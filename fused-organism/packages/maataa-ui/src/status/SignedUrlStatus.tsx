/**
 * @maataa/ui/status/SignedUrlStatus
 * Whether a temporary file link is still valid, and refresh it
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useEffect, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SignedUrlStatusProps {
  expiresAt: Date;
  onRefresh: () => void;
  refreshing?: boolean;
  /** Start warning this many seconds before expiry @default 60 */
  warnSeconds?: number;
  now?: () => number;
}

/**
 * SignedUrlStatus
 * "Link valid" (minutes shown, not announced) → "Link expires soon" → "Link expired · Get a new
 * link". Updates every 15 s; only the state changes are announced.
 */
export function SignedUrlStatus({
  expiresAt,
  onRefresh,
  refreshing,
  warnSeconds = 60,
  now = Date.now,
}: SignedUrlStatusProps) {
  const t = useT();
  const left = () => Math.round((expiresAt.getTime() - now()) / 1000);
  const [s, setS] = useState(left);
  useEffect(() => {
    setS(left());
    const t = setInterval(() => setS(left()), 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);
  const state = refreshing ? "refreshing" : s <= 0 ? "expired" : s <= warnSeconds ? "soon" : "ok";
  const text = {
    refreshing: msg("Getting a new link…"),
    expired: msg("Link expired"),
    soon: msg("Link expires soon"),
    ok: msg("Link valid"),
  }[state];
  return (
    <span
      style={{
        display: "inline-flex",
        gap: spacingTokens.sm,
        alignItems: "center",
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      <span
        role="status"
        style={{
          color:
            state === "expired"
              ? colorTokens.interactive.error
              : state === "soon"
                ? colorTokens.interactive.warning
                : colorTokens.text.secondary,
          fontWeight: state === "ok" ? 400 : 600,
        }}
      >
        {text}
      </span>
      {state === "ok" && (
        <span aria-hidden="true" style={{ color: colorTokens.text.secondary }}>
          {t("for {value} min", { value: Math.ceil(s / 60) })}
        </span>
      )}
      {(state === "expired" || state === "soon") && (
        <button
          type="button"
          onClick={onRefresh}
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
          {t("Get a new link")}
        </button>
      )}
    </span>
  );
}
SignedUrlStatus.displayName = "SignedUrlStatus";
