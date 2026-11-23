/**
 * @maataa/ui/data/DeliveryStatusList
 * Who has received / opened a sent item (call sheet, pitch, notice)
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { StateBadge, deliveryStates } from "../status/StateBadge";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface DeliveryRecord {
  id: string;
  name: string;
  /** "email", "sms", "whatsapp" */
  channel: string;
  status: keyof typeof deliveryStates;
  at?: Date;
  /** e.g. "Mailbox full" */
  error?: string;
}

export interface DeliveryStatusListProps {
  records: DeliveryRecord[];
  onResend?: (id: string) => void;
  /** @default 'Delivery' */
  caption?: string;
  /** @default 'en-IN' */
  locale?: string;
}

/** DeliveryStatusList: summary counts in the caption; failures first. */
export function DeliveryStatusList({
  records,
  onResend,
  caption = "Delivery",
  locale: localeProp,
}: DeliveryStatusListProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const failed = records.filter((r) => r.status === "bounced" || r.status === "failed");
  const opened = records.filter((r) => r.status === "opened").length;
  const order = (r: DeliveryRecord) =>
    r.status === "bounced" || r.status === "failed"
      ? 0
      : r.status === "queued" || r.status === "sent"
        ? 1
        : 2;
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
  };
  return (
    <ScrollTable label={caption}>
      <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {caption}: {opened} of {records.length} opened
          {failed.length ? (
            <>
              {" "}
              <span style={{ color: colorTokens.interactive.error }}>
                {t("· {count} not delivered", { count: failed.length })}
              </span>
            </>
          ) : null}
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {t("Recipient")}
            </th>
            <th scope="col" style={td}>
              {t("Channel")}
            </th>
            <th scope="col" style={td}>
              {t("Status")}
            </th>
            <th scope="col" style={td}>
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
          {[...records]
            .sort((a, b) => order(a) - order(b))
            .map((r) => (
              <tr key={r.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  {r.name}
                </th>
                <td style={td}>{r.channel}</td>
                <td style={td}>
                  <StateBadge state={r.status} states={deliveryStates} />
                  {r.error && (
                    <span
                      style={{
                        display: "block",
                        color: colorTokens.interactive.error,
                        fontSize: typographyTokens.fontSize.xs,
                      }}
                    >
                      {r.error}
                    </span>
                  )}
                  {r.at && (
                    <span
                      style={{
                        display: "block",
                        color: colorTokens.text.secondary,
                        fontSize: typographyTokens.fontSize.xs,
                      }}
                    >
                      {r.at.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}
                    </span>
                  )}
                </td>
                <td style={td}>
                  {onResend && (r.status === "bounced" || r.status === "failed") && (
                    <button
                      type="button"
                      onClick={() => onResend(r.id)}
                      aria-label={t("Resend to {name}", { name: r.name })}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: colorTokens.interactive.primary,
                        textDecoration: "underline",
                        cursor: "pointer",
                        font: "inherit",
                      }}
                    >
                      {t("Resend")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
DeliveryStatusList.displayName = "DeliveryStatusList";
