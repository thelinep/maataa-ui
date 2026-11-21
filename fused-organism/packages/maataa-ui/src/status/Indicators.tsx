/**
 * @maataa/ui/status/Indicators
 * CountBadge, PriorityBadge, IndeterminateProgress, BufferingIndicator,
 * LoadingOverlay and SkeletonTable
 */

import React, { useEffect, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { Spinner } from "./Spinner";

const KEYFRAMES = `
@keyframes maataa-indeterminate { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
@keyframes maataa-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .maataa-anim { animation: none !important; }
}`;

function Keyframes() {
  return <style>{KEYFRAMES}</style>;
}

/* ───────────────────────── CountBadge ───────────────────────── */

export interface CountBadgeProps {
  count: number;
  /** What is being counted, e.g. "unread messages" (read after the number) */
  noun: string;
  /** Above this, show "99+" @default 99 */
  max?: number;
  /** Show a 0 badge @default false */
  showZero?: boolean;
  tone?: "neutral" | "alert";
}

/**
 * CountBadge
 * Visible "12" (or "99+"), announced as "12 unread messages" — the exact
 * number even when capped visually.
 */
export function CountBadge({ count, noun, max = 99, showZero, tone = "alert" }: CountBadgeProps) {
  if (count <= 0 && !showZero) return null;
  const alert = tone === "alert";
  return (
    <span style={{ display: "inline-flex" }}>
      <span
        aria-hidden="true"
        style={{
          minWidth: 20,
          height: 20,
          padding: "0 6px",
          borderRadius: 999,
          display: "inline-grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: 700,
          background: alert ? colorTokens.interactive.error : colorTokens.background.tertiary,
          color: alert ? colorTokens.text.inverse : colorTokens.text.primary,
          boxSizing: "border-box",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count > max ? `${max}+` : count}
      </span>
      <VisuallyHidden>
        {count} {noun}
      </VisuallyHidden>
    </span>
  );
}

/* ───────────────────────── PriorityBadge ───────────────────────── */

export type Priority = "urgent" | "high" | "medium" | "low";

const PRIORITY: Record<Priority, { label: string; bars: number; bg: string; fg: string }> = {
  urgent: {
    label: "Urgent",
    bars: 4,
    bg: colorTokens.semantic.error.bg,
    fg: colorTokens.semantic.error.text,
  },
  high: {
    label: "High",
    bars: 3,
    bg: colorTokens.semantic.warning.bg,
    fg: colorTokens.semantic.warning.text,
  },
  medium: {
    label: "Medium",
    bars: 2,
    bg: colorTokens.semantic.info.bg,
    fg: colorTokens.semantic.info.text,
  },
  low: {
    label: "Low",
    bars: 1,
    bg: colorTokens.background.tertiary,
    fg: colorTokens.text.secondary,
  },
};

export interface PriorityBadgeProps {
  priority: Priority;
  /** Hide the word visually (still announced) @default false */
  compact?: boolean;
}

/**
 * PriorityBadge
 * Level is shown three ways: word, number of bars, and colour.
 */
export function PriorityBadge({ priority, compact }: PriorityBadgeProps) {
  const p = PRIORITY[priority];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: compact ? "3px 6px" : "2px 10px 2px 8px",
        borderRadius: 999,
        background: p.bg,
        color: p.fg,
        fontSize: typographyTokens.fontSize.xs,
        fontWeight: 700,
      }}
    >
      <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={i * 3.6}
            y={9 - i * 3}
            width={2.6}
            height={3 + i * 3}
            rx={0.8}
            fill="currentColor"
            opacity={i < p.bars ? 1 : 0.25}
          />
        ))}
      </svg>
      {compact ? (
        <VisuallyHidden>{p.label} priority</VisuallyHidden>
      ) : (
        <span>
          {p.label}
          <VisuallyHidden> priority</VisuallyHidden>
        </span>
      )}
    </span>
  );
}

/* ───────────────────────── IndeterminateProgress ───────────────────────── */

export interface IndeterminateProgressProps {
  label: string;
  /** Show the label visibly @default true */
  showLabel?: boolean;
}

/**
 * IndeterminateProgress
 * role=progressbar with no value (so it reads as "busy"). The moving stripe
 * stops with reduced motion and a static striped bar remains.
 */
