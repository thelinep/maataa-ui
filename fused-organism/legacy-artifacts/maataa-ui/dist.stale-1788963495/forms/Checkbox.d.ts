/**
 * @maataa/ui/forms/Checkbox
 * Accessible checkbox component with indeterminate state support
 */
import React from "react";
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
    /**
     * Whether checkbox is checked
     */
    checked?: boolean;
    /**
     * Callback when checkbox state changes
     */
    onChange?: (checked: boolean) => void;
    /**
     * Label text displayed next to checkbox
     */
    label?: string;
    /**
     * Description text displayed below checkbox
     */
    description?: string;
    /**
     * Error message to display
     */
    error?: string;
    /**
     * Whether checkbox is in indeterminate state (shows dash)
     */
    indeterminate?: boolean;
    /**
     * Checkbox size
     * @default 'md'
     */
    size?: "sm" | "md" | "lg";
}
/**
 * Checkbox
 * Accessible checkbox input with support for indeterminate state
 */
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Checkbox.d.ts.map