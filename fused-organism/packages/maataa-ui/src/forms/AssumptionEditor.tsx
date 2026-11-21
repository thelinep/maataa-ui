/**
 * @maataa/ui/forms/AssumptionEditor
 * Edit the assumptions behind a revenue or budget scenario
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Assumption {
  id: string;
  label: string;
  value: number;
  /** e.g. "%", "₹", "screens", "weeks" */
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  /** Where the number comes from */
  source?: string;
  /** Low-confidence assumptions are flagged */
  confidence?: "low" | "medium" | "high";
}

export interface AssumptionEditorProps {
  title: string;
  assumptions: Assumption[];
  onChange: (id: string, value: number) => void;
}

/**
 * AssumptionEditor
 * Each assumption is a number field with its unit in the label ("Screens
 * in week 1 (screens)"), its range as a hint, and its source. Out-of-range
 * values are flagged, not silently clamped.
 */
export function AssumptionEditor({ title, assumptions, onChange }: AssumptionEditorProps) {
  return (
    <fieldset
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.sm,
      }}
    >
      <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>{title}</legend>
      {assumptions.map((a) => {
        const out =
          (a.min !== undefined && a.value < a.min) || (a.max !== undefined && a.value > a.max);
        const hintId = `as-${a.id}-hint`;
        return (
          <div
            key={a.id}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(160px, 1fr) 140px",
              gap: spacingTokens.sm,
              alignItems: "center",
            }}
          >
            <label htmlFor={`as-${a.id}`} style={{ fontSize: typographyTokens.fontSize.sm }}>
              <span style={{ fontWeight: 600 }}>{a.label}</span> ({a.unit})
              {a.confidence === "low" && " "}
              {a.confidence === "low" && (
                <span style={{ color: colorTokens.interactive.warning, fontWeight: 600 }}>
                  · low confidence
                </span>
              )}
              <span
                id={hintId}
                style={{
                  display: "block",
                  fontSize: typographyTokens.fontSize.xs,
                  color: out ? colorTokens.interactive.error : colorTokens.text.secondary,
                }}
              >
                {a.min !== undefined && a.max !== undefined ? `Usually ${a.min}–${a.max}` : ""}
                {out ? " · outside the usual range" : ""}
                {a.source ? `${a.min !== undefined ? " · " : ""}Source: ${a.source}` : ""}
              </span>
            </label>
            <input
              id={`as-${a.id}`}
              type="number"
              inputMode="decimal"
              value={a.value}
              step={a.step ?? "any"}
              aria-describedby={hintId}
              aria-invalid={out || undefined}
              onChange={(e) => onChange(a.id, Number(e.target.value))}
              style={{
                padding: 6,
                border: `2px solid ${out ? colorTokens.interactive.error : colorTokens.border.control}`,
                borderRadius: 6,
                font: "inherit",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
                background: colorTokens.background.primary,
              }}
            />
          </div>
        );
      })}
    </fieldset>
  );
}
AssumptionEditor.displayName = "AssumptionEditor";