export function IndeterminateProgress({ label, showLabel = true }: IndeterminateProgressProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Keyframes />
      {showLabel && (
        <span style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
          {label}
        </span>
      )}
      <div
        role="progressbar"
        aria-label={label}
        style={{
          position: "relative",
          height: 6,
          borderRadius: 999,
          overflow: "hidden",
          background: `repeating-linear-gradient(45deg, ${colorTokens.background.tertiary} 0 8px, ${colorTokens.border.secondary} 8px 16px)`,
        }}
      >
        <span
          className="maataa-anim"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "40%",
            borderRadius: 999,
            background: colorTokens.interactive.primary,
            animation: "maataa-indeterminate 1.4s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── BufferingIndicator ───────────────────────── */

export interface BufferingIndicatorProps {
  /** Show it (wire to the video's waiting/playing events) */
  buffering: boolean;
  /** Buffered percentage if known */
  percent?: number;
  /** Announce after this long, to avoid chatter on short stalls @default 1500 */
  announceAfterMs?: number;
}

/**
 * BufferingIndicator
 * Centred over a player. Only stalls longer than `announceAfterMs` are
 * announced ("Buffering…"), and recovery is announced once ("Playing").
 */
export function BufferingIndicator({
  buffering,
  percent,
  announceAfterMs = 1500,
}: BufferingIndicatorProps) {
  const [say, setSay] = useState("");
  const [announced, setAnnounced] = useState(false);
  useEffect(() => {
    if (buffering) {
      const t = setTimeout(() => {
        setSay("Buffering…");
        setAnnounced(true);
      }, announceAfterMs);
      return () => clearTimeout(t);
    }
    if (announced) {
      setSay("Playing");
      setAnnounced(false);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buffering, announceAfterMs]);
  return (
    <>
      <VisuallyHidden role="status">{say}</VisuallyHidden>
      {buffering && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(20, 14, 8, 0.72)",
              color: "#FFFFFF",
            }}
          >
            <Spinner size="lg" label="Buffering" />
            <span style={{ fontSize: typographyTokens.fontSize.sm }}>
              Buffering{percent != null ? ` ${Math.round(percent)}%` : "…"}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

/* ───────────────────────── LoadingOverlay ───────────────────────── */

export interface LoadingOverlayProps {
  loading: boolean;
  /** e.g. "Exporting the call sheet" */
  label: string;
  /** Cover the whole page instead of the parent @default false */
  fullPage?: boolean;
  /** Offer cancel */
  onCancel?: () => void;
}

/**
 * LoadingOverlay
 * Full-page (or container) spinner for blocking work. Announced once; the
 * content behind is marked busy and inert while it shows.
 */
export function LoadingOverlay({ loading, label, fullPage, onCancel }: LoadingOverlayProps) {
  if (!loading) return null;
  return (
    <div
      role="alertdialog"
      aria-modal={fullPage ? true : undefined}
      aria-label={label}
      aria-busy="true"
      style={{
        position: fullPage ? "fixed" : "absolute",
        inset: 0,
        zIndex: fullPage ? 1100 : 10,
        display: "grid",
        placeItems: "center",
        background: "rgba(255, 250, 240, 0.86)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacingTokens.sm,
          padding: spacingTokens.lg,
          borderRadius: 16,
          background: colorTokens.background.primary,
          boxShadow: colorTokens.shadow.lg,
        }}
      >
        <span aria-hidden="true">
          <Spinner size="lg" label={label} />
        </span>
        <span style={{ fontWeight: 600 }}>{label}…</span>
        {onCancel && (
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            style={{
              minHeight: 40,
              padding: "0 16px",
              borderRadius: 8,
              border: `1px solid ${colorTokens.border.control}`,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── SkeletonTable ───────────────────────── */

export interface SkeletonTableProps {
  /** e.g. "Loading crew" */
  label: string;
  rows?: number;
  columns?: number;
}

/**
 * SkeletonTable
 * Placeholder rows shaped like the table to come. Hidden from assistive tech;
 * one status message says what is loading.
 */
export function SkeletonTable({ label, rows = 5, columns = 4 }: SkeletonTableProps) {
  const bar = (w: string, h = 12): React.CSSProperties => ({
    display: "block",
    width: w,
    height: h,
    borderRadius: 4,
    background: colorTokens.background.tertiary,
    animation: "maataa-pulse 1.6s ease-in-out infinite",
  });
  return (
    <div>
      <Keyframes />
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
        {label}…
      </span>
      <div
        aria-hidden="true"
        style={{
          border: `1px solid ${colorTokens.border.secondary}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 16,
            padding: "12px 14px",
            background: colorTokens.background.secondary,
          }}
        >
          {Array.from({ length: columns }, (_, c) => (
            <span key={c} className="maataa-anim" style={bar(`${50 + ((c * 17) % 30)}%`, 10)} />
          ))}
        </div>
        {Array.from({ length: rows }, (_, r) => (
          <div
            key={r}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: 16,
              padding: "14px",
              borderTop: `1px solid ${colorTokens.border.secondary}`,
            }}
          >
            {Array.from({ length: columns }, (_, c) => (
              <span
                key={c}
                className="maataa-anim"
                style={bar(`${40 + (((r + 1) * (c + 3) * 13) % 50)}%`)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
