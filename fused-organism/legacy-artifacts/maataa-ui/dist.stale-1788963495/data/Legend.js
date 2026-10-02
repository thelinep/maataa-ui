import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/data/Legend
 * Series identity key for a chart with two or more series
 */
import React from "react";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
/**
 * Legend
 * A row of color-swatch + label pairs — the dependable identity channel for
 * a multi-series chart. Per the data-viz guidelines, a single-series chart
 * doesn't need one (its title already says what's plotted); render this
 * only when a chart has two or more series.
 *
 * @example
 * ```tsx
 * <Legend items={[{ label: "Revenue", color: chartTokens.categorical[0] }]} />
 * ```
 */
export const Legend = React.forwardRef(({ items, className, style }, ref) => {
    return (_jsx("ul", { ref: ref, className: className, style: {
            display: "flex",
            flexWrap: "wrap",
            gap: spacingTokens.md,
            listStyle: "none",
            margin: 0,
            padding: 0,
            ...style,
        }, children: items.map((item) => (_jsxs("li", { style: {
                display: "flex",
                alignItems: "center",
                gap: spacingTokens.xs,
                fontSize: typographyTokens.fontSize.sm,
                color: colorTokens.text.secondary,
            }, children: [_jsx("span", { "aria-hidden": "true", style: {
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: radiusTokens.full,
                        backgroundColor: item.color,
                        flexShrink: 0,
                    } }), item.label] }, item.label))) }));
});
Legend.displayName = "Legend";
//# sourceMappingURL=Legend.js.map