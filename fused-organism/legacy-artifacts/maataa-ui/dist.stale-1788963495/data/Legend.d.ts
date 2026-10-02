/**
 * @maataa/ui/data/Legend
 * Series identity key for a chart with two or more series
 */
import React from "react";
export interface LegendItem {
    label: string;
    color: string;
}
export interface LegendProps {
    items: LegendItem[];
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const Legend: React.ForwardRefExoticComponent<LegendProps & React.RefAttributes<HTMLUListElement>>;
//# sourceMappingURL=Legend.d.ts.map