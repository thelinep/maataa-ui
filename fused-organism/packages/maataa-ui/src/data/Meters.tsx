/**
 * @maataa/ui/data/Meters
 * AnimatedCounter, StackedProgressBar, ProgressRing and Gauge
 */

import React, { useEffect, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { chartColor, defaultFormat } from "./chartKit";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ───────────────────────── AnimatedCounter ───────────────────────── */

export interface AnimatedCounterProps {
  value: number;
  label: string;
  format?: (n: number) => string;
  durationMs?: number;
  /** e.g. "₹" */
  prefix?: string;
  suffix?: string;
}

/**
 * AnimatedCounter
 * Counts up visually; assistive tech only ever gets the final number (the
 * moving digits are aria-hidden). No animation with reduced motion.
 */
export function AnimatedCounter({
  value,
  label,
  format = defaultFormat,
  durationMs = 1200,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const [shown, setShown] = useState(reducedMotion() ? value : 0);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion() || durationMs <= 0) {
      setShown(value);
      return undefined;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - (1 - p) ** 3;
      setShown(a + (value - a) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);
  const isInt = Number.isInteger(value);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: typographyTokens.fontSize["3xl"],
          fontWeight: 700,
          color: colorTokens.text.primary,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span aria-hidden="true">
          {prefix}
          {format(isInt ? Math.round(shown) : shown)}
          {suffix}
        </span>
        <VisuallyHidden>
          {prefix}
          {format(value)}
          {suffix}
        </VisuallyHidden>
      </span>
      <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}>
        {label}
      </span>
    </div>
  );
}

/* ───────────────────────── StackedProgressBar ───────────────────────── */

export interface ProgressSegment {
  label: string;
  value: number;
  color?: string;
}

export interface StackedProgressBarProps {
  label: string;
  segments: ProgressSegment[];
  /** Total capacity; defaults to the sum of segments */
  total?: number;
  format?: (n: number) => string;
  /** e.g. "₹" or "shots" */
  unit?: string;
}

/**
 * StackedProgressBar
 * One bar split into parts (e.g. spent / committed / remaining). A list
 * under it gives every part in words, so the colours are only decoration.
 */
export function StackedProgressBar({
  label,
  segments,
  total,
  format = defaultFormat,
  unit = "",
}: StackedProgressBarProps) {
  const sum = segments.reduce((s, x) => s + x.value, 0);
  const cap = total ?? sum;
  const u = (n: number) =>
    unit === "₹" ? `₹${format(n)}` : `${format(n)}${unit ? ` ${unit}` : ""}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}>
          {u(sum)} of {u(cap)}
        </span>
      </div>
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          height: 14,
          borderRadius: 999,
          overflow: "hidden",
          background: colorTokens.background.tertiary,
          outline: `1px solid ${colorTokens.border.control}`,
        }}
      >
        {segments.map((s, i) => (
          <span
            key={s.label}
            style={{
              width: `${(Math.max(0, s.value) / (cap || 1)) * 100}%`,
              background: s.color ?? chartColor(i),
              borderRight:
                i < segments.length - 1 ? `2px solid ${colorTokens.background.primary}` : undefined,
            }}
          />
        ))}
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: spacingTokens.md,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        {segments.map((s, i) => (
          <li key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: s.color ?? chartColor(i),
              }}
            />
            {s.label}: {u(s.value)} ({Math.round((s.value / (cap || 1)) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── ProgressRing ───────────────────────── */

export interface ProgressRingProps {
  /** 0–max */
  value: number;
  max?: number;
  label: string;
  size?: number;
  /** Text in the centre @default percentage */
  centre?: React.ReactNode;
  color?: string;
}

/**
 * ProgressRing
 * A circular progressbar (role=progressbar with value and text).
 */
export function ProgressRing({
  value,
  max = 100,
  label,
  size = 96,
  centre,
  color = colorTokens.interactive.primary,
}: ProgressRingProps) {
  const p = Math.min(1, Math.max(0, value / (max || 1)));
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${Math.round(p * 100)}%`}
        style={{ position: "relative", width: size, height: size }}
      >
        <svg width={size} height={size} aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={colorTokens.border.secondary}
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - p)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: size > 80 ? 20 : 14,
          }}
        >
          {centre ?? `${Math.round(p * 100)}%`}
        </span>
      </div>
      <span style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {label}
      </span>
    </div>
  );
}

/* ───────────────────────── Gauge ───────────────────────── */

export interface GaugeBand {
  /** Upper bound of this band */
  upTo: number;
  label: string;
  color: string;
}

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  /** Coloured bands, e.g. Poor / Fair / Good */
  bands?: GaugeBand[];
  format?: (n: number) => string;
}

/**
 * Gauge
 * Half-dial with a needle. role=meter, and the band name is part of the
 * value text ("72, Good").
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  bands,
  format = defaultFormat,
}: GaugeProps) {
  const W = 220;
  const C = { x: 110, y: 110 };
  const R = 90;
  const t = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const ang = (f: number) => Math.PI + f * Math.PI;
  const pt = (f: number, r: number) =>
    `${C.x + r * Math.cos(ang(f))} ${C.y + r * Math.sin(ang(f))}`;
  const band = bands?.find((b) => value <= b.upTo) ?? bands?.[bands.length - 1];
  let prev = min;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={`${format(value)}${band ? `, ${band.label}` : ""}`}
      >
        <svg width={W} height={130} viewBox={`0 0 ${W} 130`} aria-hidden="true">
          {(bands ?? [{ upTo: max, label: "", color: colorTokens.border.secondary }]).map((b) => {
            const f0 = (prev - min) / (max - min);
            const f1 = (Math.min(b.upTo, max) - min) / (max - min);
            prev = b.upTo;
            return (
              <path
                key={b.label + b.upTo}
                d={`M ${pt(f0, R)} A ${R} ${R} 0 0 1 ${pt(f1, R)}`}
                fill="none"
                stroke={b.color}
                strokeWidth={16}
              />
            );
          })}
          <line
            x1={C.x}
            y1={C.y}
            x2={C.x + (R - 14) * Math.cos(ang(t))}
            y2={C.y + (R - 14) * Math.sin(ang(t))}
            stroke={colorTokens.text.primary}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle cx={C.x} cy={C.y} r={7} fill={colorTokens.text.primary} />
          <text
            x={C.x - R}
            y={128}
            textAnchor="middle"
            style={{ fontSize: 11, fill: colorTokens.text.secondary }}
          >
            {format(min)}
          </text>
          <text
            x={C.x + R}
            y={128}
            textAnchor="middle"
            style={{ fontSize: 11, fill: colorTokens.text.secondary }}
          >
            {format(max)}
          </text>
        </svg>
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.xl, fontWeight: 700, marginTop: -8 }}>
        {format(value)}
        {band && (
          <span
            style={{
              fontSize: typographyTokens.fontSize.sm,
              fontWeight: 600,
              marginLeft: 8,
              color: colorTokens.text.secondary,
            }}
          >
            {band.label}
          </span>
        )}
      </div>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {label}
      </div>
    </div>
  );
}
