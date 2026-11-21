/**
 * @maataa/ui/whiteboard/ColorPaletteStrip
 * A film's colour palette with names, hex codes and contrast hints
 */

import React from "react";
import { CopyButton } from "../actions/CopyButton";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PaletteColor {
  name: string;
  hex: string;
  /** e.g. "Meera's world", "Night exteriors" */
  usage?: string;
}

/** WCAG relative-luminance contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    const [r, g, bl] = [0, 2, 4]
      .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export interface ColorPaletteStripProps {
  title: string;
  colors: PaletteColor[];
}

/**
 * ColorPaletteStrip
 * Each swatch is named and shows its hex; text on the swatch uses black or
 * white, whichever contrasts more, and says which text colour is readable
 * on it (for titles and lower thirds).
 */
export function ColorPaletteStrip({ title, colors }: ColorPaletteStripProps) {
  return (
    <section aria-label={title}>
      <h3 style={{ margin: `0 0 ${spacingTokens.sm}`, fontSize: typographyTokens.fontSize.lg }}>
        {title}
      </h3>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: spacingTokens.xs,
        }}
      >
        {colors.map((c) => {
          const onWhite = contrastRatio(c.hex, "#FFFFFF");
          const onBlack = contrastRatio(c.hex, "#000000");
          const ink = onWhite >= onBlack ? "#FFFFFF" : "#000000";
          const best = Math.max(onWhite, onBlack);
          return (
            <li
              key={c.hex + c.name}
              style={{
                border: `1px solid ${colorTokens.border.primary}`,
                borderRadius: 8,
                overflow: "hidden",
                background: colorTokens.background.primary,
              }}
            >
              <div
                style={{
                  background: c.hex,
                  color: ink,
                  height: 72,
                  padding: spacingTokens.xs,
                  display: "flex",
                  alignItems: "flex-end",
                  fontWeight: 700,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  padding: spacingTokens.xs,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  fontSize: typographyTokens.fontSize.xs,
                }}
              >
                <span
                  style={{
                    fontFamily: typographyTokens.fontFamily.mono,
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  {c.hex.toUpperCase()}
                </span>
                {c.usage && <span style={{ color: colorTokens.text.secondary }}>{c.usage}</span>}
                <span>
                  {ink === "#FFFFFF" ? "White" : "Black"} text {best.toFixed(1)}:1
                  {best < 4.5 ? " (large titles only)" : ""}
                </span>
                <CopyButton value={c.hex.toUpperCase()} what={`${c.name} hex code`} size="sm" />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
ColorPaletteStrip.displayName = "ColorPaletteStrip";
