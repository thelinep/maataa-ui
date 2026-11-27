/**
 * @maataa/ui/forms/DistributionListSelector
 * Choose who receives a call sheet, by department
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface Recipient {
  id: string;
  name: string;
  role: string;
  department: string;
  /** No email or phone on file */
  unreachable?: boolean;
}

export interface DistributionListSelectorProps {
  recipients: Recipient[];
  value: string[];
  onChange: (ids: string[]) => void;
  /** @default 'Send to' */
  legend?: string;
}

/**
 * DistributionListSelector
 * One fieldset per department with a "Whole department" checkbox that
 * shows mixed state. People with no contact details are listed but can't
 * be chosen, with the reason.
 */
export function DistributionListSelector({
  recipients,
  value,
  onChange,
  legend: legendProp,
}: DistributionListSelectorProps) {
  const t = useT();
  const legend = legendProp ?? t("Send to");
  const depts = Array.from(new Set(recipients.map((r) => r.department)));
  const reachable = recipients.filter((r) => !r.unreachable);
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
      <legend style={{ fontWeight: 700, padding: 0, marginBottom: spacingTokens.xs }}>
        {legend}{" "}
        <span style={{ fontWeight: 400, color: colorTokens.text.secondary }}>
          {t("· {count} of {count2} chosen", { count: value.length, count2: reachable.length })}
        </span>
      </legend>
      <div>
        <button
          type="button"
          onClick={() =>
            onChange(value.length === reachable.length ? [] : reachable.map((r) => r.id))
          }
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: colorTokens.interactive.primary,
            textDecoration: "underline",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {value.length === reachable.length ? t("Clear everyone") : t("Choose everyone")}
        </button>
      </div>
      {depts.map((d) => {
        const people = recipients.filter((r) => r.department === d);
        const ok = people.filter((p) => !p.unreachable);
        const on = ok.filter((p) => value.includes(p.id)).length;
        return (
          <fieldset
            key={d}
            style={{
              border: `1px solid ${colorTokens.border.primary}`,
              borderRadius: 8,
              padding: spacingTokens.sm,
              margin: 0,
            }}
          >
            <legend style={{ padding: `0 ${spacingTokens.xs}` }}>
              <label
                style={{
                  display: "flex",
                  gap: spacingTokens.xs,
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={on > 0 && on === ok.length}
                  ref={(el) => {
                    if (el) el.indeterminate = on > 0 && on < ok.length;
                  }}
                  onChange={(e) =>
                    onChange(
                      e.target.checked
                        ? Array.from(new Set([...value, ...ok.map((p) => p.id)]))
                        : value.filter((x) => !ok.some((p) => p.id === x))
                    )
                  }
                  style={{ accentColor: colorTokens.interactive.primary }}
                />
                {d} ({on}/{ok.length})
              </label>
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 4,
              }}
            >
              {people.map((p) => (
                <label
                  key={p.id}
                  style={{
                    display: "flex",
                    gap: spacingTokens.xs,
                    alignItems: "flex-start",
                    fontSize: typographyTokens.fontSize.sm,
                    color: p.unreachable ? colorTokens.text.secondary : colorTokens.text.primary,
                  }}
                >
                  <input
                    type="checkbox"
                    disabled={p.unreachable}
                    checked={value.includes(p.id)}
                    onChange={(e) =>
                      onChange(
                        e.target.checked ? [...value, p.id] : value.filter((x) => x !== p.id)
                      )
                    }
                    style={{ marginTop: 3, accentColor: colorTokens.interactive.primary }}
                  />
                  <span>
                    {p.name} · {p.role}
                    {p.unreachable && (
                      <span style={{ display: "block", fontSize: typographyTokens.fontSize.xs }}>
                        {t("No email or phone on file")}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}
    </fieldset>
  );
}
DistributionListSelector.displayName = "DistributionListSelector";
