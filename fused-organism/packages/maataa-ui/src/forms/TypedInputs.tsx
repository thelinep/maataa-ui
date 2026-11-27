/**
 * @maataa/ui/forms/TypedInputs
 * URL, phone and percentage inputs with the right keyboard, autocomplete and
 * validation in words
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { colorTokens, spacingTokens } from "../tokens";
import { FieldFrame, controlStyle } from "./fieldKit";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

type BaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  label: string;
  hint?: React.ReactNode;
  /** An error from the form; shown instead of the built-in check */
  error?: string;
};

/** Returns an error message, or null when the URL is acceptable */
export function validateUrl(value: string, schemes: string[] = ["https", "http"]): string | null {
  if (!value.trim()) return null;
  let u: URL;
  try {
    u = new URL(value.trim());
  } catch {
    return "Enter a full web address, starting with https://";
  }
  const scheme = u.protocol.replace(":", "");
  if (!schemes.includes(scheme)) {
    return `Addresses must start with ${schemes.map((s) => `${s}://`).join(" or ")}`;
  }
  if (!u.hostname.includes(".") && u.hostname !== "localhost") {
    return "That address has no domain, like example.com";
  }
  return null;
}

export interface UrlInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  /** Allowed schemes @default ['https','http'] */
  schemes?: string[];
}

/**
 * UrlInput
 * Checks the scheme when the field loses focus, not on every keystroke.
 */
export function UrlInput({
  label,
  hint,
  error,
  value,
  onChange,
  schemes,
  id,
  ...props
}: UrlInputProps) {
  const [touched, setTouched] = useState(false);
  const own = touched ? validateUrl(value, schemes) : null;
  const msg = error ?? own ?? undefined;
  return (
    <FieldFrame label={label} hint={hint} error={msg} id={id}>
      {(ids) => (
        <input
          id={ids.id}
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          autoCapitalize="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            setTouched(true);
            props.onBlur?.(e);
          }}
          aria-invalid={msg ? true : undefined}
          aria-describedby={ids.describedBy}
          style={controlStyle(!!msg)}
          {...props}
        />
      )}
    </FieldFrame>
  );
}

export interface DialCode {
  code: string;
  country: string;
}

export const commonDialCodes: DialCode[] = [
  { code: "+91", country: "India" },
  { code: "+1", country: "United States / Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+61", country: "Australia" },
  { code: "+65", country: "Singapore" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
];

/** Keeps digits only; strips a leading 0 trunk prefix */
export function normalizeTel(national: string): string {
  return national.replace(/\D/g, "").replace(/^0+/, "");
}

export interface TelValue {
  dialCode: string;
  number: string;
}

export interface TelInputProps extends Omit<BaseProps, "defaultValue"> {
  value: TelValue;
  onChange: (value: TelValue) => void;
  dialCodes?: DialCode[];
  /** Digits expected after the dial code (for a length check) */
  expectedDigits?: number;
}

/**
 * TelInput
 * Country code and number as two labelled controls in one group, so each is
 * announced on its own. Output: E.164 via `${dialCode}${normalizeTel(number)}`.
 */
export function TelInput({
  label,
  hint,
  error,
  value,
  onChange,
  dialCodes = commonDialCodes,
  expectedDigits,
  id,
  ...props
}: TelInputProps) {
  const t = useT();
  const [touched, setTouched] = useState(false);
  const digits = normalizeTel(value.number);
  const own =
    touched && expectedDigits && digits.length > 0 && digits.length !== expectedDigits
      ? `Enter ${expectedDigits} digits after ${value.dialCode} (you have ${digits.length})`
      : null;
  const msg = error ?? own ?? undefined;
  return (
    <FieldFrame label={label} hint={hint} error={msg} id={id} group>
      {(ids) => (
        <div style={{ display: "flex", gap: spacingTokens.xs }}>
          <select
            aria-label={t("Country code")}
            value={value.dialCode}
            onChange={(e) => onChange({ ...value, dialCode: e.target.value })}
            autoComplete="tel-country-code"
            style={{ ...controlStyle(false), accentColor: colorTokens.interactive.primary }}
          >
            {dialCodes.map((d) => (
              <option key={d.code + d.country} value={d.code}>
                {d.country} ({d.code})
              </option>
            ))}
          </select>
          <input
            id={ids.id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            aria-label={t("Phone number")}
            value={value.number}
            onChange={(e) => onChange({ ...value, number: e.target.value })}
            onBlur={() => setTouched(true)}
            aria-invalid={msg ? true : undefined}
            aria-describedby={ids.describedBy}
            style={{ ...controlStyle(!!msg), flex: 1, minWidth: 0 }}
            {...props}
          />
        </div>
      )}
    </FieldFrame>
  );
}

export interface PercentageInputProps extends BaseProps {
  /** Value as a percentage number (12.5 means 12.5%), or null when empty */
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Decimal places allowed @default 2 */
  decimals?: number;
}

/**
 * PercentageInput
 * A text field with a visible "%" suffix that is part of the label's
 * description, so it is read as "percent".
 */
export function PercentageInput({
  label,
  hint,
  error,
  value,
  onChange,
  min = 0,
  max = 100,
  decimals = 2,
  id,
  ...props
}: PercentageInputProps) {
  const [text, setText] = useState(value == null ? "" : String(value));
  const [own, setOwn] = useState<string | null>(null);
  const msg = error ?? own ?? undefined;
  const commit = (t: string) => {
    const s = t.replace(/%/g, "").replace(/,/g, ".").trim();
    if (s === "") {
      setOwn(null);
      onChange(null);
      return;
    }
    const n = Number(s);
    if (!Number.isFinite(n)) {
      setOwn("Enter a number, like 12.5");
      return;
    }
    if (n < min || n > max) {
      setOwn(`Enter a percentage from ${min} to ${max}`);
      return;
    }
    const f = 10 ** decimals;
    const rounded = Math.round(n * f) / f;
    setOwn(null);
    setText(String(rounded));
    onChange(rounded);
  };
  return (
    <FieldFrame label={label} hint={hint} error={msg} id={id}>
      {(ids) => (
        <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.xs }}>
          <input
            id={ids.id}
            type="text"
            inputMode="decimal"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            aria-invalid={msg ? true : undefined}
            aria-describedby={[ids.describedBy, `${ids.id}-unit`].filter(Boolean).join(" ")}
            style={{ ...controlStyle(!!msg), width: "8em" }}
            {...props}
          />
          <span id={`${ids.id}-unit`} style={{ color: colorTokens.text.secondary }}>
            <span aria-hidden="true">%</span>
            <VisuallyHidden>percent</VisuallyHidden>
          </span>
        </div>
      )}
    </FieldFrame>
  );
}
