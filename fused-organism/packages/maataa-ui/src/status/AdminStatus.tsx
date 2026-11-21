/**
 * @maataa/ui/status/AdminStatus
 * Last-owner warning, screen-reader mode indicator, sync ops dashboard
 */

import React from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

/* ---------- Last owner ---------- */

export interface LastOwnerWarningProps {
  /** e.g. "Monsoon Diaries" or the organisation */
  workspace: string;
  /** The action being blocked, e.g. "leave", "change your role" */
  action: string;
  onAddOwner?: () => void;
}

/** LastOwnerWarning: explains why the action is blocked and how to unblock it. */
export function LastOwnerWarning({ workspace, action, onAddOwner }: LastOwnerWarningProps) {
  return (
    <div
      role="alert"
      style={{
        border: `1px solid ${colorTokens.interactive.warning}`,
        borderLeft: `6px solid ${colorTokens.interactive.warning}`,
        borderRadius: 6,
        padding: spacingTokens.sm,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.xs,
      }}
    >
      <strong>You’re the only owner of {workspace}</strong>
      <span>
        You can’t {action} until someone else is an owner, otherwise nobody could manage billing,
        members or deletion.
      </span>
      {onAddOwner && (
        <div>
          <Button variant="secondary" size="sm" onClick={onAddOwner}>
            Make someone an owner
          </Button>
        </div>
      )}
    </div>
  );
}
LastOwnerWarning.displayName = "LastOwnerWarning";

/* ---------- Screen reader mode ---------- */

export interface ScreenReaderModeIndicatorProps {
  on: boolean;
  onToggle?: (on: boolean) => void;
}

/**
 * ScreenReaderModeIndicator
 * Shows when the app's screen-reader mode (fewer animations, more
 * announcements, simplified layouts) is on, as a switch with its state.
 */
export function ScreenReaderModeIndicator({ on, onToggle }: ScreenReaderModeIndicatorProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: spacingTokens.sm,
        alignItems: "center",
        padding: `4px ${spacingTokens.sm}`,
        border: `1px solid ${on ? colorTokens.interactive.info : colorTokens.border.control}`,
        borderRadius: 999,
        background: colorTokens.background.primary,
      }}
    >
      <span aria-hidden="true">🔊</span>
      {onToggle ? (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => onToggle(!on)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            cursor: "pointer",
            color: colorTokens.text.primary,
          }}
        >
          Screen reader mode: <strong>{on ? "On" : "Off"}</strong>
        </button>
      ) : (
        <span role="status">
          Screen reader mode: <strong>{on ? "On" : "Off"}</strong>
        </span>
      )}
    </div>
  );
}
ScreenReaderModeIndicator.displayName = "ScreenReaderModeIndicator";

/* ---------- Sync ops ---------- */

export interface SyncDevice {
  id: string;
  /** e.g. "Hemant's MacBook" */
  name: string;
  lastSync?: Date;
  pending: number;
  failed: number;
  online: boolean;
}

export interface SyncOpsDashboardProps {
  devices: SyncDevice[];
  conflicts: number;
  onRetryFailed?: (deviceId: string) => void;
  onOpenConflicts?: () => void;
  /** @default 'en-IN' */
  locale?: string;
  now?: Date;
}

/**
 * SyncOpsDashboard
 * Admin view of offline-first sync: totals as a definition list, then one
 * row per device with pending and failed counts in words.
 */
export function SyncOpsDashboard({
  devices,
  conflicts,
  onRetryFailed,
  onOpenConflicts,
  locale = "en-IN",
  now = new Date(),
}: SyncOpsDashboardProps) {
  const pending = devices.reduce((n, d) => n + d.pending, 0);
  const failed = devices.reduce((n, d) => n + d.failed, 0);
  const ago = (d?: Date) => {
    if (!d) return "never";
    const m = Math.round((now.getTime() - d.getTime()) / 60000);
    return m < 1
      ? "just now"
      : m < 60
        ? `${m} min ago`
        : m < 1440
          ? `${Math.round(m / 60)} h ago`
          : d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  };
  const stat = (label: string, value: number, bad?: boolean) => (
    <div
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.sm,
        minWidth: 120,
      }}
    >
      <dt style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}>
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 700,
          color: bad && value ? colorTokens.interactive.error : colorTokens.text.primary,
        }}
      >
        {value}
      </dd>
    </div>
  );
  return (
    <section
      aria-label="Sync status"
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      <dl style={{ display: "flex", gap: spacingTokens.sm, flexWrap: "wrap", margin: 0 }}>
        {stat("Devices", devices.length)}
        {stat("Online now", devices.filter((d) => d.online).length)}
        {stat("Changes waiting", pending)}
        {stat("Failed", failed, true)}
        {stat("Conflicts", conflicts, true)}
      </dl>
      {conflicts > 0 && onOpenConflicts && (
        <div>
          <Button variant="secondary" onClick={onOpenConflicts}>
            Resolve {conflicts} conflict{conflicts === 1 ? "" : "s"}
          </Button>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          Devices
        </caption>
        <thead>
          <tr
            style={{
              textAlign: "left",
              fontSize: typographyTokens.fontSize.sm,
              color: colorTokens.text.secondary,
            }}
          >
            <th scope="col">Device</th>
            <th scope="col">Last sync</th>
            <th scope="col">Waiting</th>
            <th scope="col">Failed</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id} style={{ fontSize: typographyTokens.fontSize.sm }}>
              <th
                scope="row"
                style={{
                  textAlign: "left",
                  padding: "4px 0",
                  borderBottom: `1px solid ${colorTokens.border.primary}`,
                }}
              >
                {d.name}
                <span
                  style={{
                    display: "block",
                    fontWeight: 400,
                    fontSize: typographyTokens.fontSize.xs,
                    color: d.online ? colorTokens.interactive.success : colorTokens.text.secondary,
                  }}
                >
                  {d.online ? "● Online" : "○ Offline"}
                </span>
              </th>
              <td style={{ borderBottom: `1px solid ${colorTokens.border.primary}` }}>
                {ago(d.lastSync)}
              </td>
              <td style={{ borderBottom: `1px solid ${colorTokens.border.primary}` }}>
                {d.pending}
              </td>
              <td
                style={{
                  borderBottom: `1px solid ${colorTokens.border.primary}`,
                  color: d.failed ? colorTokens.interactive.error : undefined,
                  fontWeight: d.failed ? 700 : 400,
                }}
              >
                {d.failed}
                {d.failed > 0 && onRetryFailed && (
                  <button
                    type="button"
                    onClick={() => onRetryFailed(d.id)}
                    aria-label={`Retry failed changes on ${d.name}`}
                    style={{
                      marginLeft: 8,
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: colorTokens.interactive.primary,
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                      fontWeight: 400,
                    }}
                  >
                    Retry
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
SyncOpsDashboard.displayName = "SyncOpsDashboard";
