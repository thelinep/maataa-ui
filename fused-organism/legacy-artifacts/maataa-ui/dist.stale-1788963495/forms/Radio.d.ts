/**
 * @maataa/ui/forms/Radio
 * Accessible radio button components
 */
import React from "react";
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
    /**
     * Radio button value
     */
    value: string;
    /**
     * Whether radio is selected
     */
    checked?: boolean;
    /**
     * Callback when radio state changes
     */
    onChange?: (checked: boolean) => void;
    /**
     * Label text displayed next to radio
     */
    label?: string;
    /**
     * Description text displayed below radio
     */
    description?: string;
    /**
     * Radio button size
     * @default 'md'
     */
    size?: "sm" | "md" | "lg";
}
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /**
     * Radio group name (for native grouping)
     */
    name: string;
    /**
     * Array of radio options
     */
    options: Array<{
        value: string;
        label: string;
        description?: string;
        disabled?: boolean;
    }>;
    /**
     * Currently selected value
     */
    value?: string;
    /**
     * Callback when selection changes
     */
    onChange?: (value: string) => void;
    /**
     * Group label
     */
    label?: string;
    /**
     * Group description
     */
    description?: string;
    /**
     * Layout direction
     * @default 'vertical'
     */
    direction?: "vertical" | "horizontal";
    /**
     * Whether group is disabled
     */
    disabled?: boolean;
    /**
     * Radio button size
     * @default 'md'
     */
    size?: "sm" | "md" | "lg";
}
/**
 * Radio
 * Individual radio button component
 */
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
/**
 * RadioGroup
 * Group of radio buttons with label and state management
 */
export declare const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Radio.d.ts.map