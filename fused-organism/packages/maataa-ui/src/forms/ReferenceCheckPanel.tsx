/**
 * @maataa/ui/forms/ReferenceCheckPanel
 * Record reference checks for an applicant
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ReferenceCheck {
  id: string;
  refereeName: string;
  /** e.g. "Director, Kabir Nagar Nights" */
  relation: string;
  status: "toContact" | "contacted" | "positive" | "concerns" | "noReply";
  notes?: string;
  checkedBy?: string;
}

export interface ReferenceCheckPanelProps {
  applicantName: string;
  references: ReferenceCheck[];
  onUpdate: (id: string, patch: Partial<ReferenceCheck>) => void;
}

const label: Record<ReferenceCheck["status"], string> = {
  toContact: msg("Not contacted"),
  contacted: msg("Contacted"),
  positive: msg("Positive"),
  concerns: msg("Concerns"),
  noReply: msg("No reply"),
};
const tone = {
  toContact: "default",
  contacted: "info",
  positive: "success",
  concerns: "error",
  noReply: "warning",
} as const;

/**
 * ReferenceCheckPanel
 * One section per referee with a status select and private notes. Notes
 * are marked as internal so nobody pastes them into an offer.
 */
export function ReferenceCheckPanel({
  applicantName,
  references,
  onUpdate,
}: ReferenceCheckPanelProps) {
  const t = useT();
  const id = useId();
  const [open, setOpen] = useState<string | null>(null);
  const done = references.filter((r) => r.status === "positive" || r.status === "concerns").length;
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <h3 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        {t("References for {applicantName} ", { applicantName })}
        <span
          style={{
            fontWeight: 400,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
          }}
        >
          · {done} of {references.length} checked
        </span>
      </h3>
      {references.map((r) => (
        <div
          key={r.id}
          style={{
            border: `1px solid ${colorTokens.border.primary}`,
            borderRadius: 8,
            padding: spacingTokens.sm,
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
              flexWrap: "wrap",
            }}
          >
            <span>
              <strong>{r.refereeName}</strong>{" "}
              <span style={{ color: colorTokens.text.secondary }}>· {r.relation}</span>
            </span>
            <Badge variant={tone[r.status]}>{t(label[r.status])}</Badge>
          </div>
          <label
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "center",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            {t("Status")}
            <select
              value={r.status}
              onChange={(e) =>
                onUpdate(r.id, { status: e.target.value as ReferenceCheck["status"] })
              }
              style={{
                padding: 4,
                border: `1px solid ${colorTokens.border.control}`,
                borderRadius: 4,
                font: "inherit",
                background: colorTokens.background.primary,
              }}
            >
              {Object.entries(label).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="tertiary"
            size="sm"
            aria-expanded={open === r.id}
            onClick={() => setOpen(open === r.id ? null : r.id)}
          >
            {open === r.id ? "Hide notes" : r.notes ? t("Show notes") : t("Add notes")}
          </Button>
          {open === r.id && (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {t("Internal notes (never shared with the applicant)")}
              <textarea
                rows={3}
                defaultValue={r.notes}
                onBlur={(e) => onUpdate(r.id, { notes: e.target.value })}
                style={{
                  padding: spacingTokens.sm,
                  border: `1px solid ${colorTokens.border.control}`,
                  borderRadius: 6,
                  font: "inherit",
                  background: colorTokens.background.primary,
                }}
              />
            </label>
          )}
        </div>
      ))}
    </section>
  );
}
ReferenceCheckPanel.displayName = "ReferenceCheckPanel";
