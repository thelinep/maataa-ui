/**
 * @maataa/ui/data/BusinessLists
 * Delivery tracker, screening attendees, legal matters, signatures,
 * subsidy programmes, networking contacts
 */

import React from "react";
import { Badge } from "../primitives/Badge";
import { StateBadge, signatureStates } from "../status/StateBadge";
import { ScrollTable } from "./ScrollTable";
import { relativeDue } from "./DeadlineList";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

const td: React.CSSProperties = {
  padding: spacingTokens.xs,
  borderBottom: `1px solid ${colorTokens.border.primary}`,
  fontSize: typographyTokens.fontSize.sm,
  verticalAlign: "top",
  textAlign: "left",
};
const fmt = (d: Date, locale = "en-IN") =>
  d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

/* ---------- Delivery tracker ---------- */

export interface DeliveryItem {
  id: string;
  /** e.g. "Netflix India" */
  recipient: string;
  /** e.g. "IMF package", "Dubbing script" */
  item: string;
  due: Date;
  status: "notStarted" | "inProgress" | "sent" | "accepted" | "rejected";
  note?: string;
}
const delText = {
  notStarted: "Not started",
  inProgress: "In progress",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};
const delTone = {
  notStarted: "default",
  inProgress: "info",
  sent: "warning",
  accepted: "success",
  rejected: "error",
} as const;

