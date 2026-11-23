/**
 * @maataa/ui/surfaces/NotificationPanel
 * Notification list with read state, type filter, mark-all-read and detail
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface NotificationItem {
  id: string;
  /** e.g. "approval", "mention", "schedule" */
  type: string;
  title: string;
  body?: string;
  at: Date;
  read: boolean;
  /** Where "Open" goes */
  href?: string;
  actor?: string;
}

export interface NotificationPanelProps {
  items: NotificationItem[];
  /** Labels for the type filter, e.g. { approval: "Approvals" } */
  typeLabels?: Record<string, string>;
  onOpen: (item: NotificationItem) => void;
  onMarkRead: (id: string, read: boolean) => void;
  onMarkAllRead: () => void;
  /** @default 'en-IN' */
  locale?: string;
  /** Heading @default 'Notifications' */
  title?: string;
}

const when = (d: Date, locale: string) =>
  d.toLocaleString(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/**
 * NotificationPanel
 * Filters are toggle buttons (aria-pressed). Each row says "Unread" in words
 * and has its own mark-read button. Use inside a Popover, Drawer or page.
 *
 * @example
 * ```tsx
 * <NotificationPanel items={items} onOpen={go} onMarkRead={mark} onMarkAllRead={markAll} />
 * ```
 */
export function NotificationPanel({
  items,
  typeLabels = {},
  onOpen,
  onMarkRead,
  onMarkAllRead,
  locale = "en-IN",
  title = "Notifications",
}: NotificationPanelProps) {
  const id = useId();
  const [filter, setFilter] = useState<string>("all");
  const types = Array.from(new Set(items.map((i) => i.type)));
  const shown =
    filter === "all"
      ? items
      : filter === "unread"
        ? items.filter((i) => !i.read)
        : items.filter((i) => i.type === filter);
  const unread = items.filter((i) => !i.read).length;
  const chip = (key: string, label: string) => (
    <button
      key={key}
      type="button"
      aria-pressed={filter === key}
      onClick={() => setFilter(key)}
      style={{
        padding: `2px ${spacingTokens.sm}`,
        minHeight: 28,
        borderRadius: 999,
        border: `1px solid ${filter === key ? colorTokens.interactive.primary : colorTokens.border.control}`,
        background:
          filter === key ? colorTokens.interactive.primary : colorTokens.background.primary,
        color: filter === key ? colorTokens.text.inverse : colorTokens.text.primary,
        cursor: "pointer",
        font: "inherit",
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      {label}
    </button>
  );
  return (
    <section
      aria-labelledby={`${id}-t`}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm, minWidth: 320 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
          {title}{" "}
          <span
            style={{
              fontWeight: 400,
              color: colorTokens.text.secondary,
              fontSize: typographyTokens.fontSize.sm,
            }}
          >
            · {unread} unread
          </span>
        </h2>
        <Button variant="tertiary" size="sm" onClick={onMarkAllRead} disabled={unread === 0}>
          Mark all read
        </Button>
      </div>
      <div
        role="group"
        aria-label="Show"
        style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap" }}
      >
        {chip("all", "All")}
        {chip("unread", "Unread")}
        {types.map((t) => chip(t, typeLabels[t] ?? t[0].toUpperCase() + t.slice(1)))}
      </div>
      {shown.length === 0 ? (
        <p style={{ color: colorTokens.text.secondary, margin: spacingTokens.sm }}>Nothing here.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((n) => (
            <li
              key={n.id}
              style={{
                display: "grid",
                gridTemplateColumns: "10px 1fr auto",
                gap: spacingTokens.sm,
                padding: spacingTokens.sm,
                borderBottom: `1px solid ${colorTokens.border.primary}`,
                background: n.read ? "transparent" : colorTokens.background.secondary,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  marginTop: 7,
                  borderRadius: "50%",
                  background: n.read ? "transparent" : colorTokens.interactive.primary,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <button
                  type="button"
                  onClick={() => onOpen(n)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                    cursor: "pointer",
                    font: "inherit",
                    fontWeight: n.read ? 400 : 700,
                    color: colorTokens.text.primary,
                  }}
                >
                  {!n.read && (
                    <span
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        overflow: "hidden",
                        clip: "rect(0 0 0 0)",
                      }}
                    >
                      Unread:
                    </span>
                  )}
                  {!n.read && " "}
                  {n.title}
                </button>
                {n.body && (
                  <div
                    style={{
                      fontSize: typographyTokens.fontSize.sm,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {n.body}
                  </div>
                )}
                <div
                  style={{
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                  }}
                >
                  {n.actor ? `${n.actor} · ` : ""}
                  <time dateTime={n.at.toISOString()}>{when(n.at, locale)}</time>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onMarkRead(n.id, !n.read)}
                // Starts with the visible text (WCAG 2.5.3), then says which notification
                aria-label={`${n.read ? "Mark unread" : "Mark read"}: ${n.title}`}
                style={{
                  alignSelf: "start",
                  background: "none",
                  border: "none",
                  color: colorTokens.interactive.primary,
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: typographyTokens.fontSize.xs,
                  textDecoration: "underline",
                }}
              >
                {n.read ? "Mark unread" : "Mark read"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

NotificationPanel.displayName = "NotificationPanel";

export interface NotificationDetailProps {
  item: NotificationItem;
  onBack: () => void;
  /** Primary action, e.g. "Review budget" */
  actionLabel?: string;
  onAction?: () => void;
  /** @default 'en-IN' */
  locale?: string;
}

/** One notification in full, with Back and its action. */
export function NotificationDetail({
  item,
  onBack,
  actionLabel,
  onAction,
  locale = "en-IN",
}: NotificationDetailProps) {
  return (
    <article
      aria-label={item.title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div>
        <Button variant="tertiary" size="sm" onClick={onBack}>
          ← All notifications
        </Button>
      </div>
      <h2 style={{ margin: 0, fontSize: typographyTokens.fontSize.xl }}>{item.title}</h2>
      <div style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {item.actor ? `${item.actor} · ` : ""}
        <time dateTime={item.at.toISOString()}>{when(item.at, locale)}</time>
      </div>
      {item.body && <p style={{ margin: 0 }}>{item.body}</p>}
      {actionLabel && onAction && (
        <div>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </article>
  );
}

NotificationDetail.displayName = "NotificationDetail";
