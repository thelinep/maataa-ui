/**
 * @maataa/ui/data/TableViews
 * AgendaView, InlineEditGrid, ComparisonTable and DiffView
 */

import { useLocale, useT } from "../i18n/LocaleProvider";
import React, { useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { ScrollTable } from "./ScrollTable";
import type { CalendarEvent } from "./EventCalendar";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

const cell: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: `1px solid ${colorTokens.border.secondary}`,
  textAlign: "left",
  verticalAlign: "top",
};
const headCell: React.CSSProperties = {
  ...cell,
  borderBottom: `2px solid ${colorTokens.border.primary}`,
  fontWeight: 600,
  background: colorTokens.background.secondary,
};

/* ───────────────────────── AgendaView ───────────────────────── */

export interface AgendaViewProps {
  events: CalendarEvent[];
  /** First day shown @default today */
  from?: Date;
  /** Days shown @default 14 */
  days?: number;
  locale?: string;
  onSelect?: (event: CalendarEvent) => void;
  /** Heading level for each day @default 3 */
  level?: 2 | 3 | 4;
  today?: Date;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * AgendaView
 * A list of days that have events, each a heading followed by a list —
 * easy to skim by heading with a screen reader. Empty days are skipped.
 */
export function AgendaView({
  events,
  from = new Date(),
  days = 14,
  locale: localeProp,
  onSelect,
  level = 3,
  today = new Date(),
}: AgendaViewProps) {
  const t = useT();
  const locale = useLocale(localeProp);
  const H = `h${level}` as "h3";
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const groups: { day: Date; items: CalendarEvent[] }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const items = events
      .filter((e) => sameDay(e.start, d))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    if (items.length) groups.push({ day: d, items });
  }
  const time = (d: Date) => d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  if (!groups.length) {
    return (
      <p style={{ color: colorTokens.text.secondary }}>
        {t("Nothing scheduled in the next {days} days.", { days })}
      </p>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}>
      {groups.map((g) => (
        <section
          key={g.day.toISOString()}
          aria-label={g.day.toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        >
          <H
            style={{
              margin: `0 0 ${spacingTokens.xs}`,
              fontSize: typographyTokens.fontSize.md,
              display: "flex",
              gap: 8,
              alignItems: "baseline",
            }}
          >
            {g.day.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
            {sameDay(g.day, today) && (
              <span
                style={{
                  fontSize: typographyTokens.fontSize.xs,
                  padding: "1px 8px",
                  borderRadius: 999,
                  background: colorTokens.interactive.primary,
                  color: colorTokens.text.inverse,
                }}
              >
                {t("Today")}
              </span>
            )}
          </H>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              borderLeft: `3px solid ${colorTokens.border.primary}`,
            }}
          >
            {g.items.map((e) => {
              const body = (
                <>
                  <span
                    style={{
                      minWidth: 110,
                      color: colorTokens.text.secondary,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {time(e.start)}
                    {e.end && `–${time(e.end)}`}
                  </span>{" "}
                  <span style={{ fontWeight: 500 }}>{e.title}</span>{" "}
                  {e.kind && (
                    <span
                      style={{
                        color: colorTokens.text.secondary,
                        fontSize: typographyTokens.fontSize.sm,
                      }}
                    >
                      · {e.kind}
                    </span>
                  )}
                </>
              );
              const row: React.CSSProperties = {
                display: "flex",
                gap: spacingTokens.sm,
                alignItems: "baseline",
                padding: "8px 12px",
                flexWrap: "wrap",
              };
              return (
                <li key={e.id}>
                  {onSelect ? (
                    <button
                      type="button"
                      onClick={() => onSelect(e)}
                      style={{
                        ...row,
                        width: "100%",
                        border: 0,
                        background: "transparent",
                        font: "inherit",
                        color: "inherit",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      {body}
                    </button>
                  ) : (
                    <div style={row}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function omit<V>(o: Record<string, V>, key: string): Record<string, V> {
  const next = { ...o };
  delete next[key];
  return next;
}

/* ───────────────────────── InlineEditGrid ───────────────────────── */

export interface GridColumn<T> {
  key: keyof T & string;
  header: string;
  /** Editable cells get a text/number input */
  editable?: boolean;
  type?: "text" | "number";
  /** Return an error message, or null */
  validate?: (value: string, row: T) => string | null;
  align?: "left" | "right";
  width?: number | string;
}

export interface InlineEditGridProps<T extends { id: string }> {
  label: string;
  columns: GridColumn<T>[];
  rows: T[];
  onChange: (id: string, key: keyof T & string, value: string | number) => void;
  /** Which column names each row (used in input names) */
  rowHeaderKey: keyof T & string;
}

/**
 * InlineEditGrid
 * A real table whose editable cells hold labelled inputs (named "Rate,
 * Focus puller"). Enter commits and moves down; Escape reverts the cell.
 * Errors appear in the cell and on the input.
 */
export function InlineEditGrid<T extends { id: string }>({
  label,
  columns,
  rows,
  onChange,
  rowHeaderKey,
}: InlineEditGridProps<T>) {
  const t = useT();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const k = (id: string, c: string) => `${id}::${c}`;

  const commit = (row: T, col: GridColumn<T>) => {
    const key = k(row.id, col.key);
    if (!(key in drafts)) return true;
    const v = drafts[key]!;
    const err =
      col.validate?.(v, row) ??
      (col.type === "number" && v.trim() !== "" && !Number.isFinite(Number(v))
        ? "Enter a number"
        : null);
    if (err) {
      setErrors((e) => ({ ...e, [key]: err }));
      return false;
    }
    setErrors((o) => omit(o, key));
    setDrafts((o) => omit(o, key));
    onChange(row.id, col.key, col.type === "number" ? Number(v) : v);
    setMsg(`${col.header} for ${String(row[rowHeaderKey])} saved.`);
    return true;
  };

  return (
    <>
      <ScrollTable label={label}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={{ ...headCell, textAlign: c.align ?? "left", width: c.width }}
                >
                  {c.header}
                  {c.editable && (
                    <>
                      {" "}
                      <VisuallyHidden>{t("(editable)")}</VisuallyHidden>
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.id}>
                {columns.map((c) => {
                  const key = k(r.id, c.key);
                  const val = String(r[c.key] ?? "");
                  if (c.key === rowHeaderKey) {
                    return (
                      <th key={c.key} scope="row" style={{ ...cell, fontWeight: 500 }}>
                        {val}
                      </th>
                    );
                  }
                  if (!c.editable) {
                    return (
                      <td
                        key={c.key}
                        style={{
                          ...cell,
                          textAlign: c.align ?? "left",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {val}
                      </td>
                    );
                  }
                  const err = errors[key];
                  return (
                    <td key={c.key} style={{ ...cell, padding: 4, textAlign: c.align ?? "left" }}>
                      <input
                        ref={(el) => {
                          refs.current[key] = el;
                        }}
                        aria-label={`${c.header}, ${String(r[rowHeaderKey])}`}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={err ? `${key}-err` : undefined}
                        inputMode={c.type === "number" ? "decimal" : undefined}
                        value={drafts[key] ?? val}
                        onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                        onBlur={() => commit(r, c)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (commit(r, c))
                              refs.current[k(rows[ri + 1]?.id ?? "", c.key)]?.focus();
                          } else if (e.key === "Escape") {
                            setDrafts((o) => omit(o, key));
                            setErrors((o) => omit(o, key));
                          }
                        }}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          minHeight: 36,
                          padding: "4px 8px",
                          border: `1px solid ${err ? colorTokens.interactive.error : key in drafts ? colorTokens.interactive.primary : "transparent"}`,
                          borderRadius: 4,
                          background:
                            key in drafts ? colorTokens.background.primary : "transparent",
                          font: "inherit",
                          textAlign: c.align ?? "left",
                          color: colorTokens.text.primary,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      />
                      {err && (
                        <span
                          id={`${key}-err`}
                          style={{
                            display: "block",
                            color: colorTokens.interactive.error,
                            fontSize: typographyTokens.fontSize.xs,
                            padding: "2px 8px",
                          }}
                        >
                          {err}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </>
  );
}

/* ───────────────────────── ComparisonTable ───────────────────────── */

export interface ComparisonOption {
  id: string;
  name: string;
  /** Marked "Recommended" */
  recommended?: boolean;
}

export interface ComparisonRow {
  feature: string;
  /** Per option id: true/false render as Yes/No with icons; strings as text */
  values: Record<string, boolean | string | number | null>;
}

export interface ComparisonTableProps {
  label: string;
  options: ComparisonOption[];
  rows: ComparisonRow[];
  /** Highlight rows where options differ @default false */
  highlightDifferences?: boolean;
}

/**
 * ComparisonTable
 * Options as column headers, features as row headers. Yes/No is written in
 * words next to ✓/✕. "Only show differences" filters rows.
 */
export function ComparisonTable({
  label,
  options,
  rows,
  highlightDifferences,
}: ComparisonTableProps) {
  const t = useT();
  const locale = useLocale();
  const [onlyDiff, setOnlyDiff] = useState(false);
  const differs = (r: ComparisonRow) =>
    new Set(options.map((o) => String(r.values[o.id]))).size > 1;
  const shown = onlyDiff ? rows.filter(differs) : rows;
  const render = (v: boolean | string | number | null | undefined) => {
    if (v === true)
      return (
        <span style={{ color: colorTokens.interactive.success, fontWeight: 600 }}>
          <span aria-hidden="true">✓ </span>
          {t("Yes")}
        </span>
      );
    if (v === false)
      return (
        <span style={{ color: colorTokens.text.secondary }}>
          <span aria-hidden="true">✕ </span>
          {t("No")}
        </span>
      );
    if (v == null || v === "")
      return (
        <span style={{ color: colorTokens.text.secondary }}>
          —<VisuallyHidden>{t("not stated")}</VisuallyHidden>
        </span>
      );
    return typeof v === "number" ? v.toLocaleString(locale) : v;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 32 }}>
        <input
          type="checkbox"
          checked={onlyDiff}
          onChange={(e) => setOnlyDiff(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: colorTokens.interactive.primary }}
        />
        {t("Only show differences ({value})", { value: rows.filter(differs).length })}
      </label>
      <ScrollTable label={label}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 160 + options.length * 140,
          }}
        >
          <thead>
            <tr>
              <td style={{ ...headCell, background: "transparent" }} />
              {options.map((o) => (
                <th
                  key={o.id}
                  scope="col"
                  style={{
                    ...headCell,
                    background: o.recommended
                      ? colorTokens.background.tertiary
                      : headCell.background,
                  }}
                >
                  {o.name}
                  {o.recommended && (
                    <span
                      style={{
                        display: "block",
                        fontSize: typographyTokens.fontSize.xs,
                        color: colorTokens.interactive.primary,
                        fontWeight: 700,
                      }}
                    >
                      {t("Recommended")}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const hl = highlightDifferences && differs(r);
              return (
                <tr
                  key={r.feature}
                  style={{ background: hl ? colorTokens.background.secondary : undefined }}
                >
                  <th scope="row" style={{ ...cell, fontWeight: 500 }}>
                    {r.feature}
                    {hl && (
                      <>
                        {" "}
                        <VisuallyHidden>{t("(differs)")}</VisuallyHidden>
                      </>
                    )}
                  </th>
                  {options.map((o) => (
                    <td
                      key={o.id}
                      style={{
                        ...cell,
                        background: o.recommended ? "rgba(245, 237, 228, 0.5)" : undefined,
                      }}
                    >
                      {render(r.values[o.id])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>
    </div>
  );
}

/* ───────────────────────── DiffView ───────────────────────── */

export type DiffLine = {
  kind: "same" | "added" | "removed";
  text: string;
  oldNo?: number;
  newNo?: number;
};

/** Line diff (longest common subsequence) */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const n = a.length;
  const m = b.length;
  const L: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i]![j] = a[i] === b[j] ? L[i + 1]![j + 1]! + 1 : Math.max(L[i + 1]![j]!, L[i]![j + 1]!);
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ kind: "same", text: a[i]!, oldNo: i + 1, newNo: j + 1 });
      i++;
      j++;
    } else if (L[i + 1]![j]! >= L[i]![j + 1]!) {
      out.push({ kind: "removed", text: a[i]!, oldNo: i + 1 });
      i++;
    } else {
      out.push({ kind: "added", text: b[j]!, newNo: j + 1 });
      j++;
    }
  }
  while (i < n) out.push({ kind: "removed", text: a[i]!, oldNo: ++i });
  while (j < m) out.push({ kind: "added", text: b[j]!, newNo: ++j });
  return out;
}

export interface DiffViewProps {
  label: string;
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * DiffView
 * Unified line diff. Added and removed lines are marked with +/− and the
 * words "Added"/"Removed" for screen readers, not colour alone.
 */
export function DiffView({
  label,
  before,
  after,
  beforeLabel: beforeLabelProp,
  afterLabel: afterLabelProp,
}: DiffViewProps) {
  const t = useT();
  const afterLabel = afterLabelProp ?? t("After");
  const beforeLabel = beforeLabelProp ?? t("Before");
  const lines = diffLines(before, after);
  const added = lines.filter((l) => l.kind === "added").length;
  const removed = lines.filter((l) => l.kind === "removed").length;
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
  const bg = {
    same: "transparent",
    added: colorTokens.semantic.success.bg,
    removed: colorTokens.semantic.error.bg,
  };
  const sign = { same: " ", added: "+", removed: "−" };
  return (
    <section
      aria-label={label}
      style={{
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          padding: "8px 12px",
          background: colorTokens.background.secondary,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <span>
          {beforeLabel} → {afterLabel}
        </span>
        <span>
          <span style={{ color: colorTokens.interactive.success, fontWeight: 600 }}>
            {t("{added} added", { added })}
          </span>
          ,{" "}
          <span style={{ color: colorTokens.interactive.error, fontWeight: 600 }}>
            {t("{removed} removed", { removed })}
          </span>
        </span>
      </div>
      <ScrollTable label={t("{label} lines", { label })}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontFamily: mono,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          <thead>
            <tr>
              <th scope="col" style={{ ...headCell, width: 40, fontSize: 11 }}>
                {beforeLabel}
              </th>
              <th scope="col" style={{ ...headCell, width: 40, fontSize: 11 }}>
                {afterLabel}
              </th>
              <th scope="col" style={{ ...headCell, fontSize: 11 }}>
                {t("Line")}
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} style={{ background: bg[l.kind] }}>
                <td
                  style={{
                    padding: "2px 8px",
                    color: colorTokens.text.secondary,
                    textAlign: "right",
                  }}
                >
                  {l.oldNo ?? ""}
                </td>
                <td
                  style={{
                    padding: "2px 8px",
                    color: colorTokens.text.secondary,
                    textAlign: "right",
                  }}
                >
                  {l.newNo ?? ""}
                </td>
                <td
                  style={{
                    padding: "2px 8px",
                    whiteSpace: "pre-wrap",
                    color: colorTokens.text.primary,
                  }}
                >
                  <span aria-hidden="true">{sign[l.kind]} </span>
                  {l.kind !== "same" && (
                    <VisuallyHidden>
                      {l.kind === "added" ? t("Added: ") : t("Removed: ")}
                    </VisuallyHidden>
                  )}
                  {l.text || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
    </section>
  );
}
