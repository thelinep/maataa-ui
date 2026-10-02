import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Spacer
 * Flexible or fixed-size gap for flex layouts
 */
import React from "react";
import { spacingTokens } from "../tokens";
/**
 * Spacer
 * Used inside a `Flex` or `Stack` to either grow and fill remaining
 * space (default) or insert a fixed-size gap along one axis.
 *
 * @example
 * ```tsx
 * <Flex>
 *   <span>Left</span>
 *   <Spacer />
 *   <span>Right</span>
 * </Flex>
 * <Spacer size="lg" axis="vertical" />
 * ```
 */
export const Spacer = React.forwardRef(({ size, axis = "vertical", style, "aria-hidden": ariaHidden = true, ...props }, ref) => {
    const resolvedSize = size
        ? spacingTokens[size] || size
        : undefined;
    return (_jsx("div", { ref: ref, "aria-hidden": ariaHidden, style: resolvedSize
            ? {
                flexShrink: 0,
                width: axis === "horizontal" ? resolvedSize : undefined,
                height: axis === "vertical" ? resolvedSize : undefined,
                ...style,
            }
            : {
                flex: 1,
                ...style,
            }, ...props }));
});
Spacer.displayName = "Spacer";
//# sourceMappingURL=Spacer.js.map