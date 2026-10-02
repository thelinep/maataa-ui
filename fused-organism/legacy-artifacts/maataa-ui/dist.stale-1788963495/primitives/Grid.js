import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Grid
 * CSS Grid layout container primitive
 */
import React from "react";
import { spacingTokens } from "../tokens";
const alignMap = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
};
const justifyMap = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
    "space-between": "space-between",
};
function resolveTemplate(value) {
    if (value === undefined)
        return undefined;
    return typeof value === "number" ? `repeat(${value}, 1fr)` : value;
}
function resolveSpacing(value) {
    if (!value)
        return undefined;
    return spacingTokens[value] || value;
}
/**
 * Grid
 * A CSS Grid layout primitive. Pass a number of columns/rows for an
 * even `repeat()` track, or a raw `grid-template-columns`/`-rows`
 * string for full control.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap="md">
 *   <Card>1</Card>
 *   <Card>2</Card>
 *   <Card>3</Card>
 * </Grid>
 * ```
 */
export const Grid = React.forwardRef(({ columns, rows, gap, columnGap, rowGap, align = "stretch", justify = "stretch", children, style, ...props }, ref) => {
    return (_jsx("div", { ref: ref, style: {
            display: "grid",
            gridTemplateColumns: resolveTemplate(columns),
            gridTemplateRows: resolveTemplate(rows),
            gap: resolveSpacing(gap),
            columnGap: resolveSpacing(columnGap),
            rowGap: resolveSpacing(rowGap),
            alignItems: alignMap[align],
            justifyItems: justifyMap[justify],
            ...style,
        }, ...props, children: children }));
});
Grid.displayName = "Grid";
//# sourceMappingURL=Grid.js.map