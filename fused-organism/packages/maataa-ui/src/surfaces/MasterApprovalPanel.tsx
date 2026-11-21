/**
 * @maataa/ui/surfaces/MasterApprovalPanel
 * Final master sign-off: deliverables checked, QC passed, then approve
 */

import React from "react";
import { StateBadge, qcStates } from "../status/StateBadge";
import { ApprovalActions } from "../actions/ApprovalActions";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Deliverable {
  id: string;
  /** e.g. "DCP 2K Flat", "ProRes 4444 master", "Subtitles (Hindi, English)" */
  name: string;
  qc: keyof typeof qcStates;
}

export interface MasterApprovalPanelProps {
  title: string;
  deliverables: Deliverable[];
  onApprove: () => void;
  onReject: (reason: string) => void;
  approved?: { by: string; at: Date };
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * MasterApprovalPanel
 * Approval is only offered once every deliverable has passed (or waived)
 * QC; otherwise it lists what's outstanding.
 */
export function MasterApprovalPanel({
  title,
  deliverables,
  onApprove,
  onReject,
  approved,
  locale = "en-IN",
}: MasterApprovalPanelProps) {
  const outstanding = deliverables.filter((d) => d.qc !== "passed" && d.qc !== "waived");
  return (
    <section
      aria-label={title}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{title}</h3>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {deliverables.map((d) => (
          <li
            key={d.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: spacingTokens.sm,
              padding: `${spacingTokens.xs} 0`,
              borderBottom: `1px solid ${colorTokens.border.primary}`,
            }}
          >
            <span>{d.name}</span>
            <StateBadge state={d.qc} states={qcStates} />
          </li>
        ))}
      </ul>
      {approved ? (
        <p
          role="status"
          style={{ margin: 0, color: colorTokens.interactive.success, fontWeight: 600 }}
        >
          ✓ Master approved by {approved.by} on{" "}
          {approved.at.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      ) : outstanding.length ? (
        <p style={{ margin: 0, color: colorTokens.interactive.warning, fontWeight: 600 }}>
          Approval opens when QC passes on: {outstanding.map((d) => d.name).join(", ")}.
        </p>
      ) : (
        <ApprovalActions
          subject={title}
          onApprove={onApprove}
          onReject={onReject}
          approveLabel="Approve master"
        />
      )}
    </section>
  );
}
MasterApprovalPanel.displayName = "MasterApprovalPanel";
