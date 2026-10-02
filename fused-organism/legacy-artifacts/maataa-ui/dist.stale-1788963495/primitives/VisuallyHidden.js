import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/VisuallyHidden
 * Component for hiding content visually while keeping it accessible to screen readers
 */
import React from "react";
/**
 * VisuallyHidden
 * Hides content visually while keeping it accessible to screen readers
 * Follows ARIA best practices for accessibility
 */
export const VisuallyHidden = React.forwardRef(({ focusable = false, children, style, ...props }, ref) => {
    return (_jsx("span", { ref: ref, style: {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0",
            ...(focusable && {
                "&:focus": {
                    clip: "auto",
                    width: "auto",
                    height: "auto",
                    overflow: "visible",
                },
            }),
            ...style,
        }, ...props, children: children }));
});
VisuallyHidden.displayName = "VisuallyHidden";
//# sourceMappingURL=VisuallyHidden.js.map