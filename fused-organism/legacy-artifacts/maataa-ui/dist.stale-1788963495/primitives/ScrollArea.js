import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/ScrollArea
 * Scrollable container with consistent, themed scrollbar styling
 */
import React from "react";
import { colorTokens } from "../tokens";
const overflowByDirection = {
    vertical: { overflowY: "auto", overflowX: "hidden" },
    horizontal: { overflowY: "hidden", overflowX: "auto" },
    both: { overflowY: "auto", overflowX: "auto" },
};
/**
 * ScrollArea
 * A scrollable container with a themed, unobtrusive scrollbar.
 * Falls back gracefully to the platform's default scrollbar in
 * browsers that don't support the `::-webkit-scrollbar` pseudo-elements.
 *
 * @example
 * ```tsx
 * <ScrollArea maxHeight="240px">
 *   <LongListOfItems />
 * </ScrollArea>
 * ```
 */
export const ScrollArea = React.forwardRef(({ maxHeight, maxWidth, direction = "vertical", children, style, className, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: className ? `maataa-scroll-area ${className}` : "maataa-scroll-area", style: {
            maxHeight,
            maxWidth,
            scrollbarWidth: "thin",
            scrollbarColor: `${colorTokens.border.primary} transparent`,
            ...overflowByDirection[direction],
            ...style,
        }, ...props, children: [children, _jsx("style", { children: `
            .maataa-scroll-area::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .maataa-scroll-area::-webkit-scrollbar-track {
              background: transparent;
            }
            .maataa-scroll-area::-webkit-scrollbar-thumb {
              background-color: ${colorTokens.border.primary};
              border-radius: 9999px;
            }
          ` })] }));
});
ScrollArea.displayName = "ScrollArea";
//# sourceMappingURL=ScrollArea.js.map