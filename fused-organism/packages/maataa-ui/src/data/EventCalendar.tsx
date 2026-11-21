/**
 * @maataa/ui/data/EventCalendar
 * Month, week and day views of shoots, auditions, bookings and deadlines
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  /** e.g. "shoot", "audition", "booking" — shown as a word, not only colour */
  kind?: string;
  color?: string;
}

export type CalendarView = "month" | "week" | "day";

export interface EventCalendarProps {
  events: CalendarEvent[];
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  /** Any date inside the visible period */
  date: Date;
  onDateChange: (d: Date) => void;
  onSelectEvent?: (e: CalendarEvent) => void;
  /** @default 'en-IN' */
  locale?: string;
  /** 0 = Sunday, 1 = Monday @default 1 */
  weekStartsOn?: 0 | 1;
  /** Events shown per month cell before "+N more" @default 3 */
  maxPerCell?: number;
  /** Today, for highlighting (tests) */
  today?: Date;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfWeek = (d: Date, ws: number) => addDays(d, -((d.getDay() - ws + 7) % 7));

/** Events on a given day, sorted by start (multi-day events appear on each day). */
export function eventsOn(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const s = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const e = s + 86_400_000;
  return events
    .filter((ev) => ev.start.getTime() < e && (ev.end ?? ev.start).getTime() >= s)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * EventCalendar
 * The period title is a live heading, so Previous/Next announce where you
 * are. Month view is a table; each day's number is a button that opens that
 * day ("21 November, 2 events"). Events are buttons with time and kind in
 * their names. Week and day views are plain lists.
 */
export function EventCalendar({
  events,
  view,
  onViewChange,
  date,
  onDateChange,
  onSelectEvent,
  locale = "en-IN",
  weekStartsOn = 1,
  maxPerCell = 3,
  today = new Date(),
}: EventCalendarProps) {
  const id = useId();
  const time = (d: Date) => d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const evName = (e: CalendarEvent) =>
    `${e.allDay ? "All day" : time(e.start)}, ${e.title}${e.kind ? `, ${e.kind}` : ""}`;
  const weekStart = startOfWeek(date, weekStartsOn);
  const title =
    view === "month"
      ? date.toLocaleDateString(locale, { month: "long", year: "numeric" })
      : view === "week"
        ? `Week of ${weekStart.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}`
        : date.toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
  const step = (dir: -1 | 1) =>
    onDateChange(
      view === "month"
        ? new Date(date.getFullYear(), date.getMonth() + dir, 1)
        : addDays(date, dir * (view === "week" ? 7 : 1))
    );
  const btn: React.CSSProperties = {
    minHeight: 36,
    padding: `0 ${spacingTokens.sm}`,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
    cursor: "pointer",
    font: "inherit",
  };
  const chip = (e: CalendarEvent, showTime = true) => (
    <button
      key={e.id}
      type="button"
      onClick={() => onSelectEvent?.(e)}
      aria-label={evName(e)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        border: "none",
        borderLeft: `3px solid ${e.color ?? colorTokens.interactive.primary}`,
        background: colorTokens.background.tertiary,
        borderRadius: 3,
        padding: "1px 4px",
        marginTop: 2,
        fontSize: typographyTokens.fontSize.xs,
        color: colorTokens.text.primary,
        cursor: "pointer",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        font: "inherit",
      }}
    >
      {showTime && !e.allDay && (
        <span style={{ color: colorTokens.text.secondary }}>{time(e.start)} </span>
      )}
      {e.title}
    </button>
  );
  const weekdays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  let body: React.ReactNode;
  if (view === "month") {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const gridStart = startOfWeek(first, weekStartsOn);
    const weeks = Array.from({ length: 6 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d))
    ).filter((wk) => wk.some((d) => d.getMonth() === date.getMonth()));
    body = (
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <caption
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {title}
        </caption>
        <thead>
          <tr>
            {weekdays.map((d) => (
              <th
                key={d.getDay()}
                scope="col"
                abbr={d.toLocaleDateString(locale, { weekday: "long" })}
                style={{
                  padding: spacingTokens.xs,
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                  fontWeight: 600,
                }}
              >
                {d.toLocaleDateString(locale, { weekday: "short" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((d) => {
                const evs = eventsOn(events, d);
                const outside = d.getMonth() !== date.getMonth();
                const isToday = sameDay(d, today);
                return (
                  <td
                    key={d.toISOString()}
                    style={{
                      verticalAlign: "top",
                      height: 92,
                      padding: 3,
                      border: `1px solid ${colorTokens.border.primary}`,
                      background: outside
                        ? colorTokens.background.secondary
                        : colorTokens.background.primary,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onDateChange(d);
                        onViewChange("day");
                      }}
                      aria-label={`${d.toLocaleDateString(locale, { day: "numeric", month: "long" })}${isToday ? ", today" : ""}, ${evs.length ? `${evs.length} event${evs.length === 1 ? "" : "s"}` : "no events"}`}
                      aria-current={isToday ? "date" : undefined}
                      style={{
                        minWidth: 28,
                        minHeight: 28,
                        border: "none",
                        borderRadius: "50%",
                        background: isToday ? colorTokens.interactive.primary : "transparent",
                        color: isToday
                          ? colorTokens.text.inverse
                          : outside
                            ? colorTokens.text.secondary
                            : colorTokens.text.primary,
                        fontWeight: isToday ? 700 : 400,
                        cursor: "pointer",
                        font: "inherit",
                      }}
                    >
                      {d.getDate()}
                    </button>
                    {evs.slice(0, maxPerCell).map((e) => chip(e, false))}
                    {evs.length > maxPerCell && (
                      <button
                        type="button"
                        onClick={() => {
                          onDateChange(d);
                          onViewChange("day");
                        }}
                        style={{
                          border: "none",
                          background: "none",
                          padding: "1px 4px",
                          fontSize: typographyTokens.fontSize.xs,
                          color: colorTokens.interactive.primary,
                          cursor: "pointer",
                          font: "inherit",
                        }}
                      >
                        +{evs.length - maxPerCell} more
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    const days = view === "week" ? weekdays : [date];
    body = (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: view === "week" ? "repeat(7, minmax(0, 1fr))" : "1fr",
          gap: spacingTokens.xs,
        }}
      >
        {days.map((d) => {
          const evs = eventsOn(events, d);
          const isToday = sameDay(d, today);
          return (
            <section
              key={d.toISOString()}
              aria-label={d.toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              style={{
                border: `1px solid ${isToday ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                borderRadius: 6,
                padding: spacingTokens.xs,
                minHeight: 120,
                background: colorTokens.background.primary,
              }}
            >
              <h3
                style={{
                  margin: `0 0 ${spacingTokens.xs}`,
                  fontSize: typographyTokens.fontSize.sm,
                  color: isToday ? colorTokens.interactive.primary : colorTokens.text.primary,
                }}
              >
                {d.toLocaleDateString(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: view === "day" ? "long" : "short",
                })}
                {isToday ? " · Today" : ""}
              </h3>
              {evs.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  Nothing scheduled
                </p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {evs.map((e) => (
                    <li key={e.id}>{chip(e)}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <div
        style={{ display: "flex", gap: spacingTokens.sm, alignItems: "center", flexWrap: "wrap" }}
      >
        <button type="button" style={btn} onClick={() => step(-1)} aria-label={`Previous ${view}`}>
          ‹
        </button>
        <button type="button" style={btn} onClick={() => onDateChange(today)}>
          Today
        </button>
        <button type="button" style={btn} onClick={() => step(1)} aria-label={`Next ${view}`}>
          ›
        </button>
        <h2
          id={`${id}-title`}
          aria-live="polite"
          style={{ margin: 0, flex: 1, fontSize: typographyTokens.fontSize.xl }}
        >
          {title}
        </h2>
        <div role="group" aria-label="View" style={{ display: "flex" }}>
          {(["month", "week", "day"] as CalendarView[]).map((v, i) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => onViewChange(v)}
              style={{
                ...btn,
                borderRadius: i === 0 ? "6px 0 0 6px" : i === 2 ? "0 6px 6px 0" : 0,
                marginLeft: i ? -1 : 0,
                background:
                  view === v ? colorTokens.interactive.primary : colorTokens.background.primary,
                color: view === v ? colorTokens.text.inverse : colorTokens.text.primary,
              }}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {body}
    </div>
  );
}
EventCalendar.displayName = "EventCalendar";
