/**
 * @maataa/ui/forms/ListControls
 * AppliedFilterChips (what is filtering the list, each removable) and
 * SortSelector (field + direction)
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

export interface AppliedFilter {
  id: string;
  /** e.g. "Department" */
  field: string;
  /** e.g. "Camera" */
  value: string;
}

export interface AppliedFilterChipsProps {
  filters: AppliedFilter[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  /** Results after filtering, announced on change */
  resultCount?: number;
  noun?: string;
}

/**
 * AppliedFilterChips
 * Each chip is a button named "Remove filter: Department is Camera". After
 * removing, focus moves to the next chip (or Clear all). After the last one
 * goes, move focus to the list or its filters yourself.
 */
export function AppliedFilterChips({
  filters,
  onRemove,
  onClearAll,
  resultCount,
  noun = "results",
}: AppliedFilterChipsProps) {
  const t = useT();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const clearRef = useRef<HTMLButtonElement>(null);
  const [msg, setMsg] = useState("");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: spacingTokens.xs }}>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
      {filters.length > 0 && (
        <>
          <span
            style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
          >
            {resultCount != null
              ? t("{count} {noun}, filtered by:", { count: resultCount, noun })
              : t("Filtered by:")}
          </span>
          <ul
            aria-label={t("Active filters")}
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: spacingTokens.xs,
            }}
          >
            {filters.map((f, i) => (
              <li key={f.id}>
                <button
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => {
                    onRemove(f.id);
                    setMsg(
                      t("Removed filter {field}: {value}.", { field: f.field, value: f.value })
                    );
                    requestAnimationFrame(() =>
                      (refs.current[i] ?? refs.current[i - 1] ?? clearRef.current)?.focus()
                    );
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    minHeight: 32,
                    padding: "0 6px 0 12px",
                    borderRadius: 999,
                    border: `1px solid ${colorTokens.interactive.primary}`,
                    background: colorTokens.background.tertiary,
                    color: colorTokens.text.primary,
                    font: "inherit",
                    fontSize: typographyTokens.fontSize.sm,
                    cursor: "pointer",
                  }}
                >
                  <VisuallyHidden>{t("Remove filter:")}</VisuallyHidden>{" "}
                  <span>
                    <span style={{ color: colorTokens.text.secondary }}>{f.field}:</span> {f.value}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: colorTokens.background.primary,
                    }}
                  >
                    ×
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            ref={clearRef}
            type="button"
            onClick={() => {
              onClearAll();
              setMsg("All filters cleared.");
            }}
            style={{
              minHeight: 32,
              padding: "0 8px",
              border: 0,
              background: "transparent",
              color: colorTokens.interactive.primary,
              textDecoration: "underline",
              font: "inherit",
              fontSize: typographyTokens.fontSize.sm,
              cursor: "pointer",
            }}
          >
            {t("Clear all")}
          </button>
        </>
      )}
    </div>
  );
}

export interface SortField {
  value: string;
  label: string;
  /** Words for each direction, e.g. ["Oldest first", "Newest first"] */
  directions?: [string, string];
}

export interface SortValue {
  field: string;
  direction: "asc" | "desc";
}

export interface SortSelectorProps {
  fields: SortField[];
  value: SortValue;
  onChange: (value: SortValue) => void;
  label?: string;
}

/**
 * SortSelector
 * One native select listing every field × direction in words ("Date —
 * newest first"), so the choice is one control and fully announced.
 */
export function SortSelector({ fields, value, onChange, label: labelProp }: SortSelectorProps) {
  const t = useT();
  const label = labelProp ?? t("Sort by");
  const opts = fields.flatMap((f) => {
    const [a, d] = f.directions ?? ["A to Z", "Z to A"];
    return [
      { key: `${f.value}:asc`, label: `${f.label} — ${a}` },
      { key: `${f.value}:desc`, label: `${f.label} — ${d}` },
    ];
  });
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacingTokens.xs,
        fontSize: typographyTokens.fontSize.sm,
      }}
    >
      {label}
      <select
        value={`${value.field}:${value.direction}`}
        onChange={(e) => {
          const [field, direction] = e.target.value.split(":") as [string, "asc" | "desc"];
          onChange({ field, direction });
        }}
        style={{
          minHeight: 40,
          padding: "0 8px",
          border: `2px solid ${colorTokens.border.control}`,
          borderRadius: 6,
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
          font: "inherit",
          accentColor: colorTokens.interactive.primary,
        }}
      >
        {opts.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
