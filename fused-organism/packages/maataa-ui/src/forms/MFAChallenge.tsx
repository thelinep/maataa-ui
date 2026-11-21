/**
 * @maataa/ui/forms/MFAChallenge
 * Second step of sign-in: authenticator code or recovery code
 */

import React, { useId, useState } from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface MFAChallengeProps {
  /** Called with the code and which kind it is */
  onSubmit: (code: string, kind: "totp" | "recovery") => void;
  error?: string;
  busy?: boolean;
  /** Digits in an authenticator code @default 6 */
  length?: number;
  onCancel?: () => void;
}

/**
 * MFAChallenge
 * One input (not one box per digit) with autocomplete="one-time-code", so
 * password managers and SMS autofill work and paste is easy. Spaces are
 * ignored. "Use a recovery code" swaps the field.
 *
 * @example
 * ```tsx
 * <MFAChallenge onSubmit={(code, kind) => verify(code, kind)} error={err} />
 * ```
 */
export function MFAChallenge({ onSubmit, error, busy, length = 6, onCancel }: MFAChallengeProps) {
  const id = useId();
  const [kind, setKind] = useState<"totp" | "recovery">("totp");
  const [code, setCode] = useState("");
  const [local, setLocal] = useState<string>();
  const shown = local ?? error;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.replace(/[\s-]/g, "");
    if (kind === "totp" && !new RegExp(`^\\d{${length}}$`).test(clean))
      return setLocal(`Enter the ${length}-digit code from your authenticator app`);
    if (kind === "recovery" && clean.length < 8)
      return setLocal("Enter one of your recovery codes");
    setLocal(undefined);
    onSubmit(clean, kind);
  };
  return (
    <form
      noValidate
      onSubmit={submit}
      aria-label="Two-step verification"
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md, maxWidth: 360 }}
    >
      <p style={{ margin: 0 }}>
        {kind === "totp"
          ? "Open your authenticator app and enter the code for maataa."
          : "Enter one of the recovery codes you saved when you set up two-step verification. Each code works once."}
      </p>
      <label htmlFor={`${id}-code`} style={{ fontWeight: 500 }}>
        {kind === "totp" ? "Verification code" : "Recovery code"}
      </label>
      <input
        id={`${id}-code`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        inputMode={kind === "totp" ? "numeric" : "text"}
        autoComplete="one-time-code"
        autoCapitalize="off"
        spellCheck={false}
        aria-invalid={shown ? true : undefined}
        aria-describedby={shown ? `${id}-err` : undefined}
        style={{
          padding: "10px",
          fontFamily: typographyTokens.fontFamily.mono,
          fontSize: typographyTokens.fontSize["3xl"],
          letterSpacing: kind === "totp" ? "0.3em" : "0.05em",
          border: `2px solid ${shown ? colorTokens.interactive.error : colorTokens.border.control}`,
          borderRadius: 6,
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
        }}
      />
      {shown && (
        <span
          id={`${id}-err`}
          role="alert"
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.sm }}
        >
          {shown}
        </span>
      )}
      <Button type="submit" disabled={busy}>
        Verify
      </Button>
      <div style={{ display: "flex", gap: spacingTokens.md }}>
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => {
            setKind(kind === "totp" ? "recovery" : "totp");
            setCode("");
            setLocal(undefined);
          }}
        >
          {kind === "totp" ? "Use a recovery code instead" : "Use my authenticator app"}
        </Button>
        {onCancel && (
          <Button variant="tertiary" size="sm" onClick={onCancel}>
            Cancel sign-in
          </Button>
        )}
      </div>
    </form>
  );
}

MFAChallenge.displayName = "MFAChallenge";
