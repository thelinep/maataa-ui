/**
 * @maataa/ui/forms/ConsentToggle
 * One consent: what it allows, its state and when it was given
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ConsentToggleProps {
  /** What is being allowed, e.g. "Share my contact details with the crew" */
  label: string;
  /** Detail: who sees what and why */
  description?: string;
  granted: boolean;
  onChange: (granted: boolean) => void;
  /** Connected account the consent applies to, e.g. "Google Drive · asha@…" */
  linkedAccount?: string;
  /** When consent was last granted */
  consentedAt?: Date;
  /** @default 'en-IN' */
  locale?: string;
  /** Consent that cannot be withdrawn here (e.g. required by contract) */
  locked?: boolean;
}

/**
 * ConsentToggle
 * A `role="switch"` button named by the label and described by the detail,
 * account and date. The state is also written out ("On", "Off").
 *
 * @example
 * ```tsx
 * <ConsentToggle label="Use my photo on the call sheet" granted={ok} onChange={setOk} consentedAt={when} />
 * ```
 */
export function ConsentToggle({
  label,
  description,
  granted,
  onChange,
  linkedAccount,
  consentedAt,
  locale = "en-IN",
  locked = false,
}: ConsentToggleProps) {
  const id = useId();
  const when =
    granted && consentedAt
      ? `Given on ${consentedAt.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}`
      : granted
        ? "Given"
        : "Not given";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: spacingTokens.md,
        alignItems: "flex-start",
        padding: `${spacingTokens.sm} 0`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div id={`${id}-label`} style={{ fontWeight: 600, color: colorTokens.text.primary }}>
          {label}
        </div>
        <div
          id={`${id}-desc`}
          style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
        >
          {description && <span style={{ display: "block" }}>{description}</span>}
          {linkedAccount && <span style={{ display: "block" }}>Account: {linkedAccount}</span>}
          <span style={{ display: "block" }}>
            {when}
            {locked ? " · required, cannot be withdrawn here" : ""}
          </span>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={granted}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        disabled={locked}
        onClick={() => onChange(!granted)}
        style={{
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: spacingTokens.xs,
          minHeight: 32,
          padding: `0 ${spacingTokens.sm}`,
          border: `1px solid ${granted ? colorTokens.interactive.success : colorTokens.border.control}`,
          borderRadius: 999,
          background: granted ? colorTokens.interactive.success : colorTokens.background.primary,
          color: granted ? colorTokens.text.inverse : colorTokens.text.primary,
          cursor: locked ? "not-allowed" : "pointer",
          font: "inherit",
          fontWeight: 600,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: granted ? colorTokens.text.inverse : colorTokens.border.control,
          }}
        />
        {granted ? "On" : "Off"}
      </button>
    </div>
  );
}

ConsentToggle.displayName = "ConsentToggle";
