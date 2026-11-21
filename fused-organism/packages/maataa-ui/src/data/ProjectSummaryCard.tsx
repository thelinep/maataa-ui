/**
 * @maataa/ui/data/ProjectSummaryCard
 * Dashboard card for one project: stage, budget use, next milestone, team
 */

import React from "react";
import { Badge } from "../primitives/Badge";
import { Avatar } from "./Avatar";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ProjectSummary {
  id: string;
  title: string;
  stage: string;
  /** 0–1 share of budget spent */
  budgetUsed?: number;
  budgetLabel?: string;
  nextMilestone?: string;
  team?: string[];
  href?: string;
}

export interface ProjectSummaryCardProps {
  project: ProjectSummary;
  onOpen?: (p: ProjectSummary) => void;
}

/**
 * ProjectSummaryCard
 * Title link stretched over the card; budget use is a labelled meter and
 * the percentage is written out. Over 100% is flagged in words.
 */
export function ProjectSummaryCard({ project: p, onOpen }: ProjectSummaryCardProps) {
  const pct = p.budgetUsed !== undefined ? Math.round(p.budgetUsed * 100) : undefined;
  const over = pct !== undefined && pct > 100;
  return (
    <article
      style={{
        position: "relative",
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
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
          <a
            href={p.href ?? `#${p.id}`}
            onClick={(e) => {
              if (onOpen) {
                e.preventDefault();
                onOpen(p);
              }
            }}
            style={{ color: colorTokens.text.primary, textDecoration: "none" }}
          >
            <span aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
            {p.title}
          </a>
        </h3>
        <Badge variant="info">{p.stage}</Badge>
      </div>
      {pct !== undefined && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            <span>Budget used</span>
            <span
              style={{
                fontWeight: 600,
                color: over ? colorTokens.interactive.error : colorTokens.text.primary,
              }}
            >
              {pct}%{over ? " · over budget" : ""}
              {p.budgetLabel ? ` of ${p.budgetLabel}` : ""}
            </span>
          </div>
          <div
            role="meter"
            aria-label="Budget used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(pct, 100)}
            aria-valuetext={`${pct}%${over ? ", over budget" : ""}`}
            style={{
              height: 8,
              borderRadius: 99,
              background: colorTokens.background.tertiary,
              marginTop: 4,
            }}
          >
            <div
              style={{
                width: `${Math.min(pct, 100)}%`,
                height: "100%",
                borderRadius: 99,
                background: over
                  ? colorTokens.interactive.error
                  : pct > 85
                    ? colorTokens.interactive.warning
                    : colorTokens.interactive.primary,
              }}
            />
          </div>
        </div>
      )}
      {p.nextMilestone && (
        <div style={{ fontSize: typographyTokens.fontSize.sm }}>
          <span style={{ color: colorTokens.text.secondary }}>Next: </span>
          {p.nextMilestone}
        </div>
      )}
      {p.team && p.team.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.xs }}>
          <div aria-hidden="true" style={{ display: "flex" }}>
            {p.team.slice(0, 4).map((n, i) => (
              <Avatar
                key={n}
                name={n}
                size="sm"
                decorative
                style={{
                  marginLeft: i ? -6 : 0,
                  boxShadow: `0 0 0 2px ${colorTokens.background.primary}`,
                }}
              />
            ))}
          </div>
          <span
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
          >
            {p.team.length} {p.team.length === 1 ? "person" : "people"}
          </span>
        </div>
      )}
    </article>
  );
}
ProjectSummaryCard.displayName = "ProjectSummaryCard";
