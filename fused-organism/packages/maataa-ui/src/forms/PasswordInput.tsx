/**
 * @maataa/ui/forms/PasswordInput
 * Password field with Show/Hide and optional rules checklist
 */

import React, { useId, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

/** Sensible defaults: length over complexity (NIST 800-63B) */
export const defaultPasswordRules: PasswordRule[] = [
  { label: "At least 12 characters", test: (v) => v.length >= 12 },
  { label: "Not only numbers", test: (v) => v.length > 0 && !/^\d+$/.test(v) },
];

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Show these rules live under the field (new passwords) */
  rules?: PasswordRule[];
  /** "current-password" or "new-password" @default 'current-password' */
  autoComplete?: string;
}

/**
 * PasswordInput
 * The button is named "Show password" / "Hide password" and keeps focus. Rules
 * say "met" / "not met" in words.
 *
 * @example
 * ```tsx
 * <PasswordInput label="New password" value={pw} onChange={setPw} rules={defaultPasswordRules} autoComplete="new-password" />
 * ```
 */
export function PasswordInput({
  label,
  value,
  onChange,
  error,
  rules,
  autoComplete = "current-password",
  id: idProp,
  ...props
}: PasswordInputProps) {
  const gen = useId();
  const id = idProp ?? gen;
  const [shown, setShown] = useState(false);
  const describedBy =
    [error ? `${id}-error` : null, rules ? `${id}-rules` : null].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <label
        htmlFor={id}
        style={{
          fontWeight: 500,
          color: error ? colorTokens.interactive.error : colorTokens.text.primary,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: spacingTokens.xs }}>
        <input
          id={id}
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          style={{
            flex: 1,
            padding: "10px",
            border: `2px solid ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
            borderRadius: 6,
            font: "inherit",
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
          }}
          {...props}
        />
        <button
          type="button"
          aria-controls={id}
          onClick={() => setShown((s) => !s)}
          style={{
            minWidth: 64,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {shown ? "Hide" : "Show"}{" "}
          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            password
          </span>
        </button>
      </div>
      {error && (
        <span
          id={`${id}-error`}
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.xs }}
        >
          {error}
        </span>
      )}
      {rules && (
        <ul
          id={`${id}-rules`}
          style={{
            margin: 0,
            paddingLeft: 0,
            listStyle: "none",
            fontSize: typographyTokens.fontSize.xs,
          }}
        >
          {rules.map((r) => {
            const ok = r.test(value);
            return (
              <li
                key={r.label}
                style={{ color: ok ? colorTokens.interactive.success : colorTokens.text.secondary }}
              >
                <span aria-hidden="true">{ok ? "✓ " : "○ "}</span>
                {r.label}
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  {ok ? ", met" : ", not met"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

PasswordInput.displayName = "PasswordInput";
