/**
 * @maataa/ui/data/RoleBreakdownCard
 * One cast or crew role: who it is, what it needs, how hiring is going
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface RoleBreakdown {
  id: string;
  /** e.g. "Meera (lead)" or "Gaffer" */
  title: string;
  kind: "cast" | "crew";
  description?: string;
  /** e.g. "Female, 25–35, Hindi and Marathi" */
  requirements?: string[];
  scenes?: number;
  shootDays?: number;
  applicants?: number;
  /** e.g. "Open", "Callbacks", "Offer out", "Filled" */
  stage: string;
  filledBy?: string;
}

export interface RoleBreakdownCardProps {
  role: RoleBreakdown;
  actions?: React.ReactNode;
}

/** RoleBreakdownCard */
export function RoleBreakdownCard({ role: r, actions }: RoleBreakdownCardProps) {
  const t = useT();
  const filled = Boolean(r.filledBy);
  return (
    <article
      aria-label={r.title}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 10,
        padding: spacingTokens.md,
        background: colorTokens.background.primary,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: spacingTokens.sm,
          alignItems: "baseline",
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{r.title}</h3>
        <Badge variant={filled ? "success" : "info"}>{filled ? "Filled" : r.stage}</Badge>
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {r.kind === "cast" ? t("Cast") : t("Crew")}
        {r.scenes !== undefined
          ? " · " + t.plural(r.scenes, "{count} scene", "{count} scenes")
          : ""}
        {r.shootDays !== undefined
          ? " · " + t.plural(r.shootDays, "{count} shoot day", "{count} shoot days")
          : ""}
      </div>
      {r.description && <p style={{ margin: 0 }}>{r.description}</p>}
      {r.requirements && r.requirements.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: spacingTokens.lg,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {r.requirements.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      )}
      <div style={{ fontSize: typographyTokens.fontSize.sm }}>
        {filled ? (
          <>
            {t("Cast:")} <strong>{r.filledBy}</strong>
          </>
        ) : (
          `${r.applicants ?? 0} applicant${r.applicants === 1 ? "" : "s"}`
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: spacingTokens.sm }}>{actions}</div>}
    </article>
  );
}
RoleBreakdownCard.displayName = "RoleBreakdownCard";
