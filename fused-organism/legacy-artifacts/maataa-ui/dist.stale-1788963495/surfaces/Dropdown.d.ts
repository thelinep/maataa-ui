/**
 * @maataa/ui/surfaces/Dropdown
 * Context menu or action dropdown component
 */
import React from "react";
export interface DropdownItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    divider?: boolean;
}
export interface DropdownProps {
    /**
     * Dropdown trigger button content
     */
    trigger: React.ReactNode;
    /**
     * Dropdown menu items
     */
    items: DropdownItem[];
    /**
     * Callback when item is clicked
     */
    onSelect?: (itemId: string) => void;
    /**
     * Position relative to trigger
     * @default 'bottom'
     */
    position?: "top" | "bottom" | "left" | "right";
    /**
     * Whether dropdown is disabled
     * @default false
     */
    disabled?: boolean;
}
/**
 * Dropdown
 * Context menu or action dropdown component
 */
export declare const Dropdown: React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Dropdown.d.ts.map