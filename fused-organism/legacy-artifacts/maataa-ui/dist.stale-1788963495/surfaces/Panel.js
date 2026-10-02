import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/surfaces/Panel
 * Static layout region with an optional header, actions, and collapse toggle
 */
import React, { useState } from "react";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
/**
 * Panel
 * A larger, static layout region — a dashboard sidebar section, a
 * settings group, an inspector pane — with an optional header, header
 * actions, and an optional collapse toggle. Unlike `Card`, `Panel` is
 * meant for full-height/full-width layout regions rather than
 * standalone content cards.
 *
 * @example
 * ```tsx
 * <Panel title="Filters" collapsible>
 *   <Checkbox label="Active only" />
 * </Panel>
 * ```
 */
export const Panel = React.forwardRef(({ title, actions, collapsible = false, defaultCollapsed = false, collapsed, onCollapsedChange, children, style, ...props }, ref) => {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const isControlled = collapsed !== undefined;
    const isCollapsed = isControlled ? collapsed : internalCollapsed;
    const toggle = () => {
        const next = !isCollapsed;
        if (!isControlled)
            setInternalCollapsed(next);
        onCollapsedChange?.(next);
    };
    return (_jsxs("div", { ref: ref, style: {
            display: "flex",
            flexDirection: "column",
            backgroundColor: colorTokens.background.primary,
            border: `1px solid ${colorTokens.border.primary}`,
            borderRadius: radiusTokens.md,
            overflow: "hidden",
            ...style,
        }, ...props, children: [(title || actions) && (_jsxs("div", { role: collapsible ? "button" : undefined, tabIndex: collapsible ? 0 : undefined, onClick: collapsible ? toggle : undefined, onKeyDown: collapsible
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle();
                        }
                    }
                    : undefined, "aria-expanded": collapsible ? !isCollapsed : undefined, style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacingTokens.sm,
                    padding: spacingTokens.md,
                    borderBottom: isCollapsed ? undefined : `1px solid ${colorTokens.border.secondary}`,
                    cursor: collapsible ? "pointer" : "default",
                    backgroundColor: colorTokens.background.secondary,
                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: spacingTokens.xs }, children: [collapsible && (_jsx("span", { "aria-hidden": "true", style: {
                                    display: "inline-block",
                                    transition: "transform 0.2s ease",
                                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                                    fontSize: "12px",
                                    color: colorTokens.text.secondary,
                                }, children: "\u25BE" })), title && (_jsx("span", { style: {
                                    fontSize: typographyTokens.fontSize.lg,
                                    fontWeight: typographyTokens.fontWeight.semibold,
                                    color: colorTokens.text.primary,
                                }, children: title }))] }), actions && (_jsx("div", { onClick: (e) => e.stopPropagation(), style: { display: "flex", gap: spacingTokens.xs }, children: actions }))] })), !isCollapsed && _jsx("div", { style: { padding: spacingTokens.md }, children: children })] }));
});
Panel.displayName = "Panel";
//# sourceMappingURL=Panel.js.map