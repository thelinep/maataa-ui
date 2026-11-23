/**
 * @maataa/ui/whiteboard/DrawingToolPalette
 * Drawing tools as a radio group, with undo and redo
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type DrawingTool =
  "pen" | "marker" | "eraser" | "line" | "arrow" | "rect" | "ellipse" | "text";

export const drawingToolLabels: Record<DrawingTool, { label: string; icon: string; key: string }> =
  {
    pen: { label: msg("Pen"), icon: "✎", key: "P" },
    marker: { label: msg("Marker"), icon: "🖍", key: "M" },
    eraser: { label: msg("Eraser"), icon: "⌫", key: "E" },
    line: { label: msg("Line"), icon: "╱", key: "L" },
    arrow: { label: msg("Arrow (camera move)"), icon: "➚", key: "A" },
    rect: { label: msg("Rectangle"), icon: "▭", key: "R" },
    ellipse: { label: msg("Ellipse"), icon: "◯", key: "O" },
    text: { label: msg("Text"), icon: "T", key: "T" },
  };

export interface DrawingToolPaletteProps {
  value: DrawingTool;
  onChange: (t: DrawingTool) => void;
  tools?: DrawingTool[];
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  /** @default 'vertical' */
  orientation?: "vertical" | "horizontal";
}

/**
 * DrawingToolPalette
 * Native radios (arrow keys move between tools) styled as icon buttons,
 * each with a visible label tooltip and its shortcut letter in the name.
 */
export function DrawingToolPalette({
  value,
  onChange,
  tools = Object.keys(drawingToolLabels) as DrawingTool[],
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  orientation = "vertical",
}: DrawingToolPaletteProps) {
  const tx = useT();
  const id = useId();
  const btn = (on: boolean): React.CSSProperties => ({
    width: 40,
    height: 40,
    display: "grid",
    placeItems: "center",
    borderRadius: 8,
    border: `${on ? 2 : 1}px solid ${on ? colorTokens.interactive.primary : colorTokens.border.control}`,
    background: on ? colorTokens.interactive.primary : colorTokens.background.primary,
    color: on ? colorTokens.text.inverse : colorTokens.text.primary,
    cursor: "pointer",
    fontSize: 18,
  });
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: orientation === "vertical" ? "column" : "row",
        gap: spacingTokens.xs,
        padding: spacingTokens.xs,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        background: colorTokens.background.secondary,
      }}
    >
      <fieldset
        style={{
          border: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: orientation === "vertical" ? "column" : "row",
          gap: spacingTokens.xs,
        }}
      >
        <legend
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {tx("Drawing tool")}
        </legend>
        {tools.map((t) => {
          const d = drawingToolLabels[t];
          const on = value === t;
          return (
            <label
              key={t}
              title={`${tx(d.label)} (${d.key})`}
              style={{ position: "relative", ...btn(on) }}
            >
              <input
                type="radio"
                name={`${id}-tool`}
                value={t}
                checked={on}
                onChange={() => onChange(t)}
                aria-label={tx("{label}, shortcut {key}", { label: d.label, key: d.key })}
                style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "pointer" }}
              />
              <span
                aria-hidden="true"
                style={{
                  fontFamily: t === "text" ? "Georgia, serif" : undefined,
                  fontWeight: t === "text" ? 700 : 400,
                }}
              >
                {d.icon}
              </span>
            </label>
          );
        })}
      </fieldset>
      {(onUndo || onRedo) && (
        <div
          style={{
            display: "flex",
            flexDirection: orientation === "vertical" ? "column" : "row",
            gap: spacingTokens.xs,
            borderTop:
              orientation === "vertical" ? `1px solid ${colorTokens.border.primary}` : undefined,
            borderLeft:
              orientation === "horizontal" ? `1px solid ${colorTokens.border.primary}` : undefined,
            paddingTop: orientation === "vertical" ? spacingTokens.xs : 0,
            paddingLeft: orientation === "horizontal" ? spacingTokens.xs : 0,
          }}
        >
          {onUndo && (
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              aria-label={tx("Undo")}
              title={tx("Undo (Ctrl+Z)")}
              style={{
                ...btn(false),
                opacity: canUndo ? 1 : 0.4,
                fontSize: typographyTokens.fontSize.lg,
              }}
            >
              <span aria-hidden="true">↶</span>
            </button>
          )}
          {onRedo && (
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              aria-label={tx("Redo")}
              title={tx("Redo (Ctrl+Shift+Z)")}
              style={{
                ...btn(false),
                opacity: canRedo ? 1 : 0.4,
                fontSize: typographyTokens.fontSize.lg,
              }}
            >
              <span aria-hidden="true">↷</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
DrawingToolPalette.displayName = "DrawingToolPalette";
