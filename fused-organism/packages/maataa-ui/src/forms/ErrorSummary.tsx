/**
 * @maataa/ui/forms/ErrorSummary
 * List of form problems, each linking to its field
 */

import React, { useEffect, useRef } from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface FormError {
  /** id of the field to focus */
  fieldId: string;
  message: string;
}

export interface ErrorSummaryProps {
  errors: FormError[];
  /** @default 'There is a problem' */
  title?: string;
  /** Take focus when errors appear (after submit) @default true */
  focusOnShow?: boolean;
}

/**
 * ErrorSummary
 * Shown at the top of a form after a failed submit. It takes focus and
 * each item moves focus to its field. Renders nothing with no errors.
 *
 * @example
 * ```tsx
 * <ErrorSummary errors={[{ fieldId: "email", message: "Enter your email" }]} />
 * ```
 */
export function ErrorSummary({
  errors,
  title = "There is a problem",
  focusOnShow = true,
}: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const key = errors.map((e) => e.fieldId + e.message).join("|");
  useEffect(() => {
    if (errors.length && focusOnShow) ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  if (errors.length === 0) return null;
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      style={{
        border: `2px solid ${colorTokens.interactive.error}`,
        borderRadius: 6,
        padding: spacingTokens.md,
        color: colorTokens.text.primary,
        outline: "none",
      }}
    >
      <strong style={{ color: colorTokens.interactive.error }}>{title}</strong>
      <ul style={{ margin: `${spacingTokens.xs} 0 0`, paddingLeft: spacingTokens.lg }}>
        {errors.map((e) => (
          <li key={e.fieldId}>
            <a
              href={`#${e.fieldId}`}
              onClick={(ev) => {
                ev.preventDefault();
                document.getElementById(e.fieldId)?.focus();
              }}
              style={{ color: colorTokens.interactive.error }}
            >
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

ErrorSummary.displayName = "ErrorSummary";
