/**
 * @maataa/ui/data/DataTable
 * A sortable table — also the "table view" backing any chart's raw data
 */
import React from "react";
export interface DataTableColumn {
    /** The row property this column reads. */
    key: string;
    header: string;
    align?: "left" | "right" | "center";
    sortable?: boolean;
    /** Custom cell renderer. Receives the raw cell value and the full row. */
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}
export interface DataTableProps {
    columns: DataTableColumn[];
    data: Record<string, unknown>[];
    /** Derives a stable React key for a row. Defaults to its index. */
    getRowKey?: (row: Record<string, unknown>, index: number) => string | number;
    /** Rendered instead of the table body when `data` is empty. */
    emptyState?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const DataTable: React.ForwardRefExoticComponent<DataTableProps & React.RefAttributes<HTMLTableElement>>;
//# sourceMappingURL=DataTable.d.ts.map