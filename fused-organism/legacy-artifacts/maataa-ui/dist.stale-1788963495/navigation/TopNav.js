import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colorTokens, spacingTokens } from "../tokens";
import { Menu } from "./Menu";
/**
 * TopNav
 * A horizontal top bar for an application shell: brand on the left,
 * primary navigation in the middle, and actions (search, avatar,
 * notifications) on the right. Pair with `Sidebar` and `AppShell`.
 *
 * @example
 * ```tsx
 * <TopNav
 *   brand={<Logo />}
 *   items={[{ id: "home", label: "Home" }, { id: "docs", label: "Docs" }]}
 *   activeId="home"
 *   actions={<IconButton icon="🔔" aria-label="Notifications" />}
 * />
 * ```
 */
export const TopNav = ({ brand, items, activeId, onSelect, actions, sticky = false, children, }) => {
    return (_jsxs("header", { style: {
            display: "flex",
            alignItems: "center",
            gap: spacingTokens.lg,
            padding: `${spacingTokens.sm} ${spacingTokens.lg}`,
            backgroundColor: colorTokens.background.primary,
            borderBottom: `1px solid ${colorTokens.border.primary}`,
            position: sticky ? "sticky" : "static",
            top: sticky ? 0 : undefined,
            zIndex: sticky ? 100 : undefined,
        }, children: [brand && _jsx("div", { style: { display: "flex", alignItems: "center", flexShrink: 0 }, children: brand }), _jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", overflowX: "auto" }, children: children ??
                    (items && (_jsx(Menu, { items: items, activeId: activeId, onSelect: onSelect, orientation: "horizontal" }))) }), actions && (_jsx("div", { style: { display: "flex", alignItems: "center", gap: spacingTokens.sm, flexShrink: 0 }, children: actions }))] }));
};
TopNav.displayName = "TopNav";
//# sourceMappingURL=TopNav.js.map