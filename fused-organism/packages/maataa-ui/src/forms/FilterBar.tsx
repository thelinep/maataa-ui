/**
 * @maataa/ui/forms/FilterBar
 * A row of filters with a result count and Clear all
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface FilterDef {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  /** Label of the "no filter" choice @default 'Any' */
  anyLabel?: string;
}

export interface FilterBarProps {
  /** Group name, e.g. "Filter productions" */
  label: string;
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  /** Shown in a status region, e.g. 24 → "24 productions" */
  resultCount?: number;
  /** Noun for the count @default 'results' */
  resultNoun?: string;
  /** Singular noun @default resultNoun without a trailing "s" */
  resultNounSingular?: string;
  /** Extra controls (search box, date range) */
  children?: React.ReactNode;
}

/**
 * FilterBar
 * Native selects, each labelled; the count updates in a polite status
 * region so people hear the effect of a filter. Clear all appears once any
 * filter is set.
 *
 * @example
 * ```tsx
 * <FilterBar label="Filter productions" filters={defs} values={f} onChange={setF} resultCount={rows.length} resultNoun="productions" />
 * ```
 */
export function FilterBar({
  label,
  filters,
  values,
  onChange,
  resultCount,
  resultNoun = "results",
  resultNounSingular,
  children,
}: FilterBarProps) {
  const t = useT();
  const active = Object.values(values).some(Boolean);
  return (
    <div
      role="group"
      aria-label={label}
      style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.md, alignItems: "flex-end" }}
    >
      {children}
      {filters.map((f) => (
        <label
          key={f.id}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.text.primary,
          }}
        >
          {f.label}
          <select
            value={values[f.id] ?? ""}
            onChange={(e) => onChange({ ...values, [f.id]: e.target.value })}
            style={{
              minWidth: 140,
              padding: spacingTokens.sm,
              border: `1px solid ${values[f.id] ? colorTokens.interactive.primary : colorTokens.border.control}`,
              borderRadius: 6,
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
              font: "inherit",
            }}
          >
            <option value="">{f.anyLabel ?? "Any"}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {active && (
        <button
          type="button"
          onClick={() => onChange(Object.fromEntries(filters.map((f) => [f.id, ""])))}
          style={{
            minHeight: 36,
            background: "none",
            border: "none",
            color: colorTokens.interactive.primary,
            textDecoration: "underline",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {t("Clear all filters")}
        </button>
      )}
      {resultCount !== undefined && (
        <span
          role="status"
          style={{
            marginLeft: "auto",
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.sm,
            alignSelf: "center",
          }}
        >
          {resultCount}{" "}
          {resultCount === 1 ? (resultNounSingular ?? resultNoun.replace(/s$/, "")) : resultNoun}
        </span>
      )}
    </div>
  );
}
FilterBar.displayName = "FilterBar";
