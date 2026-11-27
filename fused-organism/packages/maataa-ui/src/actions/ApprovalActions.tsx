/**
 * @maataa/ui/actions/ApprovalActions
 * Approve, or send back with a reason
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ApprovalActionsProps {
  /** What's being approved, e.g. "Ravi's timesheet, week 47" */
  subject: string;
  onApprove: () => void;
  onReject: (reason: string) => void;
  /** Labels @default 'Approve' / 'Send back' */
  approveLabel?: string;
  rejectLabel?: string;
  /** You can't approve your own item */
  disabledReason?: string;
  busy?: boolean;
}

/**
 * ApprovalActions
 * Sending back opens an inline reason field (required, at least 10
 * characters) that the author will read. Buttons name the subject.
 */
export function ApprovalActions({
  subject,
  onApprove,
  onReject,
  approveLabel: approveLabelProp,
  rejectLabel: rejectLabelProp,
  disabledReason,
  busy,
}: ApprovalActionsProps) {
  const t = useT();
  const rejectLabel = rejectLabelProp ?? t("Send back");
  const approveLabel = approveLabelProp ?? t("Approve");
  const id = useId();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  if (disabledReason)
    return (
      <p
        style={{
          margin: 0,
          color: colorTokens.text.secondary,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        {disabledReason}
      </p>
    );
  return (
    <div
      role="group"
      aria-label={t("Decision on {subject}", { subject })}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      {!rejecting ? (
        <div style={{ display: "flex", gap: spacingTokens.sm }}>
          <Button onClick={onApprove} disabled={busy}>
            {approveLabel}
          </Button>
          <Button variant="secondary" onClick={() => setRejecting(true)} disabled={busy}>
            {rejectLabel}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (reason.trim().length < 10)
              return setErr("Explain what needs changing (at least 10 characters)");
            onReject(reason.trim());
            setRejecting(false);
            setReason("");
            setErr("");
          }}
          style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}
        >
          <label htmlFor={`${id}-r`} style={{ fontWeight: 500 }}>
            {t("Why are you sending it back?")}
          </label>
          <textarea
            id={`${id}-r`}
            rows={3}
            value={reason}
            autoFocus
            onChange={(e) => setReason(e.target.value)}
            aria-invalid={err ? true : undefined}
            aria-describedby={`${id}-h${err ? ` ${id}-e` : ""}`}
            style={{
              padding: spacingTokens.sm,
              border: `2px solid ${err ? colorTokens.interactive.error : colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              background: colorTokens.background.primary,
            }}
          />
          <span
            id={`${id}-h`}
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
          >
            {t("They’ll see this message.")}
          </span>
          {err && (
            <span
              id={`${id}-e`}
              role="alert"
              style={{
                color: colorTokens.interactive.error,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              {err}
            </span>
          )}
          <div style={{ display: "flex", gap: spacingTokens.sm }}>
            <Button type="submit" variant="danger">
              {rejectLabel}
            </Button>
            <Button variant="secondary" onClick={() => setRejecting(false)}>
              {t("Cancel")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
ApprovalActions.displayName = "ApprovalActions";
