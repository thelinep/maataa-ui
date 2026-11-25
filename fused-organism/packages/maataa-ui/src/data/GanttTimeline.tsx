/**
 * @maataa/ui/data/GanttTimeline
 * Production schedule as bars on a date axis, with milestones
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  /** 0–1 */
  progress?: number;
  /** e.g. "Pre-production" */
  phase?: string;
  /** Has a scheduling conflict */
  conflict?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
}

export interface GanttTimelineProps {
  tasks: GanttTask[];
  milestones?: Milestone[];
  /** @default 'Schedule' */
  caption?: string;
  /** @default 'en-IN' */
  locale?: string;
  today?: Date;
}

const DAY = 86_400_000;

/**
 * MilestoneMarker
 * A diamond with its name and date; used on the Gantt axis and on its own.
 */
export function MilestoneMarker({
  milestone,
  locale: localeProp,
}: {
  milestone: Milestone;
  locale?: string;
}) {
  const locale = useLocale(localeProp);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: typographyTokens.fontSize.xs,
        color: colorTokens.text.primary,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          transform: "rotate(45deg)",
          background: colorTokens.interactive.warning,
          display: "inline-block",
        }}
      />
      <span>
        <strong>{milestone.name}</strong> ·{" "}
        {milestone.date.toLocaleDateString(locale, { day: "numeric", month: "short" })}
      </span>
    </span>
  );
}
MilestoneMarker.displayName = "MilestoneMarker";

/**
 * GanttTimeline
 * A real table (task, dates, progress) with the bar in a decorative column,
 * so the schedule is readable without seeing the bars. Milestones get their
 * own rows and a marker line.
 */
export function GanttTimeline({
  tasks,
  milestones = [],
  caption = "Schedule",
  locale: localeProp,
  today,
}: GanttTimelineProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const times = [
    ...tasks.flatMap((t) => [t.start.getTime(), t.end.getTime()]),
    ...milestones.map((m) => m.date.getTime()),
  ];
  const min = Math.min(...times);
  const max = Math.max(...times) + DAY;
  const span = Math.max(DAY, max - min);
  const pos = (d: Date) => ((d.getTime() - min) / span) * 100;
  const date = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const td: React.CSSProperties = {
    padding: `${spacingTokens.xs} ${spacingTokens.sm}`,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    whiteSpace: "nowrap",
  };
  const rows = [
    ...tasks.map((t) => ({ kind: "task" as const, t, at: t.start.getTime() })),
    ...milestones.map((m) => ({ kind: "milestone" as const, m, at: m.date.getTime() })),
  ].sort((a, b) => a.at - b.at);
  return (
    <div role="region" aria-label={caption} tabIndex={0} style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
          {caption} ·{" "}
          {t("{from} to {to}", { from: date(new Date(min)), to: date(new Date(max - DAY)) })}
        </caption>
        <thead>
          <tr style={{ color: colorTokens.text.secondary, textAlign: "left" }}>
            <th scope="col" style={td}>
              {t("Task")}
            </th>
            <th scope="col" style={td}>
              {t("Dates")}
            </th>
            <th scope="col" style={td}>
              {t("Progress")}
            </th>
            <th scope="col" style={{ ...td, width: "50%" }}>
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                }}
              >
                {t("Timeline")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) =>
            r.kind === "task" ? (
              <tr key={r.t.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  {r.t.name}
                  {r.t.phase && (
                    <span
                      style={{
                        display: "block",
                        fontSize: typographyTokens.fontSize.xs,
                        color: colorTokens.text.secondary,
                        fontWeight: 400,
                      }}
                    >
                      {r.t.phase}
                    </span>
                  )}
                </th>
                <td style={td}>
                  {date(r.t.start)} – {date(r.t.end)}
                </td>
                <td style={td}>
                  {r.t.progress !== undefined ? `${Math.round(r.t.progress * 100)}%` : "—"}
                  {r.t.conflict && (
                    <span
                      style={{
                        display: "block",
                        color: colorTokens.interactive.error,
                        fontWeight: 600,
                      }}
                    >
                      ⚠ {r.t.conflict}
                    </span>
                  )}
                </td>
                <td style={td} aria-hidden="true">
                  <div style={{ position: "relative", height: 18 }}>
                    {today && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${pos(today)}%`,
                          top: -6,
                          bottom: -6,
                          width: 2,
                          background: colorTokens.interactive.info,
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        left: `${pos(r.t.start)}%`,
                        width: `${Math.max(1, pos(new Date(r.t.end.getTime() + DAY)) - pos(r.t.start))}%`,
                        top: 2,
                        height: 14,
                        borderRadius: 4,
                        background: r.t.conflict
                          ? colorTokens.interactive.error
                          : colorTokens.border.control,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(r.t.progress ?? 0) * 100}%`,
                          height: "100%",
                          background: colorTokens.interactive.primary,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={r.m.id}>
                <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                  {t("Milestone: {name}", { name: r.m.name })}
                </th>
                <td style={td}>{date(r.m.date)}</td>
                <td style={td}>—</td>
                <td style={td} aria-hidden="true">
                  <div style={{ position: "relative", height: 18 }}>
                    <span
                      style={{
                        position: "absolute",
                        left: `calc(${pos(r.m.date)}% - 6px)`,
                        top: 3,
                      }}
                    >
                      <MilestoneMarker milestone={r.m} locale={locale} />
                    </span>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
GanttTimeline.displayName = "GanttTimeline";
