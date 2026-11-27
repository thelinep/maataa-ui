/**
 * @maataa/ui/status/Spinner
 * Indeterminate loading indicator with an accessible name
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens } from "../tokens";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "role"> {
  /**
   * What is loading, read by screen readers
   * @default 'Loading'
   */
  label?: string;
  /** @default 'md' */
  size?: SpinnerSize;
  /**
   * Show the label next to the spinner (otherwise it is screen-reader only)
   * @default false
   */
  showLabel?: boolean;
}

const sizes: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 40 };

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Spinner
 * A rotating arc for work of unknown length. It is a polite live region
 * (role="status"), so its label is announced once when it appears. With
 * reduced motion the arc stands still.
 *
 * @example
 * ```tsx
 * <Spinner label="Loading projects" />
 * ```
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ label: labelProp, size = "md", showLabel = false, style, ...props }, ref) => {
    const t = useT();
    const label = labelProp ?? t("Loading");
    const px = sizes[size];
    const still = prefersReducedMotion();
    return (
      <span
        ref={ref}
        role="status"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, ...style }}
        {...props}
      >
        <svg width={px} height={px} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke={colorTokens.border.primary}
            strokeWidth="3"
          />
          <path
            d="M12 3a9 9 0 0 1 9 9"
            fill="none"
            stroke={colorTokens.interactive.primary}
            strokeWidth="3"
            strokeLinecap="round"
          >
            {!still && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="0.9s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </svg>
        <span style={showLabel ? { color: colorTokens.text.secondary } : hidden}>{label}</span>
      </span>
    );
  }
);

Spinner.displayName = "Spinner";
