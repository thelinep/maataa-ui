/**
 * @maataa/ui/forms/EquipmentCheckoutSheet
 * Check gear out and back in, with condition notes
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type GearCondition = "good" | "worn" | "damaged" | "missing";

export interface CheckoutLine {
  id: string;
  name: string;
  serial?: string;
  out: boolean;
  in: boolean;
  condition: GearCondition;
  note?: string;
}

export interface EquipmentCheckoutSheetProps {
  /** e.g. "Day 4 · Camera dept" */
  title: string;
  lines: CheckoutLine[];
  onChange: (id: string, patch: Partial<CheckoutLine>) => void;
}

const condLabel: Record<GearCondition, string> = {
  good: "Good",
  worn: "Worn",
  damaged: "Damaged",
  missing: "Missing",
};

/**
 * EquipmentCheckoutSheet
 * A table with "Out" and "In" checkboxes per item (named by item), a
 * condition select, and a summary of what's still out.
 */
export function EquipmentCheckoutSheet({ title, lines, onChange }: EquipmentCheckoutSheetProps) {
  const stillOut = lines.filter((l) => l.out && !l.in).length;
  const problems = lines.filter(
    (l) => l.condition === "damaged" || l.condition === "missing"
  ).length;
  const td: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
  };
  return (
    <div role="region" aria-label={title} tabIndex={0} style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          {title}
          <span
            role="status"
            style={{
              display: "block",
              fontWeight: 400,
              fontSize: typographyTokens.fontSize.sm,
              color:
                stillOut || problems
                  ? colorTokens.interactive.warning
                  : colorTokens.interactive.success,
            }}
          >
            {stillOut
              ? `${stillOut} item${stillOut === 1 ? "" : "s"} still out`
              : "Everything is back"}
            {problems ? ` · ${problems} damaged or missing` : ""}
          </span>
        </caption>
        <thead>
          <tr style={{ textAlign: "left", color: colorTokens.text.secondary }}>
            <th scope="col" style={td}>
              Item
            </th>
            <th scope="col" style={td}>
              Out
            </th>
            <th scope="col" style={td}>
              In
            </th>
            <th scope="col" style={td}>
              Condition
            </th>
            <th scope="col" style={td}>
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id}>
              <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 500 }}>
                {l.name}
                {l.serial && (
                  <span
                    style={{
                      display: "block",
                      fontSize: typographyTokens.fontSize.xs,
                      color: colorTokens.text.secondary,
                      fontWeight: 400,
                    }}
                  >
                    S/N {l.serial}
                  </span>
                )}
              </th>
              <td style={td}>
                <input
                  type="checkbox"
                  aria-label={`${l.name} checked out`}
                  checked={l.out}
                  onChange={(e) => onChange(l.id, { out: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
                />
              </td>
              <td style={td}>
                <input
                  type="checkbox"
                  aria-label={`${l.name} returned`}
                  checked={l.in}
                  disabled={!l.out}
                  onChange={(e) => onChange(l.id, { in: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
                />
              </td>
              <td style={td}>
                <select
                  aria-label={`Condition of ${l.name}`}
                  value={l.condition}
                  onChange={(e) => onChange(l.id, { condition: e.target.value as GearCondition })}
                  style={{
                    padding: 4,
                    border: `1px solid ${l.condition === "damaged" || l.condition === "missing" ? colorTokens.interactive.error : colorTokens.border.control}`,
                    borderRadius: 4,
                    font: "inherit",
                    background: colorTokens.background.primary,
                  }}
                >
                  {Object.entries(condLabel).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </td>
              <td style={td}>
                <input
                  aria-label={`Note for ${l.name}`}
                  defaultValue={l.note}
                  onBlur={(e) => onChange(l.id, { note: e.target.value })}
                  style={{
                    width: "100%",
                    padding: 4,
                    border: `1px solid ${colorTokens.border.control}`,
                    borderRadius: 4,
                    font: "inherit",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
EquipmentCheckoutSheet.displayName = "EquipmentCheckoutSheet";
