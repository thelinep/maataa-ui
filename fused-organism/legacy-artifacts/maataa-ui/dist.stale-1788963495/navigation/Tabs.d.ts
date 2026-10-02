/**
 * @maataa/ui/navigation/Tabs
 * Tabbed interface component with keyboard navigation
 */
import React from "react";
export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
}
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /**
     * Array of tab items
     */
    tabs: TabItem[];
    /**
     * Default active tab ID
     */
    defaultTab?: string;
    /**
     * Callback when tab changes
     */
    onChange?: (tabId: string) => void;
    /**
     * Tab variant style
     * @default 'line'
     */
    variant?: "line" | "box" | "pill";
    /**
     * Whether tabs are disabled
     */
    disabled?: boolean;
}
/**
 * Tabs
 * Tabbed interface with keyboard navigation support
 */
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Tabs.d.ts.map