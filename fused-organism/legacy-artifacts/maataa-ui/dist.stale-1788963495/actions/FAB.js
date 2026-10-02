import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/actions/FAB
 * Floating action button for a screen's primary, most-frequent action
 */
import React from "react";
import { colorTokens, radiusTokens, spacingTokens, transitionTokens } from "../tokens";
const sizeStyles = {
    md: { diameter: "48px", fontSize: "20px" },
    lg: { diameter: "56px", fontSize: "24px" },
};
const positionStyles = {
    static: {},
    "bottom-right": { position: "fixed", bottom: spacingTokens.lg, right: spacingTokens.lg },
    "bottom-left": { position: "fixed", bottom: spacingTokens.lg, left: spacingTokens.lg },
    "top-right": { position: "fixed", top: spacingTokens.lg, right: spacingTokens.lg },
    "top-left": { position: "fixed", top: spacingTokens.lg, left: spacingTokens.lg },
};
/**
 * FAB
 * A prominent, circular (or extended, when given a `label`) button
 * for a screen's single most important action. Positioned fixed in a
 * screen corner by default.
 *
 * @example
 * ```tsx
 * <FAB icon="+" aria-label="Create new item" />
 * <FAB icon="+" label="New task" position="static" />
 * ```
 */
export const FAB = React.forwardRef(({ icon, label, size = "lg", position = "bottom-right", disabled, style, ...props }, ref) => {
    const { diameter, fontSize } = sizeStyles[size];
    return (_jsxs("button", { ref: ref, type: "button", disabled: disabled, style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: spacingTokens.sm,
            height: diameter,
            width: label ? "auto" : diameter,
            minWidth: diameter,
            padding: label ? `0 ${spacingTokens.lg}` : 0,
            fontSize,
            fontWeight: 500,
            border: "none",
            borderRadius: label ? radiusTokens.full : radiusTokens.full,
            backgroundColor: colorTokens.interactive.primary,
            color: colorTokens.text.inverse,
            boxShadow: colorTokens.shadow.lg,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
            transition: `all ${transitionTokens.base}`,
            zIndex: 100,
            ...positionStyles[position],
            ...style,
        }, ...props, children: [_jsx("span", { "aria-hidden": Boolean(label), children: icon }), label && _jsx("span", { style: { fontSize: "14px" }, children: label })] }));
});
FAB.displayName = "FAB";
//# sourceMappingURL=FAB.js.map