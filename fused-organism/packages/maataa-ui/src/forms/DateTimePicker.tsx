/**
 * @maataa/ui/forms/DateTimePicker
 * Combines DatePicker and TimePicker into a single date+time value
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { applyTimeValue, formatTimeValue } from "./dateUtils";

export interface DateTimePickerProps {
  /** Currently selected date and time, or `null` for no selection (controlled). */
  value: Date | null;

  /** Called with the combined date+time whenever either part changes. */
  onChange: (date: Date | null) => void;

  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DateTimePicker
 * Pairs a `DatePicker` with a `TimePicker`; the time field is disabled
 * until a date is chosen, and defaults to midnight the first time a date
 * is picked.
 *
 * @example
 * ```tsx
 * const [when, setWhen] = useState<Date | null>(null);
 * <DateTimePicker label="Starts at" value={when} onChange={setWhen} />
 * ```
 */
export const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      min,
      max,
      className,
      style,
    },
    ref
  ) => {
    const handleDateChange = (date: Date | null) => {
      if (!date) {
        onChange(null);
        return;
      }
      const withTime = value ? applyTimeValue(date, formatTimeValue(value)) : date;
      onChange(withTime);
    };

    const handleTimeChange = (time: string) => {
      if (!value) return;
      onChange(applyTimeValue(value, time));
    };

    const autoId = React.useId();
    const labelId = label ? `${autoId}-label` : undefined;
    const messageId = error || helperText ? `${autoId}-message` : undefined;
    const fieldName = label ?? "Date and time";

    return (
      <div
        ref={ref}
        className={className}
        role="group"
        aria-labelledby={labelId}
        aria-label={label ? undefined : fieldName}
        aria-describedby={messageId}
        style={{ width: "100%", ...style }}
      >
        {label && (
          <span
            id={labelId}
            style={{
              display: "block",
              marginBottom: spacingTokens.xs,
              fontSize: typographyTokens.fontSize.md,
              fontWeight: typographyTokens.fontWeight.medium,
              color: error ? colorTokens.interactive.error : colorTokens.text.primary,
            }}
          >
            {label}
            {required && (
              <span
                style={{ color: colorTokens.interactive.error, marginLeft: "2px" }}
                aria-hidden="true"
              >
                *
              </span>
            )}
          </span>
        )}
        <div style={{ display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }}>
          <div style={{ flex: "2 1 200px" }}>
            <DatePicker
              value={value}
              onChange={handleDateChange}
              disabled={disabled}
              min={min}
              max={max}
              aria-label={`${fieldName}: date`}
              required={required}
            />
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <TimePicker
              value={value ? formatTimeValue(value) : ""}
              onChange={handleTimeChange}
              disabled={disabled || !value}
              aria-label={`${fieldName}: time`}
              required={required}
            />
          </div>
        </div>
        {error && (
          <span
            id={messageId}
            role="alert"
            style={{
              display: "block",
              marginTop: spacingTokens.xs,
              fontSize: typographyTokens.fontSize.xs,
              color: colorTokens.interactive.error,
            }}
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span
            id={messageId}
            style={{
              display: "block",
              marginTop: spacingTokens.xs,
              fontSize: typographyTokens.fontSize.xs,
              color: colorTokens.text.secondary,
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
