/**
 * @maataa/ui/surfaces/BrandLogo
 * maataa mark and wordmark in light, dark and mono
 */

import React from "react";
import { colorTokens, typographyTokens } from "../tokens";

export type BrandLogoVariant = "full" | "mark" | "wordmark";
export type BrandLogoTone = "default" | "inverse" | "mono";

export interface BrandLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'full' */
  variant?: BrandLogoVariant;
  /** @default 'default' */
  tone?: BrandLogoTone;
  /** Mark height in px @default 32 */
  size?: number;
  /** Accessible name @default 'maataa' */
  label?: string;
  /** Hide from assistive tech when text beside it already names the product */
  decorative?: boolean;
}

/**
 * BrandLogo
 * The mark is a film frame with a play notch; the wordmark is set in the
 * base typeface. One accessible name for the whole logo.
 *
 * @example
 * ```tsx
 * <BrandLogo variant="full" tone="inverse" />
 * ```
 */
export const BrandLogo = React.forwardRef<HTMLSpanElement, BrandLogoProps>(
  (
    {
      variant = "full",
      tone = "default",
      size = 32,
      label = "maataa",
      decorative = false,
      style,
      ...props
    },
    ref
  ) => {
    const fg =
      tone === "inverse"
        ? colorTokens.text.inverse
        : tone === "mono"
          ? colorTokens.text.primary
          : colorTokens.interactive.primary;
    const text = tone === "inverse" ? colorTokens.text.inverse : colorTokens.text.primary;
    const a11y = decorative
      ? { "aria-hidden": true as const }
      : { role: "img", "aria-label": label };
    return (
      <span
        ref={ref}
        {...a11y}
        style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3, ...style }}
        {...props}
      >
        {variant !== "wordmark" && (
          <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <rect x="2" y="5" width="28" height="22" rx="4" fill={fg} />
            {[8, 14, 20].map((y) => (
              <React.Fragment key={y}>
                <rect
                  x="4.5"
                  y={y}
                  width="2.5"
                  height="3"
                  rx="0.6"
                  fill={
                    tone === "inverse"
                      ? colorTokens.interactive.primary
                      : colorTokens.background.primary
                  }
                />
                <rect
                  x="25"
                  y={y}
                  width="2.5"
                  height="3"
                  rx="0.6"
                  fill={
                    tone === "inverse"
                      ? colorTokens.interactive.primary
                      : colorTokens.background.primary
                  }
                />
              </React.Fragment>
            ))}
            <path
              d="M13 11.5v9l7.5-4.5z"
              fill={
                tone === "inverse"
                  ? colorTokens.interactive.primary
                  : colorTokens.background.primary
              }
            />
          </svg>
        )}
        {variant !== "mark" && (
          <span
            aria-hidden="true"
            style={{
              fontFamily: typographyTokens.fontFamily.base,
              fontWeight: 700,
              fontSize: size * 0.72,
              letterSpacing: "-0.02em",
              color: text,
              lineHeight: 1,
            }}
          >
            maataa
          </span>
        )}
      </span>
    );
  }
);

BrandLogo.displayName = "BrandLogo";
