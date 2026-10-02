import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Flex
 * Low-level flexbox container primitive
 */
import React from "react";
import { spacingTokens } from "../tokens";
const alignMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
};
const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    "space-between": "space-between",
    "space-around": "space-around",
    "space-evenly": "space-evenly",
};
/**
 * Flex
 * A low-level flexbox container. Unlike `Stack`, `Flex` makes no
 * assumptions about direction or spacing defaults — it's the raw
 * primitive that `Stack` and other opinionated layouts are built from.
 *
 * @example
 * ```tsx
 * <Flex direction="row" justify="space-between" align="center" gap="md">
 *   <span>Left</span>
 *   <span>Right</span>
 * </Flex>
 * ```
 */
export const Flex = React.forwardRef(({ direction = "row", align = "stretch", justify = "start", wrap = false, gap, inline = false, children, style, ...props }, ref) => {
    const gapValue = gap ? spacingTokens[gap] || gap : undefined;
    return (_jsx("div", { ref: ref, style: {
            display: inline ? "inline-flex" : "flex",
            flexDirection: direction,
            alignItems: alignMap[align],
            justifyContent: justifyMap[justify],
            flexWrap: wrap ? "wrap" : "nowrap",
            gap: gapValue,
            ...style,
        }, ...props, children: children }));
});
Flex.displayName = "Flex";
//# sourceMappingURL=Flex.js.map