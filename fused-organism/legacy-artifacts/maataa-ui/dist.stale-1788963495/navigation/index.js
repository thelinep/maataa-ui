/**
 * @maataa/ui/navigation
 * Category: navigation
 * Navigation components for moving through applications
 */
// Tabs
export { Tabs } from "./Tabs";
// Breadcrumb
export { Breadcrumb } from "./Breadcrumb";
// Pagination
export { Pagination } from "./Pagination";
// Core navigation & shell components (MUI-06)
export { Menu } from "./Menu";
export { Sidebar } from "./Sidebar";
export { TopNav } from "./TopNav";
export { AppShell } from "./AppShell";
// Component metadata for Storybook and docs
export const navigationComponents = [
    {
        id: "menu",
        name: "Menu",
        component: "Menu",
        category: "Navigation",
        description: "A static, in-page navigational menu with optional nested, collapsible groups",
    },
    {
        id: "sidebar",
        name: "Sidebar",
        component: "Sidebar",
        category: "Navigation",
        description: "A vertical application navigation rail, with an optional collapsed/icon-only mode",
    },
    {
        id: "top-nav",
        name: "TopNav",
        component: "TopNav",
        category: "Navigation",
        description: "A horizontal application top bar, with brand, nav items, and actions slots",
    },
    {
        id: "app-shell",
        name: "AppShell",
        component: "AppShell",
        category: "Navigation",
        description: "Composes a top bar, sidebar, and main content area into a full app layout",
    },
];
//# sourceMappingURL=index.js.map