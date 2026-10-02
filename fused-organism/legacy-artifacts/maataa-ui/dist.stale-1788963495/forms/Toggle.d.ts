/**
 * @maataa/ui/forms/Toggle
 * Boolean toggle switch component
 */
import React from "react";
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
    /**
     * Whether toggle is checked
     */
    checked?: boolean;
    /**
     * Callback when toggle state changes
     */
    onChange?: (checked: boolean) => void;
    /**
     * Label text displayed next to toggle
     */
    label?: string;
    /**
     * Description text displayed below toggle
     */
    description?: string;
    /**
     * Toggle size
     * @default 'md'
     */
    size?: "sm" | "md" | "lg";
    /**
     * Color variant
     * @default 'primary'
     */
    color?: "primary" | "success" | "warning" | "error";
}
/**
 * Toggle
 * Boolean toggle switch with animated thumb
 */
export declare const Toggle: React.ForwardRefExoticComponent<ToggleProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Toggle.d.ts.map