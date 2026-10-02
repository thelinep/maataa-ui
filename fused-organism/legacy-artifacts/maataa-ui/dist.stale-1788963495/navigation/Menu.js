import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/navigation/Menu
 * Static navigational menu list, with optional nested groups
 */
import { useState } from "react";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
const MenuItems = ({ items, activeId, onSelect, orientation, depth, expandedIds, toggleExpanded }) => {
    return (_jsx("ul", { style: {
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: orientation === "horizontal" && depth === 0 ? "row" : "column",
            gap: orientation === "horizontal" && depth === 0 ? spacingTokens.xs : 0,
        }, children: items.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isExpanded = expandedIds.has(item.id);
            const isActive = item.id === activeId;
            const handleClick = () => {
                if (item.disabled)
                    return;
                if (hasChildren) {
                    toggleExpanded(item.id);
                    return;
                }
                item.onClick?.();
                onSelect?.(item.id);
            };
            const content = (_jsxs("span", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: spacingTokens.sm,
                    width: "100%",
                    padding: `${spacingTokens.sm} ${spacingTokens.md}`,
                    paddingLeft: `calc(${spacingTokens.md} + ${depth} * ${spacingTokens.lg})`,
                    borderRadius: radiusTokens.sm,
                    fontSize: typographyTokens.fontSize.md,
                    fontWeight: isActive
                        ? typographyTokens.fontWeight.semibold
                        : typographyTokens.fontWeight.normal,
                    color: isActive ? colorTokens.interactive.primary : colorTokens.text.primary,
                    backgroundColor: isActive ? colorTokens.background.secondary : "transparent",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    opacity: item.disabled ? 0.6 : 1,
                }, children: [item.icon && (_jsx("span", { "aria-hidden": "true", style: { display: "flex" }, children: item.icon })), _jsx("span", { style: { flex: 1 }, children: item.label }), hasChildren && (_jsx("span", { "aria-hidden": "true", style: {
                            fontSize: "10px",
                            transition: "transform 0.2s ease",
                            transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                        }, children: "\u25BE" }))] }));
            return (_jsxs("li", { children: [item.href && !hasChildren ? (_jsx("a", { href: item.href, "aria-current": isActive ? "page" : undefined, onClick: (e) => {
                            if (item.disabled)
                                e.preventDefault();
                            else {
                                item.onClick?.();
                                onSelect?.(item.id);
                            }
                        }, style: { textDecoration: "none", display: "block" }, children: content })) : (_jsx("button", { type: "button", onClick: handleClick, disabled: item.disabled, "aria-expanded": hasChildren ? isExpanded : undefined, "aria-current": isActive ? "page" : undefined, style: {
                            display: "block",
                            width: "100%",
                            border: "none",
                            background: "none",
                            padding: 0,
                            textAlign: "left",
                        }, children: content })), hasChildren && isExpanded && (_jsx(MenuItems, { items: item.children, activeId: activeId, onSelect: onSelect, orientation: "vertical", depth: depth + 1, expandedIds: expandedIds, toggleExpanded: toggleExpanded }))] }, item.id));
        }) }));
};
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
export const Menu = ({ items, activeId, onSelect, orientation = "vertical", defaultExpandedIds = [], className, style, }) => {
    const [expandedIds, setExpandedIds] = useState(new Set(defaultExpandedIds));
    const toggleExpanded = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    return (_jsx("nav", { className: className, style: style, children: _jsx(MenuItems, { items: items, activeId: activeId, onSelect: onSelect, orientation: orientation, depth: 0, expandedIds: expandedIds, toggleExpanded: toggleExpanded }) }));
};
Menu.displayName = "Menu";
//# sourceMappingURL=Menu.js.map