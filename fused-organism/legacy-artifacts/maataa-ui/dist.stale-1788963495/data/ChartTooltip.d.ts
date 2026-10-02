/**
 * @maataa/ui/data/ChartTooltip
 * Internal fixed-position hover tooltip shared by the chart components.
 * Not part of the public API.
 */
import React from "react";
export interface ChartTooltipState {
    x: number;
    y: number;
    title: string;
    rows: {
        label: string;
        value: string;
        color?: string;
    }[];
}
export declare const ChartTooltip: React.FC<{
    state: ChartTooltipState | null;
}>;
//# sourceMappingURL=ChartTooltip.d.ts.map