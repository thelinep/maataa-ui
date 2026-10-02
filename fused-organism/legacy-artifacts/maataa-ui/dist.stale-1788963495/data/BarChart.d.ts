/**
 * @maataa/ui/data/BarChart
 * A grouped bar chart with gridlines, legend, and hover tooltip
 */
import React from "react";
import type { ChartSeries } from "./LineChart";
export interface BarChartProps {
    /** One or more series, each with one value per `categories` entry. */
    series: ChartSeries[];
    /** X-axis category labels, same length as each series' `data`. */
    categories: string[];
    width?: number;
    height?: number;
    /** Formats a raw value for the tooltip and y-axis ticks. */
    valueFormatter?: (value: number) => string;
    /** Maximum thickness of a single bar, per the design system's mark spec. @default 24 */
    maxBarThickness?: number;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * BarChart
 * Plots one or more series as grouped, 4px-rounded-top bars over a shared
 * 0-anchored y-axis, with recessive gridlines, a legend (when there are two
 * or more series), and a per-bar hover tooltip.
 *
 * @example
 * ```tsx
 * <BarChart
 *   categories={["Q1", "Q2", "Q3", "Q4"]}
 *   series={[{ label: "Revenue", data: [120, 180, 150, 220] }]}
 * />
 * ```
 */
export declare const BarChart: React.ForwardRefExoticComponent<BarChartProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=BarChart.d.ts.map