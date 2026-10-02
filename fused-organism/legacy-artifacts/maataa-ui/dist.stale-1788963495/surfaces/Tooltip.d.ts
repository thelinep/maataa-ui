/**
 * @maataa/ui/surfaces/Tooltip
 * Floating label for brief contextual information
 */
import React from "react";
export interface TooltipProps {
    /**
     * Tooltip content
     */
    content: React.ReactNode;
    /**
     * Element that triggers the tooltip
     */
    children: React.ReactElement;
    /**
     * Tooltip position
     * @default 'top'
     */
    position?: "top" | "right" | "bottom" | "left";
    /**
     * Delay before showing tooltip (ms)
     * @default 200
     */
    delay?: number;
    /**
     * Whether tooltip is disabled
     * @default false
     */
    disabled?: boolean;
}
/**
 * Tooltip
 * Floating label showing brief information on hover
 */
export declare const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Tooltip.d.ts.map