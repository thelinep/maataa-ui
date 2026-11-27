/**
 * @maataa/ui/forms/PeriodPickers
 * Month and ISO-week pickers built from labelled selects (native month/week
 * inputs are missing in several browsers)
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle, smallButtonStyle } from "./fieldKit";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const selectStyle: React.CSSProperties = {
  ...controlStyle(false),
  accentColor: colorTokens.interactive.primary,
};

function years(from: number, to: number) {
  const out: number[] = [];
  for (let y = from; y <= to; y++) out.push(y);
  return out;
}

/** "2026-11" ↔ { year, month (1–12) } */
export function parseMonth(value: string): { year: number; month: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) };
}

export function formatMonthValue(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export interface MonthPickerProps {
  label: string;
  /** "YYYY-MM" */
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
  error?: string;
  fromYear?: number;
  toYear?: number;
}

/**
 * MonthPicker
 * Month and year selects, plus Previous/Next month buttons.
 */
export function MonthPicker({
  label,
  value,
  onChange,
  hint,
  error,
  fromYear = new Date().getFullYear() - 5,
  toYear = new Date().getFullYear() + 5,
}: MonthPickerProps) {
  const t = useT();
  const now = new Date();
  const cur = parseMonth(value) ?? { year: now.getFullYear(), month: now.getMonth() + 1 };
  const step = (d: number) => {
    const idx = cur.year * 12 + (cur.month - 1) + d;
    onChange(formatMonthValue(Math.floor(idx / 12), (idx % 12) + 1));
  };
  return (
    <FieldFrame label={label} hint={hint} error={error} group>
      {(ids) => (
        <div style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap" }}>
          <button type="button" style={smallButtonStyle} onClick={() => step(-1)}>
            <span aria-hidden="true">‹ </span>
            {t("Previous month")}
          </button>
          <select
            aria-label={t("Month")}
            aria-describedby={ids.describedBy}
            value={cur.month}
            onChange={(e) => onChange(formatMonthValue(cur.year, Number(e.target.value)))}
            style={selectStyle}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            aria-label={t("Year")}
            value={cur.year}
            onChange={(e) => onChange(formatMonthValue(Number(e.target.value), cur.month))}
            style={selectStyle}
          >
            {years(Math.min(fromYear, cur.year), Math.max(toYear, cur.year)).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button type="button" style={smallButtonStyle} onClick={() => step(1)}>
            {t("Next month")}
            <span aria-hidden="true"> ›</span>
          </button>
        </div>
      )}
    </FieldFrame>
  );
}

/** ISO 8601 week of a date: { year, week } */
export function isoWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

/** Monday of an ISO week (UTC) */
export function isoWeekStart(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const day = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - day + 1 + (week - 1) * 7);
  return monday;
}

export function weeksInYear(year: number) {
  return isoWeek(new Date(Date.UTC(year, 11, 28))).week;
}

/** "2026-W47" ↔ { year, week } */
export function parseWeek(value: string): { year: number; week: number } | null {
  const m = /^(\d{4})-W(\d{2})$/.exec(value);
  return m ? { year: Number(m[1]), week: Number(m[2]) } : null;
}

export function formatWeekValue(year: number, week: number) {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function fmtDay(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export interface WeekPickerProps extends Omit<MonthPickerProps, "value" | "onChange"> {
  /** "YYYY-Www" (ISO week) */
  value: string;
  onChange: (value: string) => void;
}

/**
 * WeekPicker
 * ISO weeks (Monday start). The selected week's dates are shown and read out,
 * e.g. "Week 47: 16 Nov – 22 Nov 2026".
 */
export function WeekPicker({
  label,
  value,
  onChange,
  hint,
  error,
  fromYear = new Date().getFullYear() - 2,
  toYear = new Date().getFullYear() + 2,
}: WeekPickerProps) {
  const t = useT();
  const cur = parseWeek(value) ?? isoWeek(new Date());
  const total = weeksInYear(cur.year);
  const start = isoWeekStart(cur.year, cur.week);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const step = (d: number) => {
    const s = new Date(start);
    s.setUTCDate(s.getUTCDate() + d * 7);
    const w = isoWeek(new Date(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate()));
    onChange(formatWeekValue(w.year, w.week));
  };
  const weekOptions: number[] = [];
  for (let w = 1; w <= total; w++) weekOptions.push(w);
  return (
    <FieldFrame label={label} hint={hint} error={error} group>
      {(ids) => (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          <div style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap" }}>
            <button type="button" style={smallButtonStyle} onClick={() => step(-1)}>
              <span aria-hidden="true">‹ </span>
              {t("Previous week")}
            </button>
            <select
              aria-label={t("Week")}
              aria-describedby={[ids.describedBy, `${ids.id}-range`].filter(Boolean).join(" ")}
              value={cur.week}
              onChange={(e) => onChange(formatWeekValue(cur.year, Number(e.target.value)))}
              style={selectStyle}
            >
              {weekOptions.map((w) => (
                <option key={w} value={w}>
                  {t("Week {w}", { w })}
                </option>
              ))}
            </select>
            <select
              aria-label={t("Year")}
              value={cur.year}
              onChange={(e) => {
                const y = Number(e.target.value);
                onChange(formatWeekValue(y, Math.min(cur.week, weeksInYear(y))));
              }}
              style={selectStyle}
            >
              {years(Math.min(fromYear, cur.year), Math.max(toYear, cur.year)).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button type="button" style={smallButtonStyle} onClick={() => step(1)}>
              {t("Next week")}
              <span aria-hidden="true"> ›</span>
            </button>
          </div>
          <span
            id={`${ids.id}-range`}
            aria-live="polite"
            style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
          >
            Week {cur.week}: {fmtDay(start)} – {fmtDay(end)} {end.getUTCFullYear()}
          </span>
        </div>
      )}
    </FieldFrame>
  );
}
