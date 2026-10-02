/**
 * @maataa/ui/data/LineChart
 * A multi-series line chart with gridlines, legend, and hover tooltip
 */
import React from "react";
export interface ChartSeries {
    label: string;
    data: number[];
    color?: string;
}
export interface LineChartProps {
    /** One or more series, each with one value per `categories` entry. */
    series: ChartSeries[];
    /** X-axis category labels, same length as each series' `data`. */
    categories: string[];
    width?: number;
    height?: number;
    /** Formats a raw value for the tooltip and y-axis ticks. */
    valueFormatter?: (value: number) => string;
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const LineChart: React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=LineChart.d.ts.map