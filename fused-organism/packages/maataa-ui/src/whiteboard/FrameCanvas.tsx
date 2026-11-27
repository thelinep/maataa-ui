/**
 * @maataa/ui/whiteboard/FrameCanvas
 * One storyboard frame: draw with a pointer, describe it in words
 */

import { useT } from "../i18n/LocaleProvider";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DrawingTool } from "./DrawingToolPalette";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface FrameCanvasHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  toDataURL: () => string | undefined;
}

export interface FrameCanvasProps {
  /** Frame number, e.g. "12A" */
  frame: string;
  tool: DrawingTool;
  color: string;
  size: number;
  /** Text description, required for screen-reader users and the shot list */
  description: string;
  onDescriptionChange: (text: string) => void;
  /** Called after each stroke with a PNG data URL */
  onChange?: (dataUrl: string) => void;
  /** Background image (a previous drawing) */
  initial?: string;
  /** @default 16 / 9 */
  aspect?: number;
  onHistoryChange?: (h: { canUndo: boolean; canRedo: boolean }) => void;
  width?: number;
}

type Pt = { x: number; y: number };

/**
 * FrameCanvas
 * Drawing is pointer-based, so every frame also has a required text
 * description: the canvas is an image named by that description, and
 * keyboard users fill it in instead of drawing. Undo/redo with Ctrl+Z /
 * Ctrl+Shift+Z while the canvas has focus. Pen pressure is used when present.
 */
