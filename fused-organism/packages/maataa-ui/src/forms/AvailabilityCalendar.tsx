/**
 * @maataa/ui/forms/AvailabilityCalendar
 * Month of available / booked days; pick a start and end
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useId, useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface AvailabilityCalendarProps {
  /** What's being booked, e.g. "Bandra bungalow" or "ARRI Alexa Mini" */
  subject: string;
  month: Date;
  onMonthChange: (m: Date) => void;
  /** Days that can't be booked */
  booked: Date[];
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  /** @default 'en-IN' */
  locale?: string;
  /** Earliest bookable day */
  min?: Date;
}

const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * AvailabilityCalendar
 * An APG date grid: arrow keys move by day and week, Enter picks. Booked
 * days are announced as "booked" and can't be picked; a range can't span a
 * booked day. The legend explains the marks.
 */
export function AvailabilityCalendar({
  subject,
  month,
  onMonthChange,
  booked,
  value,
  onChange,
  locale: localeProp,
  min,
}: AvailabilityCalendarProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const id = useId();
  const gridRef = useRef<HTMLTableElement>(null);
  const bookedSet = new Set(booked.map(key));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from(
      { length: daysIn },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
    ),
  ];
  while (cells.length % 7) cells.push(null);
  const isBooked = (d: Date) => bookedSet.has(key(d)) || (min ? day0(d) < day0(min) : false);
  const inRange = (d: Date) => value.start && value.end && d >= value.start && d <= value.end;
  const spansBooked = (a: Date, b: Date) => {
    for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1))
      if (bookedSet.has(key(d))) return true;
    return false;
  };
  const pick = (d: Date) => {
    if (isBooked(d)) return;
    if (!value.start || value.end || d < value.start) onChange({ start: d, end: null });
    else if (spansBooked(value.start, d)) onChange({ start: d, end: null });
    else onChange({ start: value.start, end: d });
  };
  const focusDay = (d: Date) => {
    if (d.getMonth() !== month.getMonth())
      onMonthChange(new Date(d.getFullYear(), d.getMonth(), 1));
    requestAnimationFrame(() =>
      gridRef.current?.querySelector<HTMLElement>(`[data-day="${key(d)}"]`)?.focus()
    );
  };
  const focusable =
    value.start && value.start.getMonth() === month.getMonth()
      ? key(value.start)
      : key(cells.find((c) => c && !isBooked(c)) ?? first);
  const fmt = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const status = value.start
    ? value.end
      ? `${fmt(value.start)} to ${fmt(value.end)} chosen`
      : `Start ${fmt(value.start)}. Now pick the last day.`
    : "Pick the first day";
  const btn: React.CSSProperties = {
    minWidth: 36,
    minHeight: 36,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    background: colorTokens.background.primary,
    cursor: "pointer",
    color: colorTokens.text.primary,
  };
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm }}>
        <button
          type="button"
          style={btn}
          aria-label={t("Previous month")}
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          ‹
        </button>
        <h3
          id={`${id}-m`}
          aria-live="polite"
          style={{
            margin: 0,
            flex: 1,
            textAlign: "center",
            fontSize: typographyTokens.fontSize.lg,
          }}
        >
          {month.toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </h3>
        <button
          type="button"
          style={btn}
          aria-label={t("Next month")}
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          ›
        </button>
      </div>
      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={`${id}-m`}
        aria-describedby={`${id}-legend`}
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <th
                key={d}
                scope="col"
                style={{
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                  padding: 4,
                }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, w) => (
            <tr key={w}>
              {cells.slice(w * 7, w * 7 + 7).map((d, i) => {
                if (!d) return <td key={i} />;
                const b = isBooked(d);
                const sel = inRange(d) || (value.start && key(value.start) === key(d));
                return (
                  <td
                    key={i}
                    role="gridcell"
                    aria-selected={sel ? true : undefined}
                    style={{ padding: 2 }}
                  >
                    <button
                      type="button"
                      data-day={key(d)}
                      tabIndex={key(d) === focusable ? 0 : -1}
                      aria-disabled={b || undefined}
                      aria-label={`${d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}${b ? ", booked" : sel ? ", chosen" : ", available"}`}
                      onClick={() => pick(d)}
                      onKeyDown={(e) => {
                        const moves: Record<string, number> = {
                          ArrowLeft: -1,
                          ArrowRight: 1,
                          ArrowUp: -7,
                          ArrowDown: 7,
                        };
                        if (moves[e.key] !== undefined) {
                          e.preventDefault();
                          focusDay(
                            new Date(d.getFullYear(), d.getMonth(), d.getDate() + moves[e.key])
                          );
                        }
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        border: "none",
                        cursor: b ? "not-allowed" : "pointer",
                        background: sel
                          ? colorTokens.interactive.primary
                          : b
                            ? colorTokens.background.tertiary
                            : colorTokens.background.primary,
                        color: sel
                          ? colorTokens.text.inverse
                          : b
                            ? colorTokens.text.secondary
                            : colorTokens.text.primary,
                        textDecoration: b ? "line-through" : "none",
                        fontWeight: sel ? 700 : 400,
                        font: "inherit",
                      }}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        id={`${id}-legend`}
        style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
      >
        Struck-through days are booked for {subject}.
      </div>
      <div role="status" style={{ fontSize: typographyTokens.fontSize.sm, fontWeight: 600 }}>
        {status}
      </div>
    </div>
  );
}
AvailabilityCalendar.displayName = "AvailabilityCalendar";
