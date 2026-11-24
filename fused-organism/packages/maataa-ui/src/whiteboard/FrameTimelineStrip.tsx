/**
 * @maataa/ui/whiteboard/FrameTimelineStrip
 * Storyboard frames in order, with selection and reordering
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface StoryFrame {
  id: string;
  /** e.g. "12A" */
  number: string;
  thumbnailUrl?: string;
  description: string;
  /** Seconds on screen */
  duration?: number;
  shot?: string;
}

export interface FrameTimelineStripProps {
  frames: StoryFrame[];
  selectedId?: string;
  onSelect: (id: string) => void;
  /** New order of ids */
  onReorder?: (ids: string[]) => void;
  onAdd?: () => void;
  /** @default 'Storyboard frames' */
  label?: string;
}

/** Moves an item to a new index, returning a new array. */
export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, x);
  return next;
}

/**
 * FrameTimelineStrip
 * A horizontal list of frame buttons (aria-current on the selected one).
 * The reorder controls act on the selected frame: earlier, later, or a
 * position number — no dragging needed. Total running time is shown.
 */
export function FrameTimelineStrip({
  frames,
  selectedId,
  onSelect,
  onReorder,
  onAdd,
  label: labelProp,
}: FrameTimelineStripProps) {
  const t = useT();
  const label = labelProp ?? t("Storyboard frames");
  const [msg, setMsg] = useState("");
  const idx = frames.findIndex((f) => f.id === selectedId);
  const total = frames.reduce((s, f) => s + (f.duration ?? 0), 0);
  const reorder = (to: number) => {
    if (!onReorder || idx < 0 || to === idx || to < 0 || to >= frames.length) return;
    onReorder(moveItem(frames, idx, to).map((f) => f.id));
    setMsg(
      t("Frame {number} moved to position {position} of {total}", {
        number: frames[idx].number,
        position: to + 1,
        total: frames.length,
      })
    );
  };
  const small: React.CSSProperties = {
    minHeight: 32,
    padding: "0 10px",
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    background: colorTokens.background.primary,
    cursor: "pointer",
    font: "inherit",
    fontSize: typographyTokens.fontSize.sm,
    color: colorTokens.text.primary,
  };
  return (
    <section
      aria-label={label}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: spacingTokens.sm,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
          {total
            ? t("{count} frames · {time} running time", {
                count: frames.length,
                time: `${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")}`,
              })
            : t("{count} frames", { count: frames.length })}
        </span>
        {onReorder && idx >= 0 && (
          <div
            role="group"
            aria-label={t("Reorder frame {value}", { value: frames[idx].number })}
            style={{ display: "flex", gap: spacingTokens.xs, alignItems: "center" }}
          >
            <button
              type="button"
              style={small}
              disabled={idx === 0}
              onClick={() => reorder(idx - 1)}
            >
              ← {t("Earlier")}
            </button>
            <button
              type="button"
              style={small}
              disabled={idx === frames.length - 1}
              onClick={() => reorder(idx + 1)}
            >
              {t("Later →")}
            </button>
            <label
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {t("Position")}
              <select
                value={idx + 1}
                onChange={(e) => reorder(Number(e.target.value) - 1)}
                style={{ ...small, padding: "0 4px" }}
              >
                {frames.map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: `0 0 ${spacingTokens.xs}`,
          display: "flex",
          gap: spacingTokens.sm,
          overflowX: "auto",
        }}
      >
        {frames.map((f, i) => {
          const on = f.id === selectedId;
          return (
            <li key={f.id} style={{ flex: "0 0 150px" }}>
              <button
                type="button"
                onClick={() => onSelect(f.id)}
                aria-current={on ? "true" : undefined}
                style={{
                  width: "100%",
                  padding: 0,
                  border: `${on ? 3 : 1}px solid ${on ? colorTokens.interactive.primary : colorTokens.border.control}`,
                  borderRadius: 8,
                  background: colorTokens.background.primary,
                  cursor: "pointer",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                {/* Named by content, not aria-label, so the visible shorthand never
                    contradicts the name (WCAG 2.5.3) */}
                <VisuallyHidden>{`${t("Frame {number}, {position} of {total}", { number: f.number, position: i + 1, total: frames.length })}${f.shot ? `, ${f.shot}` : ""}: ${f.description || t("no description")}`}</VisuallyHidden>
                <div
                  aria-hidden="true"
                  style={{
                    aspectRatio: "16 / 9",
                    background: f.thumbnailUrl
                      ? `center / cover url(${f.thumbnailUrl}) #fff`
                      : "#fff",
                    borderBottom: `1px solid ${colorTokens.border.primary}`,
                    display: "grid",
                    placeItems: "center",
                    color: colorTokens.text.secondary,
                    fontSize: typographyTokens.fontSize.xs,
                  }}
                >
                  {!f.thumbnailUrl && "Not drawn"}
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    padding: 6,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.primary,
                  }}
                >
                  <strong>{f.number}</strong>
                  {f.shot ? ` · ${f.shot}` : ""}
                  {f.duration ? ` · ${f.duration}s` : ""}
                  <div
                    style={{
                      color: colorTokens.text.secondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {f.description || "—"}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
        {onAdd && (
          <li style={{ flex: "0 0 120px" }}>
            <button
              type="button"
              onClick={onAdd}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 110,
                border: `2px dashed ${colorTokens.border.control}`,
                borderRadius: 8,
                background: "transparent",
                cursor: "pointer",
                color: colorTokens.interactive.primary,
                font: "inherit",
              }}
            >
              {t("+ Add frame")}
            </button>
          </li>
        )}
      </ol>
    </section>
  );
}
FrameTimelineStrip.displayName = "FrameTimelineStrip";
