/**
 * @maataa/ui/primitives/Input
 * Core input field primitive component
 */

import React, { useContext, useId, useState } from "react";
import { colorTokens, radiusTokens } from "@maataa/tokens";

/**
 * Shared by a field wrapper (e.g. @maataa/ui FieldShell) and the control
 * inside it, so the control gets the label's target id, its description /
 * error ids, and the invalid and required state without manual wiring.
 */
export interface FieldContextValue {
  /** id the wrapper's <label htmlFor> points at; the control should use it. */
  id: string;
  /**
   * id of the wrapper's visible label. Controls that a <label htmlFor> cannot
   * name (e.g. a custom listbox trigger) should use aria-labelledby with it.
   */
  labelId?: string;
  /** Space-separated ids of the wrapper's error / helper text. */
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

/** Field state from the nearest field wrapper, or null outside one. */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

const joinIds = (...ids: Array<string | undefined | false>) => ids.filter(Boolean).join(" ") || undefined;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

/**
 * Input Component
 * A text input component with optional label, error messaging, and helper text
 *
 * @example
 * ```tsx
 * <Input label="Email" type="email" placeholder="user@example.com" />
 * <Input label="Password" type="password" error="Password is required" />
 * <Input helperText="Enter a valid email address" />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      className,
      style,
      id,
      required,
      onFocus,
      onBlur,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const field = useField();
    const generatedId = useId();
    const inputId = id ?? field?.id ?? generatedId;
    const messageId = error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined;
    const invalid =
      Boolean(error) || Boolean(field?.invalid) || ariaInvalid === true || ariaInvalid === "true";
    // A wrapper's `required` is announced (aria-required) but does not turn on
    // native constraint validation, which would pre-empt the app's own
    // validation (e.g. react-hook-form + zod). Pass `required` to opt in.
    const ariaRequired = !required && field?.required ? true : undefined;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: error ? colorTokens.interactive.error : colorTokens.text.primary,
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            ref={ref}
            className={className}
            style={{
              width: "100%",
              padding: icon ? "10px 10px 10px 36px" : "10px",
              fontSize: "14px",
              border: `2px solid ${
                invalid
                  ? colorTokens.interactive.error
                  : focused
                    ? colorTokens.interactive.primary
                    : colorTokens.interactive.secondary
              }`,
              borderRadius: radiusTokens.md,
              outline: "none",
              transition: "all 0.2s ease",
              backgroundColor: colorTokens.background.primary,
              color: colorTokens.text.primary,
              boxSizing: "border-box",
              ...style,
            }}
            {...props}
            id={inputId}
            required={required}
            aria-required={ariaRequired}
            aria-invalid={invalid || undefined}
            aria-describedby={joinIds(messageId, field?.describedBy, ariaDescribedBy)}
            // After the spread so callers' handlers (e.g. react-hook-form's
            // onBlur) are chained rather than replacing the focus styling.
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />
          {icon && (
            <div
              style={{
                position: "absolute",
                left: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                color: colorTokens.interactive.primary,
              }}
            >
              {icon}
            </div>
          )}
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{ fontSize: "12px", color: colorTokens.interactive.error }}
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-help`} style={{ fontSize: "12px", color: colorTokens.text.secondary }}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
