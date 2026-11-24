/**
 * @maataa/ui/forms/OtpInput
 * One-time code entry as ONE field (not one box per digit), so paste, SMS
 * autofill and screen readers all work
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, smallButtonStyle } from "./fieldKit";

export interface OtpInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  /** Called once all digits are in */
  onComplete?: (value: string) => void;
  /** Number of characters @default 6 */
  length?: number;
  /** Allow letters as well as digits @default false */
  alphanumeric?: boolean;
  hint?: React.ReactNode;
  error?: string;
  /** Show a "Send a new code" button with this cooldown in seconds */
  onResend?: () => void;
  resendAfterSeconds?: number;
  autoFocus?: boolean;
}

/**
 * OtpInput
 * Uses autocomplete="one-time-code". Spaces and dashes in a pasted code are
 * ignored. Progress is given in words ("4 of 6 characters").
 */
export function OtpInput({
  label: labelProp,
  value,
  onChange,
  onComplete,
  length = 6,
  alphanumeric = false,
  hint,
  error,
  onResend,
  resendAfterSeconds = 30,
  autoFocus,
}: OtpInputProps) {
  const t = useT();
  const label = labelProp ?? t("Verification code");
  const [wait, setWait] = useState(onResend ? resendAfterSeconds : 0);
  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const clean = (s: string) =>
    (alphanumeric ? s.replace(/[^0-9a-z]/gi, "").toUpperCase() : s.replace(/\D/g, "")).slice(
      0,
      length
    );

  return (
    <FieldFrame
      label={label}
      hint={
        hint ??
        (alphanumeric
          ? t("Enter the {length}-character code we sent you.", { length })
          : t("Enter the {length}-digit code we sent you.", { length }))
      }
      error={error}
    >
      {(ids) => (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          <input
            id={ids.id}
            value={value}
            onChange={(e) => {
              const v = clean(e.target.value);
              onChange(v);
              if (v.length === length) onComplete?.(v);
            }}
            inputMode={alphanumeric ? "text" : "numeric"}
            autoComplete="one-time-code"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={length + 8}
            autoFocus={autoFocus}
            aria-invalid={error ? true : undefined}
            aria-describedby={[ids.describedBy, `${ids.id}-count`].filter(Boolean).join(" ")}
            style={{
              width: `${length * 1.1 + 1}em`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: typographyTokens.fontSize.xl,
              letterSpacing: "0.5em",
              padding: "8px 0.5em",
              minHeight: 52,
              border: `2px solid ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
              borderRadius: 8,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              boxSizing: "content-box",
            }}
          />
          <span
            id={`${ids.id}-count`}
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
          >
            {value.length} of {length} {alphanumeric ? "characters" : "digits"}
          </span>
          {onResend && (
            <div>
              <button
                type="button"
                disabled={wait > 0}
                onClick={() => {
                  onResend();
                  setWait(resendAfterSeconds);
                }}
                style={smallButtonStyle}
              >
                {wait > 0 ? t("Send a new code in {wait} s", { wait }) : t("Send a new code")}
              </button>
            </div>
          )}
        </div>
      )}
    </FieldFrame>
  );
}
