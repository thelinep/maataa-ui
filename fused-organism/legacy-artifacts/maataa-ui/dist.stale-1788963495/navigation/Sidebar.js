import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colorTokens, spacingTokens } from "../tokens";
import { Menu } from "./Menu";
/**
 * Sidebar
 * A vertical navigation rail for an application shell, with header
 * and footer slots and an optional collapsed, icon-only width. Pair
 * with `TopNav` and `AppShell` to compose a full app layout.
 *
 * @example
 * ```tsx
 * <Sidebar
 *   header={<Logo />}
 *   items={[{ id: "home", label: "Home", icon: <HomeIcon /> }]}
 *   activeId="home"
 * />
 * ```
 */
export const Sidebar = ({ items, activeId, onSelect, header, footer, collapsed = false, width = "240px", collapsedWidth = "64px", children, }) => {
    return (_jsxs("aside", { style: {
            display: "flex",
            flexDirection: "column",
            width: collapsed ? collapsedWidth : width,
            height: "100%",
            backgroundColor: colorTokens.background.primary,
            borderRight: `1px solid ${colorTokens.border.primary}`,
            transition: "width 0.2s ease",
            overflow: "hidden",
            flexShrink: 0,
        }, children: [header && (_jsx("div", { style: {
                    padding: spacingTokens.md,
                    borderBottom: `1px solid ${colorTokens.border.secondary}`,
                }, children: header })), _jsx("div", { style: { flex: 1, overflowY: "auto", padding: spacingTokens.sm }, children: children ?? (items && _jsx(Menu, { items: items, activeId: activeId, onSelect: onSelect })) }), footer && (_jsx("div", { style: {
                    padding: spacingTokens.md,
                    borderTop: `1px solid ${colorTokens.border.secondary}`,
                }, children: footer }))] }));
};
Sidebar.displayName = "Sidebar";
//# sourceMappingURL=Sidebar.js.map