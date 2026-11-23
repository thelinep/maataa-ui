/**
 * @maataa/ui/forms/BudgetLineEditor
 * Edit budget lines as a table: category, item, quantity, rate, amount
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface BudgetLine {
  id: string;
  category: string;
  item: string;
  quantity: number;
  /** e.g. "days", "units" */
  unit: string;
  rate: number;
}

export interface BudgetLineEditorProps {
  lines: BudgetLine[];
  onChange: (lines: BudgetLine[]) => void;
  categories: string[];
  /** @default 'INR' */
  currency?: string;
  /** @default 'en-IN' */
  locale?: string;
  /** New-line id factory */
  newId?: () => string;
  readOnly?: boolean;
}

/**
 * BudgetLineEditor
 * Every cell input is labelled with its row ("Rate for Catering lunch"),
 * so the table reads well in forms mode. Amounts and the total recalculate
 * live and use the currency format.
 */
export function BudgetLineEditor({
  lines,
  onChange,
  categories,
  currency = "INR",
  locale: localeProp,
  newId = () => Math.random().toString(36).slice(2, 9),
  readOnly,
}: BudgetLineEditorProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const total = lines.reduce((s, l) => s + l.quantity * l.rate, 0);
  const upd = (id: string, patch: Partial<BudgetLine>) =>
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const cell: React.CSSProperties = {
    padding: spacingTokens.xs,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
  };
  const inp: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "6px 8px",
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    font: "inherit",
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
  };
  const name = (l: BudgetLine) => l.item || `line ${lines.indexOf(l) + 1}`;
  return (
    <div role="region" aria-label={t("Budget lines")} tabIndex={0} style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.sm }}>
          {t("Budget lines")}
        </caption>
        <thead>
          <tr
            style={{
              textAlign: "left",
              fontSize: typographyTokens.fontSize.sm,
              color: colorTokens.text.secondary,
            }}
          >
            <th scope="col" style={cell}>
              {t("Category")}
            </th>
            <th scope="col" style={cell}>
              {t("Item")}
            </th>
            <th scope="col" style={{ ...cell, width: 80 }}>
              {t("Qty")}
            </th>
            <th scope="col" style={{ ...cell, width: 90 }}>
              {t("Unit")}
            </th>
            <th scope="col" style={{ ...cell, width: 120 }}>
              {t("Rate")}
            </th>
            <th scope="col" style={{ ...cell, textAlign: "right", width: 130 }}>
              {t("Amount")}
            </th>
            {!readOnly && (
              <th scope="col" style={cell}>
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  {t("Remove")}
                </span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id}>
              <td style={cell}>
                {readOnly ? (
                  l.category
                ) : (
                  <select
                    aria-label={t("Category for {value}", { value: name(l) })}
                    value={l.category}
                    onChange={(e) => upd(l.id, { category: e.target.value })}
                    style={inp}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                )}
              </td>
              <td style={cell}>
                {readOnly ? (
                  l.item
                ) : (
                  <input
                    aria-label={t("Item {value}", { value: lines.indexOf(l) + 1 })}
                    value={l.item}
                    onChange={(e) => upd(l.id, { item: e.target.value })}
                    style={inp}
                  />
                )}
              </td>
              <td style={cell}>
                {readOnly ? (
                  l.quantity
                ) : (
                  <input
                    aria-label={t("Quantity for {value}", { value: name(l) })}
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={l.quantity}
                    onChange={(e) => upd(l.id, { quantity: Number(e.target.value) || 0 })}
                    style={inp}
                  />
                )}
              </td>
              <td style={cell}>
                {readOnly ? (
                  l.unit
                ) : (
                  <input
                    aria-label={t("Unit for {value}", { value: name(l) })}
                    value={l.unit}
                    onChange={(e) => upd(l.id, { unit: e.target.value })}
                    style={inp}
                  />
                )}
              </td>
              <td style={cell}>
                {readOnly ? (
                  money.format(l.rate)
                ) : (
                  <input
                    aria-label={t("Rate for {value}", { value: name(l) })}
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={l.rate}
                    onChange={(e) => upd(l.id, { rate: Number(e.target.value) || 0 })}
                    style={inp}
                  />
                )}
              </td>
              <td style={{ ...cell, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {money.format(l.quantity * l.rate)}
              </td>
              {!readOnly && (
                <td style={cell}>
                  <button
                    type="button"
                    aria-label={t("Remove {value}", { value: name(l) })}
                    onClick={() => onChange(lines.filter((x) => x.id !== l.id))}
                    style={{
                      minWidth: 32,
                      minHeight: 32,
                      border: `1px solid ${colorTokens.border.control}`,
                      borderRadius: 6,
                      background: colorTokens.background.primary,
                      cursor: "pointer",
                      color: colorTokens.text.primary,
                    }}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th
              scope="row"
              colSpan={5}
              style={{ ...cell, textAlign: "right", borderBottom: "none" }}
            >
              {t("Total")}
            </th>
            <td
              style={{
                ...cell,
                textAlign: "right",
                fontWeight: 700,
                borderBottom: "none",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <output aria-live="polite">{money.format(total)}</output>
            </td>
            {!readOnly && <td style={{ ...cell, borderBottom: "none" }} />}
          </tr>
        </tfoot>
      </table>
      {!readOnly && (
        <Button
          variant="secondary"
          onClick={() =>
            onChange([
              ...lines,
              {
                id: newId(),
                category: categories[0] ?? "",
                item: "",
                quantity: 1,
                unit: "units",
                rate: 0,
              },
            ])
          }
        >
          {t("Add line")}
        </Button>
      )}
    </div>
  );
}
BudgetLineEditor.displayName = "BudgetLineEditor";
