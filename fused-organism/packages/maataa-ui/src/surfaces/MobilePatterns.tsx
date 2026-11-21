/**
 * @maataa/ui/surfaces/MobilePatterns
 * ActionSheet, PullToRefresh, BackgroundSyncToast, PermissionPrompt and
 * BiometricUnlock
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

const big = (primary?: boolean, danger?: boolean): React.CSSProperties => ({
  width: "100%",
  minHeight: 52,
  border: 0,
  borderRadius: 12,
  background: primary ? colorTokens.interactive.primary : colorTokens.background.primary,
  color: danger
    ? colorTokens.interactive.error
    : primary
      ? colorTokens.text.inverse
      : colorTokens.text.primary,
  font: "inherit",
  fontSize: typographyTokens.fontSize.md,
  fontWeight: primary || danger ? 700 : 500,
  cursor: "pointer",
});

/* ───────────────────────── ActionSheet ───────────────────────── */

export interface SheetAction {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
}

export interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: SheetAction[];
}

/**
 * ActionSheet
 * iOS-style list of actions from the bottom with a separate Cancel. Modal
 * dialog: focus moves in, Tab is kept inside, Escape or tapping outside
 * cancels, focus returns to the opener.
 */
export function ActionSheet({ open, onClose, title, message, actions }: ActionSheetProps) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => opener.current?.focus?.();
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        background: "rgba(20,14,8,0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-t` : undefined}
        aria-label={title ? undefined : "Actions"}
        aria-describedby={message ? `${id}-m` : undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key !== "Tab" || !box.current) return;
          const f = Array.from(box.current.querySelectorAll<HTMLElement>("button"));
          if (e.shiftKey && document.activeElement === f[0]) {
            e.preventDefault();
            f[f.length - 1]?.focus();
          } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
            e.preventDefault();
            f[0]?.focus();
          }
        }}
        style={{
          width: "min(480px, 100%)",
          padding: `${spacingTokens.sm} ${spacingTokens.sm} max(${spacingTokens.sm}, env(safe-area-inset-bottom))`,
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.sm,
        }}
      >
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            background: colorTokens.background.primary,
          }}
        >
          {(title || message) && (
            <div
              style={{
                padding: "12px 16px",
                textAlign: "center",
                borderBottom: `1px solid ${colorTokens.border.secondary}`,
              }}
            >
              {title && (
                <h2
                  id={`${id}-t`}
                  style={{
                    margin: 0,
                    fontSize: typographyTokens.fontSize.sm,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {title}
                </h2>
              )}
              {message && (
                <p
                  id={`${id}-m`}
                  style={{ margin: "2px 0 0", fontSize: 12, color: colorTokens.text.secondary }}
                >
                  {message}
                </p>
              )}
            </div>
          )}
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {actions.map((a) => (
              <li key={a.id} style={{ borderBottom: `1px solid ${colorTokens.border.tertiary}` }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    a.onSelect();
                  }}
                  style={{ ...big(false, a.destructive), borderRadius: 0 }}
                >
                  {a.icon && <span aria-hidden="true">{a.icon} </span>}
                  {a.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ ...big(), fontWeight: 700, borderRadius: 14 }}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ───────────────────────── PullToRefresh ───────────────────────── */

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  /** Pull distance that triggers (px) @default 70 */
  threshold?: number;
  /** "Updated 2 min ago" etc. */
  lastUpdated?: string;
}

/**
 * PullToRefresh
 * Touch gesture at the top of a scroll area — always paired with a visible
 * Refresh button, since the gesture is invisible and pointer-dependent.
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 70,
  lastUpdated,
}: PullToRefreshProps) {
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const start = useRef<number | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const run = async () => {
    if (busy) return;
    setBusy(true);
    setMsg("Refreshing…");
    try {
      await onRefresh();
      setMsg("Up to date.");
    } catch {
      setMsg("Couldn’t refresh. Check your connection.");
    } finally {
      setBusy(false);
      setPull(0);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: colorTokens.text.secondary,
        }}
      >
        <span>{lastUpdated}</span>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          aria-busy={busy || undefined}
          style={{
            minHeight: 36,
            padding: "0 12px",
            borderRadius: 999,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            cursor: "pointer",
          }}
        >
          <span aria-hidden="true">↻ </span>
          {busy ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div
        ref={area}
        onTouchStart={(e) => {
          if ((area.current?.scrollTop ?? 0) <= 0) start.current = e.touches[0]!.clientY;
        }}
        onTouchMove={(e) => {
          if (start.current == null) return;
          setPull(Math.max(0, Math.min(120, (e.touches[0]!.clientY - start.current) * 0.5)));
        }}
        onTouchEnd={() => {
          start.current = null;
          if (pull >= threshold) void run();
          else setPull(0);
        }}
        style={{
          position: "relative",
          overflowY: "auto",
          maxHeight: 420,
          overscrollBehavior: "contain",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height: busy ? 44 : pull,
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            color: colorTokens.text.secondary,
            fontSize: 12,
            transition: start.current == null ? "height 150ms" : undefined,
          }}
        >
          {busy
            ? "Refreshing…"
            : pull >= threshold
              ? "Release to refresh"
              : pull > 0
                ? "Pull to refresh"
                : ""}
        </div>
        {children}
      </div>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── BackgroundSyncToast ───────────────────────── */

export interface BackgroundSyncToastProps {
  /** Items waiting to upload (0 hides the toast after success) */
  pending: number;
  state: "offline" | "syncing" | "synced" | "failed";
  noun?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * BackgroundSyncToast
 * Says what is waiting and why ("3 timesheets saved on this phone; they’ll
 * upload when you’re back online"). Announced politely on state change.
 */
export function BackgroundSyncToast({
  pending,
  state,
  noun = "changes",
  onRetry,
  onDismiss,
}: BackgroundSyncToastProps) {
  const text =
    state === "offline"
      ? `${pending} ${noun} saved on this device. They’ll upload when you’re back online.`
      : state === "syncing"
        ? `Uploading ${pending} ${noun}…`
        : state === "synced"
          ? `All ${noun} uploaded.`
          : `${pending} ${noun} couldn’t upload.`;
  const [bg, fg, sym] =
    state === "failed"
      ? [colorTokens.semantic.error.bg, colorTokens.semantic.error.text, "!"]
      : state === "synced"
        ? [colorTokens.semantic.success.bg, colorTokens.semantic.success.text, "✓"]
        : state === "offline"
          ? [colorTokens.semantic.warning.bg, colorTokens.semantic.warning.text, "⇣"]
          : [colorTokens.semantic.info.bg, colorTokens.semantic.info.text, "⇡"];
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        background: bg,
        color: fg,
        boxShadow: colorTokens.shadow.md,
        maxWidth: 420,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: "rgba(255,255,255,0.6)",
          fontWeight: 800,
        }}
      >
        {sym}
      </span>
      <span style={{ flex: 1, fontSize: typographyTokens.fontSize.sm, fontWeight: 600 }}>
        {text}
      </span>
      {state === "failed" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            minHeight: 36,
            padding: "0 12px",
            borderRadius: 8,
            border: 0,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      )}
      {state === "synced" && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            width: 36,
            height: 36,
            border: 0,
            background: "transparent",
            color: fg,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── PermissionPrompt ───────────────────────── */

export type PermissionKind = "camera" | "microphone" | "location" | "notifications";

const PERM: Record<PermissionKind, { icon: string; title: string }> = {
  camera: { icon: "📷", title: "Use your camera" },
  microphone: { icon: "🎙", title: "Use your microphone" },
  location: { icon: "📍", title: "Use your location" },
  notifications: { icon: "🔔", title: "Send you notifications" },
};

export interface PermissionPromptProps {
  kind: PermissionKind;
  /** Why we need it, in one sentence */
  reason: string;
  /** Called when the person agrees; trigger the browser prompt here */
  onAllow: () => void;
  onDecline: () => void;
  /** Already refused in the browser: show how to change it instead */
  blocked?: boolean;
}

/**
 * PermissionPrompt
 * Explains first, then asks (the browser prompt only appears after "Allow").
 * If already blocked, gives the steps to re-enable rather than a dead button.
 */
export function PermissionPrompt({
  kind,
  reason,
  onAllow,
  onDecline,
  blocked,
}: PermissionPromptProps) {
  const id = useId();
  const p = PERM[kind];
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
        padding: spacingTokens.lg,
        borderRadius: 16,
        border: `1px solid ${colorTokens.border.primary}`,
        background: colorTokens.background.primary,
        maxWidth: 380,
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 40 }}>
        {p.icon}
      </span>
      <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
        Allow maataa to {p.title.toLowerCase()}?
      </h2>
      <p style={{ margin: 0, color: colorTokens.text.secondary }}>{reason}</p>
      {blocked ? (
        <div
          style={{
            textAlign: "left",
            fontSize: typographyTokens.fontSize.sm,
            padding: spacingTokens.sm,
            borderRadius: 8,
            background: colorTokens.semantic.warning.bg,
            color: colorTokens.semantic.warning.text,
          }}
        >
          <strong>It’s turned off for this site.</strong> To turn it on: open the site settings (the
          icon left of the address bar), set {kind} to Allow, then reload.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <button type="button" onClick={onAllow} style={big(true)}>
            Allow
          </button>
          <button
            type="button"
            onClick={onDecline}
            style={{ ...big(), border: `1px solid ${colorTokens.border.control}` }}
          >
            Not now
          </button>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── BiometricUnlock ───────────────────────── */

export interface BiometricUnlockProps {
  /** Run WebAuthn / platform biometric check; resolve true on success */
  verify: () => Promise<boolean>;
  /** Fallback (PIN / password) */
  onUsePasscode: () => void;
  onUnlocked: () => void;
  method?: "fingerprint" | "face";
  appName?: string;
}

/**
 * BiometricUnlock
 * Lock screen with one "Unlock with fingerprint" button (never auto-
 * triggered), a passcode fallback that is always visible, and failures
 * explained with attempts left.
 */
export function BiometricUnlock({
  verify,
  onUsePasscode,
  onUnlocked,
  method = "fingerprint",
  appName = "maataa",
}: BiometricUnlockProps) {
  const [busy, setBusy] = useState(false);
  const [fails, setFails] = useState(0);
  const [msg, setMsg] = useState("");
  const max = 3;
  const word = method === "face" ? "face" : "fingerprint";
  const run = async () => {
    setBusy(true);
    setMsg(`Checking your ${word}…`);
    try {
      if (await verify()) {
        setMsg("Unlocked.");
        onUnlocked();
      } else throw new Error("no");
    } catch {
      const n = fails + 1;
      setFails(n);
      setMsg(
        n >= max
          ? `${word[0]!.toUpperCase()}${word.slice(1)} unlock is paused. Use your passcode.`
          : `Didn’t match. ${max - n} ${max - n === 1 ? "try" : "tries"} left.`
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section
      aria-label={`${appName} is locked`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacingTokens.md,
        padding: spacingTokens.xl,
        borderRadius: 20,
        background: colorTokens.background.inverse,
        color: colorTokens.text.inverse,
        maxWidth: 360,
        textAlign: "center",
      }}
    >
      <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>{appName} is locked</h2>
      <span
        aria-hidden="true"
        style={{
          width: 88,
          height: 88,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          fontSize: 44,
          border: `3px solid ${fails ? "#F5B5A6" : "#F5D547"}`,
        }}
      >
        {method === "face" ? "🙂" : "☝"}
      </span>
      <button
        type="button"
        onClick={run}
        disabled={busy || fails >= max}
        style={{
          ...big(true),
          background: "#F5D547",
          color: colorTokens.text.primary,
          opacity: fails >= max ? 0.5 : 1,
        }}
      >
        {busy ? "Checking…" : `Unlock with ${word}`}
      </button>
      <button
        type="button"
        onClick={onUsePasscode}
        style={{
          ...big(),
          background: "transparent",
          color: colorTokens.text.inverse,
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        Use passcode
      </button>
      <p
        role="status"
        style={{
          margin: 0,
          minHeight: 20,
          fontSize: typographyTokens.fontSize.sm,
          color: fails ? "#F5B5A6" : "rgba(255,255,255,0.85)",
        }}
      >
        {msg}
      </p>
    </section>
  );
}
