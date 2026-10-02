import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Card
 * Core card container primitive component
 */
import React from "react";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
/**
 * Card Component
 * A flexible container component for content with optional header and footer
 *
 * @example
 * ```tsx
 * <Card title="Profile" subtitle="User Information">
 *   <p>Card content goes here</p>
 *   <p slot="footer">Footer content</p>
 * </Card>
 * ```
 */
export const Card = React.forwardRef(({ title, subtitle, footer, elevated = false, interactive = false, children, style, ...props }, ref) => {
    const [isHovering, setIsHovering] = React.useState(false);
    return (_jsxs("div", { ref: ref, style: {
            backgroundColor: colorTokens.background.primary,
            border: `1px solid ${colorTokens.interactive.secondary}`,
            borderRadius: radiusTokens.md,
            overflow: "hidden",
            transition: "all 0.3s ease",
            boxShadow: elevated || isHovering ? colorTokens.shadow.lg : colorTokens.shadow.sm,
            cursor: interactive && isHovering ? "pointer" : "default",
            ...style,
        }, onMouseEnter: () => interactive && setIsHovering(true), onMouseLeave: () => interactive && setIsHovering(false), ...props, children: [(title || subtitle) && (_jsxs("div", { style: {
                    padding: spacingTokens.md,
                    borderBottom: `1px solid ${colorTokens.border.secondary}`,
                }, children: [title && (_jsx("h3", { style: {
                            margin: "0 0 4px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: colorTokens.text.primary,
                        }, children: title })), subtitle && (_jsx("p", { style: { margin: "0", fontSize: "13px", color: colorTokens.text.secondary }, children: subtitle }))] })), _jsx("div", { style: { padding: spacingTokens.md }, children: children }), footer && (_jsx("div", { style: {
                    padding: `${spacingTokens.sm} ${spacingTokens.md}`,
                    borderTop: `1px solid ${colorTokens.border.secondary}`,
                    backgroundColor: colorTokens.background.secondary,
                }, children: footer }))] }));
});
Card.displayName = "Card";
//# sourceMappingURL=Card.js.map