/**
 * @maataa/ui/whiteboard/BrushColorPicker
 * Named colour swatches and a brush size slider
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Swatch {
  name: string;
  hex: string;
}

/** Storyboard defaults: pencil greys plus one accent for camera moves */
export const storyboardSwatches: Swatch[] = [
  { name: "Black", hex: "#111111" },
  { name: "Graphite", hex: "#4A4A4A" },
  { name: "Grey", hex: "#8C8C8C" },
  { name: "Light grey", hex: "#C8C8C8" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Camera red", hex: "#C0392B" },
  { name: "Light blue", hex: "#2E86C1" },
  { name: "Sepia", hex: "#806641" },
];

export interface BrushColorPickerProps {
  color: string;
  onColorChange: (hex: string) => void;
  size: number;
  onSizeChange: (px: number) => void;
  swatches?: Swatch[];
  /** @default 1 */
  minSize?: number;
  /** @default 40 */
  maxSize?: number;
}

/**
 * BrushColorPicker
 * Swatches are radios named by colour ("Camera red"), never colour alone.
 * The size slider shows its value and a live preview dot.
 */
export function BrushColorPicker({
  color,
  onColorChange,
  size,
  onSizeChange,
  swatches = storyboardSwatches,
  minSize = 1,
  maxSize = 40,
}: BrushColorPickerProps) {
  const id = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
        <legend
          style={{
            fontWeight: 600,
            padding: 0,
            marginBottom: spacingTokens.xs,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          Colour: {swatches.find((s) => s.hex.toLowerCase() === color.toLowerCase())?.name ?? color}
        </legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {swatches.map((s) => {
            const on = s.hex.toLowerCase() === color.toLowerCase();
            return (
              <label
                key={s.hex}
                title={s.name}
                style={{
                  position: "relative",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: s.hex,
                  border: `1px solid ${colorTokens.border.control}`,
                  boxShadow: on
                    ? `0 0 0 3px ${colorTokens.background.primary}, 0 0 0 5px ${colorTokens.interactive.primary}`
                    : "none",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`${id}-c`}
                  checked={on}
                  onChange={() => onColorChange(s.hex)}
                  aria-label={s.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    margin: 0,
                    cursor: "pointer",
                  }}
                />
              </label>
            );
          })}
        </div>
      </fieldset>
      <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm }}>
        <label
          htmlFor={`${id}-s`}
          style={{ fontWeight: 600, fontSize: typographyTokens.fontSize.sm, whiteSpace: "nowrap" }}
        >
          Brush size
        </label>
        <input
          id={`${id}-s`}
          type="range"
          min={minSize}
          max={maxSize}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          aria-valuetext={`${size} pixels`}
          style={{ flex: 1, accentColor: colorTokens.interactive.primary }}
        />
        <output
          htmlFor={`${id}-s`}
          style={{
            width: 44,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {size} px
        </output>
        <span
          aria-hidden="true"
          style={{ width: 40, height: 40, display: "grid", placeItems: "center" }}
        >
          <span
            style={{
              width: Math.min(size, 40),
              height: Math.min(size, 40),
              borderRadius: "50%",
              background: color,
              border: `1px solid ${colorTokens.border.control}`,
            }}
          />
        </span>
      </div>
    </div>
  );
}
BrushColorPicker.displayName = "BrushColorPicker";
