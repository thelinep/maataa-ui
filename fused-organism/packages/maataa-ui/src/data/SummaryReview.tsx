/**
 * @maataa/ui/data/SummaryReview
 * Check your answers before submitting
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SummarySection {
  id: string;
  title: string;
  rows: { label: string; value: React.ReactNode }[];
  /** Go back and change this section */
  onEdit?: () => void;
}

export interface SummaryReviewProps {
  sections: SummarySection[];
  /** @default 'Check your answers' */
  title?: string;
}

/**
 * SummaryReview
 * Each section is a heading and a definition list; "Change" buttons name
 * their section ("Change account type"). Empty values read "Not given".
 */
export function SummaryReview({ sections, title: titleProp }: SummaryReviewProps) {
  const t = useT();
  const title = titleProp ?? t("Check your answers");
  return (
    <section
      aria-label={title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.lg }}
    >
      {sections.map((s) => (
        <div key={s.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderBottom: `1px solid ${colorTokens.border.primary}`,
              paddingBottom: spacingTokens.xs,
            }}
          >
            <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{s.title}</h3>
            {s.onEdit && (
              <button
                type="button"
                onClick={s.onEdit}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: colorTokens.interactive.primary,
                  textDecoration: "underline",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                Change{" "}
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  {s.title.toLowerCase()}
                </span>
              </button>
            )}
          </div>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(140px, 1fr) 2fr",
              gap: `${spacingTokens.xs} ${spacingTokens.md}`,
              margin: `${spacingTokens.sm} 0 0`,
            }}
          >
            {s.rows.map((r) => (
              <React.Fragment key={r.label}>
                <dt style={{ color: colorTokens.text.secondary }}>{r.label}</dt>
                <dd
                  style={{
                    margin: 0,
                    color:
                      r.value === "" || r.value == null
                        ? colorTokens.text.secondary
                        : colorTokens.text.primary,
                  }}
                >
                  {r.value === "" || r.value == null ? "Not given" : r.value}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}
SummaryReview.displayName = "SummaryReview";
