import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/data/DonutChart
 * Categorical share-of-total, as a ring of stroke segments
 */
import React, { useState } from "react";
import { chartTokens, colorTokens, typographyTokens } from "../tokens";
import { ChartTooltip } from "./ChartTooltip";
import { Legend } from "./Legend";
import { formatCompactNumber } from "./chartUtils";
const GAP = 2;
/**
 * DonutChart
 * Each slice is a stroke segment on a ring, in the design system's
 * CVD-safe categorical order, separated by a 2px surface gap. A legend
 * always accompanies it (color alone never carries identity here), and
 * the ring's center can show the summed total.
 *
 * @example
 * ```tsx
 * <DonutChart
 *   data={[
 *     { label: "Direct", value: 420 },
 *     { label: "Referral", value: 180 },
 *     { label: "Social", value: 90 },
 *   ]}
 * />
 * ```
 */
export const DonutChart = React.forwardRef(({ data, size = 200, thickness = 24, showTotal = true, valueFormatter = String, className, style, }, ref) => {
    const [tooltip, setTooltip] = useState(null);
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    let cumulative = 0;
    const slices = data.map((d, i) => {
        const fraction = d.value / total;
        const length = fraction * circumference;
        const color = d.color ?? chartTokens.categorical[i % chartTokens.categorical.length];
        const offsetBefore = cumulative;
        cumulative += length;
        return { ...d, length, offsetBefore, color, fraction };
    });
    const handleHover = (e, slice) => {
        setTooltip({
            x: e.clientX,
            y: e.clientY - 12,
            title: slice.label,
            rows: [
                {
                    label: `${Math.round(slice.fraction * 1000) / 10}%`,
                    value: valueFormatter(slice.value),
                    color: slice.color,
                },
            ],
        });
    };
    return (_jsxs("div", { className: className, style: { display: "flex", flexDirection: "column", gap: "12px", ...style }, children: [_jsxs("div", { style: { position: "relative", width: size, height: size }, children: [_jsx("svg", { ref: ref, width: size, height: size, viewBox: `0 0 ${size} ${size}`, role: "img", "aria-label": `Donut chart with ${data.length} categories`, children: _jsx("g", { transform: `rotate(-90 ${center} ${center})`, children: slices.map((slice) => {
                                const drawLength = Math.max(slice.length - GAP, 0);
                                return (_jsx("circle", { cx: center, cy: center, r: radius, fill: "none", stroke: slice.color, strokeWidth: thickness, strokeDasharray: `${drawLength} ${circumference - drawLength}`, strokeDashoffset: -slice.offsetBefore, onMouseMove: (e) => handleHover(e, slice), onMouseLeave: () => setTooltip(null) }, slice.label));
                            }) }) }), showTotal && (_jsxs("div", { style: {
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }, children: [_jsx("span", { style: {
                                    fontSize: typographyTokens.fontSize["2xl"],
                                    fontWeight: typographyTokens.fontWeight.semibold,
                                    color: colorTokens.text.primary,
                                }, children: formatCompactNumber(total) }), _jsx("span", { style: {
                                    fontSize: typographyTokens.fontSize.xs,
                                    color: colorTokens.text.secondary,
                                }, children: "Total" })] }))] }), _jsx(Legend, { items: slices.map((s) => ({ label: s.label, color: s.color })) }), _jsx(ChartTooltip, { state: tooltip })] }));
});
DonutChart.displayName = "DonutChart";
//# sourceMappingURL=DonutChart.js.map