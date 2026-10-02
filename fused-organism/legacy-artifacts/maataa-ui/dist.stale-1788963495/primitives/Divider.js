import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Divider
 * Visual separator between sections of content
 */
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
/**
 * Divider
 * A thin line separating sections of content, optionally carrying a
 * text label (horizontal orientation only).
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 * ```
 */
export const Divider = React.forwardRef(({ orientation = "horizontal", spacing = "md", label, style, role, ...props }, ref) => {
    if (orientation === "vertical") {
        return (_jsx("div", { ref: ref, role: role ?? "separator", "aria-orientation": "vertical", style: {
                display: "inline-block",
                alignSelf: "stretch",
                width: "1px",
                marginLeft: spacingTokens[spacing],
                marginRight: spacingTokens[spacing],
                backgroundColor: colorTokens.border.primary,
                ...style,
            }, ...props }));
    }
    if (label) {
        return (_jsxs("div", { ref: ref, role: role ?? "separator", style: {
                display: "flex",
                alignItems: "center",
                gap: spacingTokens.sm,
                marginTop: spacingTokens[spacing],
                marginBottom: spacingTokens[spacing],
                ...style,
            }, ...props, children: [_jsx("span", { style: { flex: 1, height: "1px", backgroundColor: colorTokens.border.primary } }), _jsx("span", { style: {
                        fontSize: typographyTokens.fontSize.sm,
                        color: colorTokens.text.secondary,
                        whiteSpace: "nowrap",
                    }, children: label }), _jsx("span", { style: { flex: 1, height: "1px", backgroundColor: colorTokens.border.primary } })] }));
    }
    return (_jsx("div", { ref: ref, role: role ?? "separator", style: {
            width: "100%",
            height: "1px",
            marginTop: spacingTokens[spacing],
            marginBottom: spacingTokens[spacing],
            backgroundColor: colorTokens.border.primary,
            ...style,
        }, ...props }));
});
Divider.displayName = "Divider";
//# sourceMappingURL=Divider.js.map