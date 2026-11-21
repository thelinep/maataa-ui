/**
 * @maataa/ui/navigation/UserChip
 * The signed-in person in a top bar, opening their account menu
 */

import React from "react";
import { Avatar } from "../data/Avatar";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface UserChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  /** e.g. "Producer" or an organisation */
  subtitle?: string;
  avatarSrc?: string;
  /** Set when it opens a menu; mirrors the menu's state */
  expanded?: boolean;
}

/**
 * UserChip
 * A button with avatar, name and role. Named "Account: <name>" so its purpose
 * is clear; pass `expanded` when it controls a menu.
 *
 * @example
 * ```tsx
 * <UserChip name="Hemant" subtitle="Producer" onClick={openMenu} expanded={open} />
 * ```
 */
export const UserChip = React.forwardRef<HTMLButtonElement, UserChipProps>(
  ({ name, subtitle, avatarSrc, expanded, style, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={`Account: ${name}`}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      aria-expanded={expanded}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacingTokens.sm,
        minHeight: 40,
        padding: `${spacingTokens.xs} ${spacingTokens.sm}`,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 999,
        background: colorTokens.background.primary,
        color: colorTokens.text.primary,
        cursor: "pointer",
        font: "inherit",
        ...style,
      }}
      {...props}
    >
      <Avatar name={name} src={avatarSrc} size="sm" decorative />
      <span
        style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.2 }}
      >
        <span style={{ fontWeight: 600 }}>{name}</span>
        {subtitle && (
          <span
            style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </button>
  )
);

UserChip.displayName = "UserChip";
