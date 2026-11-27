/**
 * @maataa/ui/data/PitchViews
 * Choose pitch recipients, and see how a sent pitch was read
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { Badge } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PitchContact {
  id: string;
  name: string;
  company: string;
  /** e.g. "Streaming", "Studio", "Investor" */
  kind: string;
  /** When they last received a pitch from you */
  lastPitched?: Date;
  /** They asked not to be contacted */
  optedOut?: boolean;
}

export interface PitchRecipientSelectorProps {
  contacts: PitchContact[];
  value: string[];
  onChange: (ids: string[]) => void;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * PitchRecipientSelector
 * Searchable checkbox list. Contacts who opted out can't be chosen; ones
 * pitched in the last 30 days are flagged so nobody gets spammed.
 */
export function PitchRecipientSelector({
  contacts,
  value,
  onChange,
  locale: localeProp,
}: PitchRecipientSelectorProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const [q, setQ] = useState("");
  const now = Date.now();
  const shown = contacts.filter(
    (c) =>
      !q.trim() || `${c.name} ${c.company} ${c.kind}`.toLowerCase().includes(q.trim().toLowerCase())
  );
  return (
    <fieldset
      style={{
        border: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.xs,
      }}
    >
      <legend style={{ fontWeight: 700, padding: 0, marginBottom: spacingTokens.xs }}>
        {tx("Send the pitch to · {count} chosen", { count: value.length })}
      </legend>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        {tx("Search contacts")}
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: 6,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 4,
            font: "inherit",
          }}
        />
      </label>
      {shown.map((c) => {
        const recent = c.lastPitched && now - c.lastPitched.getTime() < 30 * 86_400_000;
        return (
          <label
            key={c.id}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "flex-start",
              padding: "4px 0",
              borderBottom: `1px solid ${colorTokens.border.primary}`,
              color: c.optedOut ? colorTokens.text.secondary : colorTokens.text.primary,
            }}
          >
            <input
              type="checkbox"
              disabled={c.optedOut}
              checked={value.includes(c.id)}
              onChange={(e) =>
                onChange(e.target.checked ? [...value, c.id] : value.filter((x) => x !== c.id))
              }
              style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
            />
            <span style={{ fontSize: typographyTokens.fontSize.sm }}>
              <strong>{c.name}</strong> · {c.company} · {c.kind}
              {c.optedOut && (
                <span style={{ display: "block", fontSize: typographyTokens.fontSize.xs }}>
                  {tx("Asked not to receive pitches")}
                </span>
              )}
              {!c.optedOut && recent && (
                <span
                  style={{
                    display: "block",
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.interactive.warning,
                    fontWeight: 600,
                  }}
                >
                  Pitched on{" "}
                  {c.lastPitched!.toLocaleDateString(locale, { day: "numeric", month: "short" })}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
PitchRecipientSelector.displayName = "PitchRecipientSelector";

export interface PitchDeliveryReceiptProps {
  deck: string;
  recipient: string;
  sentAt: Date;
  openedAt?: Date;
  /** Seconds spent per slide, in order */
  slideSeconds?: number[];
  /** Slide titles, same order */
  slideTitles?: string[];
  downloaded?: boolean;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * PitchDeliveryReceipt
 * When it was sent and opened, and time on each slide as a table (the bars
 * are decoration). Slides not reached say "Not viewed".
 */
export function PitchDeliveryReceipt({
  deck,
  recipient,
  sentAt,
  openedAt,
  slideSeconds = [],
  slideTitles = [],
  downloaded,
  locale: localeProp,
}: PitchDeliveryReceiptProps) {
  const tx = useT();
  const locale = useLocale(localeProp);
  const t = (d: Date) =>
    d.toLocaleString(locale, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  const max = Math.max(1, ...slideSeconds);
  const total = slideSeconds.reduce((a, b) => a + b, 0);
  return (
    <section
      aria-label={tx("{deck} sent to {recipient}", { deck, recipient })}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
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
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.md }}>
          {deck} → {recipient}
        </h3>
        <Badge variant={openedAt ? "success" : "info"}>
          {openedAt ? tx("Opened") : tx("Not opened yet")}
        </Badge>
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        Sent {t(sentAt)}
        {openedAt ? ` · opened ${t(openedAt)}` : ""}
        {total ? ` · ${Math.floor(total / 60)} min ${total % 60} s reading` : ""}
        {downloaded ? " · downloaded" : ""}
      </div>
      {slideSeconds.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <caption
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            {tx("Time on each slide")}
          </caption>
          <thead>
            <tr
              style={{
                fontSize: typographyTokens.fontSize.xs,
                color: colorTokens.text.secondary,
                textAlign: "left",
              }}
            >
              <th scope="col">{tx("Slide")}</th>
              <th scope="col" style={{ textAlign: "right" }}>
                {tx("Time")}
              </th>
              <th scope="col" style={{ width: "45%" }}>
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  {tx("Bar")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {slideSeconds.map((s, i) => (
              <tr key={i} style={{ fontSize: typographyTokens.fontSize.sm }}>
                <th scope="row" style={{ textAlign: "left", fontWeight: 400, padding: "2px 0" }}>
                  {i + 1}. {slideTitles[i] ?? `Slide ${i + 1}`}
                </th>
                <td
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    padding: "2px 8px",
                    color: s ? undefined : colorTokens.text.secondary,
                  }}
                >
                  {s ? `${s} s` : "Not viewed"}
                </td>
                <td aria-hidden="true">
                  <div
                    style={{
                      height: 8,
                      width: `${(s / max) * 100}%`,
                      background: colorTokens.interactive.primary,
                      borderRadius: 4,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
PitchDeliveryReceipt.displayName = "PitchDeliveryReceipt";
