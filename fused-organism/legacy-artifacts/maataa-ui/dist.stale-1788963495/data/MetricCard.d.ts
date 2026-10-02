/**
 * @maataa/ui/data/MetricCard
 * A stat tile: label, headline value, optional delta and trend sparkline
 */
import React from "react";
export interface MetricCardProps {
    /** Sentence-case label, no trailing colon (e.g. "Total revenue"). */
    label: string;
    /** The headline value. A number is auto-compacted (1,284 / 12.9K / $4.2M). */
    value: number | string;
    /** Optional "$" or other prefix applied when `value` is a number. */
    valuePrefix?: string;
    /** Signed change vs. a named prior period, e.g. 12.4 for "+12.4%". */
    delta?: number;
    /** What the delta is measured against, e.g. "vs last week". */
    deltaPeriod?: string;
    /** Whether a positive delta is a good outcome. @default true */
    positiveIsGood?: boolean;
    /** Optional trend sparkline data. */
    trend?: number[];
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const MetricCard: React.ForwardRefExoticComponent<MetricCardProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=MetricCard.d.ts.map