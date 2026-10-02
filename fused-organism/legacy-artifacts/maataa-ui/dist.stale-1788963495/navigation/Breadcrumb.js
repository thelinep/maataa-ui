import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/navigation/Breadcrumb
 * Navigation breadcrumb trail component
 */
import React from "react";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens } from "../tokens";
/**
 * Breadcrumb
 * Navigation breadcrumb trail component
 */
export const Breadcrumb = React.forwardRef(({ items, separator = "/", ariaLabel = "Breadcrumb", ...props }, ref) => {
    return (_jsx("nav", { "aria-label": ariaLabel, children: _jsx("ol", { ref: ref, style: {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: spacingTokens.sm,
                margin: 0,
                padding: 0,
                listStyle: "none",
                ...props.style,
            }, ...props, children: items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.active || isLast;
                return (_jsxs("li", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: spacingTokens.sm,
                    }, children: [item.href ? (_jsx("a", { href: item.href, onClick: item.onClick, "aria-current": isActive ? "page" : undefined, style: {
                                color: isActive ? colorTokens.text.primary : colorTokens.interactive.primary,
                                textDecoration: "none",
                                cursor: "pointer",
                                fontWeight: isActive ? 600 : 500,
                                transition: "color 0.2s ease",
                            }, onMouseEnter: (e) => {
                                if (!isActive) {
                                    e.currentTarget.style.textDecoration = "underline";
                                }
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.textDecoration = "none";
                            }, children: item.label })) : (_jsx("span", { onClick: item.onClick, "aria-current": isActive ? "page" : undefined, style: {
                                color: colorTokens.text.primary,
                                fontWeight: isActive ? 600 : 500,
                                cursor: item.onClick ? "pointer" : "default",
                            }, children: item.label })), !isLast && (_jsxs(_Fragment, { children: [_jsx(VisuallyHidden, { children: "/" }), _jsx("span", { "aria-hidden": "true", style: {
                                        color: colorTokens.text.secondary,
                                        margin: `0 ${spacingTokens.xs}`,
                                    }, children: separator })] }))] }, `${item.label}-${index}`));
            }) }) }));
});
Breadcrumb.displayName = "Breadcrumb";
//# sourceMappingURL=Breadcrumb.js.map