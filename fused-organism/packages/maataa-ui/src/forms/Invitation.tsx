/**
 * @maataa/ui/forms/Invitation
 * Accept an invitation, or recover from an expired one
 */

import React, { useId } from "react";
import { Button } from "../primitives/Button";
import { Avatar } from "../data/Avatar";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface InvitationDetails {
  inviterName: string;
  /** Project or organisation */
  workspaceName: string;
  role: string;
  /** The invitation's email; shown so people notice a wrong account */
  email: string;
  expiresAt: Date;
}

export interface InvitationAcceptanceProps {
  invitation: InvitationDetails;
  /** Email of the signed-in account, if any */
  signedInAs?: string;
  onAccept: () => void;
  onDecline: () => void;
  onSwitchAccount?: () => void;
  busy?: boolean;
  /** @default 'en-IN' */
  locale?: string;
  /** Clock for tests */
  now?: Date;
}

/**
 * InvitationAcceptance
 * Who invited you, to what, as which role, and when it expires. Warns if
 * you're signed in with a different email than the invitation's.
 */
export function InvitationAcceptance({
  invitation,
  signedInAs,
  onAccept,
  onDecline,
  onSwitchAccount,
  busy,
  locale = "en-IN",
  now = new Date(),
}: InvitationAcceptanceProps) {
  const id = useId();
  const { inviterName, workspaceName, role, email, expiresAt } = invitation;
  const mismatch = signedInAs && signedInAs.toLowerCase() !== email.toLowerCase();
  const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / 86_400_000);
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 480 }}
    >
      <div style={{ display: "flex", gap: spacingTokens.md, alignItems: "center" }}>
        <Avatar name={inviterName} size="lg" decorative />
        <h1 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"] }}>
          {inviterName} invited you to {workspaceName}
        </h1>
      </div>
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: `${spacingTokens.xs} ${spacingTokens.md}`,
          margin: 0,
        }}
      >
        <dt style={{ color: colorTokens.text.secondary }}>Your role</dt>
        <dd style={{ margin: 0, fontWeight: 600 }}>{role}</dd>
        <dt style={{ color: colorTokens.text.secondary }}>Sent to</dt>
        <dd style={{ margin: 0 }}>{email}</dd>
        <dt style={{ color: colorTokens.text.secondary }}>Expires</dt>
        <dd style={{ margin: 0 }}>
          {expiresAt.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {daysLeft <= 3 && daysLeft > 0 ? ` (in ${daysLeft} day${daysLeft === 1 ? "" : "s"})` : ""}
        </dd>
      </dl>
      {mismatch && (
        <div
          role="alert"
          style={{
            border: `1px solid ${colorTokens.interactive.warning}`,
            borderRadius: 6,
            padding: spacingTokens.sm,
          }}
        >
          You’re signed in as <strong>{signedInAs}</strong>, but this invitation is for{" "}
          <strong>{email}</strong>.
          {onSwitchAccount && (
            <div style={{ marginTop: spacingTokens.xs }}>
              <Button variant="secondary" size="sm" onClick={onSwitchAccount}>
                Switch account
              </Button>
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        <Button onClick={onAccept} disabled={busy}>
          Accept and join
        </Button>
        <Button variant="secondary" onClick={onDecline} disabled={busy}>
          Decline
        </Button>
      </div>
    </section>
  );
}
InvitationAcceptance.displayName = "InvitationAcceptance";

export type InvitationProblem = "expired" | "used" | "revoked" | "invalid";

export interface InvitationRecoveryPanelProps {
  problem: InvitationProblem;
  inviterName?: string;
  workspaceName?: string;
  /** Asks the inviter to send a fresh invitation */
  onRequestNew?: () => void;
  /** Set after a request was sent */
  requested?: boolean;
  onGoHome: () => void;
}

const problemText: Record<InvitationProblem, string> = {
  expired: "This invitation has expired.",
  used: "This invitation has already been used.",
  revoked: "This invitation was cancelled.",
  invalid: "We couldn't read this invitation link.",
};

/** InvitationRecoveryPanel: what went wrong and how to get a working invite. */
export function InvitationRecoveryPanel({
  problem,
  inviterName,
  workspaceName,
  onRequestNew,
  requested,
  onGoHome,
}: InvitationRecoveryPanelProps) {
  const who = inviterName ?? "the person who invited you";
  return (
    <section
      aria-label="Invitation problem"
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 480 }}
    >
      <h1 style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"] }}>
        {problemText[problem]}
      </h1>
      <p style={{ margin: 0, color: colorTokens.text.secondary }}>
        {problem === "used"
          ? `If you already joined${workspaceName ? ` ${workspaceName}` : ""}, sign in to continue. Otherwise ask ${who} for a new invitation.`
          : `Ask ${who} to send a new one${workspaceName ? ` for ${workspaceName}` : ""}. Invitations last 7 days.`}
      </p>
      <div role="status">
        {requested ? `Request sent. ${inviterName ?? "They"} will get an email.` : ""}
      </div>
      <div style={{ display: "flex", gap: spacingTokens.sm }}>
        {onRequestNew && problem !== "invalid" && !requested && (
          <Button onClick={onRequestNew}>Ask for a new invitation</Button>
        )}
        <Button variant="secondary" onClick={onGoHome}>
          Go to sign in
        </Button>
      </div>
    </section>
  );
}
InvitationRecoveryPanel.displayName = "InvitationRecoveryPanel";
