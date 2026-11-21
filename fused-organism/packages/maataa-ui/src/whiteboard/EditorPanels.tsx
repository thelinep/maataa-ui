/**
 * @maataa/ui/whiteboard/EditorPanels
 * ShapeToolPicker, LayerStack, EffectsLibrary, LiveDrawingOverlay,
 * RenderProgressRow and RenderQueue
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

const iconBtn: React.CSSProperties = {
  minWidth: 36,
  minHeight: 36,
  border: `1px solid ${colorTokens.border.control}`,
  borderRadius: 6,
  background: colorTokens.background.primary,
  color: colorTokens.text.primary,
  font: "inherit",
  cursor: "pointer",
};

/* ───────────────────────── ShapeToolPicker ───────────────────────── */

export type ShapeKind = "rectangle" | "ellipse" | "line" | "arrow" | "triangle" | "star" | "text";

const SHAPES: { id: ShapeKind; label: string; path: React.ReactNode }[] = [
  { id: "rectangle", label: "Rectangle", path: <rect x="4" y="6" width="16" height="12" rx="1" /> },
  { id: "ellipse", label: "Ellipse", path: <ellipse cx="12" cy="12" rx="8" ry="6" /> },
  { id: "line", label: "Line", path: <line x1="4" y1="18" x2="20" y2="6" /> },
  { id: "arrow", label: "Arrow", path: <path d="M4 18 L20 6 M20 6 h-6 M20 6 v6" /> },
  { id: "triangle", label: "Triangle", path: <path d="M12 5 L20 19 H4 Z" /> },
  {
    id: "star",
    label: "Star",
    path: <path d="M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16.3 7 19l1.2-5.6L4 9.6l5.6-.6z" />,
  },
  { id: "text", label: "Text box", path: <path d="M6 6h12M12 6v12" /> },
];

export interface ShapeToolPickerProps {
  value: ShapeKind;
  onChange: (shape: ShapeKind) => void;
  /** Fill the shape @default false */
  filled?: boolean;
  onFilledChange?: (filled: boolean) => void;
  shapes?: ShapeKind[];
}

/**
 * ShapeToolPicker
 * Radio group of shapes (arrow keys move and select), plus a Fill toggle.
 */
export function ShapeToolPicker({
  value,
  onChange,
  filled,
  onFilledChange,
  shapes,
}: ShapeToolPickerProps) {
  const list = SHAPES.filter((s) => !shapes || shapes.includes(s.id));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(
    0,
    list.findIndex((s) => s.id === value)
  );
  const go = (n: number) => {
    const k = (n + list.length) % list.length;
    onChange(list[k]!.id);
    refs.current[k]?.focus();
  };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacingTokens.sm,
        flexWrap: "wrap",
      }}
    >
      <div
        role="radiogroup"
        aria-label="Shape"
        style={{
          display: "inline-flex",
          gap: 2,
          padding: 3,
          borderRadius: 10,
          background: colorTokens.background.tertiary,
        }}
      >
        {list.map((s, n) => {
          const on = s.id === value;
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[n] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={s.label}
              title={s.label}
              tabIndex={n === idx ? 0 : -1}
              onClick={() => onChange(s.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") go(n + 1);
                else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(n - 1);
                else return;
                e.preventDefault();
              }}
              style={{
                ...iconBtn,
                border: on
                  ? `2px solid ${colorTokens.interactive.primary}`
                  : "2px solid transparent",
                background: on ? colorTokens.background.primary : "transparent",
                width: 40,
                height: 40,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill={
                  filled && s.id !== "line" && s.id !== "arrow" && s.id !== "text"
                    ? "currentColor"
                    : "none"
                }
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {s.path}
              </svg>
            </button>
          );
        })}
      </div>
      {onFilledChange && (
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <input
            type="checkbox"
            checked={!!filled}
            onChange={(e) => onFilledChange(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
          />
          Fill
        </label>
      )}
    </div>
  );
}

/* ───────────────────────── LayerStack ───────────────────────── */

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  /** 0–100 */
  opacity?: number;
}

