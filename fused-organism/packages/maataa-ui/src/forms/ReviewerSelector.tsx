/**
 * @maataa/ui/forms/ReviewerSelector
 * Pick one reviewer per role, with the usual approval rules
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ReviewerRole {
  id: string;
  /** e.g. "Line producer" */
  label: string;
  /** @default true */
  required?: boolean;
}

export interface ReviewerCandidate {
  id: string;
  name: string;
}

export type ReviewerAssignment = Record<string, string | undefined>;

export interface ReviewerSelectorProps {
  /** Group label @default 'Reviewers' */
  label?: string;
  roles: ReviewerRole[];
  people: ReviewerCandidate[];
  value: ReviewerAssignment;
  onChange: (value: ReviewerAssignment) => void;
  /** The author cannot review their own work */
  authorId?: string;
  /** Show errors (e.g. after a submit attempt) @default false */
  showErrors?: boolean;
}

/**
 * Checks an assignment. Returns errors keyed by role id: a required role with
 * nobody, the author picked, or the same person in two roles.
 */
export function validateReviewers(
  roles: ReviewerRole[],
  value: ReviewerAssignment,
  people: ReviewerCandidate[],
  authorId?: string
): Record<string, string> {
  const errors: Record<string, string> = {};
  const seen = new Map<string, string>();
  for (const role of roles) {
    const pick = value[role.id];
    if (!pick) {
      if (role.required !== false) errors[role.id] = `Choose a ${role.label.toLowerCase()}.`;
      continue;
    }
    if (authorId && pick === authorId) {
      errors[role.id] = "The author cannot review their own work.";
      continue;
    }
    const other = seen.get(pick);
    if (other) {
      const name = people.find((p) => p.id === pick)?.name ?? "This person";
      errors[role.id] = `${name} is already the ${other.toLowerCase()}. Choose someone else.`;
      continue;
    }
    seen.set(pick, role.label);
  }
  return errors;
}

/**
 * ReviewerSelector
 * A fieldset of native selects, one per role. The author is left out of the
 * options; duplicates and empty required roles show an error tied to the
 * select with aria-describedby.
 *
 * @example
 * ```tsx
 * <ReviewerSelector roles={[{ id: "lp", label: "Line producer" }]} people={crew} value={r} onChange={setR} authorId={me} />
 * ```
 */
export function ReviewerSelector({
  label = "Reviewers",
  roles,
  people,
  value,
  onChange,
  authorId,
  showErrors = false,
}: ReviewerSelectorProps) {
  const id = useId();
  const errors = showErrors ? validateReviewers(roles, value, people, authorId) : {};
  const options = people.filter((p) => p.id !== authorId);
  return (
    <fieldset
      style={{
        border: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.md,
      }}
    >
      <legend
        style={{
          padding: 0,
          marginBottom: spacingTokens.xs,
          fontWeight: 600,
          color: colorTokens.text.primary,
        }}
      >
        {label}
      </legend>
      {roles.map((role) => {
        const selectId = `${id}-${role.id}`;
        const err = errors[role.id];
        const required = role.required !== false;
        return (
          <div
            key={role.id}
            style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}
          >
            <label htmlFor={selectId} style={{ color: colorTokens.text.primary }}>
              {role.label}
              {!required && " "}
              {!required && <span style={{ color: colorTokens.text.secondary }}>(optional)</span>}
            </label>
            <select
              id={selectId}
              value={value[role.id] ?? ""}
              required={required}
              aria-invalid={err ? true : undefined}
              aria-describedby={err ? `${selectId}-error` : undefined}
              onChange={(e) => onChange({ ...value, [role.id]: e.target.value || undefined })}
              style={{
                padding: spacingTokens.sm,
                border: `1px solid ${err ? colorTokens.interactive.error : colorTokens.border.control}`,
                borderRadius: 6,
                font: "inherit",
                background: colorTokens.background.primary,
                color: colorTokens.text.primary,
              }}
            >
              <option value="">Not assigned</option>
              {options.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {err && (
              <span
                id={`${selectId}-error`}
                style={{
                  color: colorTokens.interactive.error,
                  fontSize: typographyTokens.fontSize.xs,
                }}
              >
                {err}
              </span>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}

ReviewerSelector.displayName = "ReviewerSelector";