export const FrameCanvas = forwardRef<FrameCanvasHandle, FrameCanvasProps>(function FrameCanvas(
  {
    frame,
    tool,
    color,
    size,
    description,
    onDescriptionChange,
    onChange,
    initial,
    aspect = 16 / 9,
    onHistoryChange,
    width = 640,
  },
  ref
) {
  const t = useT();
  const id = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const history = useRef<ImageData[]>([]);
  const future = useRef<ImageData[]>([]);
  const drawing = useRef<{ start: Pt; last: Pt; snapshot?: ImageData } | null>(null);
  const [, force] = useState(0);
  const height = Math.round(width / aspect);
  const ctx = () => {
    try {
      return canvas.current?.getContext("2d") ?? null;
    } catch {
      return null;
    }
  };
  const report = useCallback(() => {
    onHistoryChange?.({ canUndo: history.current.length > 0, canRedo: future.current.length > 0 });
    force((n) => n + 1);
  }, [onHistoryChange]);

  useEffect(() => {
    const c = ctx();
    if (!c) return;
    c.fillStyle = "#fff";
    c.fillRect(0, 0, width, height);
    if (initial) {
      const img = new Image();
      img.onload = () => c.drawImage(img, 0, 0, width, height);
      img.src = initial;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, width, height]);

  const snap = () => {
    const c = ctx();
    if (!c) return;
    history.current.push(c.getImageData(0, 0, width, height));
    if (history.current.length > 50) history.current.shift();
    future.current = [];
  };
  const emit = () => {
    try {
      const url = canvas.current?.toDataURL("image/png");
      if (url) onChange?.(url);
    } catch {
      /* no canvas */
    }
  };
  const restore = (from: ImageData[], to: ImageData[]) => {
    const c = ctx();
    const prev = from.pop();
    if (!c || !prev) return;
    to.push(c.getImageData(0, 0, width, height));
    c.putImageData(prev, 0, 0);
    emit();
    report();
  };
  useImperativeHandle(ref, () => ({
    undo: () => restore(history.current, future.current),
    redo: () => restore(future.current, history.current),
    clear: () => {
      const c = ctx();
      if (!c) return;
      snap();
      c.fillStyle = "#fff";
      c.fillRect(0, 0, width, height);
      emit();
      report();
    },
    toDataURL: () => {
      try {
        return canvas.current?.toDataURL("image/png");
      } catch {
        return undefined;
      }
    },
  }));

  const pt = (e: React.PointerEvent): Pt => {
    const r = canvas.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * width,
      y: ((e.clientY - r.top) / r.height) * height,
    };
  };
  const shape = (c: CanvasRenderingContext2D, a: Pt, b: Pt) => {
    c.beginPath();
    if (tool === "line" || tool === "arrow") {
      c.moveTo(a.x, a.y);
      c.lineTo(b.x, b.y);
      if (tool === "arrow") {
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const h = 6 + size * 2;
        c.moveTo(b.x, b.y);
        c.lineTo(b.x - h * Math.cos(ang - 0.45), b.y - h * Math.sin(ang - 0.45));
        c.moveTo(b.x, b.y);
        c.lineTo(b.x - h * Math.cos(ang + 0.45), b.y - h * Math.sin(ang + 0.45));
      }
    } else if (tool === "rect") c.rect(a.x, a.y, b.x - a.x, b.y - a.y);
    else if (tool === "ellipse")
      c.ellipse(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        Math.abs(b.x - a.x) / 2,
        Math.abs(b.y - a.y) / 2,
        0,
        0,
        Math.PI * 2
      );
    c.stroke();
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm, maxWidth: width }}
    >
      <canvas
        ref={canvas}
        width={width}
        height={height}
        role="img"
        aria-label={t("Frame {frame}: {value}", {
          frame,
          value: description.trim() || "no description yet",
        })}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
            e.preventDefault();
            if (e.shiftKey) restore(future.current, history.current);
            else restore(history.current, future.current);
          }
        }}
        onPointerDown={(e) => {
          const c = ctx();
          if (!c || tool === "text") return;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          snap();
          const p = pt(e);
          drawing.current = {
            start: p,
            last: p,
            snapshot: ["line", "arrow", "rect", "ellipse"].includes(tool)
              ? c.getImageData(0, 0, width, height)
              : undefined,
          };
        }}
        onPointerMove={(e) => {
          const c = ctx();
          const d = drawing.current;
          if (!c || !d) return;
          const p = pt(e);
          const pressure = e.pressure && e.pointerType === "pen" ? 0.4 + e.pressure : 1;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.globalCompositeOperation = "source-over";
          c.strokeStyle = tool === "eraser" ? "#fff" : color;
          c.globalAlpha = tool === "marker" ? 0.35 : 1;
          c.lineWidth =
            (tool === "eraser" ? size * 2 : tool === "marker" ? size * 1.8 : size) * pressure;
          if (d.snapshot) {
            c.putImageData(d.snapshot, 0, 0);
            shape(c, d.start, p);
          } else {
            c.beginPath();
            c.moveTo(d.last.x, d.last.y);
            c.lineTo(p.x, p.y);
            c.stroke();
          }
          c.globalAlpha = 1;
          d.last = p;
        }}
        onPointerUp={() => {
          if (!drawing.current) return;
          drawing.current = null;
          emit();
          report();
        }}
        onPointerCancel={() => {
          drawing.current = null;
        }}
        style={{
          width: "100%",
          aspectRatio: String(aspect),
          background: "#fff",
          border: `2px solid ${colorTokens.border.control}`,
          borderRadius: 6,
          touchAction: "none",
          cursor: tool === "text" ? "text" : "crosshair",
        }}
      />
      <label
        htmlFor={`${id}-d`}
        style={{ fontWeight: 600, fontSize: typographyTokens.fontSize.sm }}
      >
        What happens in frame {frame}
      </label>
      <textarea
        id={`${id}-d`}
        rows={2}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        aria-describedby={`${id}-h`}
        placeholder={t("e.g. MCU Meera at the window, rain on glass, she turns as the door opens")}
        style={{
          padding: spacingTokens.sm,
          border: `2px solid ${description.trim() ? colorTokens.border.control : colorTokens.interactive.warning}`,
          borderRadius: 6,
          font: "inherit",
          background: colorTokens.background.primary,
        }}
      />
      <span
        id={`${id}-h`}
        style={{
          fontSize: typographyTokens.fontSize.xs,
          color: description.trim() ? colorTokens.text.secondary : colorTokens.interactive.warning,
        }}
      >
        {description.trim()
          ? t("This description is read out in place of the drawing and goes into the shot list.")
          : t("Add a description: it's how screen-reader users and the shot list see this frame.")}
      </span>
    </div>
  );
});
FrameCanvas.displayName = "FrameCanvas";
