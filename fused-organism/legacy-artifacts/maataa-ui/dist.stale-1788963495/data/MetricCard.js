import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/data/MetricCard
 * A stat tile: label, headline value, optional delta and trend sparkline
 */
import React from "react";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { formatCompactNumber } from "./chartUtils";
import { Sparkline } from "./Sparkline";
/**
 * MetricCard
 * The stat-tile figure from the data-viz guidelines: a sentence-case label,
 * an auto-compacted headline value, an optional signed delta colored by
 * direction × whether up is good for this metric, and an optional trend
 * sparkline.
 *
 * @example
 * ```tsx
 * <MetricCard
 *   label="Total revenue"
 *   value={128400}
 *   valuePrefix="$"
 *   delta={12.4}
 *   deltaPeriod="vs last month"
 *   trend={[4, 6, 5, 8, 9, 7, 10]}
 * />
 * ```
 */
export const MetricCard = React.forwardRef(({ label, value, valuePrefix = "", delta, deltaPeriod, positiveIsGood = true, trend, className, style, }, ref) => {
    const displayValue = typeof value === "number" ? formatCompactNumber(value, valuePrefix) : value;
    const isGoodDelta = delta !== undefined && delta >= 0 === positiveIsGood;
    const deltaColor = delta === undefined
        ? undefined
        : delta === 0
            ? colorTokens.text.secondary
            : isGoodDelta
                ? colorTokens.interactive.success
                : colorTokens.interactive.error;
    return (_jsxs("div", { ref: ref, className: className, style: {
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens.xs,
            padding: spacingTokens.lg,
            backgroundColor: colorTokens.background.primary,
            border: `1px solid ${colorTokens.border.primary}`,
            borderRadius: radiusTokens.lg,
            ...style,
        }, children: [_jsx("span", { style: {
                    fontSize: typographyTokens.fontSize.sm,
                    color: colorTokens.text.secondary,
                }, children: label }), _jsxs("div", { style: {
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: spacingTokens.md,
                }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: spacingTokens.xs }, children: [_jsx("span", { style: {
                                    fontSize: typographyTokens.fontSize["4xl"],
                                    fontWeight: typographyTokens.fontWeight.semibold,
                                    color: colorTokens.text.primary,
                                    lineHeight: typographyTokens.lineHeight.tight,
                                }, children: displayValue }), delta !== undefined && (_jsxs("span", { style: { fontSize: typographyTokens.fontSize.xs, color: deltaColor }, children: [delta > 0 ? "▲" : delta < 0 ? "▼" : "–", " ", Math.abs(delta), "%", deltaPeriod && (_jsxs("span", { style: { color: colorTokens.text.secondary }, children: [" ", deltaPeriod] }))] }))] }), trend && trend.length > 0 && (_jsx(Sparkline, { data: trend, color: isGoodDelta || delta === undefined
                            ? colorTokens.interactive.success
                            : colorTokens.interactive.error, "aria-label": `${label} trend` }))] })] }));
});
MetricCard.displayName = "MetricCard";
//# sourceMappingURL=MetricCard.js.map