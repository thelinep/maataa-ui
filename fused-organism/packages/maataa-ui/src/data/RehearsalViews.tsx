/**
 * @maataa/ui/data/RehearsalViews
 * Rehearsal scene list, attendance grid, director notes, reschedule request
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { Avatar } from "./Avatar";
import { ScrollTable } from "./ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

/* ---------- Scene list ---------- */

export interface RehearsalScene {
  id: string;
  scene: string;
  title: string;
  cast: string[];
  minutes: number;
  done?: boolean;
}

/** RehearsalSceneList: running order with times and cast; done scenes say so. */
export function RehearsalSceneList({
  scenes,
  start,
  locale = "en-IN",
}: {
  scenes: RehearsalScene[];
  start: Date;
  locale?: string;
}) {
  let t = start.getTime();
  return (
    <ol aria-label="Rehearsal running order" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {scenes.map((s) => {
        const at = new Date(t);
        t += s.minutes * 60_000;
        return (
          <li
            key={s.id}
            style={{
              display: "grid",
              gridTemplateColumns: "70px 1fr auto",
              gap: spacingTokens.sm,
              padding: `${spacingTokens.xs} 0`,
              borderBottom: `1px solid ${colorTokens.border.primary}`,
              background: s.done ? colorTokens.background.secondary : undefined,
            }}
          >
            <time
              dateTime={at.toISOString()}
              style={{ fontVariantNumeric: "tabular-nums", color: colorTokens.text.secondary }}
            >
              {at.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}
            </time>
            <span>
              <strong>Sc. {s.scene}</strong> · {s.title}
              <span
                style={{
                  display: "block",
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {s.cast.join(", ")}
              </span>
            </span>
            <span style={{ fontSize: typographyTokens.fontSize.sm }}>
              {s.done ? "✓ Done" : `${s.minutes} min`}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
RehearsalSceneList.displayName = "RehearsalSceneList";

/* ---------- Attendance grid ---------- */

export type Attendance = "present" | "late" | "absent" | "excused" | "";

export interface AttendanceGridProps {
  people: { id: string; name: string; role?: string }[];
  sessions: { id: string; label: string }[];
  /** value[personId][sessionId] */
  value: Record<string, Record<string, Attendance>>;
  onChange: (personId: string, sessionId: string, a: Attendance) => void;
  /** @default 'Attendance' */
  caption?: string;
}

const aText: Record<Exclude<Attendance, "">, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  excused: "Excused",
};
const aMark: Record<Exclude<Attendance, "">, string> = {
  present: "✓",
  late: "◔",
  absent: "✕",
  excused: "–",
};

/**
 * AttendanceGrid
 * People by sessions; each cell is a select named "Asha Rao, Session 2".
 * Totals per person are in the last column.
 */
export function AttendanceGrid({
  people,
  sessions,
  value,
  onChange,
  caption = "Attendance",
}: AttendanceGridProps) {
  const td: React.CSSProperties = {
    padding: 3,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    textAlign: "center",
  };
  return (
    <ScrollTable label={caption}>
      <table style={{ borderCollapse: "collapse", minWidth: 200 + sessions.length * 110 }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {caption}
        </caption>
        <thead>
          <tr style={{ color: colorTokens.text.secondary }}>
            <th scope="col" style={{ ...td, textAlign: "left" }}>
              Person
            </th>
            {sessions.map((s) => (
              <th key={s.id} scope="col" style={td}>
                {s.label}
              </th>
            ))}
            <th scope="col" style={td}>
              Present
            </th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => {
            const row = value[p.id] ?? {};
            const present = sessions.filter(
              (s) => row[s.id] === "present" || row[s.id] === "late"
            ).length;
            return (
              <tr key={p.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  <span style={{ display: "flex", gap: spacingTokens.xs, alignItems: "center" }}>
                    <Avatar name={p.name} size="sm" decorative />
                    <span>
                      {p.name}
                      {p.role && (
                        <span
                          style={{
                            display: "block",
                            fontWeight: 400,
                            fontSize: typographyTokens.fontSize.xs,
                            color: colorTokens.text.secondary,
                          }}
                        >
                          {p.role}
                        </span>
                      )}
                    </span>
                  </span>
                </th>
                {sessions.map((s) => {
                  const a = row[s.id] ?? "";
                  return (
                    <td key={s.id} style={td}>
                      <select
                        aria-label={`${p.name}, ${s.label}`}
                        value={a}
                        onChange={(e) => onChange(p.id, s.id, e.target.value as Attendance)}
                        style={{
                          padding: 3,
                          border: `1px solid ${a === "absent" ? colorTokens.interactive.error : colorTokens.border.control}`,
                          borderRadius: 4,
                          font: "inherit",
                          fontSize: typographyTokens.fontSize.sm,
                          background: colorTokens.background.primary,
                        }}
                      >
                        <option value="">Not marked</option>
                        {Object.entries(aText).map(([k, v]) => (
                          <option key={k} value={k}>
                            {aMark[k as keyof typeof aMark]} {v}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
                <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>
                  {present}/{sessions.length}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
AttendanceGrid.displayName = "AttendanceGrid";

/* ---------- Director notes ---------- */

export interface DirectorNote {
  id: string;
  scene: string;
  /** Who it's for, or "All" */
  forWhom: string;
  text: string;
  at: Date;
  resolved?: boolean;
}

export interface DirectorNotesPanelProps {
  notes: DirectorNote[];
  onAdd: (n: { scene: string; forWhom: string; text: string }) => void;
  onToggleResolved: (id: string) => void;
  cast: string[];
}

/** DirectorNotesPanel: add a note for a scene and person; mark notes worked on. */
export function DirectorNotesPanel({
  notes,
  onAdd,
  onToggleResolved,
  cast,
}: DirectorNotesPanelProps) {
  const id = useId();
  const [scene, setScene] = useState("");
  const [forWhom, setForWhom] = useState("All");
  const [text, setText] = useState("");
  const open = notes.filter((n) => !n.resolved).length;
  const inp: React.CSSProperties = {
    padding: 6,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    font: "inherit",
    background: colorTokens.background.primary,
  };
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <h3 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        Director’s notes{" "}
        <span
          style={{
            fontWeight: 400,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.secondary,
          }}
        >
          · {open} open
        </span>
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onAdd({ scene: scene.trim(), forWhom, text: text.trim() });
          setText("");
        }}
        style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          Scene
          <input
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            style={{ ...inp, width: 70 }}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          For
          <select value={forWhom} onChange={(e) => setForWhom(e.target.value)} style={inp}>
            <option>All</option>
            {cast.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: typographyTokens.fontSize.sm,
            flex: 1,
            minWidth: 180,
          }}
        >
          Note
          <input value={text} onChange={(e) => setText(e.target.value)} style={inp} />
        </label>
        <Button type="submit" size="sm">
          Add note
        </Button>
      </form>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {notes.map((n) => (
          <li
            key={n.id}
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              alignItems: "flex-start",
              padding: `${spacingTokens.xs} 0`,
              borderBottom: `1px solid ${colorTokens.border.primary}`,
            }}
          >
            <input
              type="checkbox"
              checked={!!n.resolved}
              onChange={() => onToggleResolved(n.id)}
              aria-label={`Worked on: ${n.text}`}
              style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
            />
            <span
              style={{
                textDecoration: n.resolved ? "line-through" : "none",
                color: n.resolved ? colorTokens.text.secondary : colorTokens.text.primary,
              }}
            >
              <strong>
                {n.scene ? `Sc. ${n.scene}` : "General"} · {n.forWhom}:
              </strong>{" "}
              {n.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
DirectorNotesPanel.displayName = "DirectorNotesPanel";

/* ---------- Consent and reschedule ---------- */

export interface RescheduleRequestProps {
  /** e.g. "Rehearsal, Tue 24 Nov, 10 am" */
  session: string;
  /** Intimate, stunt or nudity scenes need explicit consent */
  needsConsent?: boolean;
  consentDescription?: string;
  consented?: boolean;
  onConsent?: (yes: boolean) => void;
  onRequestReschedule: (reason: string, proposed: string) => void;
}

/**
 * RescheduleRequest
 * For sensitive scenes, consent is asked first in plain words and can be
 * withdrawn. A reschedule request needs a reason and a proposed time.
 */
export function RescheduleRequest({
  session,
  needsConsent,
  consentDescription,
  consented,
  onConsent,
  onRequestReschedule,
}: RescheduleRequestProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [proposed, setProposed] = useState("");
  const [err, setErr] = useState("");
  return (
    <section
      aria-label={`Your attendance: ${session}`}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <strong>{session}</strong>
      {needsConsent && onConsent && (
        <fieldset
          style={{
            border: `1px solid ${colorTokens.interactive.warning}`,
            borderRadius: 6,
            padding: spacingTokens.sm,
            margin: 0,
          }}
        >
          <legend style={{ fontWeight: 600, padding: `0 ${spacingTokens.xs}` }}>
            Your consent
          </legend>
          <p style={{ margin: `0 0 ${spacingTokens.xs}` }}>{consentDescription}</p>
          <div style={{ display: "flex", gap: spacingTokens.md }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="radio"
                name={`${id}-c`}
                checked={consented === true}
                onChange={() => onConsent(true)}
                style={{ accentColor: colorTokens.interactive.primary }}
              />
              I agree
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="radio"
                name={`${id}-c`}
                checked={consented === false}
                onChange={() => onConsent(false)}
                style={{ accentColor: colorTokens.interactive.primary }}
              />
              I don’t agree
            </label>
          </div>
          <p
            style={{
              margin: `${spacingTokens.xs} 0 0`,
              fontSize: typographyTokens.fontSize.xs,
              color: colorTokens.text.secondary,
            }}
          >
            You can change this at any time, including on the day. The intimacy coordinator is told,
            not the whole crew.
          </p>
        </fieldset>
      )}
      {!open ? (
        <div>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            I can’t make it
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason.trim() || !proposed) return setErr("Give a reason and a time that works");
            onRequestReschedule(reason.trim(), proposed);
            setOpen(false);
            setErr("");
          }}
          style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            Reason
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
              style={{
                padding: 6,
                border: `1px solid ${colorTokens.border.control}`,
                borderRadius: 4,
                font: "inherit",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            A time that works for you
            <input
              type="datetime-local"
              value={proposed}
              onChange={(e) => setProposed(e.target.value)}
              style={{
                padding: 6,
                border: `1px solid ${colorTokens.border.control}`,
                borderRadius: 4,
                font: "inherit",
              }}
            />
          </label>
          {err && (
            <span
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
            <Button type="submit">Ask to reschedule</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
RescheduleRequest.displayName = "RescheduleRequest";
