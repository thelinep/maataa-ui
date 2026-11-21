/**
 * @maataa/ui/status/Timer
 * Start / stop timer for a timed activity (a take, a filming block)
 */

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TimerResult {
  startedAt: Date;
  endedAt: Date;
  durationMs: number;
}

export interface TimerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** What is being timed, e.g. "Scene 12, take 3" */
  label: string;
  /** Called when the timer starts */
  onStart?: (startedAt: Date) => void;
  /** Called with the start, end and duration when it stops */
  onStop?: (result: TimerResult) => void;
  /** Clock for tests; defaults to Date.now */
  now?: () => number;
}

/** Formats milliseconds as H:MM:SS or M:SS. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Spoken form, e.g. "1 hour 2 minutes 5 seconds". */
export function spokenDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const parts: string[] = [];
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) parts.push(`${h} hour${h === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} minute${m === 1 ? "" : "s"}`);
  if (s || parts.length === 0) parts.push(`${s} second${s === 1 ? "" : "s"}`);
  return parts.join(" ");
}

/**
 * Timer
 * Shows elapsed time while running. The ticking clock is hidden from screen
 * readers (it would be announced every second); starting and stopping are
 * announced once through a status region instead.
 *
 * @example
 * ```tsx
 * <Timer label="Scene 12, take 3" onStop={(r) => saveTake(r)} />
 * ```
 */
export const Timer = React.forwardRef<HTMLDivElement, TimerProps>(
  ({ label, onStart, onStop, now = Date.now, style, ...props }, ref) => {
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [message, setMessage] = useState("");
    const tick = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(
      () => () => {
        if (tick.current) clearInterval(tick.current);
      },
      []
    );

    const start = () => {
      const t = now();
      setStartedAt(t);
      setElapsed(0);
      setMessage(`${label} started`);
      tick.current = setInterval(() => setElapsed(now() - t), 1000);
      onStart?.(new Date(t));
    };

    const stop = () => {
      if (startedAt === null) return;
      if (tick.current) clearInterval(tick.current);
      tick.current = null;
      const end = now();
      const durationMs = end - startedAt;
      setElapsed(durationMs);
      setStartedAt(null);
      setMessage(`${label} stopped after ${spokenDuration(durationMs)}`);
      onStop?.({ startedAt: new Date(startedAt), endedAt: new Date(end), durationMs });
    };

    const running = startedAt !== null;
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        style={{ display: "inline-flex", alignItems: "center", gap: spacingTokens.md, ...style }}
        {...props}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: typographyTokens.fontFamily.mono,
            fontSize: typographyTokens.fontSize["3xl"],
            fontVariantNumeric: "tabular-nums",
            color: running ? colorTokens.text.primary : colorTokens.text.secondary,
            minWidth: "5ch",
          }}
        >
          {formatDuration(elapsed)}
        </span>
        {running ? (
          <Button variant="danger" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button onClick={start}>Start</Button>
        )}
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
          {message}
        </span>
      </div>
    );
  }
);

Timer.displayName = "Timer";
