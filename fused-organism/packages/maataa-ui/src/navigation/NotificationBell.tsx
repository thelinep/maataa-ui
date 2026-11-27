/**
 * @maataa/ui/navigation/NotificationBell
 * Top-bar button with the unread count
 */

import React from "react";
import { useT } from "../i18n/LocaleProvider";
import { colorTokens } from "../tokens";

export interface NotificationBellProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  unread: number;
  /** Whether its panel is open */
  expanded?: boolean;
}

/**
 * NotificationBell
 * Named "Notifications, 3 unread"; the visual badge is hidden from assistive
 * tech so the count isn't read twice. Shows 99+ past 99.
 *
 * @example
 * ```tsx
 * <NotificationBell unread={3} expanded={open} onClick={() => setOpen(!open)} />
 * ```
 */
export const NotificationBell = React.forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ unread, expanded, style, ...props }, ref) => {
    const t = useT();
    return (
      <button
        ref={ref}
        type="button"
        // The name includes the badge text as shown ("99+"), per WCAG 2.5.3
        aria-label={
          unread > 0
            ? t("Notifications, {count} unread", { count: unread > 99 ? "99+" : unread })
            : t("Notifications")
        }
        aria-haspopup="dialog"
        aria-expanded={expanded}
        style={{
          position: "relative",
          width: 40,
          height: 40,
          display: "inline-grid",
          placeItems: "center",
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: "50%",
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
          cursor: "pointer",
          ...style,
        }}
        {...props}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unread > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              padding: "0 5px",
              borderRadius: 10,
              background: colorTokens.interactive.error,
              color: colorTokens.text.inverse,
              fontSize: 11,
              fontWeight: 700,
              display: "grid",
              placeItems: "center",
              boxSizing: "border-box",
            }}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    );
  }
);

NotificationBell.displayName = "NotificationBell";
