/**
 * @maataa/ui/data/TimesheetViews
 * Timesheet list (with status) and a week summary
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { StateBadge, approvalStates } from "../status/StateBadge";
import { ScrollTable } from "./ScrollTable";
import { formatHM } from "../forms/TimesheetEntryForm";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TimesheetSummary {
  id: string;
  person: string;
  role: string;
  /** e.g. "Week 47 · 16–22 Nov" */
  period: string;
  minutes: number;
  overtimeMinutes: number;
  status: keyof typeof approvalStates;
}

export interface TimesheetListProps {
  sheets: TimesheetSummary[];
  onOpen: (s: TimesheetSummary) => void;
  /** @default 'Timesheets' */
  caption?: string;
}

/** TimesheetList: open button names person and period. */
export function TimesheetList({ sheets, onOpen, caption = "Timesheets" }: TimesheetListProps) {
  const t = useT();
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
  };
  const waiting = sheets.filter((s) => s.status === "submitted").length;
  return (
    <ScrollTable label={caption}>
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {t("{caption} · {waiting} waiting for approval", { caption, waiting })}
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              {t("Person")}
            </th>
            <th scope="col" style={td}>
              {t("Period")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Hours")}
            </th>
            <th scope="col" style={{ ...td, textAlign: "right" }}>
              {t("Overtime")}
            </th>
            <th scope="col" style={td}>
              {t("Status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sheets.map((s) => (
            <tr key={s.id}>
              <th scope="row" style={{ ...td, textAlign: "left" }}>
                <button
                  type="button"
                  onClick={() => onOpen(s)}
                  aria-label={t("Open {person}'s timesheet, {period}", {
                    person: s.person,
                    period: s.period,
                  })}
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
                  {s.person}
                </button>
                <span
                  style={{
                    display: "block",
                    fontWeight: 400,
                    color: colorTokens.text.secondary,
                    fontSize: typographyTokens.fontSize.xs,
                  }}
                >
                  {s.role}
                </span>
              </th>
              <td style={td}>{s.period}</td>
              <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {formatHM(s.minutes)}
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  color: s.overtimeMinutes ? colorTokens.interactive.warning : undefined,
                }}
              >
                {s.overtimeMinutes ? formatHM(s.overtimeMinutes) : "—"}
              </td>
              <td style={td}>
                <StateBadge state={s.status} states={approvalStates} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
TimesheetList.displayName = "TimesheetList";

export interface TimesheetWeekSummaryProps {
  /** e.g. "Week 47" */
  week: string;
  days: { date: Date; minutes: number }[];
  standardMinutes?: number;
  /** @default 'en-IN' */
  locale?: string;
}

/** TimesheetWeekSummary: per-day hours, total and overtime, as a list. */
export function TimesheetWeekSummary({
  week,
  days,
  standardMinutes = 720,
  locale: localeProp,
}: TimesheetWeekSummaryProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const total = days.reduce((s, d) => s + d.minutes, 0);
  const ot = days.reduce((s, d) => s + Math.max(0, d.minutes - standardMinutes), 0);
  const max = Math.max(standardMinutes, ...days.map((d) => d.minutes));
  return (
    <section
      aria-label={t("{week} summary", { week })}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        {week}: {formatHM(total)}
        {ot ? (
          <>
            {" "}
            <span style={{ color: colorTokens.interactive.warning }}>
              {t("· {value} overtime", { value: formatHM(ot) })}
            </span>
          </>
        ) : null}
      </h3>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {days.map((d) => (
          <li
            key={d.date.toISOString()}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 90px",
              gap: spacingTokens.sm,
              alignItems: "center",
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            <span>{d.date.toLocaleDateString(locale, { weekday: "short", day: "numeric" })}</span>
            <span
              aria-hidden="true"
              style={{
                position: "relative",
                height: 10,
                background: colorTokens.background.tertiary,
                borderRadius: 5,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${(Math.min(d.minutes, standardMinutes) / max) * 100}%`,
                  background: colorTokens.interactive.primary,
                  borderRadius: 5,
                }}
              />
              {d.minutes > standardMinutes && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${(standardMinutes / max) * 100}%`,
                    width: `${((d.minutes - standardMinutes) / max) * 100}%`,
                    background: colorTokens.interactive.warning,
                    borderRadius: 5,
                  }}
                />
              )}
            </span>
            <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {d.minutes ? formatHM(d.minutes) : "Off"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
TimesheetWeekSummary.displayName = "TimesheetWeekSummary";
