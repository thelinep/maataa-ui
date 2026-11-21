/**
 * @maataa/ui/status/StateBadge
 * A workflow state as a badge with words and a mark, from a preset map
 */

import React from "react";
import { Badge, type BadgeProps } from "../primitives/Badge";

export interface StateDef {
  label: string;
  variant: NonNullable<BadgeProps["variant"]>;
  /** Short mark shown before the label; decorative */
  mark?: string;
}

export type StateMap = Record<string, StateDef>;

export interface StateBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  state: string;
  states: StateMap;
  /** Prefix read by screen readers, e.g. "Render status" */
  prefix?: string;
}

/**
 * StateBadge
 * Words plus a mark, never colour alone. Unknown states fall back to the
 * raw value so nothing renders blank.
 *
 * @example
 * ```tsx
 * <StateBadge state="approved" states={qcStates} prefix="QC" />
 * ```
 */
export function StateBadge({ state, states, prefix, ...props }: StateBadgeProps) {
  const def = states[state] ?? { label: state, variant: "default" as const };
  return (
    <Badge variant={def.variant} {...props}>
      {prefix && (
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {prefix}:
        </span>
      )}
      {prefix && " "}
      {def.mark && <span aria-hidden="true">{def.mark} </span>}
      {def.label}
    </Badge>
  );
}
StateBadge.displayName = "StateBadge";

const s = (label: string, variant: StateDef["variant"], mark?: string): StateDef => ({
  label,
  variant,
  mark,
});

/** Drone flight and location clearance */
export const clearanceStates: StateMap = {
  notRequired: s("Not required", "default", "–"),
  pending: s("Clearance pending", "warning", "…"),
  granted: s("Cleared", "success", "✓"),
  conditional: s("Cleared with conditions", "info", "!"),
  refused: s("Refused", "error", "✕"),
  expired: s("Expired", "error", "⏱"),
};
/** VFX/edit renders */
export const renderStates: StateMap = {
  queued: s("Queued", "default", "…"),
  rendering: s("Rendering", "info", "↻"),
  done: s("Rendered", "success", "✓"),
  failed: s("Render failed", "error", "✕"),
};
/** Quality control */
export const qcStates: StateMap = {
  notStarted: s("QC not started", "default", "–"),
  inReview: s("In QC", "info", "…"),
  passed: s("QC passed", "success", "✓"),
  failed: s("QC failed", "error", "✕"),
  waived: s("QC waived", "warning", "!"),
};
/** Contract signatures */
export const signatureStates: StateMap = {
  draft: s("Draft", "default", "–"),
  sent: s("Sent for signature", "info", "→"),
  partiallySigned: s("Partly signed", "warning", "½"),
  signed: s("Signed", "success", "✓"),
  declined: s("Declined", "error", "✕"),
  expired: s("Expired", "error", "⏱"),
};
/** Message / call sheet / pitch delivery */
export const deliveryStates: StateMap = {
  queued: s("Queued", "default", "…"),
  sent: s("Sent", "info", "→"),
  delivered: s("Delivered", "info", "✓"),
  opened: s("Opened", "success", "✓✓"),
  bounced: s("Bounced", "error", "✕"),
  failed: s("Not delivered", "error", "✕"),
};
/** Publishing (crowdfunding, listings, call sheets) */
export const publicationStates: StateMap = {
  draft: s("Draft", "default", "–"),
  inReview: s("In review", "warning", "…"),
  published: s("Published", "success", "●"),
  withdrawn: s("Withdrawn", "error", "○"),
  closed: s("Closed", "default", "■"),
};
/** Approvals (timesheets, prices, budgets, masters) */
export const approvalStates: StateMap = {
  draft: s("Draft", "default", "–"),
  submitted: s("Waiting for approval", "warning", "…"),
  approved: s("Approved", "success", "✓"),
  rejected: s("Sent back", "error", "↩"),
};
/** Permits */
export const permitStates: StateMap = {
  notApplied: s("Not applied", "default", "–"),
  applied: s("Applied", "info", "→"),
  approved: s("Approved", "success", "✓"),
  rejected: s("Rejected", "error", "✕"),
  expired: s("Expired", "error", "⏱"),
};
