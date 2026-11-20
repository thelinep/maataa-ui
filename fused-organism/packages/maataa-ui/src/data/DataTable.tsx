/**
 * @maataa/ui/data/DataTable
 * A sortable table — also the "table view" backing any chart's raw data
 */

import React, { useMemo, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { EmptyState } from "./EmptyState";

/** Row shape. Defaults to a plain record; pass your own row type for typed `render`/`onRowClick`. */
export type DataTableRow = object;

export interface DataTableColumn<T extends DataTableRow = Record<string, unknown>> {
  /** The row property this column reads. */
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  /** Custom cell renderer. Receives the raw cell value and the full row. */
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T extends DataTableRow = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];

  /** Derives a stable React key for a row. Defaults to its index. */
  getRowKey?: (row: T, index: number) => string | number;

  /** Rendered instead of the table body when `data` is empty. */
  emptyState?: React.ReactNode;
  /**
   * Makes each row actionable (e.g. open a detail view). Rows become
   * focusable and respond to Enter and Space as well as clicks. `index` is
   * the row's position in the current (sorted) order.
   */
  onRowClick?: (row: T, index: number) => void;

  className?: string;
  style?: React.CSSProperties;
}

type SortDirection = "asc" | "desc";

/**
 * DataTable
 * A sortable table for tabular data — click a sortable column header to
 * sort by it, click again to reverse. Numeric-aligned columns use
 * tabular figures so values stay aligned down the column. Per the
 * data-viz guidelines, this is also the always-available "table view"
 * that should back any chart built from the same rows.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: "name", header: "Name", sortable: true },
 *     { key: "revenue", header: "Revenue", align: "right", sortable: true },
 *   ]}
 *   data={[{ name: "Acme", revenue: 12400 }]}
 * />
 * ```
 */
function DataTableInner<T extends DataTableRow = Record<string, unknown>>(
  { columns, data, getRowKey, emptyState, onRowClick, className, style }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = cell(a, sortKey);
      const bv = cell(b, sortKey);
      let cmp = 0;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [data, sortKey, sortDirection]);

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    if (sortKey === column.key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column.key);
      setSortDirection("asc");
    }
  };

  if (data.length === 0) {
    return (
      <div className={className} style={style}>
        {emptyState ?? <EmptyState title="No data" description="Nothing to show yet." />}
      </div>
    );
  }

  return (
    <div className={className} style={{ overflowX: "auto", ...style }}>
      <table
        ref={ref}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => {
              const isActive = sortKey === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    isActive ? (sortDirection === "asc" ? "ascending" : "descending") : undefined
                  }
                  style={{
                    textAlign: column.align ?? "left",
                    padding: spacingTokens.sm,
                    borderBottom: `2px solid ${colorTokens.border.primary}`,
                    color: colorTokens.text.secondary,
                    fontWeight: typographyTokens.fontWeight.semibold,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: spacingTokens.xs,
                        color: "inherit",
                        font: "inherit",
                      }}
                    >
                      {column.header}
                      <span aria-hidden="true" style={{ fontSize: typographyTokens.fontSize.xs }}>
                        {isActive ? (sortDirection === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : index}
              {...(onRowClick
                ? {
                    tabIndex: 0,
                    onClick: () => onRowClick(row, index),
                    onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowClick(row, index);
                      }
                    },
                    onMouseEnter: () => setActiveRow(index),
                    onMouseLeave: () =>
                      setActiveRow((current) => (current === index ? null : current)),
                    onFocus: () => setActiveRow(index),
                    onBlur: () => setActiveRow((current) => (current === index ? null : current)),
                    style: {
                      cursor: "pointer",
                      backgroundColor:
                        activeRow === index ? colorTokens.background.secondary : undefined,
                      outline:
                        activeRow === index
                          ? `2px solid ${colorTokens.interactive.primary}`
                          : undefined,
                      outlineOffset: "-2px",
                    },
                  }
                : {})}
            >
              {columns.map((column) => {
                const value = cell(row, column.key);
                return (
                  <td
                    key={column.key}
                    style={{
                      textAlign: column.align ?? "left",
                      padding: spacingTokens.sm,
                      borderBottom: `1px solid ${colorTokens.border.secondary}`,
                      color: colorTokens.text.primary,
                      fontVariantNumeric: column.align === "right" ? "tabular-nums" : undefined,
                    }}
                  >
                    {column.render ? column.render(value, row) : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Reads a column's value from a row of any object type. */
function cell(row: DataTableRow, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

/**
 * Generic over the row type: `<DataTable<Budget> ... />`, or inferred from
 * `data`. Defaults to `Record<string, unknown>` for untyped rows.
 */
export const DataTable = React.forwardRef(DataTableInner) as (<
  T extends DataTableRow = Record<string, unknown>,
>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLTableElement> }
) => React.ReactElement | null) & { displayName?: string };

DataTable.displayName = "DataTable";
