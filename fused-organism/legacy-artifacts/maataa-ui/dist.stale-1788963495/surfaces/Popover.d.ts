/**
 * @maataa/ui/surfaces/Popover
 * Floating panel with more content than a tooltip
 */
import React from "react";
export interface PopoverProps {
    /**
     * Popover content
     */
    content: React.ReactNode;
    /**
     * Element that triggers the popover
     */
    children: React.ReactElement;
    /**
     * Popover position
     * @default 'bottom'
     */
    position?: "top" | "right" | "bottom" | "left";
    /**
     * Popover title
     */
    title?: string;
    /**
     * Whether popover is controlled
     */
    isOpen?: boolean;
    /**
     * Callback when popover open state changes
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Whether popover is disabled
     * @default false
     */
    disabled?: boolean;
}
/**
 * Popover
 * Floating panel with more content than a tooltip
 */
export declare const Popover: React.ForwardRefExoticComponent<PopoverProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Popover.d.ts.map