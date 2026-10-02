/**
 * @maataa/ui/forms/ToggleGroup
 * Mutually exclusive toggle button group
 */
import React from "react";
export interface ToggleGroupOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /**
     * Array of toggle options
     */
    options: ToggleGroupOption[];
    /**
     * Currently selected value
     */
    value?: string;
    /**
     * Callback when selection changes
     */
    onChange?: (value: string) => void;
    /**
     * Layout direction
     * @default 'horizontal'
     */
    direction?: "horizontal" | "vertical";
    /**
     * Group label
     */
    label?: string;
    /**
     * Whether group is disabled
     */
    disabled?: boolean;
    /**
     * Button size
     * @default 'md'
     */
    size?: "sm" | "md" | "lg";
}
/**
 * ToggleGroup
 * Group of mutually exclusive toggle buttons
 */
export declare const ToggleGroup: React.ForwardRefExoticComponent<ToggleGroupProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ToggleGroup.d.ts.map