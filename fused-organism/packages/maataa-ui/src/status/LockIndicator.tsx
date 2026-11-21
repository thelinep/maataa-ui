/**
 * @maataa/ui/status/LockIndicator
 * Picture lock (or script/budget lock): locked by whom, when, and unlock
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface LockIndicatorProps {
  /** e.g. "Picture" → "Picture locked" */
  subject: string;
  locked: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  /** Shown only to people allowed to unlock */
  onUnlock?: () => void;
  onLock?: () => void;
  /** @default 'en-IN' */
  locale?: string;
}

/** LockIndicator: a padlock mark plus words; lock/unlock buttons name the subject. */
export function LockIndicator({
  subject,
  locked,
  lockedBy,
  lockedAt,
  onUnlock,
  onLock,
  locale = "en-IN",
}: LockIndicatorProps) {
  const tone = locked ? colorTokens.interactive.success : colorTokens.text.secondary;
  return (
    <div
      style={{
        display: "inline-flex",
        gap: spacingTokens.sm,
        alignItems: "center",
        padding: `4px ${spacingTokens.sm}`,
        border: `1px solid ${tone}`,
        borderRadius: 999,
        background: colorTokens.background.primary,
      }}
    >
      <span aria-hidden="true">{locked ? "🔒" : "🔓"}</span>
      <span style={{ fontWeight: 600, color: tone }}>
        {subject} {locked ? "locked" : "not locked"}
      </span>
      {locked && (lockedBy || lockedAt) && (
        <span style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}>
          {lockedBy ? `by ${lockedBy}` : ""}
          {lockedAt
            ? ` · ${lockedAt.toLocaleDateString(locale, { day: "numeric", month: "short" })}`
            : ""}
        </span>
      )}
      {locked && onUnlock && (
        <button
          type="button"
          onClick={onUnlock}
          aria-label={`Unlock ${subject.toLowerCase()}`}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: colorTokens.interactive.primary,
            textDecoration: "underline",
            cursor: "pointer",
            font: "inherit",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          Unlock
        </button>
      )}
      {!locked && onLock && (
        <button
          type="button"
          onClick={onLock}
          aria-label={`Lock ${subject.toLowerCase()}`}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: colorTokens.interactive.primary,
            textDecoration: "underline",
            cursor: "pointer",
            font: "inherit",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          Lock
        </button>
      )}
    </div>
  );
}
LockIndicator.displayName = "LockIndicator";
