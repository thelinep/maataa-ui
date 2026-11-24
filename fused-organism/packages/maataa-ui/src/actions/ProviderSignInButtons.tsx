/**
 * @maataa/ui/actions/ProviderSignInButtons
 * "Continue with Google" style buttons
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface SignInProvider {
  id: string;
  /** e.g. "Google" */
  name: string;
  /** Provider mark; decorative */
  icon?: React.ReactNode;
}

export interface ProviderSignInButtonsProps {
  providers: SignInProvider[];
  onSelect: (providerId: string) => void;
  /** Provider being redirected to; its button shows progress */
  pendingId?: string;
  /** @default 'Continue with' */
  verb?: string;
}

/**
 * ProviderSignInButtons
 * Full-width buttons, each named with the verb and provider. While one is
 * redirecting, all are disabled and it reads "Opening Google…".
 *
 * @example
 * ```tsx
 * <ProviderSignInButtons providers={[{ id: "google", name: "Google" }]} onSelect={signInWith} />
 * ```
 */
export function ProviderSignInButtons({
  providers,
  onSelect,
  pendingId,
  verb = "Continue with",
}: ProviderSignInButtonsProps) {
  const t = useT();
  return (
    <div
      role="group"
      aria-label={t("Sign in with another account")}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          disabled={pendingId !== undefined}
          aria-busy={pendingId === p.id || undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: spacingTokens.sm,
            minHeight: 44,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 6,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            fontWeight: 600,
            cursor: pendingId ? "wait" : "pointer",
            opacity: pendingId && pendingId !== p.id ? 0.6 : 1,
          }}
        >
          {p.icon && (
            <span aria-hidden="true" style={{ display: "inline-flex" }}>
              {p.icon}
            </span>
          )}
          {pendingId === p.id ? t("Opening {name}…", { name: p.name }) : `${verb} ${p.name}`}
        </button>
      ))}
    </div>
  );
}

ProviderSignInButtons.displayName = "ProviderSignInButtons";
