/**
 * @maataa/ui/forms/DurationPicker
 * Hours and minutes as one value, in minutes
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface DurationPickerProps {
  /** Field label, e.g. "Scene length" */
  label: string;
  /** Total minutes */
  value: number;
  onChange: (minutes: number) => void;
  /** Largest allowed total, in minutes @default 1440 */
  max?: number;
  /** Minute step @default 1 */
  minuteStep?: number;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** "2 h 05 min" style text for a duration in minutes */
export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")} min`;
}

/**
 * DurationPicker
 * A fieldset with labelled hour and minute number inputs. The legend is the
 * group name, so each input reads as "Scene length, Hours".
 *
 * @example
 * ```tsx
 * <DurationPicker label="Scene length" value={95} onChange={setMinutes} />
 * ```
 */
export function DurationPicker({
  label,
  value,
  onChange,
  max = 1440,
  minuteStep = 1,
  helperText,
  error,
  disabled,
  style,
}: DurationPickerProps) {
  const t = useT();
  const id = useId();
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  const set = (h: number, m: number) => {
    const total = Math.max(
      0,
      Math.min(max, (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0))
    );
    onChange(total);
  };
  const describedBy = error ? `${id}-error` : helperText ? `${id}-help` : undefined;
  const input: React.CSSProperties = {
    width: "5em",
    padding: spacingTokens.sm,
    border: `1px solid ${error ? colorTokens.interactive.error : colorTokens.border.control}`,
    borderRadius: 6,
    font: "inherit",
  };
  return (
    <fieldset
      style={{ border: "none", margin: 0, padding: 0, ...style }}
      aria-describedby={describedBy}
      disabled={disabled}
    >
      <legend
        style={{
          padding: 0,
          marginBottom: spacingTokens.xs,
          fontWeight: 500,
          color: colorTokens.text.primary,
        }}
      >
        {label}
      </legend>
      <div style={{ display: "flex", gap: spacingTokens.md, alignItems: "end" }}>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {t("Hours")}
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={Math.floor(max / 60)}
            value={hours}
            aria-invalid={error ? true : undefined}
            onChange={(e) => set(parseInt(e.target.value, 10), minutes)}
            style={input}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {t("Minutes")}
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            step={minuteStep}
            value={minutes}
            aria-invalid={error ? true : undefined}
            onChange={(e) => set(hours, Math.min(59, parseInt(e.target.value, 10)))}
            style={input}
          />
        </label>
        <output
          aria-hidden="true"
          style={{ paddingBottom: spacingTokens.sm, color: colorTokens.text.secondary }}
        >
          {formatMinutes(value)}
        </output>
      </div>
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.xs }}
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          id={`${id}-help`}
          style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}
        >
          {helperText}
        </span>
      ) : null}
    </fieldset>
  );
}

DurationPicker.displayName = "DurationPicker";
