/**
 * @maataa/ui/data/MoreCharts
 * HorizontalBarChart, GroupedBarChart, ThresholdBarChart, PieChart,
 * FunnelChart, WaterfallChart, RadarChart and Heatmap — all SVG with direct
 * labels, a spoken summary and a data table (via ChartFigure)
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, typographyTokens } from "../tokens";
import { niceTicks } from "./chartUtils";
import { ChartFigure, LegendList, chartColor, defaultFormat } from "./chartKit";

export interface Datum {
  label: string;
  value: number;
}

interface CommonProps {
  title: string;
  /** Overrides the generated summary */
  summary?: string;
  format?: (n: number) => string;
  /** Unit for the table header, e.g. "₹ lakh" */
  unit?: string;
}

const axisText = { fontSize: 11, fill: colorTokens.text.secondary } as const;
const labelText = { fontSize: 12, fill: colorTokens.text.primary } as const;

function maxBy<T>(xs: T[], f: (x: T) => number) {
  return xs.reduce((a, b) => (f(b) > f(a) ? b : a), xs[0]!);
}

/* ───────────────────────── HorizontalBarChart ───────────────────────── */

export interface HorizontalBarChartProps extends CommonProps {
  data: Datum[];
  /** Sort longest first @default false */
  sort?: boolean;
  color?: string;
}

