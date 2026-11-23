/**
 * @maataa/ui/data/ReceiptDisplay
 * A payment or delivery receipt: reference, lines and total
 */

import { useLocale, useT, msg } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ReceiptLine {
  label: string;
  /** Amount in the currency's major unit, e.g. 1250.5 */
  amount: number;
}

export type ReceiptStatus = "paid" | "pending" | "refunded" | "failed";

export interface ReceiptDisplayProps extends React.HTMLAttributes<HTMLElement> {
  /** Receipt or transaction reference */
  reference: string;
  /** When it was issued */
  issuedAt: Date;
  lines: ReceiptLine[];
  /** ISO 4217 code @default 'INR' */
  currency?: string;
  /** BCP 47 locale for amounts and dates @default 'en-IN' */
  locale?: string;
  status?: ReceiptStatus;
  /** Who paid or received, e.g. "Vesahe Film Solutions" */
  party?: string;
}

const statusVariant = {
  paid: "success",
  pending: "warning",
  refunded: "info",
  failed: "error",
} as const;
const statusText: Record<ReceiptStatus, string> = {
  paid: msg("Paid"),
  pending: msg("Pending"),
  refunded: msg("Refunded"),
  failed: msg("Failed"),
};

/**
 * ReceiptDisplay
 * Lines as a real table with a total row; amounts formatted for the locale
 * and currency, aligned with tabular figures.
 *
 * @example
 * ```tsx
 * <ReceiptDisplay reference="RCPT-0042" issuedAt={new Date()} lines={[{ label: "Screening fee", amount: 15000 }]} status="paid" />
 * ```
 */
export const ReceiptDisplay = React.forwardRef<HTMLElement, ReceiptDisplayProps>(
  (
    {
      reference,
      issuedAt,
      lines,
      currency = "INR",
      locale: localeProp,
      status,
      party,
      style,
      ...props
    },
    ref
  ) => {
    const t = useT();
    const locale = useLocale(localeProp);
    const id = useId();
    const money = new Intl.NumberFormat(locale, { style: "currency", currency });
    const total = lines.reduce((sum, l) => sum + l.amount, 0);
    const cell: React.CSSProperties = {
      padding: `${spacingTokens.xs} 0`,
      borderBottom: `1px solid ${colorTokens.border.primary}`,
    };
    const num: React.CSSProperties = {
      ...cell,
      textAlign: "right",
      fontVariantNumeric: "tabular-nums",
    };
    return (
      <article
        ref={ref}
        aria-labelledby={`${id}-title`}
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.lg,
          background: colorTokens.background.secondary,
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: spacingTokens.md,
            alignItems: "baseline",
          }}
        >
          <h3 id={`${id}-title`} style={{ margin: 0 }}>
            {t("Receipt {reference}", { reference })}
          </h3>
          {status && <Badge variant={statusVariant[status]}>{t(statusText[status])}</Badge>}
        </div>
        <p
          style={{
            margin: `${spacingTokens.xs} 0 ${spacingTokens.md}`,
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <time dateTime={issuedAt.toISOString()}>
            {issuedAt.toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          {party ? ` · ${party}` : ""}
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <caption
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            Items on receipt {reference}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  ...cell,
                  textAlign: "left",
                  color: colorTokens.text.secondary,
                  fontWeight: 600,
                }}
              >
                {t("Item")}
              </th>
              <th
                scope="col"
                style={{ ...num, color: colorTokens.text.secondary, fontWeight: 600 }}
              >
                {t("Amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={`${t(l.label)}-${i}`}>
                <td style={cell}>{t(l.label)}</td>
                <td style={num}>{money.format(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" style={{ ...cell, textAlign: "left", borderBottom: "none" }}>
                {t("Total")}
              </th>
              <td style={{ ...num, borderBottom: "none", fontWeight: 700 }}>
                {money.format(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </article>
    );
  }
);

ReceiptDisplay.displayName = "ReceiptDisplay";
