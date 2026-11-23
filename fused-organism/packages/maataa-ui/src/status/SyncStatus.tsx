/**
 * @maataa/ui/status/SyncStatus
 * Whether local changes have reached the server
 */

import { useLocale, useT, msg } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type SyncState = "synced" | "syncing" | "pending" | "error" | "offline";

export interface SyncStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  state: SyncState;
  lastSyncedAt?: Date;
  pendingCount?: number;
  /** Shown on error; offers "Try again" */
  onRetry?: () => void;
  /** @default 'en-IN' */
  locale?: string;
}

const copy: Record<SyncState, { text: string; color: string; mark: string }> = {
  synced: { text: msg("All changes saved"), color: colorTokens.interactive.success, mark: "✓" },
  syncing: { text: msg("Saving…"), color: colorTokens.interactive.info, mark: "↻" },
  pending: { text: msg("Waiting to save"), color: colorTokens.interactive.warning, mark: "•" },
  error: { text: msg("Couldn't save"), color: colorTokens.interactive.error, mark: "!" },
  offline: {
    text: msg("Offline, saved on this device"),
    color: colorTokens.text.secondary,
    mark: "○",
  },
};

/**
 * SyncStatus
 * Compact state for a header or footer: words plus a mark, never colour
 * alone. A status region, so changes are announced politely.
 *
 * @example
 * ```tsx
 * <SyncStatus state="error" onRetry={sync} />
 * ```
 */
export const SyncStatus = React.forwardRef<HTMLDivElement, SyncStatusProps>(
  ({ state, lastSyncedAt, pendingCount, onRetry, locale: localeProp, style, ...props }, ref) => {
    const t = useT();
    const locale = useLocale(localeProp);
    const c = copy[state];
    const when =
      state === "synced" && lastSyncedAt
        ? ` · ${lastSyncedAt.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`
        : "";
    const count = state === "pending" && pendingCount ? ` (${pendingCount})` : "";
    return (
      <div
        ref={ref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: spacingTokens.sm,
          fontSize: typographyTokens.fontSize.sm,
          ...style,
        }}
        {...props}
      >
        <span
          role="status"
          style={{ display: "inline-flex", gap: spacingTokens.xs, color: c.color, fontWeight: 600 }}
        >
          <span aria-hidden="true">{c.mark}</span>
          {t(c.text)}
          {count}
          {when}
        </span>
        {state === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: colorTokens.interactive.primary,
              textDecoration: "underline",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            {t("Try again")}
          </button>
        )}
      </div>
    );
  }
);

SyncStatus.displayName = "SyncStatus";
