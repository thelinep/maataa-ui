/**
 * @maataa/ui/data/OfferLetterPreview
 * Offer letter from a template with {{fields}}, flagging any left empty
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface OfferLetterPreviewProps {
  /** Text with {{field}} placeholders; blank lines start new paragraphs */
  template: string;
  values: Record<string, string | undefined>;
  /** Labels for fields in the missing list, e.g. { fee: "Fee" } */
  labels?: Record<string, string>;
}

/** Fields used in a template, in order of first use */
export function templateFields(template: string): string[] {
  return Array.from(new Set(Array.from(template.matchAll(/\{\{\s*(\w+)\s*\}\}/g), (m) => m[1])));
}

/**
 * OfferLetterPreview
 * Renders the letter with values filled in. Empty fields appear as
 * "[Fee missing]" in the text and are listed above the letter, so the
 * letter can't be sent half-filled by accident.
 */
export function OfferLetterPreview({ template, values, labels = {} }: OfferLetterPreviewProps) {
  const fields = templateFields(template);
  const missing = fields.filter((f) => !values[f]?.trim());
  const label = (f: string) =>
    labels[f] ?? f.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  const paragraphs = template.split(/\n\s*\n/);
  const render = (p: string) =>
    p.split(/(\{\{\s*\w+\s*\}\})/g).map((part, i) => {
      const m = part.match(/^\{\{\s*(\w+)\s*\}\}$/);
      if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
      const v = values[m[1]]?.trim();
      return v ? (
        <strong key={i}>{v}</strong>
      ) : (
        <mark
          key={i}
          style={{ background: "#F6E3B4", color: colorTokens.interactive.error, padding: "0 2px" }}
        >
          [{label(m[1])} missing]
        </mark>
      );
    });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <div
        role="status"
        style={{
          fontSize: typographyTokens.fontSize.sm,
          color: missing.length ? colorTokens.interactive.error : colorTokens.interactive.success,
          fontWeight: 600,
        }}
      >
        {missing.length
          ? `${missing.length} field${missing.length === 1 ? "" : "s"} to fill: ${missing.map(label).join(", ")}`
          : "All fields filled"}
      </div>
      <article
        aria-label="Offer letter preview"
        style={{
          background: "#fff",
          color: "#1d1d1d",
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 4,
          padding: spacingTokens.lg,
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: 1.6,
          maxWidth: 680,
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ margin: `0 0 ${spacingTokens.sm}`, whiteSpace: "pre-line" }}>
            {render(p)}
          </p>
        ))}
      </article>
    </div>
  );
}
OfferLetterPreview.displayName = "OfferLetterPreview";
