import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Stack
 * Flexible container for stacking elements with consistent spacing
 */
import React from "react";
const spacingMap = {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
    "3xl": "48px",
    "4xl": "56px",
};
/**
 * Stack
 * Flexible container for stacking elements with consistent spacing
 */
export const Stack = React.forwardRef(({ direction = "vertical", spacing = "md", align = "start", justify = "start", wrap = false, fullWidth = false, children, style, ...props }, ref) => {
    const gapValue = spacingMap[spacing] || spacing;
    const alignMap = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        stretch: "stretch",
    };
    const justifyMap = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        "space-between": "space-between",
        "space-around": "space-around",
        "space-evenly": "space-evenly",
    };
    return (_jsx("div", { ref: ref, style: {
            display: "flex",
            flexDirection: direction === "vertical" ? "column" : "row",
            gap: gapValue,
            alignItems: alignMap[align],
            justifyContent: justifyMap[justify],
            flexWrap: wrap ? "wrap" : "nowrap",
            width: fullWidth ? "100%" : "auto",
            ...style,
        }, ...props, children: children }));
});
Stack.displayName = "Stack";
//# sourceMappingURL=Stack.js.map