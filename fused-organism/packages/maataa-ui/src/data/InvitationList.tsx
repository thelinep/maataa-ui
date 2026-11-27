/**
 * @maataa/ui/data/InvitationList
 * Pending invitations with resend and revoke
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { Badge } from "../primitives/Badge";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  sentAt: Date;
  expiresAt: Date;
  invitedBy?: string;
}

export interface InvitationListProps {
  invitations: PendingInvitation[];
  onResend: (id: string) => void;
  onRevoke: (id: string) => void;
  /** @default 'en-IN' */
  locale?: string;
  now?: Date;
  /** @default 'Pending invitations' */
  title?: string;
}

const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: colorTokens.interactive.primary,
  textDecoration: "underline",
  cursor: "pointer",
  font: "inherit",
  fontSize: typographyTokens.fontSize.sm,
};

/**
 * InvitationList
 * A table: who, role, sent, state. Expired invitations say so and offer
 * Resend. Buttons name the address they act on.
 */
export function InvitationList({
  invitations,
  onResend,
  onRevoke,
  locale: localeProp,
  now = new Date(),
  title: titleProp,
}: InvitationListProps) {
  const t = useT();
  const title = titleProp ?? t("Pending invitations");
  const locale = useLocale(localeProp);
  if (invitations.length === 0)
    return <p style={{ color: colorTokens.text.secondary }}>{t("No pending invitations.")}</p>;
  const date = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const th: React.CSSProperties = {
    textAlign: "left",
    padding: spacingTokens.sm,
    fontSize: typographyTokens.fontSize.sm,
    color: colorTokens.text.secondary,
    borderBottom: `2px solid ${colorTokens.border.primary}`,
  };
  const td: React.CSSProperties = {
    padding: spacingTokens.sm,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
  };
  return (
    <ScrollTable label={title}>
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
          {title}
        </caption>
        <thead>
          <tr>
            <th scope="col" style={th}>
              {t("Email")}
            </th>
            <th scope="col" style={th}>
              {t("Role")}
            </th>
            <th scope="col" style={th}>
              {t("Sent")}
            </th>
            <th scope="col" style={th}>
              {t("Status")}
            </th>
            <th scope="col" style={th}>
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                }}
              >
                {t("Actions")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((i) => {
            const expired = i.expiresAt.getTime() < now.getTime();
            return (
              <tr key={i.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  {i.email}
                </th>
                <td style={td}>{i.role}</td>
                <td style={td}>
                  {date(i.sentAt)}
                  {i.invitedBy ? (
                    <span style={{ color: colorTokens.text.secondary }}> by {i.invitedBy}</span>
                  ) : null}
                </td>
                <td style={td}>
                  {expired ? (
                    <Badge variant="error">{t("Expired")}</Badge>
                  ) : (
                    <Badge variant="warning">
                      {t("Waiting · until {value}", { value: date(i.expiresAt) })}
                    </Badge>
                  )}
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    style={linkBtn}
                    onClick={() => onResend(i.id)}
                    aria-label={t("Resend invitation to {email}", { email: i.email })}
                  >
                    {t("Resend")}
                  </button>{" "}
                  ·{" "}
                  <button
                    type="button"
                    style={{ ...linkBtn, color: colorTokens.interactive.error }}
                    onClick={() => onRevoke(i.id)}
                    aria-label={t("Revoke invitation to {email}", { email: i.email })}
                  >
                    {t("Revoke")}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
InvitationList.displayName = "InvitationList";
