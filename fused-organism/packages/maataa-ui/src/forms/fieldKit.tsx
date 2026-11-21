/**
 * @maataa/ui/forms/fieldKit
 * Shared label + hint + error wrapper and control styles for text-like inputs
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export const controlStyle = (invalid?: boolean): React.CSSProperties => ({
  padding: "10px",
  border: `2px solid ${invalid ? colorTokens.interactive.error : colorTokens.border.control}`,
  borderRadius: 6,
  font: "inherit",
  background: colorTokens.background.primary,
  color: colorTokens.text.primary,
  minHeight: 44,
  boxSizing: "border-box",
});

export const smallButtonStyle: React.CSSProperties = {
  minHeight: 44,
  minWidth: 44,
  padding: "0 12px",
  border: `1px solid ${colorTokens.border.control}`,
  borderRadius: 6,
  background: colorTokens.background.primary,
  color: colorTokens.text.primary,
  font: "inherit",
  cursor: "pointer",
};

export interface FieldIds {
  id: string;
  hintId?: string;
  errorId?: string;
  describedBy?: string;
}

export interface FieldFrameProps {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  id?: string;
  /** Render a fieldset/legend group instead of a label (for multi-control fields) */
  group?: boolean;
  children: (ids: FieldIds) => React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * FieldFrame
 * Gives one control (or a group) a visible label, a hint and an error, and
 * hands back the ids to wire into aria-describedby.
 */
export function FieldFrame({
  label,
  hint,
  error,
  id: idProp,
  group,
  children,
  style,
}: FieldFrameProps) {
  const gen = useId();
  const id = idProp ?? gen;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const labelStyle: React.CSSProperties = {
    fontWeight: 500,
    color: error ? colorTokens.interactive.error : colorTokens.text.primary,
    padding: 0,
  };
  const body = (
    <>
      {hint && (
        <span
          id={hintId}
          style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}
        >
          {hint}
        </span>
      )}
      {children({ id, hintId, errorId, describedBy })}
      {error && (
        <span
          id={errorId}
          style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.xs }}
        >
          {error}
        </span>
      )}
    </>
  );
  const wrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: spacingTokens.xs,
    border: 0,
    margin: 0,
    padding: 0,
    minWidth: 0,
    ...style,
  };
  if (group) {
    return (
      <fieldset style={wrap}>
        <legend style={labelStyle}>{label}</legend>
        {body}
      </fieldset>
    );
  }
  return (
    <div style={wrap}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {body}
    </div>
  );
}