/** Bars run left→right with the value printed at the end of each bar. */
export function HorizontalBarChart({
  title,
  summary,
  data,
  format = defaultFormat,
  unit,
  sort,
  color = chartColor(0),
}: HorizontalBarChartProps) {
  const t = useT();
  const rows = sort ? [...data].sort((a, b) => b.value - a.value) : data;
  const max = Math.max(...rows.map((d) => d.value), 0) || 1;
  const labelW = 130;
  const W = 520;
  const rowH = 30;
  const top = maxBy(rows, (d) => d.value);
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `${rows.length} bars. Highest is ${top?.label} at ${format(top?.value ?? 0)}${unit ? ` ${unit}` : ""}.`
      }
      table={{
        columns: ["Item", unit ? `Value (${unit})` : "Value"],
        rows: rows.map((d) => [d.label, d.value]),
      }}
    >
      <svg viewBox={`0 0 ${W} ${rows.length * rowH + 8}`} width="100%" aria-hidden="true">
        {rows.map((d, i) => {
          const w = ((W - labelW - 70) * Math.max(0, d.value)) / max;
          const y = i * rowH + 4;
          return (
            <g key={t(d.label)}>
              <text x={labelW - 8} y={y + 17} textAnchor="end" style={labelText}>
                {t(d.label)}
              </text>
              <rect x={labelW} y={y + 4} width={w} height={rowH - 10} rx={3} fill={color} />
              <text x={labelW + w + 6} y={y + 17} style={labelText}>
                {format(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── GroupedBarChart ───────────────────────── */

export interface GroupedBarChartProps extends CommonProps {
  /** Category labels on the x axis */
  categories: string[];
  series: { name: string; values: number[] }[];
}

/** Side-by-side bars per category, with a legend and a full table. */
export function GroupedBarChart({
  title,
  summary,
  categories,
  series,
  format = defaultFormat,
  unit,
}: GroupedBarChartProps) {
  const W = 560;
  const H = 240;
  const pad = { l: 48, r: 8, t: 10, b: 28 };
  const max = Math.max(...series.flatMap((s) => s.values), 0) || 1;
  const ticks = niceTicks(max, 4);
  const top = ticks[ticks.length - 1] || max;
  const gw = (W - pad.l - pad.r) / categories.length;
  const bw = Math.min(28, (gw - 12) / series.length);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / top);
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `${series.map((s) => s.name).join(" and ")} compared across ${categories.length} categories.`
      }
      table={{
        columns: ["Category", ...series.map((s) => (unit ? `${s.name} (${unit})` : s.name))],
        rows: categories.map((c, i) => [c, ...series.map((s) => s.values[i] ?? 0)]),
      }}
      footer={
        <LegendList items={series.map((s, i) => ({ label: s.name, color: chartColor(i) }))} />
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(t)}
              y2={y(t)}
              stroke={colorTokens.border.secondary}
            />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" style={axisText}>
              {format(t)}
            </text>
          </g>
        ))}
        {categories.map((c, ci) => {
          const gx = pad.l + ci * gw + (gw - bw * series.length) / 2;
          return (
            <g key={c}>
              {series.map((s, si) => {
                const v = s.values[ci] ?? 0;
                return (
                  <rect
                    key={s.name}
                    x={gx + si * bw}
                    y={y(v)}
                    width={bw - 2}
                    height={y(0) - y(v)}
                    fill={chartColor(si)}
                    rx={2}
                  />
                );
              })}
              <text x={pad.l + ci * gw + gw / 2} y={H - 8} textAnchor="middle" style={axisText}>
                {c}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── ThresholdBarChart ───────────────────────── */

export interface ThresholdBarChartProps extends CommonProps {
  data: Datum[];
  threshold: number;
  /** e.g. "Budget cap" */
  thresholdLabel: string;
}

/**
 * Vertical bars with a dashed threshold line. Bars over the line are a
 * different colour AND get a ▲ marker, and are listed in the summary.
 */
export function ThresholdBarChart({
  title,
  summary,
  data,
  threshold,
  thresholdLabel,
  format = defaultFormat,
  unit,
}: ThresholdBarChartProps) {
  const t = useT();
  const W = 560;
  const H = 240;
  const pad = { l: 48, r: 8, t: 16, b: 28 };
  const max = Math.max(threshold, ...data.map((d) => d.value)) || 1;
  const ticks = niceTicks(max, 4);
  const top = ticks[ticks.length - 1] || max;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / top);
  const bw = (W - pad.l - pad.r) / data.length;
  const over = data.filter((d) => d.value > threshold);
  const overC = colorTokens.interactive.error;
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        (over.length
          ? `${over.length} of ${data.length} over the ${thresholdLabel.toLowerCase()} of ${format(threshold)}: ${over.map((d) => d.label).join(", ")}.`
          : `All ${data.length} are within the ${thresholdLabel.toLowerCase()} of ${format(threshold)}.`)
      }
      table={{
        columns: ["Item", unit ? `Value (${unit})` : "Value", "Over?"],
        rows: data.map((d) => [d.label, d.value, d.value > threshold ? t("Over") : t("Within")]),
      }}
      footer={
        <LegendList
          items={[
            { label: msg("Within"), color: chartColor(1) },
            { label: msg("Over (▲)"), color: overC },
            {
              label: `${thresholdLabel}: ${format(threshold)}`,
              color: colorTokens.text.primary,
              dashed: true,
            },
          ]}
        />
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(t)}
              y2={y(t)}
              stroke={colorTokens.border.secondary}
            />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" style={axisText}>
              {format(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const isOver = d.value > threshold;
          const x = pad.l + i * bw + bw * 0.15;
          return (
            <g key={t(d.label)}>
              <rect
                x={x}
                y={y(d.value)}
                width={bw * 0.7}
                height={y(0) - y(d.value)}
                rx={2}
                fill={isOver ? overC : chartColor(1)}
              />
              {isOver && (
                <text
                  x={x + bw * 0.35}
                  y={y(d.value) - 4}
                  textAnchor="middle"
                  style={{ ...labelText, fill: overC }}
                >
                  ▲
                </text>
              )}
              <text x={pad.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" style={axisText}>
                {t(d.label)}
              </text>
            </g>
          );
        })}
        <line
          x1={pad.l}
          x2={W - pad.r}
          y1={y(threshold)}
          y2={y(threshold)}
          stroke={colorTokens.text.primary}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── PieChart ───────────────────────── */

export interface PieChartProps extends CommonProps {
  data: Datum[];
  /** Hole size 0–0.8 (0 = pie) @default 0 */
  hole?: number;
}

/** Share of a whole. Slices carry percentage labels; the legend repeats them. */
export function PieChart({
  title,
  summary,
  data,
  hole = 0,
  format = defaultFormat,
  unit,
}: PieChartProps) {
  const t = useT();
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  const R = 90;
  const C = 110;
  let a0 = -Math.PI / 2;
  const pct = (v: number) => Math.round((v / total) * 100);
  const top = maxBy(data, (d) => d.value);
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `${data.length} parts of a total ${format(total)}${unit ? ` ${unit}` : ""}. Largest is ${top?.label} at ${pct(top?.value ?? 0)}%.`
      }
      table={{
        columns: ["Part", unit ? `Value (${unit})` : "Value", "Share"],
        rows: data.map((d) => [d.label, d.value, `${pct(d.value)}%`]),
      }}
      footer={
        <LegendList
          items={data.map((d, i) => ({
            label: `${t(d.label)} — ${pct(d.value)}%`,
            color: chartColor(i),
          }))}
        />
      }
    >
      <svg
        viewBox="0 0 220 220"
        width="220"
        height="220"
        aria-hidden="true"
        style={{ maxWidth: "100%" }}
      >
        {data.map((d, i) => {
          const frac = Math.max(0, d.value) / total;
          const a1 = a0 + frac * Math.PI * 2;
          const large = frac > 0.5 ? 1 : 0;
          const p = (a: number, r: number) => `${C + r * Math.cos(a)} ${C + r * Math.sin(a)}`;
          const r0 = R * hole;
          const path =
            frac >= 0.9999
              ? `M ${C - R} ${C} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0`
              : `M ${p(a0, R)} A ${R} ${R} 0 ${large} 1 ${p(a1, R)} L ${p(a1, r0)} ${r0 ? `A ${r0} ${r0} 0 ${large} 0 ${p(a0, r0)}` : ""} Z`;
          const mid = (a0 + a1) / 2;
          const lr = R * (hole ? (1 + hole) / 2 : 0.62);
          const el = (
            <g key={t(d.label)}>
              <path
                d={path}
                fill={chartColor(i)}
                stroke={colorTokens.background.primary}
                strokeWidth={2}
              />
              {frac > 0.06 && (
                <text
                  x={C + lr * Math.cos(mid)}
                  y={C + lr * Math.sin(mid) + 4}
                  textAnchor="middle"
                  style={{ fontSize: 12, fontWeight: 700, fill: "#FFFFFF" }}
                >
                  {pct(d.value)}%
                </text>
              )}
            </g>
          );
          a0 = a1;
          return el;
        })}
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── FunnelChart ───────────────────────── */

export interface FunnelChartProps extends CommonProps {
  /** Stages in order, e.g. Applied → Shortlisted → Auditioned → Cast */
  stages: Datum[];
}

/** Each stage shows its count and the conversion from the stage before. */
export function FunnelChart({ title, summary, stages, format = defaultFormat }: FunnelChartProps) {
  const t = useT();
  const first = stages[0]?.value || 1;
  const last = stages[stages.length - 1];
  const W = 520;
  const rowH = 44;
  const conv = (i: number) =>
    i === 0 ? "—" : `${Math.round(((stages[i]!.value || 0) / (stages[i - 1]!.value || 1)) * 100)}%`;
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `${stages.length} stages from ${format(first)} ${stages[0]?.label.toLowerCase()} to ${format(last?.value ?? 0)} ${last?.label.toLowerCase()} (${Math.round(((last?.value ?? 0) / first) * 100)}% overall).`
      }
      table={{
        columns: ["Stage", "Count", "From previous"],
        rows: stages.map((s, i) => [s.label, s.value, conv(i)]),
      }}
    >
      <svg viewBox={`0 0 ${W} ${stages.length * rowH}`} width="100%" aria-hidden="true">
        {stages.map((s, i) => {
          const w = Math.max(40, ((W - 200) * s.value) / first);
          const x = (W - 200 - w) / 2;
          return (
            <g key={t(s.label)}>
              <rect
                x={x}
                y={i * rowH + 4}
                width={w}
                height={rowH - 8}
                rx={6}
                fill={chartColor(i)}
              />
              <text x={W - 192} y={i * rowH + 20} style={{ ...labelText, fontWeight: 600 }}>
                {t(s.label)}: {format(s.value)}
              </text>
              <text x={W - 192} y={i * rowH + 36} style={axisText}>
                {i === 0 ? "start" : `${conv(i)} of previous`}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── WaterfallChart ───────────────────────── */

export interface WaterfallChartProps extends CommonProps {
  start: Datum;
  /** Positive = increase, negative = decrease */
  steps: Datum[];
  /** Label for the final total @default 'End' */
  endLabel?: string;
}

/**
 * Running total from a start value through increases and decreases.
 * Increases and decreases differ in colour AND sign (+/−) on each bar.
 */
export function WaterfallChart({
  title,
  summary,
  start,
  steps,
  endLabel: endLabelProp,
  format = defaultFormat,
  unit,
}: WaterfallChartProps) {
  const t = useT();
  const endLabel = endLabelProp ?? t("End");
  const W = 560;
  const H = 260;
  const pad = { l: 56, r: 8, t: 18, b: 40 };
  const bars: { label: string; from: number; to: number; kind: "total" | "up" | "down" }[] = [];
  let run = start.value;
  bars.push({ label: start.label, from: 0, to: run, kind: "total" });
  for (const s of steps) {
    bars.push({ label: s.label, from: run, to: run + s.value, kind: s.value >= 0 ? "up" : "down" });
    run += s.value;
  }
  bars.push({ label: endLabel, from: 0, to: run, kind: "total" });
  const hi = Math.max(...bars.map((b) => Math.max(b.from, b.to)));
  const lo = Math.min(0, ...bars.map((b) => Math.min(b.from, b.to)));
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - (v - lo) / (hi - lo || 1));
  const bw = (W - pad.l - pad.r) / bars.length;
  const col = {
    total: chartColor(1),
    up: colorTokens.interactive.success,
    down: colorTokens.interactive.error,
  };
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `Starts at ${format(start.value)} and ends at ${format(run)}${unit ? ` ${unit}` : ""} after ${steps.length} changes.`
      }
      table={{
        columns: ["Step", unit ? `Change (${unit})` : "Change", "Running total"],
        rows: bars.map((b) => [b.label, b.kind === "total" ? b.to : b.to - b.from, b.to]),
      }}
      footer={
        <LegendList
          items={[
            { label: msg("Total"), color: col.total },
            { label: msg("Increase (+)"), color: col.up },
            { label: msg("Decrease (−)"), color: col.down },
          ]}
        />
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
        <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke={colorTokens.border.primary} />
        {bars.map((b, i) => {
          const top = Math.max(b.from, b.to);
          const bot = Math.min(b.from, b.to);
          const x = pad.l + i * bw + bw * 0.15;
          const delta = b.to - b.from;
          return (
            <g key={b.label + i}>
              <rect
                x={x}
                y={y(top)}
                width={bw * 0.7}
                height={Math.max(1, y(bot) - y(top))}
                fill={col[b.kind]}
                rx={2}
              />
              {i < bars.length - 1 && (
                <line
                  x1={x + bw * 0.7}
                  x2={x + bw}
                  y1={y(b.to)}
                  y2={y(b.to)}
                  stroke={colorTokens.text.tertiary}
                  strokeDasharray="3 3"
                />
              )}
              <text
                x={x + bw * 0.35}
                y={y(top) - 5}
                textAnchor="middle"
                style={{ ...labelText, fontSize: 11 }}
              >
                {b.kind === "total"
                  ? format(b.to)
                  : `${delta >= 0 ? "+" : "−"}${format(Math.abs(delta))}`}
              </text>
              <text x={pad.l + i * bw + bw / 2} y={H - 22} textAnchor="middle" style={axisText}>
                {t(b.label)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── RadarChart ───────────────────────── */

export interface RadarChartProps extends CommonProps {
  axes: string[];
  series: { name: string; values: number[] }[];
  /** Value at the outer ring @default 10 */
  max?: number;
}

/** Scores on several dimensions (e.g. concept strength). */
export function RadarChart({
  title,
  summary,
  axes,
  series,
  max = 10,
  format = defaultFormat,
}: RadarChartProps) {
  const C = 150;
  const R = 95;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
  const pt = (i: number, v: number) => [
    C + R * (v / max) * Math.cos(ang(i)),
    C + R * (v / max) * Math.sin(ang(i)),
  ];
  const s0 = series[0];
  const best = s0 ? axes[s0.values.indexOf(Math.max(...s0.values))] : "";
  const worst = s0 ? axes[s0.values.indexOf(Math.min(...s0.values))] : "";
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `${axes.length} dimensions scored out of ${max}. ${s0?.name}: strongest on ${best}, weakest on ${worst}.`
      }
      table={{
        columns: ["Dimension", ...series.map((s) => s.name)],
        rows: axes.map((a, i) => [a, ...series.map((s) => s.values[i] ?? 0)]),
      }}
      footer={
        series.length > 1 ? (
          <LegendList items={series.map((s, i) => ({ label: s.name, color: chartColor(i) }))} />
        ) : undefined
      }
    >
      <svg
        viewBox="-70 0 440 300"
        width="440"
        height="300"
        aria-hidden="true"
        style={{ maxWidth: "100%" }}
      >
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={axes.map((_, i) => pt(i, max * f).join(",")).join(" ")}
            fill="none"
            stroke={colorTokens.border.secondary}
          />
        ))}
        {axes.map((a, i) => {
          const [x, y] = pt(i, max * 1.18);
          const [lx, ly] = pt(i, max);
          return (
            <g key={a}>
              <line x1={C} y1={C} x2={lx} y2={ly} stroke={colorTokens.border.secondary} />
              <text
                x={x}
                y={y! + 4}
                textAnchor={Math.abs(x! - C) < 8 ? "middle" : x! > C ? "start" : "end"}
                style={{ ...labelText, fontSize: 11 }}
              >
                {a}
              </text>
            </g>
          );
        })}
        {series.map((s, si) => (
          <g key={s.name}>
            <polygon
              points={s.values.map((v, i) => pt(i, v).join(",")).join(" ")}
              fill={chartColor(si)}
              fillOpacity={0.18}
              stroke={chartColor(si)}
              strokeWidth={2.5}
            />
            {s.values.map((v, i) => {
              const [x, y] = pt(i, v);
              return (
                <circle key={i} cx={x} cy={y} r={3.5} fill={chartColor(si)}>
                  <title>{`${axes[i]}: ${format(v)}`}</title>
                </circle>
              );
            })}
          </g>
        ))}
      </svg>
    </ChartFigure>
  );
}

/* ───────────────────────── Heatmap ───────────────────────── */

export interface HeatmapProps extends CommonProps {
  rows: string[];
  columns: string[];
  /** values[row][col] */
  values: number[][];
  /** Print the number in each cell @default true */
  showValues?: boolean;
  /** Lowest and highest colours */
  scale?: [string, string];
}

function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i]! - v) * t)).join(",")})`;
}

/**
 * Grid coloured by value (light → dark), with numbers printed in cells so
 * colour is never the only cue; text colour flips for contrast.
 */
export function Heatmap({
  title,
  summary,
  rows,
  columns,
  values,
  showValues = true,
  scale = ["#F5EDE4", "#5C3D1E"],
  format = defaultFormat,
}: HeatmapProps) {
  const flat = values.flat();
  const lo = Math.min(...flat);
  const hi = Math.max(...flat);
  let peak = { r: 0, c: 0 };
  values.forEach((row, r) => row.forEach((v, c) => v === hi && (peak = { r, c })));
  const cw = 52;
  const ch = 32;
  const lw = 96;
  return (
    <ChartFigure
      title={title}
      summary={
        summary ??
        `${rows.length} by ${columns.length} grid from ${format(lo)} to ${format(hi)}. Highest: ${rows[peak.r]}, ${columns[peak.c]}.`
      }
      table={{ columns: ["", ...columns], rows: rows.map((r, ri) => [r, ...(values[ri] ?? [])]) }}
      footer={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: typographyTokens.fontSize.xs,
            color: colorTokens.text.secondary,
          }}
        >
          {format(lo)}
          <span
            aria-hidden="true"
            style={{
              width: 120,
              height: 10,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${scale[0]}, ${scale[1]})`,
            }}
          />
          {format(hi)}
        </div>
      }
    >
      <svg
        viewBox={`0 0 ${lw + columns.length * cw} ${24 + rows.length * ch}`}
        width="100%"
        aria-hidden="true"
        style={{ maxWidth: lw + columns.length * cw }}
      >
        {columns.map((c, ci) => (
          <text key={c} x={lw + ci * cw + cw / 2} y={16} textAnchor="middle" style={axisText}>
            {c}
          </text>
        ))}
        {rows.map((r, ri) => (
          <g key={r}>
            <text x={lw - 8} y={24 + ri * ch + ch / 2 + 4} textAnchor="end" style={labelText}>
              {r}
            </text>
            {columns.map((c, ci) => {
              const v = values[ri]?.[ci] ?? 0;
              const t = hi === lo ? 0.5 : (v - lo) / (hi - lo);
              return (
                <g key={c}>
                  <rect
                    x={lw + ci * cw + 1}
                    y={24 + ri * ch + 1}
                    width={cw - 2}
                    height={ch - 2}
                    rx={3}
                    fill={mix(scale[0], scale[1], t)}
                  />
                  {showValues && (
                    <text
                      x={lw + ci * cw + cw / 2}
                      y={24 + ri * ch + ch / 2 + 4}
                      textAnchor="middle"
                      style={{ fontSize: 11, fill: t > 0.5 ? "#FFFFFF" : colorTokens.text.primary }}
                    >
                      {format(v)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </ChartFigure>
  );
}
