/**
 * @maataa/ui/forms/AlternativeInput
 * Selection for people who use eye-gaze, head pointers or a single switch:
 * GazeSelectionGrid (dwell to select), DwellRing, ScanningSelector (switch /
 * blink scanning) and YesNoButtons
 */

import React, { useEffect, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

/* ───────────────────────── DwellRing ───────────────────────── */

export interface DwellRingProps {
  /** 0–1 */
  progress: number;
  size?: number;
  /** Visible text inside the ring */
  children?: React.ReactNode;
}

/**
 * DwellRing
 * Visual countdown that fills while a pointer or gaze rests on a target.
 * Decorative: the target itself carries the name.
 */
export function DwellRing({ progress, size = 56, children }: DwellRingProps) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  return (
    <span
      style={{
        position: "relative",
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorTokens.border.secondary}
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorTokens.interactive.primary}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && (
        <span style={{ position: "relative", fontSize: typographyTokens.fontSize.xs }}>
          {children}
        </span>
      )}
    </span>
  );
}

/** Tracks dwell time on one target at a time */
export function useDwell(dwellMs: number, onDwell: (id: string) => void) {
  const [target, setTarget] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const cb = useRef(onDwell);
  cb.current = onDwell;
  useEffect(() => {
    setProgress(0);
    if (!target) return undefined;
    const started = Date.now();
    const tick = setInterval(() => setProgress(Math.min(1, (Date.now() - started) / dwellMs)), 50);
    const done = setTimeout(() => {
      cb.current(target);
      setTarget(null);
    }, dwellMs);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [target, dwellMs]);
  return { target, progress, enter: setTarget, leave: () => setTarget(null) };
}

/* ───────────────────────── GazeSelectionGrid ───────────────────────── */

export interface GazeItem {
  id: string;
  label: string;
  /** Picture or symbol shown above the label */
  symbol?: React.ReactNode;
}

export interface GazeSelectionGridProps {
  label: string;
  items: GazeItem[];
  onSelect: (id: string) => void;
  /** Time a pointer must rest to select @default 1200 */
  dwellMs?: number;
  columns?: number;
  /** Minimum target size in px @default 120 */
  targetSize?: number;
  selectedId?: string;
}

/**
 * GazeSelectionGrid
 * Very large targets with generous gaps. Resting the pointer/gaze selects
 * after `dwellMs`; click, tap, Enter and Space select immediately.
 */
export function GazeSelectionGrid({
  label,
  items,
  onSelect,
  dwellMs = 1200,
  columns = 3,
  targetSize = 120,
  selectedId,
}: GazeSelectionGridProps) {
  const [said, setSaid] = useState("");
  const pick = (id: string) => {
    onSelect(id);
    setSaid(`${items.find((i) => i.id === id)?.label ?? id} selected`);
  };
  const dwell = useDwell(dwellMs, pick);
  return (
    <div role="group" aria-label={label}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(${targetSize}px, 1fr))`,
          gap: spacingTokens.lg,
        }}
      >
        {items.map((it) => {
          const on = it.id === selectedId;
          const dwelling = dwell.target === it.id;
          return (
            <button
              key={it.id}
              type="button"
              aria-pressed={selectedId !== undefined ? on : undefined}
              onClick={() => pick(it.id)}
              onPointerEnter={() => dwell.enter(it.id)}
              onPointerLeave={dwell.leave}
              style={{
                minHeight: targetSize,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: spacingTokens.xs,
                borderRadius: 16,
                border: `4px solid ${on ? colorTokens.interactive.primary : dwelling ? colorTokens.interactive.secondary : colorTokens.border.control}`,
                background: on ? colorTokens.background.tertiary : colorTokens.background.primary,
                color: colorTokens.text.primary,
                font: "inherit",
                fontSize: typographyTokens.fontSize.lg,
                fontWeight: 600,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {it.symbol && (
                <span aria-hidden="true" style={{ fontSize: 40 }}>
                  {it.symbol}
                </span>
              )}
              {it.label}
              {dwelling && (
                <span style={{ position: "absolute", top: 6, right: 6 }}>
                  <DwellRing progress={dwell.progress} size={32} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <VisuallyHidden role="status">{said}</VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── ScanningSelector ───────────────────────── */

export interface ScanningSelectorProps {
  label: string;
  items: GazeItem[];
  onSelect: (id: string) => void;
  /** Time each item stays highlighted @default 1500 */
  intervalMs?: number;
  /** Scanning on/off (controlled) */
  running: boolean;
  onRunningChange: (running: boolean) => void;
  /** Announce each highlighted item (audio scanning) @default true */
  announce?: boolean;
  /** Increment to act as a switch press from outside (e.g. a blink detector) */
  switchSignal?: number;
}

/**
 * ScanningSelector
 * Items light up one after another; a single switch (Space, Enter, the big
 * Select button, or an external `switchSignal` such as a blink detector)
 * picks the lit item. Scanning stops after a choice.
 */
export function ScanningSelector({
  label,
  items,
  onSelect,
  intervalMs = 1500,
  running,
  onRunningChange,
  announce = true,
  switchSignal,
}: ScanningSelectorProps) {
  const [idx, setIdx] = useState(0);
  const [said, setSaid] = useState("");
  const idxRef = useRef(0);
  idxRef.current = idx;

  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [running, intervalMs, items.length]);

  const choose = () => {
    if (!running) {
      onRunningChange(true);
      setIdx(0);
      return;
    }
    const it = items[idxRef.current];
    if (!it) return;
    onSelect(it.id);
    onRunningChange(false);
    setSaid(`${it.label} selected`);
  };

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (switchSignal !== undefined) choose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchSignal]);

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          choose();
        }
      }}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: spacingTokens.md,
        }}
      >
        {items.map((it, n) => {
          const lit = running && n === idx;
          return (
            <li
              key={it.id}
              aria-current={lit ? "true" : undefined}
              style={{
                minWidth: 120,
                minHeight: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                border: `4px solid ${lit ? colorTokens.interactive.primary : colorTokens.border.secondary}`,
                background: lit ? colorTokens.semantic.warning.bg : colorTokens.background.primary,
                color: colorTokens.text.primary,
                fontSize: typographyTokens.fontSize.lg,
                fontWeight: 600,
                transition: "none",
              }}
            >
              {it.symbol && (
                <span aria-hidden="true" style={{ fontSize: 36 }}>
                  {it.symbol}
                </span>
              )}
              {it.label}
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={choose}
        style={{
          minHeight: 72,
          borderRadius: 16,
          border: 0,
          background: colorTokens.interactive.primary,
          color: colorTokens.text.inverse,
          font: "inherit",
          fontSize: typographyTokens.fontSize.xl,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {running ? "Select" : "Start scanning"}
      </button>
      {running && (
        <button
          type="button"
          onClick={() => onRunningChange(false)}
          style={{
            alignSelf: "flex-start",
            minHeight: 44,
            padding: "0 16px",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Stop scanning
        </button>
      )}
      <VisuallyHidden aria-live="polite">
        {running && announce ? items[idx]?.label : said}
      </VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── YesNoButtons ───────────────────────── */

export interface YesNoButtonsProps {
  question: string;
  value: "yes" | "no" | "unsure" | null;
  onChange: (value: "yes" | "no" | "unsure") => void;
  /** Offer a third "Not sure" answer @default false */
  allowUnsure?: boolean;
  yesLabel?: string;
  noLabel?: string;
}

/**
 * YesNoButtons
 * Two very large answers (with symbols as well as colour). Each is a toggle
 * button, so the chosen answer is announced as pressed.
 */
export function YesNoButtons({
  question,
  value,
  onChange,
  allowUnsure,
  yesLabel = "Yes",
  noLabel = "No",
}: YesNoButtonsProps) {
  const opts = [
    {
      v: "yes" as const,
      label: yesLabel,
      sym: "✓",
      bg: colorTokens.semantic.success.bg,
      fg: colorTokens.semantic.success.text,
    },
    {
      v: "no" as const,
      label: noLabel,
      sym: "✕",
      bg: colorTokens.semantic.error.bg,
      fg: colorTokens.semantic.error.text,
    },
    ...(allowUnsure
      ? [
          {
            v: "unsure" as const,
            label: "Not sure",
            sym: "?",
            bg: colorTokens.background.tertiary,
            fg: colorTokens.text.primary,
          },
        ]
      : []),
  ];
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend
        style={{
          fontSize: typographyTokens.fontSize.xl,
          fontWeight: 600,
          padding: 0,
          marginBottom: spacingTokens.md,
        }}
      >
        {question}
      </legend>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${opts.length}, 1fr)`,
          gap: spacingTokens.lg,
        }}
      >
        {opts.map((o) => {
          const on = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.v)}
              style={{
                minHeight: 120,
                borderRadius: 20,
                border: `5px solid ${on ? o.fg : "transparent"}`,
                background: o.bg,
                color: o.fg,
                font: "inherit",
                fontSize: opts.length > 2 ? 22 : 28,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                boxShadow: on ? colorTokens.shadow.md : undefined,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 40 }}>
                {o.sym}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
