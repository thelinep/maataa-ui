/**
 * @maataa/ui/data/ShareLinkDisplay
 * A share link with copy, expiry and revoke
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { CopyButton } from "../actions/CopyButton";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ShareLinkDisplayProps {
  url: string;
  /** What the link opens, e.g. "call sheet" */
  what: string;
  expiresAt?: Date;
  /** Who can open it, e.g. "Anyone with the link" */
  audience?: string;
  onRevoke?: () => void;
  /** @default 'en-IN' */
  locale?: string;
}

/** ShareLinkDisplay: read-only field (selectable) plus Copy, with who and until when. */
export function ShareLinkDisplay({
  url,
  what,
  expiresAt,
  audience,
  onRevoke,
  locale: localeProp,
}: ShareLinkDisplayProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const id = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <label htmlFor={id} style={{ fontWeight: 500 }}>
        {t("Link to the {what}", { what })}
      </label>
      <div style={{ display: "flex", gap: spacingTokens.xs }}>
        <input
          id={id}
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          aria-describedby={`${id}-meta`}
          style={{
            flex: 1,
            minWidth: 0,
            padding: 8,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            fontFamily: typographyTokens.fontFamily.mono,
            fontSize: typographyTokens.fontSize.sm,
            background: colorTokens.background.secondary,
          }}
        />
        <CopyButton value={url} what={`${what} link`} />
      </div>
      <div
        id={`${id}-meta`}
        style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
      >
        {audience ?? "Anyone with the link can view"}
        {expiresAt
          ? ` · works until ${expiresAt.toLocaleString(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}`
          : ""}
      </div>
      {onRevoke && (
        <button
          type="button"
          onClick={onRevoke}
          style={{
            alignSelf: "flex-start",
            background: "none",
            border: "none",
            padding: 0,
            color: colorTokens.interactive.error,
            textDecoration: "underline",
            cursor: "pointer",
            font: "inherit",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {t("Turn off this link")}
        </button>
      )}
    </div>
  );
}
ShareLinkDisplay.displayName = "ShareLinkDisplay";