export interface LayerStackProps {
  /** Top layer first */
  layers: Layer[];
  onChange: (layers: Layer[]) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
  label?: string;
}

/**
 * LayerStack
 * Top layer first. Each row: select (by name), Show/Hide and Lock/Unlock as
 * toggle buttons, Move up/down buttons. Moves are announced with the new
 * position, and focus follows the moved layer.
 */
export function LayerStack({
  layers,
  onChange,
  selectedId,
  onSelect,
  label = "Layers",
}: LayerStackProps) {
  const [msg, setMsg] = useState("");
  const moveRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const set = (id: string, patch: Partial<Layer>) =>
    onChange(layers.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const move = (i: number, d: -1 | 1, which: "up" | "down") => {
    const j = i + d;
    if (j < 0 || j >= layers.length) return;
    const next = [...layers];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
    setMsg(`${layers[i]!.name} moved to position ${j + 1} of ${layers.length}.`);
    const atEnd = (which === "down" && j === layers.length - 1) || (which === "up" && j === 0);
    const target = atEnd ? (which === "down" ? "up" : "down") : which;
    requestAnimationFrame(() => moveRefs.current[`${layers[i]!.id}-${target}`]?.focus());
  };
  return (
    <section
      aria-label={label}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        overflow: "hidden",
        minWidth: 260,
      }}
    >
      <h3
        style={{
          margin: 0,
          padding: "8px 12px",
          fontSize: typographyTokens.fontSize.sm,
          background: colorTokens.background.secondary,
          borderBottom: `1px solid ${colorTokens.border.secondary}`,
        }}
      >
        {label}{" "}
        <span style={{ fontWeight: 400, color: colorTokens.text.secondary }}>(top first)</span>
      </h3>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {layers.map((l, i) => {
          const sel = l.id === selectedId;
          return (
            <li
              key={l.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 6px",
                borderBottom: `1px solid ${colorTokens.border.tertiary}`,
                background: sel ? colorTokens.background.tertiary : undefined,
              }}
            >
              <button
                type="button"
                aria-pressed={!l.visible ? true : false}
                aria-label={`Hide ${l.name}`}
                onClick={() => set(l.id, { visible: !l.visible })}
                style={{
                  ...iconBtn,
                  border: 0,
                  background: "transparent",
                  opacity: l.visible ? 1 : 0.5,
                }}
              >
                <span aria-hidden="true">{l.visible ? "👁" : "⦸"}</span>
              </button>
              <button
                type="button"
                aria-pressed={l.locked}
                aria-label={`Lock ${l.name}`}
                onClick={() => set(l.id, { locked: !l.locked })}
                style={{ ...iconBtn, border: 0, background: "transparent" }}
              >
                <span aria-hidden="true">{l.locked ? "🔒" : "🔓"}</span>
              </button>
              <button
                type="button"
                aria-current={sel ? "true" : undefined}
                onClick={() => onSelect?.(l.id)}
                style={{
                  flex: 1,
                  minHeight: 36,
                  textAlign: "left",
                  border: 0,
                  background: "transparent",
                  font: "inherit",
                  color: l.visible ? colorTokens.text.primary : colorTokens.text.tertiary,
                  fontWeight: sel ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {l.name}
                {(!l.visible || l.locked) && " "}
                {(!l.visible || l.locked) && (
                  <span
                    style={{
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    ({[!l.visible && "hidden", l.locked && "locked"].filter(Boolean).join(", ")})
                  </span>
                )}
              </button>
              <button
                ref={(el) => {
                  moveRefs.current[`${l.id}-up`] = el;
                }}
                type="button"
                aria-label={`Move ${l.name} up`}
                disabled={i === 0}
                onClick={() => move(i, -1, "up")}
                style={{ ...iconBtn, opacity: i === 0 ? 0.4 : 1 }}
              >
                <span aria-hidden="true">↑</span>
              </button>
              <button
                ref={(el) => {
                  moveRefs.current[`${l.id}-down`] = el;
                }}
                type="button"
                aria-label={`Move ${l.name} down`}
                disabled={i === layers.length - 1}
                onClick={() => move(i, 1, "down")}
                style={{ ...iconBtn, opacity: i === layers.length - 1 ? 0.4 : 1 }}
              >
                <span aria-hidden="true">↓</span>
              </button>
            </li>
          );
        })}
      </ol>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </section>
  );
}

/* ───────────────────────── EffectsLibrary ───────────────────────── */

export interface EffectItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  /** Small preview image */
  previewSrc?: string;
}

export interface EffectsLibraryProps {
  effects: EffectItem[];
  onApply: (id: string) => void;
  /** Already applied effect ids */
  applied?: string[];
  label?: string;
}

/**
 * EffectsLibrary
 * Searchable, filterable grid. Each tile's button is "Apply Film grain" (or
 * "Applied" when already on); result count is announced.
 */
export function EffectsLibrary({
  effects,
  onApply,
  applied = [],
  label = "Effects",
}: EffectsLibraryProps) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(effects.map((e) => e.category)))];
  const shown = effects.filter(
    (e) =>
      (cat === "All" || e.category === cat) &&
      (e.name + " " + (e.description ?? "")).toLowerCase().includes(q.toLowerCase())
  );
  return (
    <section
      aria-label={label}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div style={{ display: "flex", gap: spacingTokens.sm, flexWrap: "wrap" }}>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
            flex: 1,
            minWidth: 160,
          }}
        >
          Search effects
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              minHeight: 40,
              padding: "0 10px",
              border: `2px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
            }}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          Category
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={{
              minHeight: 40,
              padding: "0 8px",
              border: `2px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
            }}
          >
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <p
        role="status"
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        {shown.length} {shown.length === 1 ? "effect" : "effects"}
      </p>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: spacingTokens.sm,
        }}
      >
        {shown.map((e) => {
          const on = applied.includes(e.id);
          return (
            <li
              key={e.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${on ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                borderRadius: 10,
                overflow: "hidden",
                background: colorTokens.background.primary,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  aspectRatio: "16 / 9",
                  background: e.previewSrc
                    ? `center / cover url(${e.previewSrc})`
                    : `linear-gradient(135deg, ${colorTokens.background.tertiary}, ${colorTokens.border.primary})`,
                }}
              />
              <div
                style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}
              >
                <strong style={{ fontSize: typographyTokens.fontSize.sm }}>{e.name}</strong>
                <span
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {e.category}
                </span>
                {e.description && (
                  <span
                    style={{
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {e.description}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onApply(e.id)}
                  disabled={on}
                  style={{
                    ...iconBtn,
                    marginTop: "auto",
                    minHeight: 32,
                    background: on
                      ? colorTokens.background.tertiary
                      : colorTokens.interactive.primary,
                    color: on ? colorTokens.text.primary : colorTokens.text.inverse,
                    border: 0,
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  {on ? (
                    <>
                      <span aria-hidden="true">✓ </span>Applied
                      <VisuallyHidden>: {e.name}</VisuallyHidden>
                    </>
                  ) : (
                    <>
                      Apply <VisuallyHidden>{e.name}</VisuallyHidden>
                    </>
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ───────────────────────── LiveDrawingOverlay ───────────────────────── */

export interface Annotation {
  id: string;
  /** Seconds into the media */
  at: number;
  /** Data URL of the drawing */
  drawing?: string;
  note: string;
  author?: string;
}

export interface LiveDrawingOverlayProps {
  /** The video/image the overlay sits on */
  children: React.ReactNode;
  /** Current media time (for stamping annotations) */
  currentTime: number;
  annotations: Annotation[];
  onAdd: (a: Omit<Annotation, "id">) => void;
  color?: string;
  author?: string;
}

/**
 * LiveDrawingOverlay
 * Draw over a paused frame for review. Every drawing is saved with a typed
 * note (required), so the feedback exists in text as well as ink; notes are
 * listed with their timecode.
 */
export function LiveDrawingOverlay({
  children,
  currentTime,
  annotations,
  onAdd,
  color = "#F5D547",
  author,
}: LiveDrawingOverlayProps) {
  const errId = useId();
  const [on, setOn] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext?.("2d");
    if (!c || !ctx) return;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
  }, [on, color]);
  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * e.currentTarget.width,
      y: ((e.clientY - r.top) / r.height) * e.currentTarget.height,
    };
  };
  const clear = () => {
    const c = canvas.current;
    c?.getContext?.("2d")?.clearRect(0, 0, c.width, c.height);
    dirty.current = false;
  };
  const save = () => {
    if (!note.trim()) {
      setErr("Add a note describing the drawing.");
      return;
    }
    onAdd({
      at: currentTime,
      note: note.trim(),
      drawing: dirty.current ? canvas.current?.toDataURL?.() : undefined,
      author,
    });
    setNote("");
    setErr("");
    clear();
  };
  const m = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <div style={{ position: "relative" }}>
        {children}
        {on && (
          <canvas
            ref={canvas}
            width={960}
            height={540}
            role="img"
            aria-label="Drawing layer over the frame"
            onPointerDown={(e) => {
              const ctx = e.currentTarget.getContext?.("2d");
              if (!ctx) return;
              drawing.current = true;
              e.currentTarget.setPointerCapture?.(e.pointerId);
              const p = pos(e);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return;
              const ctx = e.currentTarget.getContext?.("2d");
              if (!ctx) return;
              const p = pos(e);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
              dirty.current = true;
            }}
            onPointerUp={() => (drawing.current = false)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              cursor: "crosshair",
              touchAction: "none",
              outline: `3px solid ${color}`,
              outlineOffset: -3,
            }}
          />
        )}
      </div>
      <div
        style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn((x) => !x)}
          style={{ ...iconBtn, minHeight: 44, padding: "0 12px" }}
        >
          <span aria-hidden="true">✏️ </span>Draw on frame
        </button>
        {on && (
          <button
            type="button"
            onClick={clear}
            style={{ ...iconBtn, minHeight: 44, padding: "0 12px" }}
          >
            Clear drawing
          </button>
        )}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
            minWidth: 200,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          Note at {m(currentTime)}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? errId : undefined}
            style={{
              minHeight: 44,
              padding: "0 10px",
              border: `2px solid ${err ? colorTokens.interactive.error : colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
            }}
          />
        </label>
        <button
          type="button"
          onClick={save}
          style={{
            ...iconBtn,
            minHeight: 44,
            padding: "0 14px",
            background: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
            border: 0,
            fontWeight: 700,
          }}
        >
          Add note
        </button>
      </div>
      {err && (
        <span
          id={errId}
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.xs }}
        >
          {err}
        </span>
      )}
      {annotations.length > 0 && (
        <ol
          aria-label="Review notes"
          style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}
        >
          {annotations.map((a) => (
            <li key={a.id}>
              <span
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  color: colorTokens.text.secondary,
                }}
              >
                {m(a.at)}
              </span>{" "}
              {a.note}
              {a.drawing && (
                <span style={{ color: colorTokens.text.secondary }}> (with drawing)</span>
              )}
              {a.author && <span style={{ color: colorTokens.text.secondary }}> — {a.author}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ───────────────────────── Render queue ───────────────────────── */

export type RenderState = "queued" | "rendering" | "done" | "failed" | "paused";

export interface RenderJob {
  id: string;
  name: string;
  /** e.g. "ProRes 422 HQ · 4K" */
  preset: string;
  state: RenderState;
  /** 0–100 */
  percent?: number;
  /** Seconds remaining */
  eta?: number;
  error?: string;
}

const STATE_LABEL: Record<RenderState, string> = {
  queued: "Queued",
  rendering: "Rendering",
  done: "Done",
  failed: "Failed",
  paused: "Paused",
};

export interface RenderProgressRowProps {
  job: RenderJob;
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  onPause?: (id: string) => void;
}

/** One render: name, preset, state in words, progressbar and ETA. */
export function RenderProgressRow({ job, onCancel, onRetry, onPause }: RenderProgressRowProps) {
  const col =
    job.state === "failed"
      ? colorTokens.interactive.error
      : job.state === "done"
        ? colorTokens.interactive.success
        : colorTokens.interactive.primary;
  const eta =
    job.eta != null
      ? job.eta >= 60
        ? `${Math.round(job.eta / 60)} min left`
        : `${Math.round(job.eta)} s left`
      : "";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "4px 12px",
        alignItems: "center",
        padding: "10px 12px",
        borderBottom: `1px solid ${colorTokens.border.secondary}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <strong>{job.name}</strong>
        <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}>
          {" "}
          · {job.preset}
        </span>
      </div>
      <span style={{ fontSize: typographyTokens.fontSize.sm, fontWeight: 700, color: col }}>
        {STATE_LABEL[job.state]}
        {job.state === "rendering" && job.percent != null ? ` ${Math.round(job.percent)}%` : ""}
      </span>
      <div
        role="progressbar"
        aria-label={`${job.name} render`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={job.state === "done" ? 100 : (job.percent ?? 0)}
        aria-valuetext={`${STATE_LABEL[job.state]}${job.percent != null && job.state !== "done" ? `, ${Math.round(job.percent)}%` : ""}${eta ? `, ${eta}` : ""}`}
        style={{
          height: 6,
          borderRadius: 999,
          background: colorTokens.background.tertiary,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${job.state === "done" ? 100 : (job.percent ?? 0)}%`,
            background: col,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {job.state === "rendering" && onPause && (
          <button type="button" style={iconBtn} onClick={() => onPause(job.id)}>
            Pause <VisuallyHidden>{job.name}</VisuallyHidden>
          </button>
        )}
        {(job.state === "rendering" || job.state === "queued" || job.state === "paused") &&
          onCancel && (
            <button type="button" style={iconBtn} onClick={() => onCancel(job.id)}>
              Cancel <VisuallyHidden>{job.name}</VisuallyHidden>
            </button>
          )}
        {job.state === "failed" && onRetry && (
          <button type="button" style={iconBtn} onClick={() => onRetry(job.id)}>
            Retry <VisuallyHidden>{job.name}</VisuallyHidden>
          </button>
        )}
      </div>
      {(eta || job.error) && (
        <span
          style={{
            gridColumn: "1 / -1",
            fontSize: typographyTokens.fontSize.xs,
            color: job.error ? colorTokens.interactive.error : colorTokens.text.secondary,
          }}
        >
          {job.error ?? eta}
        </span>
      )}
    </div>
  );
}

export interface RenderQueueProps extends Omit<RenderProgressRowProps, "job"> {
  jobs: RenderJob[];
  label?: string;
}

/**
 * RenderQueue
 * List of renders with a summary ("1 rendering, 2 queued, 1 failed").
 * Finishing and failing jobs are announced once.
 */
export function RenderQueue({ jobs, label = "Render queue", ...actions }: RenderQueueProps) {
  const prev = useRef<Record<string, RenderState>>({});
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const changed = jobs.filter(
      (j) =>
        prev.current[j.id] &&
        prev.current[j.id] !== j.state &&
        (j.state === "done" || j.state === "failed")
    );
    if (changed.length)
      setMsg(changed.map((j) => `${j.name}: ${STATE_LABEL[j.state].toLowerCase()}`).join(". "));
    prev.current = Object.fromEntries(jobs.map((j) => [j.id, j.state]));
  }, [jobs]);
  const counts = (Object.keys(STATE_LABEL) as RenderState[])
    .map((s) => [s, jobs.filter((j) => j.state === s).length] as const)
    .filter(([, n]) => n)
    .map(([s, n]) => `${n} ${STATE_LABEL[s].toLowerCase()}`)
    .join(", ");
  return (
    <section
      aria-label={label}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: colorTokens.background.secondary,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.sm }}>{label}</h3>
        <span style={{ color: colorTokens.text.secondary }}>{counts || "Empty"}</span>
      </header>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {jobs.map((j) => (
          <li key={j.id}>
            <RenderProgressRow job={j} {...actions} />
          </li>
        ))}
      </ul>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </section>
  );
}
