/**
 * @maataa/ui/data/Sparkline
 * A compact, axis-free inline trend line
 */
import React from "react";
export interface SparklineProps {
    /** The series values, in order. */
    data: number[];
    width?: number;
    height?: number;
    /** Line color. Defaults to the system's single-series brand color. */
    color?: string;
    /** Highlights the final point with a filled dot. @default true */
    showEndDot?: boolean;
    /** Accessible label summarizing what the sparkline shows. */
    "aria-label"?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Sparkline
 * A minimal inline trend line with no axes or gridlines — for a stat
 * tile's `trend`, or any place a full chart would be too heavy.
 *
 * @example
 * ```tsx
 * <Sparkline data={[4, 6, 5, 8, 9, 7, 10]} aria-label="Last 7 days" />
 * ```
 */
export declare const Sparkline: React.ForwardRefExoticComponent<SparklineProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=Sparkline.d.ts.map