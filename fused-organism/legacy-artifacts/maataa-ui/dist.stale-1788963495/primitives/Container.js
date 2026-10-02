import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Container
 * Max-width centered content wrapper
 */
import React from "react";
import { spacingTokens } from "../tokens";
const maxWidths = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    full: "100%",
};
/**
 * Container
 * Constrains content to a maximum width and centers it on the page,
 * with consistent horizontal padding. The standard wrapper for page
 * and section content.
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <h1>Page content</h1>
 * </Container>
 * ```
 */
export const Container = React.forwardRef(({ maxWidth = "lg", padding = "md", centered = true, children, style, ...props }, ref) => {
    return (_jsx("div", { ref: ref, style: {
            width: "100%",
            maxWidth: maxWidths[maxWidth],
            marginLeft: centered ? "auto" : undefined,
            marginRight: centered ? "auto" : undefined,
            paddingLeft: spacingTokens[padding],
            paddingRight: spacingTokens[padding],
            boxSizing: "border-box",
            ...style,
        }, ...props, children: children }));
});
Container.displayName = "Container";
//# sourceMappingURL=Container.js.map