/**
 * @maataa/ui/data/PermitStatusCard
 * A shoot, location or drone permit: authority, dates, state, conditions
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { StateBadge, permitStates } from "../status/StateBadge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Permit {
  id: string;
  /** e.g. "Shoot permit – BMC" or "DGCA drone permission" */
  title: string;
  authority: string;
  reference?: string;
  status: keyof typeof permitStates;
  validFrom?: Date;
  validTo?: Date;
  conditions?: string[];
}

export interface PermitStatusCardProps {
  permit: Permit;
  /** @default 'en-IN' */
  locale?: string;
  now?: Date;
  actions?: React.ReactNode;
}

/** PermitStatusCard: warns in words when it expires within 7 days. */
export function PermitStatusCard({
  permit: p,
  locale: localeProp,
  now = new Date(),
  actions,
}: PermitStatusCardProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const daysLeft = p.validTo
    ? Math.ceil((p.validTo.getTime() - now.getTime()) / 86_400_000)
    : undefined;
  const expiring =
    p.status === "approved" && daysLeft !== undefined && daysLeft >= 0 && daysLeft <= 7;
  return (
    <article
      aria-label={p.title}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        background: colorTokens.background.primary,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.xs,
      }}
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
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>{p.title}</h3>
        <StateBadge state={p.status} states={permitStates} />
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {p.authority}
        {p.reference ? " · " + t("Ref {reference}", { reference: p.reference }) : ""}
      </div>
      {p.validFrom && p.validTo && (
        <div style={{ fontSize: typographyTokens.fontSize.sm }}>
          Valid {fmt(p.validFrom)} to {fmt(p.validTo)}
          {expiring && (
            <>
              {" "}
              <strong style={{ color: colorTokens.interactive.warning }}>
                {t.plural(daysLeft, "· expires in {count} day", "· expires in {count} days")}
              </strong>
            </>
          )}
        </div>
      )}
      {p.conditions && p.conditions.length > 0 && (
        <details>
          <summary style={{ cursor: "pointer", fontSize: typographyTokens.fontSize.sm }}>
            {t.plural(p.conditions.length, "{count} condition", "{count} conditions")}
          </summary>
          <ul
            style={{
              margin: `${spacingTokens.xs} 0 0`,
              paddingLeft: spacingTokens.lg,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {p.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </details>
      )}
      {actions}
    </article>
  );
}
PermitStatusCard.displayName = "PermitStatusCard";
