/**
 * @maataa/ui/forms/ReadingFontToggle
 * Switch to a reading-friendly font (dyslexia support)
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type ReadingFont = "default" | "atkinson" | "opendyslexic";

export const readingFontStacks: Record<ReadingFont, string> = {
  default: "inherit",
  atkinson: "'Atkinson Hyperlegible', 'Atkinson Hyperlegible Next', system-ui, sans-serif",
  opendyslexic: "'OpenDyslexic', 'Comic Sans MS', system-ui, sans-serif",
};

export interface ReadingFontToggleProps {
  value: ReadingFont;
  onChange: (f: ReadingFont) => void;
}

/**
 * ReadingFontToggle
 * Radio options, each previewed in its own font, with a sample sentence.
 * Apply the chosen stack with readingFontStacks[value] on the app root.
 */
export function ReadingFontToggle({ value, onChange }: ReadingFontToggleProps) {
  const opts: { v: ReadingFont; label: string; hint: string }[] = [
    { v: "default", label: "Standard", hint: "The app's usual font" },
    {
      v: "atkinson",
      label: "Atkinson Hyperlegible",
      hint: "Clearer letter shapes; helps low vision",
    },
    {
      v: "opendyslexic",
      label: "OpenDyslexic",
      hint: "Weighted letters; some dyslexic readers prefer it",
    },
  ];
  return (
    <fieldset
      style={{
        border: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.xs,
      }}
    >
      <legend style={{ fontWeight: 600, padding: 0, marginBottom: spacingTokens.xs }}>
        Reading font
      </legend>
      {opts.map((o) => (
        <label
          key={o.v}
          style={{
            display: "flex",
            gap: spacingTokens.sm,
            alignItems: "flex-start",
            padding: spacingTokens.xs,
            border: `${value === o.v ? 2 : 1}px solid ${value === o.v ? colorTokens.interactive.primary : colorTokens.border.primary}`,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="reading-font"
            checked={value === o.v}
            onChange={() => onChange(o.v)}
            style={{ marginTop: 4, accentColor: colorTokens.interactive.primary }}
          />
          <span>
            <span style={{ display: "block", fontWeight: 600, fontFamily: readingFontStacks[o.v] }}>
              {o.label}
            </span>
            <span
              style={{
                display: "block",
                fontSize: typographyTokens.fontSize.sm,
                color: colorTokens.text.secondary,
              }}
            >
              {o.hint}
            </span>
            <span
              aria-hidden="true"
              style={{
                display: "block",
                fontFamily: readingFontStacks[o.v],
                fontSize: typographyTokens.fontSize.md,
                marginTop: 2,
              }}
            >
              Call time moved to 6:30 am. Bring the rain covers.
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
ReadingFontToggle.displayName = "ReadingFontToggle";
