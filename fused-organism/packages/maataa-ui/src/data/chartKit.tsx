/**
 * @maataa/ui/data/chartKit
 * Shared chart frame: a figure with a visible title, a one-sentence summary
 * that names the chart image, and a "Show data as a table" disclosure
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { ScrollTable } from "./ScrollTable";

/** Categorical colours, each ≥ 3:1 against the page background (WCAG 1.4.11) */
export const CHART_COLORS = [
  "#806641",
  "#1E3A5F",
  "#2D6A3E",
  "#8B3A2B",
  "#5B4B8A",
  "#7A6100",
  "#2F6F73",
  "#9A4A6B",
];

export const chartColor = (i: number) => CHART_COLORS[i % CHART_COLORS.length]!;

export const defaultFormat = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

export interface ChartTable {
  columns: string[];
  rows: (string | number)[][];
}

export interface ChartFigureProps {
  title: string;
  /** One or two sentences: what the chart shows and the main takeaway */
  summary: string;
  /** The same data as a table */
  table: ChartTable;
  /** Legend or notes under the chart */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Heading level for the title @default 3 */
  level?: 2 | 3 | 4;
  style?: React.CSSProperties;
}

/**
 * ChartFigure
 * The SVG passed as children should be aria-hidden (this frame names the
 * graphic with the summary). The table is always available.
 */
export function ChartFigure({
  title,
  summary,
  table,
  footer,
  children,
  level = 3,
  style,
}: ChartFigureProps) {
  const t = useT();
  const id = useId();
  const H = `h${level}` as "h3";
  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        minWidth: 0,
        ...style,
      }}
      aria-labelledby={`${id}-t`}
    >
      <H
        id={`${id}-t`}
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.md,
          color: colorTokens.text.primary,
        }}
      >
        {title}
      </H>
      <div role="img" aria-label={summary} style={{ minWidth: 0 }}>
        {children}
      </div>
      <figcaption
        style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
      >
        {summary}
      </figcaption>
      {footer}
      <details>
        <summary
          style={{
            cursor: "pointer",
            minHeight: 32,
            display: "flex",
            alignItems: "center",
            color: colorTokens.interactive.primary,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {t("Show data as a table")}
        </summary>
        <ScrollTable label={t("{title} data", { title })}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            <thead>
              <tr>
                {table.columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    style={{
                      textAlign: i ? "right" : "left",
                      padding: "6px 8px",
                      borderBottom: `2px solid ${colorTokens.border.primary}`,
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((v, ci) =>
                    ci === 0 ? (
                      <th
                        key={ci}
                        scope="row"
                        style={{
                          textAlign: "left",
                          fontWeight: 500,
                          padding: "6px 8px",
                          borderBottom: `1px solid ${colorTokens.border.secondary}`,
                        }}
                      >
                        {v}
                      </th>
                    ) : (
                      <td
                        key={ci}
                        style={{
                          textAlign: "right",
                          padding: "6px 8px",
                          borderBottom: `1px solid ${colorTokens.border.secondary}`,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {typeof v === "number" ? defaultFormat(v) : v}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
      </details>
    </figure>
  );
}

export function LegendList({
  items,
}: {
  items: { label: string; color: string; dashed?: boolean }[];
}) {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: spacingTokens.md,
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      {items.map((it) => (
        <li
          key={it.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: colorTokens.text.primary,
          }}
        >
          <svg width="14" height="14" aria-hidden="true">
            {it.dashed ? (
              <line
                x1="0"
                y1="7"
                x2="14"
                y2="7"
                stroke={it.color}
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            ) : (
              <rect width="14" height="14" rx="3" fill={it.color} />
            )}
          </svg>
          {it.label}
        </li>
      ))}
    </ul>
  );
}
