import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/data/EmptyState
 * Placeholder for a table, chart, or list with nothing to show
 */
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
/**
 * EmptyState
 * A centered placeholder for a `DataTable`, chart, or any list with no
 * data yet — an icon, a title, optional description, and an optional
 * call-to-action.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📊"
 *   title="No results yet"
 *   description="Data will appear here once the first event comes in."
 * />
 * ```
 */
export const EmptyState = React.forwardRef(({ icon, title, description, action, className, style }, ref) => {
    return (_jsxs("div", { ref: ref, className: className, style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: spacingTokens.sm,
            padding: spacingTokens["2xl"],
            color: colorTokens.text.secondary,
            ...style,
        }, children: [icon && (_jsx("div", { "aria-hidden": "true", style: { fontSize: typographyTokens.fontSize["5xl"] }, children: icon })), _jsx("div", { style: {
                    fontSize: typographyTokens.fontSize.lg,
                    fontWeight: typographyTokens.fontWeight.semibold,
                    color: colorTokens.text.primary,
                }, children: title }), description && (_jsx("div", { style: { fontSize: typographyTokens.fontSize.sm, maxWidth: "360px" }, children: description })), action && _jsx("div", { style: { marginTop: spacingTokens.xs }, children: action })] }));
});
EmptyState.displayName = "EmptyState";
//# sourceMappingURL=EmptyState.js.map