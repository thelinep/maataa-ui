import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/FormActions
 * Footer row for form submit/cancel buttons
 */
import React from "react";
import { spacingTokens } from "../tokens";
const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    "space-between": "space-between",
};
/**
 * FormActions
 * A horizontal footer row for a form's submit/cancel buttons, right-aligned
 * by default to match common form conventions.
 *
 * @example
 * ```tsx
 * <FormActions>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary" type="submit">Save</Button>
 * </FormActions>
 * ```
 */
export const FormActions = React.forwardRef(({ align = "end", gap = "sm", children, style, ...props }, ref) => {
    return (_jsx("div", { ref: ref, style: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: justifyMap[align],
            gap: spacingTokens[gap],
            width: "100%",
            ...style,
        }, ...props, children: children }));
});
FormActions.displayName = "FormActions";
//# sourceMappingURL=FormActions.js.map