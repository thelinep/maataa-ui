/**
 * @maataa/ui/data/AreaChart
 * A line chart with a soft fill wash under each series
 */
import React from "react";
import type { ChartSeries } from "./LineChart";
export interface AreaChartProps {
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
 * AreaChart
 * An `LineChart` with a soft ~10%-opacity fill wash under each series'
 * line, down to the baseline — the fill is a wash, never a saturated
 * block, so overlapping series stay legible.
 *
 * @example
 * ```tsx
 * <AreaChart
 *   categories={["Mon", "Tue", "Wed", "Thu", "Fri"]}
 *   series={[{ label: "Sessions", data: [120, 180, 150, 220, 300] }]}
 * />
 * ```
 */
export declare const AreaChart: React.ForwardRefExoticComponent<AreaChartProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=AreaChart.d.ts.map