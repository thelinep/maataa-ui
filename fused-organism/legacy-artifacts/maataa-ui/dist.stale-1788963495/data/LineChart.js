import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * @maataa/ui/data/LineChart
 * A multi-series line chart with gridlines, legend, and hover tooltip
 */
import React, { useState } from "react";
import { chartTokens, colorTokens, typographyTokens } from "../tokens";
import { ChartTooltip } from "./ChartTooltip";
import { Legend } from "./Legend";
import { buildLinePath, niceTicks } from "./chartUtils";
const PADDING = { top: 16, right: 16, bottom: 28, left: 44 };
/**
 * LineChart
 * Plots one or more series as 2px lines over a shared 0-anchored y-axis,
 * with recessive gridlines, an end-dot per series, a legend (when there are
 * two or more series), and a per-category hover tooltip listing every
 * series' value at that point.
 *
 * @example
 * ```tsx
 * <LineChart
 *   categories={["Mon", "Tue", "Wed", "Thu", "Fri"]}
 *   series={[{ label: "Visits", data: [120, 180, 150, 220, 300] }]}
 * />
 * ```
 */
export const LineChart = React.forwardRef(({ series, categories, width = 480, height = 240, valueFormatter = String, className, style }, ref) => {
    const [tooltip, setTooltip] = useState(null);
    const plotWidth = width - PADDING.left - PADDING.right;
    const plotHeight = height - PADDING.top - PADDING.bottom;
    const maxValue = Math.max(1, ...series.flatMap((s) => s.data));
    const ticks = niceTicks(maxValue);
    const scaleMax = ticks[ticks.length - 1] || 1;
    const xFor = (i) => PADDING.left +
        (categories.length > 1 ? (i / (categories.length - 1)) * plotWidth : plotWidth / 2);
    const yFor = (value) => PADDING.top + plotHeight - (value / scaleMax) * plotHeight;
    const coloredSeries = series.map((s, i) => ({
        ...s,
        color: s.color ??
            (series.length > 1
                ? chartTokens.categorical[i % chartTokens.categorical.length]
                : chartTokens.single),
    }));
    const handleHover = (e, categoryIndex) => {
        setTooltip({
            x: e.clientX,
            y: e.clientY - 12,
            title: categories[categoryIndex],
            rows: coloredSeries.map((s) => ({
                label: s.label,
                value: valueFormatter(s.data[categoryIndex] ?? 0),
                color: s.color,
            })),
        });
    };
    return (_jsxs("div", { className: className, style: style, children: [_jsxs("svg", { ref: ref, width: width, height: height, viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": `Line chart with ${series.length} series over ${categories.length} categories`, children: [ticks.map((tick) => {
                        const y = yFor(tick);
                        return (_jsxs("g", { children: [_jsx("line", { x1: PADDING.left, x2: width - PADDING.right, y1: y, y2: y, stroke: chartTokens.grid, strokeWidth: 1 }), _jsx("text", { x: PADDING.left - 8, y: y, textAnchor: "end", dominantBaseline: "middle", fontSize: typographyTokens.fontSize.xs, fill: colorTokens.text.secondary, children: valueFormatter(tick) })] }, tick));
                    }), categories.map((cat, i) => (_jsx("text", { x: xFor(i), y: height - PADDING.bottom + 18, textAnchor: "middle", fontSize: typographyTokens.fontSize.xs, fill: colorTokens.text.secondary, children: cat }, cat))), coloredSeries.map((s) => {
                        const points = s.data.map((v, i) => ({ x: xFor(i), y: yFor(v) }));
                        const last = points[points.length - 1];
                        return (_jsxs("g", { children: [_jsx("path", { d: buildLinePath(points), fill: "none", stroke: s.color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }), last && (_jsxs(_Fragment, { children: [_jsx("circle", { cx: last.x, cy: last.y, r: 6, fill: colorTokens.background.primary }), _jsx("circle", { cx: last.x, cy: last.y, r: 4, fill: s.color })] }))] }, s.label));
                    }), categories.map((cat, i) => {
                        const bandWidth = categories.length > 1 ? plotWidth / (categories.length - 1) : plotWidth;
                        return (_jsx("rect", { x: xFor(i) - bandWidth / 2, y: PADDING.top, width: bandWidth, height: plotHeight, fill: "transparent", onMouseMove: (e) => handleHover(e, i), onMouseLeave: () => setTooltip(null) }, cat));
                    })] }), series.length > 1 && (_jsx(Legend, { items: coloredSeries.map((s) => ({ label: s.label, color: s.color })) })), _jsx(ChartTooltip, { state: tooltip })] }));
});
LineChart.displayName = "LineChart";
//# sourceMappingURL=LineChart.js.map