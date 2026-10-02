import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/data/DataTable
 * A sortable table — also the "table view" backing any chart's raw data
 */
import React, { useMemo, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { EmptyState } from "./EmptyState";
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
export const DataTable = React.forwardRef(({ columns, data, getRowKey, emptyState, className, style }, ref) => {
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const sortedData = useMemo(() => {
        if (!sortKey)
            return data;
        const copy = [...data];
        copy.sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            let cmp = 0;
            if (typeof av === "number" && typeof bv === "number")
                cmp = av - bv;
            else
                cmp = String(av ?? "").localeCompare(String(bv ?? ""));
            return sortDirection === "asc" ? cmp : -cmp;
        });
        return copy;
    }, [data, sortKey, sortDirection]);
    const handleSort = (column) => {
        if (!column.sortable)
            return;
        if (sortKey === column.key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        }
        else {
            setSortKey(column.key);
            setSortDirection("asc");
        }
    };
    if (data.length === 0) {
        return (_jsx("div", { className: className, style: style, children: emptyState ?? _jsx(EmptyState, { title: "No data", description: "Nothing to show yet." }) }));
    }
    return (_jsx("div", { className: className, style: { overflowX: "auto", ...style }, children: _jsxs("table", { ref: ref, style: {
                width: "100%",
                borderCollapse: "collapse",
                fontSize: typographyTokens.fontSize.sm,
            }, children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((column) => {
                            const isActive = sortKey === column.key;
                            return (_jsx("th", { scope: "col", "aria-sort": isActive ? (sortDirection === "asc" ? "ascending" : "descending") : undefined, style: {
                                    textAlign: column.align ?? "left",
                                    padding: spacingTokens.sm,
                                    borderBottom: `2px solid ${colorTokens.border.primary}`,
                                    color: colorTokens.text.secondary,
                                    fontWeight: typographyTokens.fontWeight.semibold,
                                    whiteSpace: "nowrap",
                                }, children: column.sortable ? (_jsxs("button", { type: "button", onClick: () => handleSort(column), style: {
                                        all: "unset",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: spacingTokens.xs,
                                        color: "inherit",
                                        font: "inherit",
                                    }, children: [column.header, _jsx("span", { "aria-hidden": "true", style: { fontSize: typographyTokens.fontSize.xs }, children: isActive ? (sortDirection === "asc" ? "▲" : "▼") : "⇅" })] })) : (column.header) }, column.key));
                        }) }) }), _jsx("tbody", { children: sortedData.map((row, index) => (_jsx("tr", { children: columns.map((column) => {
                            const value = row[column.key];
                            return (_jsx("td", { style: {
                                    textAlign: column.align ?? "left",
                                    padding: spacingTokens.sm,
                                    borderBottom: `1px solid ${colorTokens.border.secondary}`,
                                    color: colorTokens.text.primary,
                                    fontVariantNumeric: column.align === "right" ? "tabular-nums" : undefined,
                                }, children: column.render ? column.render(value, row) : String(value ?? "") }, column.key));
                        }) }, getRowKey ? getRowKey(row, index) : index))) })] }) }));
});
DataTable.displayName = "DataTable";
//# sourceMappingURL=DataTable.js.map