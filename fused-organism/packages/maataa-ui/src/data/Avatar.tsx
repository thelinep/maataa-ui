/**
 * @maataa/ui/data/Avatar
 * A person's picture, falling back to initials
 */

import React, { useState } from "react";
import { colorTokens, typographyTokens } from "../tokens";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type PresenceStatus = "online" | "busy" | "away" | "offline";

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The person's name: the accessible name, and the source of the initials */
  name: string;
  /** Picture URL; initials show if missing or it fails to load */
  src?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** Optional presence dot, also stated in the accessible name */
  presence?: PresenceStatus;
  /**
   * Hide from screen readers when the name is already next to it
   * @default false
   */
  decorative?: boolean;
}

const px: Record<AvatarSize, number> = { sm: 24, md: 32, lg: 48, xl: 96 };

/** Up to two initials from a name: "Asha Rao" → "AR". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

// Fills from the paper palette; the dark text on each is 6:1 or more.
const fills = ["#E8D9C8", "#D9E5D2", "#D6E2EF", "#EBDDE6", "#F1E3BE", "#DCE4E2"];
const fillFor = (name: string) => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return fills[h % fills.length];
};

const presenceColor: Record<PresenceStatus, string> = {
  online: colorTokens.interactive.success,
  busy: colorTokens.interactive.error,
  away: colorTokens.interactive.warning,
  offline: colorTokens.border.control,
};

/**
 * Avatar
 * Round picture or initials. Named by the person's name (plus presence when
 * given) unless `decorative`.
 *
 * @example
 * ```tsx
 * <Avatar name="Asha Rao" src="/people/asha.jpg" presence="online" />
 * ```
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ name, src, size = "md", presence, decorative = false, style, ...props }, ref) => {
    const [failed, setFailed] = useState(false);
    const d = px[size];
    const showImage = Boolean(src) && !failed;
    const a11y = decorative
      ? { "aria-hidden": true as const }
      : { role: "img", "aria-label": presence ? `${name}, ${presence}` : name };
    return (
      <span
        ref={ref}
        {...a11y}
        style={{
          position: "relative",
          display: "inline-flex",
          flex: "0 0 auto",
          width: d,
          height: d,
          ...style,
        }}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            onError={() => setFailed(true)}
            style={{ width: d, height: d, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              width: d,
              height: d,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: fillFor(name),
              color: colorTokens.text.primary,
              fontWeight: 700,
              fontSize: Math.round(d * 0.4),
              fontFamily: typographyTokens.fontFamily.base,
            }}
          >
            {initialsOf(name)}
          </span>
        )}
        {presence && (
          <span
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: Math.max(8, d / 4),
              height: Math.max(8, d / 4),
              borderRadius: "50%",
              background: presenceColor[presence],
              border: `2px solid ${colorTokens.background.primary}`,
            }}
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = "Avatar";
