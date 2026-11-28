/**
 * @maataa/ui/status/ScheduleConflictBadge
 * "2 conflicts" with what clashes, on demand
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ScheduleConflict {
  id: string;
  /** e.g. "Asha Rao is booked on Kabir Nagar Nights" */
  description: string;
}

export interface ScheduleConflictBadgeProps {
  conflicts: ScheduleConflict[];
  /** What the conflicts belong to, e.g. "Day 4" */
  subject?: string;
}

/**
 * ScheduleConflictBadge
 * A disclosure button (aria-expanded) that lists the clashes. Renders
 * "No conflicts" in quiet text when there are none.
 */
export function ScheduleConflictBadge({ conflicts, subject }: ScheduleConflictBadgeProps) {
  const t = useT();
  const id = useId();
  const [open, setOpen] = useState(false);
  if (conflicts.length === 0)
    return (
      <span
        style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.interactive.success }}
      >
        {t("✓ No conflicts")}
      </span>
    );
  const label = t.plural(conflicts.length, "{count} conflict", "{count} conflicts");
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={subject ? t("{conflicts} on {subject}", { conflicts: label, subject }) : label}
        onClick={() => setOpen((o) => !o)}
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          gap: 6,
          alignItems: "center",
          padding: "2px 10px",
          borderRadius: 999,
          border: `1px solid ${colorTokens.interactive.error}`,
          background: colorTokens.background.primary,
          color: colorTokens.interactive.error,
          fontWeight: 700,
          cursor: "pointer",
          font: "inherit",
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <span aria-hidden="true">⚠</span>
        {label}

        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      <ul
        id={`${id}-list`}
        hidden={!open}
        style={{ margin: 0, paddingLeft: spacingTokens.lg, fontSize: typographyTokens.fontSize.sm }}
      >
        {conflicts.map((c) => (
          <li key={c.id}>{c.description}</li>
        ))}
      </ul>
    </span>
  );
}
ScheduleConflictBadge.displayName = "ScheduleConflictBadge";