/** DeliveryTracker: grouped by recipient, due dates relative and in words. */
export function DeliveryTracker({
  items,
  now = new Date(),
  locale = "en-IN",
}: {
  items: DeliveryItem[];
  now?: Date;
  locale?: string;
}) {
  const recips = Array.from(new Set(items.map((i) => i.recipient)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}>
      {recips.map((r) => {
        const mine = items
          .filter((i) => i.recipient === r)
          .sort((a, b) => a.due.getTime() - b.due.getTime());
        const done = mine.filter((i) => i.status === "accepted").length;
        return (
          <ScrollTable key={r} label={`Deliveries to ${r}`}>
            <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse" }}>
              <caption
                style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}
              >
                {r} · {done} of {mine.length} accepted
              </caption>
              <thead>
                <tr style={{ color: colorTokens.text.secondary }}>
                  <th scope="col" style={td}>
                    Item
                  </th>
                  <th scope="col" style={td}>
                    Due
                  </th>
                  <th scope="col" style={td}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mine.map((i) => {
                  const rel = relativeDue(i.due, now);
                  const late =
                    rel.tone === "error" && i.status !== "accepted" && i.status !== "sent";
                  return (
                    <tr key={i.id}>
                      <th scope="row" style={td}>
                        {i.item}
                        {i.note && (
                          <span
                            style={{
                              display: "block",
                              fontWeight: 400,
                              fontSize: typographyTokens.fontSize.xs,
                              color:
                                i.status === "rejected"
                                  ? colorTokens.interactive.error
                                  : colorTokens.text.secondary,
                            }}
                          >
                            {i.note}
                          </span>
                        )}
                      </th>
                      <td
                        style={{
                          ...td,
                          color: late ? colorTokens.interactive.error : undefined,
                          fontWeight: late ? 700 : 400,
                        }}
                      >
                        {fmt(i.due, locale)}
                        {i.status !== "accepted" && (
                          <span
                            style={{ display: "block", fontSize: typographyTokens.fontSize.xs }}
                          >
                            {rel.text}
                          </span>
                        )}
                      </td>
                      <td style={td}>
                        <Badge variant={delTone[i.status]}>{delText[i.status]}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollTable>
        );
      })}
    </div>
  );
}
DeliveryTracker.displayName = "DeliveryTracker";

/* ---------- Screening attendees ---------- */

export interface Attendee {
  id: string;
  name: string;
  /** e.g. "Press", "Distributor", "Cast & crew" */
  group: string;
  rsvp: "yes" | "no" | "maybe" | "pending";
  attended?: boolean;
  /** e.g. "Wheelchair space", "ISL interpreter", "Captions" */
  access?: string[];
  plusOnes?: number;
}
const rsvpText = { yes: "Coming", no: "Not coming", maybe: "Maybe", pending: "No reply" };
const rsvpTone = { yes: "success", no: "default", maybe: "warning", pending: "info" } as const;

/** ScreeningAttendeeList: RSVPs, attendance and access needs, with a seat count. */
export function ScreeningAttendeeList({
  attendees,
  capacity,
  onToggleAttended,
}: {
  attendees: Attendee[];
  capacity?: number;
  onToggleAttended?: (id: string, v: boolean) => void;
}) {
  const seats = attendees
    .filter((a) => a.rsvp === "yes")
    .reduce((n, a) => n + 1 + (a.plusOnes ?? 0), 0);
  const needs = attendees.filter((a) => a.access && a.access.length).length;
  return (
    <ScrollTable label="Attendees">
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          Attendees · {seats}
          {capacity ? ` of ${capacity}` : ""} seats{needs ? ` · ${needs} with access needs` : ""}
        </caption>
        <thead>
          <tr style={{ color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              Name
            </th>
            <th scope="col" style={td}>
              RSVP
            </th>
            <th scope="col" style={td}>
              Access needs
            </th>
            {onToggleAttended && (
              <th scope="col" style={td}>
                Came
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {attendees.map((a) => (
            <tr key={a.id}>
              <th scope="row" style={td}>
                {a.name}
                <span
                  style={{
                    display: "block",
                    fontWeight: 400,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {a.group}
                  {a.plusOnes ? ` · +${a.plusOnes}` : ""}
                </span>
              </th>
              <td style={td}>
                <Badge variant={rsvpTone[a.rsvp]}>{rsvpText[a.rsvp]}</Badge>
              </td>
              <td style={td}>{a.access && a.access.length ? a.access.join(", ") : "—"}</td>
              {onToggleAttended && (
                <td style={td}>
                  <input
                    type="checkbox"
                    aria-label={`${a.name} attended`}
                    checked={!!a.attended}
                    onChange={(e) => onToggleAttended(a.id, e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
ScreeningAttendeeList.displayName = "ScreeningAttendeeList";

/* ---------- Legal matters ---------- */

export interface LegalMatter {
  id: string;
  title: string;
  /** e.g. "Music licence", "Location agreement", "Dispute" */
  kind: string;
  counterparty: string;
  owner: string;
  nextStep?: string;
  nextDate?: Date;
  risk: "low" | "medium" | "high";
  open: boolean;
}

/** LegalMatterList: open matters first, risk in words. */
export function LegalMatterList({
  matters,
  onOpen,
  locale = "en-IN",
}: {
  matters: LegalMatter[];
  onOpen?: (m: LegalMatter) => void;
  locale?: string;
}) {
  const sorted = [...matters].sort(
    (a, b) =>
      Number(b.open) - Number(a.open) ||
      ["high", "medium", "low"].indexOf(a.risk) - ["high", "medium", "low"].indexOf(b.risk)
  );
  const risk = {
    low: ["Low risk", "default"],
    medium: ["Medium risk", "warning"],
    high: ["High risk", "error"],
  } as const;
  return (
    <ScrollTable label="Legal matters">
      <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          Legal matters · {matters.filter((m) => m.open).length} open
        </caption>
        <thead>
          <tr style={{ color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              Matter
            </th>
            <th scope="col" style={td}>
              With
            </th>
            <th scope="col" style={td}>
              Next step
            </th>
            <th scope="col" style={td}>
              Risk
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.id} style={{ opacity: m.open ? 1 : 0.6 }}>
              <th scope="row" style={td}>
                {onOpen ? (
                  <button
                    type="button"
                    onClick={() => onOpen(m)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      fontWeight: 600,
                      color: colorTokens.text.primary,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {m.title}
                  </button>
                ) : (
                  m.title
                )}
                <span
                  style={{
                    display: "block",
                    fontWeight: 400,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {m.kind} · {m.owner}
                  {m.open ? "" : " · closed"}
                </span>
              </th>
              <td style={td}>{m.counterparty}</td>
              <td style={td}>
                {m.nextStep ?? "—"}
                {m.nextDate && (
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {fmt(m.nextDate, locale)}
                  </span>
                )}
              </td>
              <td style={td}>
                <Badge variant={risk[m.risk][1]}>{risk[m.risk][0]}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
LegalMatterList.displayName = "LegalMatterList";

/* ---------- Contract signatures ---------- */

export interface Signatory {
  id: string;
  name: string;
  /** e.g. "Producer", "Lead actor" */
  role: string;
  status: keyof typeof signatureStates;
  at?: Date;
}

/** SignatureStatusList: who has signed, in order, with an overall summary. */
export function SignatureStatusList({
  contract,
  signatories,
  onRemind,
  locale = "en-IN",
}: {
  contract: string;
  signatories: Signatory[];
  onRemind?: (id: string) => void;
  locale?: string;
}) {
  const signed = signatories.filter((s) => s.status === "signed").length;
  return (
    <section aria-label={`Signatures for ${contract}`}>
      <h3 style={{ margin: `0 0 ${spacingTokens.xs}`, fontSize: typographyTokens.fontSize.md }}>
        {contract} · {signed} of {signatories.length} signed
      </h3>
      <ol style={{ margin: 0, paddingLeft: spacingTokens.lg }}>
        {signatories.map((s) => (
          <li key={s.id} style={{ padding: "4px 0", fontSize: typographyTokens.fontSize.sm }}>
            <span
              style={{
                display: "flex",
                gap: spacingTokens.sm,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <strong>{s.name}</strong>
              <span style={{ color: colorTokens.text.secondary }}>{s.role}</span>
              <StateBadge state={s.status} states={signatureStates} />
              {s.at && (
                <span
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {fmt(s.at, locale)}
                </span>
              )}
              {onRemind && s.status === "sent" && (
                <button
                  type="button"
                  onClick={() => onRemind(s.id)}
                  aria-label={`Remind ${s.name}`}
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
                  Remind
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
SignatureStatusList.displayName = "SignatureStatusList";

/* ---------- Subsidy programmes ---------- */

export interface SubsidyProgramme {
  id: string;
  name: string;
  /** e.g. "Uttar Pradesh Film Policy" */
  body: string;
  /** e.g. "Up to 25% of local spend, max ₹2 Cr" */
  benefit: string;
  deadline?: Date;
  eligible: "yes" | "maybe" | "no";
  reason?: string;
  url?: string;
}

/** SubsidyProgrammeList: eligibility in words with the reason; deadline relative. */
export function SubsidyProgrammeList({
  programmes,
  onOpen,
  now = new Date(),
}: {
  programmes: SubsidyProgramme[];
  onOpen?: (p: SubsidyProgramme) => void;
  now?: Date;
}) {
  const el = {
    yes: ["Likely eligible", "success"],
    maybe: ["Check eligibility", "warning"],
    no: ["Not eligible", "default"],
  } as const;
  return (
    <ul
      aria-label="Subsidy programmes"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      {programmes.map((p) => (
        <li
          key={p.id}
          style={{
            border: `1px solid ${colorTokens.border.primary}`,
            borderRadius: 8,
            padding: spacingTokens.sm,
            opacity: p.eligible === "no" ? 0.7 : 1,
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
            <strong>
              {onOpen ? (
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    font: "inherit",
                    fontWeight: 700,
                    color: colorTokens.text.primary,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {p.name}
                </button>
              ) : (
                p.name
              )}
            </strong>
            <Badge variant={el[p.eligible][1]}>{el[p.eligible][0]}</Badge>
          </div>
          <div
            style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
          >
            {p.body}
          </div>
          <div style={{ fontSize: typographyTokens.fontSize.sm }}>{p.benefit}</div>
          {p.reason && (
            <div
              style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
            >
              {p.reason}
            </div>
          )}
          {p.deadline && (
            <div style={{ fontSize: typographyTokens.fontSize.xs, fontWeight: 600 }}>
              Apply by {fmt(p.deadline)} · {relativeDue(p.deadline, now).text}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
SubsidyProgrammeList.displayName = "SubsidyProgrammeList";
