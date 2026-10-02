/**
 * @maataa/ui/navigation/Menu
 * Static navigational menu list, with optional nested groups
 */
import React from "react";
export interface MenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    /**
     * Nested items, rendered as a collapsible sub-list
     */
    children?: MenuItem[];
}
export interface MenuProps {
    /**
     * The items to render
     */
    items: MenuItem[];
    /**
     * The id of the currently active/selected item
     */
    activeId?: string;
    /**
     * Called when an item without its own `onClick` is selected
     */
    onSelect?: (id: string) => void;
    /**
     * Layout direction
     * @default 'vertical'
     */
    orientation?: "vertical" | "horizontal";
    /**
     * Ids of items whose children start expanded (uncontrolled)
     */
    defaultExpandedIds?: string[];
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Menu
 * A static, in-page navigational menu — as opposed to `Dropdown`,
 * which is a floating action popup. Supports nested, collapsible
 * groups and both vertical and horizontal layouts. `Sidebar` and
 * `TopNav` use `Menu` internally.
 *
 * @example
 * ```tsx
 * <Menu
 *   items={[
 *     { id: "home", label: "Home", href: "/" },
 *     { id: "settings", label: "Settings", children: [
 *       { id: "profile", label: "Profile", href: "/settings/profile" },
 *     ]},
 *   ]}
 *   activeId="home"
 * />
 * ```
 */
export declare const Menu: React.FC<MenuProps>;
//# sourceMappingURL=Menu.d.ts.map