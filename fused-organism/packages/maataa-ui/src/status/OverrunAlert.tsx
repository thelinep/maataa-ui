/**
 * @maataa/ui/status/OverrunAlert
 * Warns when spending passes (or nears) the budget
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface OverrunAlertProps {
  /** What's over, e.g. "Catering" or "Monsoon Diaries" */
  subject: string;
  budget: number;
  actual: number;
  /** Share at which to warn before overrun @default 0.9 */
  warnAt?: number;
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
  /** e.g. a "Review budget" button */
  action?: React.ReactNode;
}

/**
 * OverrunAlert
 * Renders nothing below the warning level. Over budget it is an alert;
 * nearing it is a polite status. Always states the amounts.
 */
export function OverrunAlert({
  subject,
  budget,
  actual,
  warnAt = 0.9,
  currency = "INR",
  locale: localeProp,
  action,
}: OverrunAlertProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const ratio = budget > 0 ? actual / budget : 0;
  if (ratio < warnAt) return null;
  const over = actual > budget;
  const tone = over ? colorTokens.interactive.error : colorTokens.interactive.warning;
  return (
    <div
      role={over ? "alert" : "status"}
      style={{
        display: "flex",
        gap: spacingTokens.md,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        border: `1px solid ${tone}`,
        borderLeft: `6px solid ${tone}`,
        borderRadius: 6,
        padding: spacingTokens.sm,
        background: colorTokens.background.secondary,
      }}
    >
      <span>
        <strong style={{ color: tone }}>
          {over
            ? t("{subject} is over budget", { subject })
            : t("{subject} is close to its budget", { subject })}
        </strong>
        <br />
        {over
          ? t("{actual} spent of {budget} ({overBy} over).", {
              actual: money.format(actual),
              budget: money.format(budget),
              overBy: money.format(actual - budget),
            })
          : t("{actual} spent of {budget} ({pct}%).", {
              actual: money.format(actual),
              budget: money.format(budget),
              pct: Math.round(ratio * 100),
            })}
      </span>
      {action}
    </div>
  );
}
OverrunAlert.displayName = "OverrunAlert";
