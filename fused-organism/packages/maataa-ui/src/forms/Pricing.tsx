/**
 * @maataa/ui/forms/Pricing
 * Dated price sources and a pricing worksheet (markups, GST, total)
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { ScrollTable } from "../data/ScrollTable";
import { StateBadge, approvalStates } from "../status/StateBadge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PriceSource {
  id: string;
  item: string;
  price: number;
  /** e.g. "per day" */
  unit: string;
  /** Vendor or published rate card */
  source: string;
  checkedOn: Date;
  url?: string;
}

export interface PricingSourceTableProps {
  sources: PriceSource[];
  /** Sources older than this are flagged @default 90 */
  staleAfterDays?: number;
  now?: Date;
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/** PricingSourceTable: every price with where and when it came from; stale ones flagged. */
export function PricingSourceTable({
  sources,
  staleAfterDays = 90,
  now = new Date(),
  currency = "INR",
  locale: localeProp,
}: PricingSourceTableProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    textAlign: "left",
    verticalAlign: "top",
  };
  return (
    <ScrollTable label={t("Price sources")}>
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {t("Price sources")}
        </caption>
        <thead>
          <tr style={{ color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {t("Item")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Price")}
            </th>
            <th scope="col" style={td}>
              {t("Source")}
            </th>
            <th scope="col" style={td}>
              {t("Checked")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => {
            const age = Math.floor((now.getTime() - s.checkedOn.getTime()) / 86_400_000);
            const stale = age > staleAfterDays;
            return (
              <tr key={s.id}>
                <th scope="row" style={td}>
                  {s.item}
                </th>
                <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {money.format(s.price)}{" "}
                  <span style={{ color: colorTokens.text.secondary }}>{s.unit}</span>
                </td>
                <td style={td}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colorTokens.interactive.primary }}
                    >
                      {s.source}
                    </a>
                  ) : (
                    s.source
                  )}
                </td>
                <td
                  style={{
                    ...td,
                    color: stale ? colorTokens.interactive.warning : undefined,
                    fontWeight: stale ? 600 : 400,
                  }}
                >
                  {s.checkedOn.toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {stale ? " · " + t("{age} days old, recheck", { age }) : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
PricingSourceTable.displayName = "PricingSourceTable";

export interface PricingLine {
  id: string;
  label: string;
  /** Fixed amount, or a percentage of the running subtotal */
  kind: "amount" | "percent";
  value: number;
}

/** Applies lines in order; returns each step's amount and the total. */
export function priceSteps(
  base: number,
  lines: PricingLine[]
): { id: string; amount: number; running: number }[] {
  let running = base;
  return lines.map((l) => {
    const amount = l.kind === "percent" ? (running * l.value) / 100 : l.value;
    running += amount;
    return { id: l.id, amount, running };
  });
}

export interface PricingWorksheetProps {
  title: string;
  base: number;
  baseLabel?: string;
  lines: PricingLine[];
  onChange: (id: string, value: number) => void;
  /** Approved version info, shown as a badge */
  approval?: { state: keyof typeof approvalStates; version: string };
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * PricingWorksheet
 * Each step shows its working ("18% of ₹1,20,000 = ₹21,600"), so the
 * total can be checked by eye; the total is a live output.
 */
export function PricingWorksheet({
  title,
  base,
  baseLabel: baseLabelProp,
  lines,
  onChange,
  approval,
  currency = "INR",
  locale: localeProp,
}: PricingWorksheetProps) {
  const t = useT();
  const baseLabel = baseLabelProp ?? t("Base price");
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const steps = priceSteps(base, lines);
  const total = steps.length ? steps[steps.length - 1].running : base;
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    verticalAlign: "middle",
  };
  return (
    <section
      aria-label={title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm, maxWidth: 640 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: spacingTokens.sm,
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{title}</h3>
        {approval && (
          <span
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            Version {approval.version} <StateBadge state={approval.state} states={approvalStates} />
          </span>
        )}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <th scope="row" style={{ ...td, textAlign: "left" }}>
              {baseLabel}
            </th>
            <td style={td} />
            <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {money.format(base)}
            </td>
          </tr>
          {lines.map((l, i) => {
            const st = steps[i];
            const before = i === 0 ? base : steps[i - 1].running;
            return (
              <tr key={l.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 400 }}>
                  <label htmlFor={`pw-${l.id}`}>{l.label}</label>
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {l.kind === "percent"
                      ? `${l.value}% of ${money.format(before)} = ${money.format(st.amount)}`
                      : "Fixed amount"}
                  </span>
                </th>
                <td style={{ ...td, width: 120 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <input
                      id={`pw-${l.id}`}
                      type="number"
                      inputMode="decimal"
                      value={l.value}
                      onChange={(e) => onChange(l.id, Number(e.target.value))}
                      style={{
                        width: 80,
                        padding: 4,
                        border: `1px solid ${colorTokens.border.control}`,
                        borderRadius: 4,
                        font: "inherit",
                        textAlign: "right",
                      }}
                    />
                    <span aria-hidden="true">
                      {l.kind === "percent" ? "%" : currency === "INR" ? "₹" : currency}
                    </span>
                  </span>
                </td>
                <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {money.format(st.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" style={{ ...td, textAlign: "left", borderBottom: "none" }}>
              {t("Total")}
            </th>
            <td style={{ ...td, borderBottom: "none" }} />
            <td
              style={{
                ...td,
                textAlign: "right",
                fontWeight: 700,
                borderBottom: "none",
                fontSize: typographyTokens.fontSize.lg,
              }}
            >
              <output aria-live="polite">{money.format(total)}</output>
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
PricingWorksheet.displayName = "PricingWorksheet";
