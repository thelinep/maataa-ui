/**
 * @maataa/ui/surfaces/UndoSnackbar
 * "Shot deleted · Undo" message that waits long enough, pauses on hover/focus,
 * and is reachable by keyboard (Alt+Z undoes from anywhere while it shows)
 */

import React, { useEffect, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface UndoSnackbarProps {
  /** What happened, e.g. "Scene 12 deleted" (null hides the bar) */
  message: string | null;
  onUndo: () => void;
  /** Called when it times out or is dismissed */
  onDismiss: () => void;
  /** Time before it goes (ms) @default 10000 (WCAG 2.2.1: long enough, pausable) */
  durationMs?: number;
  /** Keyboard shortcut for Undo @default true (Alt+Z) */
  shortcut?: boolean;
}

/**
 * UndoSnackbar
 * Announced politely when it appears. The countdown pauses while the pointer
 * is over it or focus is inside it. The Undo button says what it undoes.
 */
export function UndoSnackbar({
  message,
  onUndo,
  onDismiss,
  durationMs = 10000,
  shortcut = true,
}: UndoSnackbarProps) {
  const [left, setLeft] = useState(durationMs);
  const [paused, setPaused] = useState(false);

  useEffect(() => setLeft(durationMs), [message, durationMs]);

  useEffect(() => {
    if (!message || paused) return undefined;
    const t = setInterval(() => setLeft((l) => l - 250), 250);
    return () => clearInterval(t);
  }, [message, paused]);

  useEffect(() => {
    if (message && left <= 0) onDismiss();
  }, [left, message, onDismiss]);

  useEffect(() => {
    if (!message || !shortcut) return undefined;
    const h = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "z" || e.key === "Z" || e.code === "KeyZ")) {
        e.preventDefault();
        onUndo();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [message, shortcut, onUndo]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        zIndex: 80,
      }}
    >
      {message && (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacingTokens.md,
            minWidth: 280,
            maxWidth: "calc(100vw - 32px)",
            padding: `${spacingTokens.sm} ${spacingTokens.sm} ${spacingTokens.sm} ${spacingTokens.md}`,
            borderRadius: 10,
            background: colorTokens.background.inverse,
            color: colorTokens.text.inverse,
            boxShadow: colorTokens.shadow.xl,
          }}
        >
          <span style={{ flex: 1 }}>{message}</span>
          <button
            type="button"
            onClick={onUndo}
            aria-keyshortcuts={shortcut ? "Alt+Z" : undefined}
            style={{
              minHeight: 40,
              padding: "0 14px",
              borderRadius: 8,
              border: 0,
              background: colorTokens.semantic.warning.bg,
              color: colorTokens.text.primary,
              fontWeight: 700,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            style={{
              width: 40,
              height: 40,
              border: 0,
              borderRadius: 8,
              background: "transparent",
              color: colorTokens.text.inverse,
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
          <span
            aria-hidden="true"
            style={{
              fontSize: typographyTokens.fontSize.xs,
              opacity: 0.8,
              minWidth: 28,
              textAlign: "right",
            }}
          >
            {paused ? "⏸" : `${Math.ceil(left / 1000)}s`}
          </span>
        </div>
      )}
    </div>
  );
}
