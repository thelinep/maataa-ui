/**
 * @maataa/ui/data/DonutChart
 * Categorical share-of-total, as a ring of stroke segments
 */
import React from "react";
export interface DonutSlice {
    label: string;
    value: number;
    color?: string;
}
export interface DonutChartProps {
    data: DonutSlice[];
    size?: number;
    /** Ring thickness in px. @default 24 */
    thickness?: number;
    /** Shows the summed total in the center of the ring. @default true */
    showTotal?: boolean;
    /** Formats a raw value for the tooltip and (when `showTotal`) the center label. */
    valueFormatter?: (value: number) => string;
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const DonutChart: React.ForwardRefExoticComponent<DonutChartProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=DonutChart.d.ts.map