/**
 * @maataa/ui/surfaces/Celebrations
 * ProgressToast (long task progress in a corner) and ConfettiBurst
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { CHART_COLORS } from "../data/chartKit";

/* ───────────────────────── ProgressToast ───────────────────────── */

export interface ProgressToastProps {
  /** e.g. "Uploading rushes" (null hides it) */
  title: string | null;
  /** 0–100, or null when unknown */
  percent: number | null;
  /** e.g. "12 of 40 files" */
  detail?: string;
  state?: "running" | "done" | "failed";
  onCancel?: () => void;
  onDismiss?: () => void;
  onRetry?: () => void;
}

/**
 * ProgressToast
 * Non-blocking progress for long work. Milestones (every 25%) and the end
 * are announced, not every percent. The bar is a real progressbar.
 */
export function ProgressToast({
  title,
  percent,
  detail,
  state = "running",
  onCancel,
  onDismiss,
  onRetry,
}: ProgressToastProps) {
  const [say, setSay] = useState("");
  const lastStep = useRef(-1);
  useEffect(() => {
    if (!title) return;
    if (state === "done") setSay(`${title}: done.`);
    else if (state === "failed") setSay(`${title}: failed.`);
    else if (percent != null) {
      const step = Math.floor(percent / 25);
      if (step !== lastStep.current) {
        lastStep.current = step;
        if (step > 0 && step < 4) setSay(`${title}: ${step * 25}%`);
      }
    }
  }, [title, percent, state]);
  const btn: React.CSSProperties = {
    minHeight: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: `1px solid ${colorTokens.border.control}`,
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
    font: "inherit",
    fontSize: typographyTokens.fontSize.sm,
    cursor: "pointer",
  };
  const color =
    state === "failed"
      ? colorTokens.interactive.error
      : state === "done"
        ? colorTokens.interactive.success
        : colorTokens.interactive.primary;
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 85,
        width: 340,
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      <span
        role="status"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {say}
      </span>
      {title && (
        <section
          aria-label={title}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens.xs,
            padding: spacingTokens.md,
            borderRadius: 12,
            background: colorTokens.background.primary,
            border: `1px solid ${colorTokens.border.primary}`,
            boxShadow: colorTokens.shadow.xl,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 600 }}
          >
            <span>{title}</span>
            <span style={{ color, fontVariantNumeric: "tabular-nums" }}>
              {state === "done"
                ? "Done"
                : state === "failed"
                  ? "Failed"
                  : percent != null
                    ? `${Math.round(percent)}%`
                    : "Working…"}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent != null ? Math.round(percent) : undefined}
            style={{
              height: 6,
              borderRadius: 999,
              background: colorTokens.background.tertiary,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                display: "block",
                height: "100%",
                width: `${state === "done" ? 100 : (percent ?? 30)}%`,
                background: color,
                transition: "width 200ms",
              }}
            />
          </div>
          {detail && (
            <span
              style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
            >
              {detail}
            </span>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {state === "running" && onCancel && (
              <button type="button" style={btn} onClick={onCancel}>
                Cancel
              </button>
            )}
            {state === "failed" && onRetry && (
              <button type="button" style={btn} onClick={onRetry}>
                Try again
              </button>
            )}
            {state !== "running" && onDismiss && (
              <button type="button" style={btn} onClick={onDismiss}>
                Dismiss
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/* ───────────────────────── ConfettiBurst ───────────────────────── */

export interface ConfettiBurstProps {
  /** Change this value to fire a burst (e.g. a counter) */
  fireKey: number;
  /** Pieces @default 80 */
  count?: number;
  /** Words announced with the burst, e.g. "Picture locked!" */
  message?: string;
  durationMs?: number;
}

/**
 * ConfettiBurst
 * Decorative celebration: aria-hidden, short (under 5 s), and skipped
 * entirely with reduced motion — the message is still announced.
 */
export function ConfettiBurst({
  fireKey,
  count = 80,
  message,
  durationMs = 2200,
}: ConfettiBurstProps) {
  const [active, setActive] = useState(false);
  const [say, setSay] = useState("");
  const first = useRef(true);
  const reduce =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    if (message) setSay(message);
    if (reduce) return undefined;
    setActive(true);
    const t = setTimeout(() => setActive(false), Math.min(durationMs, 4500));
    return () => clearTimeout(t);
  }, [fireKey, message, durationMs, reduce]);
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 300,
        rot: Math.random() * 720 - 360,
        drift: Math.random() * 160 - 80,
        color: CHART_COLORS[i % CHART_COLORS.length],
        w: 6 + Math.random() * 6,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fireKey, count]
  );
  return (
    <>
      <span
        role="status"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {say}
      </span>
      {active && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 1200,
          }}
        >
          <style>{`@keyframes maataa-confetti { from { transform: translate(0, -20px) rotate(0); opacity: 1; } to { transform: translate(var(--dx), 105vh) rotate(var(--rot)); opacity: 0.9; } }`}</style>
          {pieces.map((p, i) => (
            <span
              key={i}
              style={
                {
                  position: "absolute",
                  top: 0,
                  left: `${p.left}%`,
                  width: p.w,
                  height: p.w * 0.45,
                  background: p.color,
                  borderRadius: 1,
                  "--dx": `${p.drift}px`,
                  "--rot": `${p.rot}deg`,
                  animation: `maataa-confetti ${durationMs}ms cubic-bezier(.2,.6,.4,1) ${p.delay}ms forwards`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
