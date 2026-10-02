import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Box
 * Generic building-block container exposing token-based style shorthands
 */
import React from "react";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
/**
 * Box
 * The most generic layout primitive: a `div` with token-based padding,
 * margin, background, radius, and border shorthands. Use it as the base
 * for one-off layout needs that don't warrant a more opinionated
 * component like `Flex`, `Grid`, or `Stack`.
 *
 * @example
 * ```tsx
 * <Box padding="md" background="secondary" radius="lg" border>
 *   Content
 * </Box>
 * ```
 */
export const Box = React.forwardRef(({ padding, margin, background, radius, border = false, children, style, ...props }, ref) => {
    return (_jsx("div", { ref: ref, style: {
            padding: padding ? spacingTokens[padding] : undefined,
            margin: margin ? spacingTokens[margin] : undefined,
            backgroundColor: background ? colorTokens.background[background] : undefined,
            borderRadius: radius ? radiusTokens[radius] : undefined,
            border: border ? `1px solid ${colorTokens.border.primary}` : undefined,
            ...style,
        }, ...props, children: children }));
});
Box.displayName = "Box";
//# sourceMappingURL=Box.js.map