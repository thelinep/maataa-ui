/**
 * @maataa/ui/forms/Select
 * Advanced dropdown select component with search and multi-select support
 */
import React from "react";
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    options: SelectOption[];
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    searchable?: boolean;
    multiSelect?: boolean;
    disabled?: boolean;
    error?: string;
    label?: string;
    description?: string;
    size?: "sm" | "md" | "lg";
}
/**
 * Select
 * Advanced dropdown select component with optional search and multi-select capabilities
 */
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Select.d.ts.map