import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colorTokens } from "../tokens";
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
export const AppShell = ({ topNav, sidebar, children, fullHeight = true, }) => {
    return (_jsxs("div", { style: {
            display: "flex",
            flexDirection: "column",
            height: fullHeight ? "100vh" : "100%",
            backgroundColor: colorTokens.background.secondary,
        }, children: [topNav, _jsxs("div", { style: { display: "flex", flex: 1, minHeight: 0 }, children: [sidebar, _jsx("main", { style: { flex: 1, overflowY: "auto" }, children: children })] })] }));
};
AppShell.displayName = "AppShell";
//# sourceMappingURL=AppShell.js.map