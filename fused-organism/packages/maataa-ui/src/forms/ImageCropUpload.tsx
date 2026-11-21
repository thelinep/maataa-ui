/**
 * @maataa/ui/forms/ImageCropUpload
 * Choose an image, then crop it with a zoom slider and move buttons (or drag)
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { smallButtonStyle } from "./fieldKit";

export interface CropArea {
  /** Zoom factor, 1 = image fills the frame */
  zoom: number;
  /** Offset of the frame centre from the image centre, as a fraction (-0.5…0.5) */
  x: number;
  y: number;
}

export interface ImageCropUploadProps {
  label: string;
  /** Width / height of the crop frame @default 1 */
  aspect?: number;
  /** Output width in pixels @default 512 */
  outputWidth?: number;
  accept?: string;
  /** Called with the cropped image when the user presses "Use this crop" */
  onCrop: (blob: Blob, area: CropArea) => void;
  /** Shape of the frame overlay @default 'rect' */
  shape?: "rect" | "circle";
  hint?: React.ReactNode;
}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** Limit offsets so the frame never leaves the image */
export function clampCrop(area: CropArea): CropArea {
  const limit = (1 - 1 / area.zoom) / 2;
  return {
    zoom: area.zoom,
    x: clamp(area.x, -limit, limit) || 0,
    y: clamp(area.y, -limit, limit) || 0,
  };
}

/**
 * ImageCropUpload
 * Cropping never needs a mouse: Zoom is a labelled slider, and Move up/down/
 * left/right buttons (or arrow keys on the frame) pan the image. The current
 * crop is described in words.
 */
export function ImageCropUpload({
  label,
  aspect = 1,
  outputWidth = 512,
  accept = "image/png,image/jpeg,image/webp",
  onCrop,
  shape = "rect",
  hint,
}: ImageCropUploadProps) {
  const id = useId();
  const [src, setSrc] = useState<string | null>(null);
  const [area, setArea] = useState<CropArea>({ zoom: 1, x: 0, y: 0 });
  const [msg, setMsg] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(
    () => () => {
      if (src) URL.revokeObjectURL(src);
    },
    [src]
  );

  const set = (a: CropArea) => setArea(clampCrop(a));
  const move = (dx: number, dy: number) => set({ ...area, x: area.x + dx, y: area.y + dy });
  const STEP = 0.05;

  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const description = `Zoom ${area.zoom.toFixed(1)} times; ${
    area.x === 0 && area.y === 0
      ? "centred"
      : `moved ${pct(Math.abs(area.x))} ${area.x < 0 ? "left" : "right"}, ${pct(Math.abs(area.y))} ${area.y < 0 ? "up" : "down"}`
  }.`;

  const save = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = Math.round(outputWidth / aspect);
    const ctx = canvas.getContext("2d");
    if (!ctx || !canvas.toBlob) {
      setMsg("This browser can’t crop images. Upload a picture that is already cropped.");
      return;
    }
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // base frame fits inside the image at zoom 1
    const baseW = Math.min(iw, ih * aspect);
    const baseH = baseW / aspect;
    const w = baseW / area.zoom;
    const h = baseH / area.zoom;
    const cx = iw / 2 + area.x * baseW;
    const cy = ih / 2 + area.y * baseH;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((b) => {
      if (b) {
        onCrop(b, area);
        setMsg("Crop saved.");
      }
    }, "image/png");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <label htmlFor={`${id}-file`} style={{ fontWeight: 500, color: colorTokens.text.primary }}>
        {label}
      </label>
      {hint && (
        <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}>
          {hint}
        </span>
      )}
      <input
        id={`${id}-file`}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (src) URL.revokeObjectURL(src);
          setSrc(URL.createObjectURL(f));
          setArea({ zoom: 1, x: 0, y: 0 });
          setMsg(`${f.name} loaded. Adjust the crop, then choose Use this crop.`);
        }}
        style={{ font: "inherit", accentColor: colorTokens.interactive.primary }}
      />
      {src && (
        <>
          <div
            role="img"
            aria-label={`Crop preview. ${description}`}
            tabIndex={0}
            onKeyDown={(e) => {
              const k = e.key;
              if (k === "ArrowLeft") move(-STEP, 0);
              else if (k === "ArrowRight") move(STEP, 0);
              else if (k === "ArrowUp") move(0, -STEP);
              else if (k === "ArrowDown") move(0, STEP);
              else if (k === "+" || k === "=") set({ ...area, zoom: clamp(area.zoom + 0.1, 1, 4) });
              else if (k === "-") set({ ...area, zoom: clamp(area.zoom - 0.1, 1, 4) });
              else return;
              e.preventDefault();
            }}
            onPointerDown={(e) => {
              drag.current = { px: e.clientX, py: e.clientY, x: area.x, y: area.y };
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
              set({
                ...area,
                x: d.x - (e.clientX - d.px) / (box.width * area.zoom),
                y: d.y - (e.clientY - d.py) / (box.height * area.zoom),
              });
            }}
            onPointerUp={() => (drag.current = null)}
            style={{
              position: "relative",
              width: 240,
              aspectRatio: String(aspect),
              overflow: "hidden",
              borderRadius: shape === "circle" ? "50%" : 6,
              outline: `2px solid ${colorTokens.border.control}`,
              background: colorTokens.background.tertiary,
              cursor: "grab",
              touchAction: "none",
            }}
          >
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${area.zoom}) translate(${-area.x * 100}%, ${-area.y * 100}%)`,
                transformOrigin: "center",
              }}
            />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm }}>
            Zoom
            <input
              type="range"
              min={1}
              max={4}
              step={0.1}
              value={area.zoom}
              aria-valuetext={`${area.zoom.toFixed(1)} times`}
              onChange={(e) => set({ ...area, zoom: Number(e.target.value) })}
              style={{ accentColor: colorTokens.interactive.primary, minHeight: 44 }}
            />
          </label>
          <div
            role="group"
            aria-label="Move image"
            style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap" }}
          >
            <button type="button" style={smallButtonStyle} onClick={() => move(-STEP, 0)}>
              Move left
            </button>
            <button type="button" style={smallButtonStyle} onClick={() => move(STEP, 0)}>
              Move right
            </button>
            <button type="button" style={smallButtonStyle} onClick={() => move(0, -STEP)}>
              Move up
            </button>
            <button type="button" style={smallButtonStyle} onClick={() => move(0, STEP)}>
              Move down
            </button>
            <button
              type="button"
              style={smallButtonStyle}
              onClick={() => set({ zoom: 1, x: 0, y: 0 })}
            >
              Reset
            </button>
          </div>
          <p style={{ margin: 0, color: colorTokens.text.secondary }}>{description}</p>
          <div>
            <button
              type="button"
              onClick={save}
              style={{
                ...smallButtonStyle,
                background: colorTokens.interactive.primary,
                color: colorTokens.text.inverse,
                border: 0,
              }}
            >
              Use this crop
            </button>
          </div>
        </>
      )}
      <div
        role="status"
        style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
      >
        {msg}
      </div>
    </div>
  );
}
