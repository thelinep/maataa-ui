/**
 * @maataa/ui/navigation/AppShell
 * Composes a top bar, sidebar, and main content area into a full app layout
 */
import React from "react";
export interface AppShellProps {
    /**
     * Top bar content, typically a `TopNav`. Spans the full width above
     * the sidebar and main content.
     */
    topNav?: React.ReactNode;
    /**
     * Sidebar content, typically a `Sidebar`. Rendered to the left of
     * the main content, below `topNav`.
     */
    sidebar?: React.ReactNode;
    /**
     * The page's main content
     */
    children: React.ReactNode;
    /**
     * Whether the layout fills the viewport height
     * @default true
     */
    fullHeight?: boolean;
}
/**
 * AppShell
 * The top-level layout for an application: an optional full-width top
 * bar, an optional sidebar, and a scrollable main content area. Pass
 * `TopNav` and `Sidebar` (or any custom content) into the matching slots.
 *
 * @example
 * ```tsx
 * <AppShell topNav={<TopNav brand={<Logo />} />} sidebar={<Sidebar items={navItems} />}>
 *   <PageContent />
 * </AppShell>
 * ```
 */
export declare const AppShell: React.FC<AppShellProps>;
//# sourceMappingURL=AppShell.d.ts.map