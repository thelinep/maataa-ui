import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/FormRow
 * Lays multiple fields out side by side, wrapping on narrow widths
 */
import React from "react";
import { spacingTokens } from "../tokens";
/**
 * FormRow
 * Places its fields in a horizontal row with equal flex-basis, so a
 * "First name" / "Last name" pair (for example) shares the width
 * evenly and wraps gracefully on small screens.
 *
 * @example
 * ```tsx
 * <FormRow>
 *   <Input label="First name" />
 *   <Input label="Last name" />
 * </FormRow>
 * ```
 */
export const FormRow = React.forwardRef(({ gap = "md", wrap = true, children, style, ...props }, ref) => {
    return (_jsx("div", { ref: ref, style: {
            display: "flex",
            flexDirection: "row",
            flexWrap: wrap ? "wrap" : "nowrap",
            gap: spacingTokens[gap],
            width: "100%",
            ...style,
        }, ...props, children: React.Children.map(children, (child) => React.isValidElement(child) ? (_jsx("div", { style: { flex: "1 1 200px", minWidth: 0 }, children: child })) : (child)) }));
});
FormRow.displayName = "FormRow";
//# sourceMappingURL=FormRow.js.map