/**
 * @maataa/ui/forms/TimesheetEntryForm
 * One day's hours: call, wrap, breaks, with the total and overtime worked out
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TimesheetDay {
  date: string;
  /** "HH:MM" */
  callTime: string;
  wrapTime: string;
  breakMinutes: number;
  /** Crossed midnight */
  overnight?: boolean;
  notes?: string;
}

/** Minutes worked; handles wrap after midnight. */
export function hoursWorked(
  d: Pick<TimesheetDay, "callTime" | "wrapTime" | "breakMinutes" | "overnight">
): number {
  const m = (t: string) => {
    const [h, mm] = t.split(":").map(Number);
    return Number.isFinite(h) && Number.isFinite(mm) ? h * 60 + mm : NaN;
  };
  const a = m(d.callTime);
  let b = m(d.wrapTime);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  if (d.overnight || b < a) b += 24 * 60;
  return Math.max(0, b - a - (d.breakMinutes || 0));
}

/** "10 h 30 min" */
export function formatHM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export interface OvertimeIndicatorProps {
  minutes: number;
  /** Standard shift in minutes @default 720 (12 h, common in Indian film) */
  standardMinutes?: number;
}

/** OvertimeIndicator: "1 h 30 min overtime" in words, or "Within shift". */
export function OvertimeIndicator({ minutes, standardMinutes = 720 }: OvertimeIndicatorProps) {
  const ot = minutes - standardMinutes;
  return (
    <span
      style={{
        fontSize: typographyTokens.fontSize.sm,
        fontWeight: 600,
        color: ot > 0 ? colorTokens.interactive.warning : colorTokens.interactive.success,
      }}
    >
      <span aria-hidden="true">{ot > 0 ? "▲ " : "✓ "}</span>
      {ot > 0 ? `${formatHM(ot)} overtime` : "Within shift"}
    </span>
  );
}
OvertimeIndicator.displayName = "OvertimeIndicator";

export interface TimesheetEntryFormProps {
  value: TimesheetDay;
  onChange: (v: TimesheetDay) => void;
  standardMinutes?: number;
  readOnly?: boolean;
}

/**
 * TimesheetEntryForm
 * Time fields for call and wrap, break minutes, and a live total with
 * overtime (announced politely). A wrap earlier than call is treated as
 * after midnight and says so.
 */
export function TimesheetEntryForm({
  value: v,
  onChange,
  standardMinutes = 720,
  readOnly,
}: TimesheetEntryFormProps) {
  const t = useT();
  const id = useId();
  const total = hoursWorked(v);
  const crossed = v.overnight || (v.callTime && v.wrapTime && v.wrapTime < v.callTime);
  const set = (patch: Partial<TimesheetDay>) => onChange({ ...v, ...patch });
  const inp: React.CSSProperties = {
    padding: 8,
    border: `2px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    font: "inherit",
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
  };
  const lab: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    fontWeight: 500,
  };
  return (
    <fieldset
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
      disabled={readOnly}
    >
      <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>
        {v.date ? t("Hours for {date}", { date: v.date }) : t("Hours for this day")}
      </legend>
      <div style={{ display: "flex", gap: spacingTokens.md, flexWrap: "wrap" }}>
        <label style={lab}>
          {t("Date")}
          <input
            type="date"
            value={v.date}
            onChange={(e) => set({ date: e.target.value })}
            style={inp}
          />
        </label>
        <label style={lab}>
          {t("Call time")}
          <input
            type="time"
            value={v.callTime}
            onChange={(e) => set({ callTime: e.target.value })}
            style={inp}
          />
        </label>
        <label style={lab}>
          {t("Wrap time")}
          <input
            type="time"
            value={v.wrapTime}
            onChange={(e) => set({ wrapTime: e.target.value })}
            aria-describedby={crossed ? `${id}-night` : undefined}
            style={inp}
          />
        </label>
        <label style={lab}>
          {t("Breaks (minutes)")}
          <input
            type="number"
            min={0}
            step={5}
            value={v.breakMinutes}
            onChange={(e) => set({ breakMinutes: Math.max(0, Number(e.target.value) || 0) })}
            style={{ ...inp, width: 110 }}
          />
        </label>
      </div>
      {crossed && (
        <span
          id={`${id}-night`}
          style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
        >
          {t("Wrap is after midnight (next day).")}
        </span>
      )}
      <div role="status" style={{ display: "flex", gap: spacingTokens.md, alignItems: "baseline" }}>
        <span>
          {t("Total")} <strong>{formatHM(total)}</strong>
        </span>
        <OvertimeIndicator minutes={total} standardMinutes={standardMinutes} />
      </div>
      <label style={lab}>
        {t("Notes (optional)")}
        <input
          value={v.notes ?? ""}
          onChange={(e) => set({ notes: e.target.value })}
          style={{ ...inp, fontWeight: 400 }}
        />
      </label>
    </fieldset>
  );
}
TimesheetEntryForm.displayName = "TimesheetEntryForm";
