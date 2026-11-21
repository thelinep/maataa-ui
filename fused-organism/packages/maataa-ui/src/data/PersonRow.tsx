/**
 * @maataa/ui/data/PersonRow
 * List row: avatar, name, role and a status
 */

import React from "react";
import { Avatar, type PresenceStatus } from "./Avatar";
import { Badge, type BadgeProps } from "../primitives/Badge";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PersonRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Role or second line, e.g. "Director of photography" */
  subtitle?: string;
  avatarSrc?: string;
  presence?: PresenceStatus;
  /** Status text shown as a badge, e.g. "Confirmed" */
  status?: string;
  statusVariant?: BadgeProps["variant"];
  /** Trailing content, e.g. a Remove button */
  actions?: React.ReactNode;
}

/**
 * PersonRow
 * One person in a crew, team or contact list. Use inside a <ul>/<li> or a
 * list role; the avatar is decorative because the name is beside it.
 *
 * @example
 * ```tsx
 * <PersonRow name="Asha Rao" subtitle="Editor" status="Confirmed" statusVariant="success" />
 * ```
 */
export const PersonRow = React.forwardRef<HTMLDivElement, PersonRowProps>(
  (
    {
      name,
      subtitle,
      avatarSrc,
      presence,
      status,
      statusVariant = "default",
      actions,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacingTokens.md,
        padding: `${spacingTokens.sm} 0`,
        ...style,
      }}
      {...props}
    >
      <Avatar name={name} src={avatarSrc} presence={presence} decorative />
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <span style={{ fontWeight: 600, color: colorTokens.text.primary }}>
          {name}
          {presence && (
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }}
            >
              , {presence}
            </span>
          )}
        </span>
        {subtitle && (
          <span
            style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
          >
            {subtitle}
          </span>
        )}
      </span>
      {status && <Badge variant={statusVariant}>{status}</Badge>}
      {actions}
    </div>
  )
);

PersonRow.displayName = "PersonRow";
