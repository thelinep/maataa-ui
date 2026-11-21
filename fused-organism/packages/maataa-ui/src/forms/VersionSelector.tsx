/**
 * @maataa/ui/forms/VersionSelector
 * Pick a version of a budget, mix, grade, contract or deck
 */

import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface VersionOption {
  id: string;
  /** e.g. "v3" */
  label: string;
  createdAt: Date;
  author?: string;
  /** e.g. "Approved", "Locked", "Draft" */
  status?: string;
  note?: string;
}

export interface VersionSelectorProps {
  /** What has versions, e.g. "Budget" → "Budget version" */
  subject: string;
  versions: VersionOption[];
  value: string;
  onChange: (id: string) => void;
  /** Id of the version in use (approved/current) */
  currentId?: string;
  /** Second version to compare with, when comparing */
  compareWith?: string;
  onCompareChange?: (id: string) => void;
  /** @default 'en-IN' */
  locale?: string;
}

/**
 * VersionSelector
 * A native select with dated options ("v3 · Approved · 18 Nov · Asha").
 * Says when you are looking at an older version than the current one.
 */
export function VersionSelector({
  subject,
  versions,
  value,
  onChange,
  currentId,
  compareWith,
  onCompareChange,
  locale = "en-IN",
}: VersionSelectorProps) {
  const id = useId();
  const sorted = [...versions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const text = (v: VersionOption) =>
    [
      v.label,
      v.id === currentId ? "current" : v.status,
      v.createdAt.toLocaleDateString(locale, { day: "numeric", month: "short" }),
      v.author,
    ]
      .filter(Boolean)
      .join(" · ");
  const sel: React.CSSProperties = {
    padding: spacingTokens.sm,
    border: `2px solid ${colorTokens.border.control}`,
    borderRadius: 6,
    font: "inherit",
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
  };
  const old = currentId && value !== currentId;
  const chosen = versions.find((v) => v.id === value);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
      <div
        style={{ display: "flex", gap: spacingTokens.md, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <label
          htmlFor={`${id}-v`}
          style={{ display: "flex", flexDirection: "column", gap: 2, fontWeight: 500 }}
        >
          {subject} version
          <select
            id={`${id}-v`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={old ? `${id}-old` : undefined}
            style={sel}
          >
            {sorted.map((v) => (
              <option key={v.id} value={v.id}>
                {text(v)}
              </option>
            ))}
          </select>
        </label>
        {onCompareChange && (
          <label style={{ display: "flex", flexDirection: "column", gap: 2, fontWeight: 500 }}>
            Compare with
            <select
              value={compareWith ?? ""}
              onChange={(e) => onCompareChange(e.target.value)}
              style={sel}
            >
              <option value="">Don’t compare</option>
              {sorted
                .filter((v) => v.id !== value)
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {text(v)}
                  </option>
                ))}
            </select>
          </label>
        )}
      </div>
      {old && (
        <span
          id={`${id}-old`}
          style={{
            fontSize: typographyTokens.fontSize.sm,
            color: colorTokens.interactive.warning,
            fontWeight: 600,
          }}
        >
          You’re viewing an older version. The current one is{" "}
          {versions.find((v) => v.id === currentId)?.label}.
        </span>
      )}
      {chosen?.note && (
        <span style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
          {chosen.note}
        </span>
      )}
    </div>
  );
}
VersionSelector.displayName = "VersionSelector";
