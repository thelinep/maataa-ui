/**
 * @maataa/ui/forms/SelectionControls
 * CascadingSelect, FilterPills, SegmentedControl and NumberStepper
 */

import React, { useId, useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle, smallButtonStyle } from "./fieldKit";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

/* ───────────────────────── CascadingSelect ───────────────────────── */

export interface CascadeOption {
  value: string;
  label: string;
  children?: CascadeOption[];
}

export interface CascadingSelectProps {
  legend: string;
  /** Label for each level, e.g. ["Department", "Role", "Grade"] */
  levels: string[];
  options: CascadeOption[];
  /** Selected value per level */
  value: string[];
  onChange: (value: string[]) => void;
  hint?: React.ReactNode;
  error?: string;
}

/**
 * CascadingSelect
 * One native select per level. Choosing a level clears the ones after it and
 * enables the next; a disabled level says what to choose first.
 */
export function CascadingSelect({
  legend,
  levels,
  options,
  value,
  onChange,
  hint,
  error,
}: CascadingSelectProps) {
  let opts: CascadeOption[] | undefined = options;
  return (
    <FieldFrame label={legend} hint={hint} error={error} group>
      {(ids) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.sm }}>
          {levels.map((lvl, n) => {
            const here = opts ?? [];
            const sel = value[n] ?? "";
            const chosen = here.find((o) => o.value === sel);
            opts = chosen?.children;
            const disabled = here.length === 0;
            return (
              <label
                key={lvl}
                style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 160 }}
              >
                {lvl}
                <select
                  id={n === 0 ? ids.id : undefined}
                  value={sel}
                  disabled={disabled}
                  aria-describedby={n === 0 ? ids.describedBy : undefined}
                  onChange={(e) => onChange([...value.slice(0, n), e.target.value].filter(Boolean))}
                  style={{ ...controlStyle(!!error), accentColor: colorTokens.interactive.primary }}
                >
                  <option value="">
                    {disabled
                      ? `Choose ${levels[n - 1]?.toLowerCase()} first`
                      : `Choose ${lvl.toLowerCase()}`}
                  </option>
                  {here.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      )}
    </FieldFrame>
  );
}

/* ───────────────────────── FilterPills ───────────────────────── */

export interface FilterPill {
  value: string;
  label: string;
  count?: number;
}

