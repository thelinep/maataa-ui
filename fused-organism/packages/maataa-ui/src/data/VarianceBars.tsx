/**
 * @maataa/ui/data/VarianceBars
 * Actuals against budget, per category, with the variance in words
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface VarianceRow {
  category: string;
  budget: number;
  actual: number;
}

export interface VarianceBarsProps {
  rows: VarianceRow[];
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
  /** @default 'Actuals vs budget' */
  title?: string;
}

/**
 * VarianceBars
 * A table (category, budget, actual, variance) with an inline bar per row.
 * Over-budget rows say "₹40,000 over" in text; the bar is decoration.
 */
export function VarianceBars({
  rows,
  currency = "INR",
  locale: localeProp,
  title: titleProp,
}: VarianceBarsProps) {
  const t = useT();
  const title = titleProp ?? t("Actuals vs budget");
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const max = Math.max(1, ...rows.map((r) => Math.max(r.budget, r.actual)));
  const td: React.CSSProperties = {
    padding: spacingTokens.sm,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <ScrollTable label={title}>
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
          {title}
        </caption>
        <thead>
          <tr style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
            <th scope="col" style={{ ...td, textAlign: "left" }}>
              {t("Category")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Budget")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Actual")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Variance")}
            </th>
            <th scope="col" style={{ ...td, width: "30%" }}>
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                }}
              >
                {t("Chart")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const diff = r.actual - r.budget;
            const over = diff > 0;
            return (
              <tr key={r.category}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  {r.category}
                </th>
                <td style={{ ...td, textAlign: "right" }}>{money.format(r.budget)}</td>
                <td style={{ ...td, textAlign: "right" }}>{money.format(r.actual)}</td>
                <td
                  style={{
                    ...td,
                    textAlign: "right",
                    fontWeight: 600,
                    color: over ? colorTokens.interactive.error : colorTokens.interactive.success,
                  }}
                >
                  {diff === 0
                    ? "On budget"
                    : `${money.format(Math.abs(diff))} ${over ? "over" : "under"}`}
                </td>
                <td style={td} aria-hidden="true">
                  <div style={{ position: "relative", height: 14 }}>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        height: 6,
                        width: `${(r.budget / max) * 100}%`,
                        background: colorTokens.border.control,
                        borderRadius: 3,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        height: 6,
                        width: `${(r.actual / max) * 100}%`,
                        background: over
                          ? colorTokens.interactive.error
                          : colorTokens.interactive.primary,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
VarianceBars.displayName = "VarianceBars";
