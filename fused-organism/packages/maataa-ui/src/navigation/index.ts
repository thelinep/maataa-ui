/**
 * @maataa/ui/navigation
 * Category: navigation
 * Navigation components for moving through applications
 */

// Tabs
export { Tabs, type TabsProps, type TabItem } from "./Tabs";

// Breadcrumb
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "./Breadcrumb";

// Pagination
export { Pagination, type PaginationProps } from "./Pagination";

// Core navigation & shell components (MUI-06)
export { Menu, type MenuProps, type MenuItem } from "./Menu";
export { Sidebar, type SidebarProps } from "./Sidebar";
export { TopNav, type TopNavProps } from "./TopNav";
export { AppShell, type AppShellProps } from "./AppShell";

// User chip (top bar)
export { UserChip, type UserChipProps } from "./UserChip";

// Catalogue A
export { NotificationBell, type NotificationBellProps } from "./NotificationBell";
export { WizardShell, type WizardShellProps, type WizardStep } from "./WizardShell";
export { safeReturnTo, rememberReturnTo, consumeReturnTo } from "./returnTo";

// Component metadata for Storybook and docs
// UI element catalog batch F
export {
  VerticalTabs,
  SegmentedTabs,
  type VerticalTabsProps,
  type SegmentedTabsProps,
  type TabItem as TabVariantItem,
} from "./TabVariants";
export {
  StickyNavbar,
  HamburgerMenu,
  BottomNav,
  StepDots,
  AnchorNav,
  ScrollToTop,
  LoadMoreButton,
  InfiniteList,
  type NavLink,
  type StickyNavbarProps,
  type HamburgerMenuProps,
  type BottomNavProps,
  type StepDotsProps,
  type AnchorNavProps,
  type AnchorItem,
  type ScrollToTopProps,
  type LoadMoreButtonProps,
  type InfiniteListProps,
} from "./PageNavigation";

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
    description:
      "A vertical application navigation rail, with an optional collapsed/icon-only mode",
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
    description:
      "Responsive workspace frame with configurable navigation, toolbar, content, and footer regions",
  },
];
