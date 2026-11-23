/**
 * @maataa/ui/forms/TimePicker
 * A styled time-of-day input
 */

import React from "react";
import { colorTokens, radiusTokens, typographyTokens } from "../tokens";

export interface TimePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> {
  /** Time value as "HH:MM" (controlled), or empty string for no selection. */
  value: string;

  /** Called with the new "HH:MM" value. */
  onChange: (value: string) => void;

  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * TimePicker
 * A time-of-day field built on the native `<input type="time">`, styled to
 * match the rest of the form components. Used standalone, or combined with
 * `DatePicker` inside `DateTimePicker`.
 *
 * @example
 * ```tsx
 * const [time, setTime] = useState("09:00");
 * <TimePicker label="Start time" value={time} onChange={setTime} />
 * ```
 */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ value, onChange, label, error, helperText, style, ...props }, ref) => {
    // Tie the label, error and helper text to the field (WCAG 1.3.1, 4.1.2).
    const autoId = React.useId();
    const inputId = props.id ?? autoId;
    const messageId = error || helperText ? `${inputId}-message` : undefined;
    const describedBy =
      [props["aria-describedby"], messageId].filter(Boolean).join(" ") || undefined;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: typographyTokens.fontSize.md,
              fontWeight: typographyTokens.fontWeight.medium,
              color: error ? colorTokens.interactive.error : colorTokens.text.primary,
            }}
          >
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="time"
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: typographyTokens.fontSize.md,
            border: `2px solid ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
            borderRadius: radiusTokens.md,
            backgroundColor: props.disabled
              ? colorTokens.background.tertiary
              : colorTokens.background.primary,
            color: colorTokens.text.primary,
            boxSizing: "border-box",
            ...style,
          }}
        />
        {error && (
          <span
            id={messageId}
            role="alert"
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.interactive.error }}
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span
            id={messageId}
            style={{ fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";