export interface FilterPillsProps {
  label: string;
  pills: FilterPill[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Only one pill on at a time (radio behaviour) @default false */
  single?: boolean;
  /** Show a "Clear" button when any pill is on @default true */
  clearable?: boolean;
}

/**
 * FilterPills
 * Toggle buttons (aria-pressed) in a labelled group. Counts are part of each
 * button's name ("Night, 4 results").
 */
export function FilterPills({
  label,
  pills,
  value,
  onChange,
  single,
  clearable = true,
}: FilterPillsProps) {
  const toggle = (v: string) => {
    if (single) onChange(value[0] === v ? [] : [v]);
    else onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };
  return (
    <div
      role="group"
      aria-label={label}
      style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.xs, alignItems: "center" }}
    >
      {pills.map((p) => {
        const on = value.includes(p.value);
        return (
          <button
            key={p.value}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(p.value)}
            style={{
              minHeight: 36,
              padding: "0 14px",
              borderRadius: 999,
              border: `1px solid ${on ? colorTokens.interactive.primary : colorTokens.border.control}`,
              background: on ? colorTokens.interactive.primary : colorTokens.background.primary,
              color: on ? colorTokens.text.inverse : colorTokens.text.primary,
              font: "inherit",
              fontSize: typographyTokens.fontSize.sm,
              cursor: "pointer",
            }}
          >
            {on && <span aria-hidden="true">✓ </span>}
            {p.label}
            {p.count != null && (
              <>
                <span aria-hidden="true">{` (${p.count})`}</span>
                <VisuallyHidden>
                  , {p.count} {p.count === 1 ? "result" : "results"}
                </VisuallyHidden>
              </>
            )}
          </button>
        );
      })}
      {clearable && value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          style={{
            ...smallButtonStyle,
            minHeight: 36,
            border: 0,
            textDecoration: "underline",
            background: "transparent",
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── SegmentedControl ───────────────────────── */

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  label: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  /** Hide the visible label (still named) @default false */
  hideLabel?: boolean;
  size?: "sm" | "md";
}

/**
 * SegmentedControl
 * A radio group drawn as joined buttons: one tab stop, arrow keys move and
 * select (APG radio group).
 */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  hideLabel,
  size = "md",
}: SegmentedControlProps) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const go = (n: number) => {
    const k = (n + options.length) % options.length;
    onChange(options[k]!.value);
    refs.current[k]?.focus();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <span
        id={`${id}-l`}
        style={
          hideLabel
            ? {
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
              }
            : { fontWeight: 500 }
        }
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-l`}
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: 3,
          gap: 2,
          borderRadius: 10,
          background: colorTokens.background.tertiary,
          border: `1px solid ${colorTokens.border.control}`,
        }}
      >
        {options.map((o, n) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[n] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={n === idx ? 0 : -1}
              onClick={() => onChange(o.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") go(n + 1);
                else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(n - 1);
                else if (e.key === "Home") go(0);
                else if (e.key === "End") go(options.length - 1);
                else return;
                e.preventDefault();
              }}
              style={{
                minHeight: size === "sm" ? 32 : 40,
                padding: size === "sm" ? "0 10px" : "0 16px",
                border: 0,
                borderRadius: 8,
                background: on ? colorTokens.background.primary : "transparent",
                boxShadow: on ? colorTokens.shadow.sm : undefined,
                color: on ? colorTokens.text.primary : colorTokens.text.secondary,
                fontWeight: on ? 600 : 500,
                font: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {o.icon && <span aria-hidden="true">{o.icon}</span>}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── NumberStepper ───────────────────────── */

export interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Unit read after the number, e.g. "people" */
  unit?: string;
  hint?: React.ReactNode;
}

/**
 * NumberStepper
 * − / + buttons named "Decrease …"/"Increase …" around a spinbutton field.
 * Buttons disable at the limits, and the limit is said in words.
 */
export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  hint,
}: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const set = (n: number) => onChange(clamp(Math.round(n / step) * step));
  const btn = (dir: -1 | 1) => {
    const disabled = dir < 0 ? value <= min : value >= max;
    return (
      <button
        type="button"
        onClick={() => set(value + dir * step)}
        disabled={disabled}
        aria-label={`${dir < 0 ? "Decrease" : "Increase"} ${label.toLowerCase()}`}
        style={{
          ...smallButtonStyle,
          fontSize: typographyTokens.fontSize.lg,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span aria-hidden="true">{dir < 0 ? "−" : "+"}</span>
      </button>
    );
  };
  const limit = value <= min ? `Minimum is ${min}.` : value >= max ? `Maximum is ${max}.` : "";
  return (
    <FieldFrame label={label} hint={hint}>
      {(ids) => (
        <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.xs }}>
          {btn(-1)}
          <input
            id={ids.id}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            aria-valuetext={unit ? `${value} ${unit}` : undefined}
            aria-describedby={[ids.describedBy, `${ids.id}-limit`].filter(Boolean).join(" ")}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/[^\d.-]/g, ""));
              if (Number.isFinite(n)) set(n);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") set(value + step);
              else if (e.key === "ArrowDown") set(value - step);
              else if (e.key === "PageUp") set(value + step * 10);
              else if (e.key === "PageDown") set(value - step * 10);
              else if (e.key === "Home" && Number.isFinite(min)) set(min);
              else if (e.key === "End" && Number.isFinite(max)) set(max);
              else return;
              e.preventDefault();
            }}
            style={{ ...controlStyle(false), width: "5em", textAlign: "center" }}
          />
          {btn(1)}
          {unit && <span style={{ color: colorTokens.text.secondary }}>{unit}</span>}
          <VisuallyHidden id={`${ids.id}-limit`} aria-live="polite">
            {limit}
          </VisuallyHidden>
        </div>
      )}
    </FieldFrame>
  );
}
