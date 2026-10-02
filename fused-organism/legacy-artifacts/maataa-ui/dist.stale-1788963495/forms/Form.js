import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/Form
 * Form wrapper with consistent vertical field spacing
 */
import React from "react";
import { spacingTokens } from "../tokens";
/**
 * Form
 * A `<form>` wrapper that prevents the default full-page submit and
 * lays its children out in a vertical stack with consistent spacing —
 * pair it with `FormRow`, `FormSection`, and `FormActions`.
 *
 * @example
 * ```tsx
 * <Form onSubmit={handleSubmit}>
 *   <Input label="Name" />
 *   <FormActions>
 *     <Button type="submit">Save</Button>
 *   </FormActions>
 * </Form>
 * ```
 */
export const Form = React.forwardRef(({ onSubmit, spacing = "lg", children, style, ...props }, ref) => {
    return (_jsx("form", { ref: ref, onSubmit: (e) => {
            e.preventDefault();
            onSubmit?.(e);
        }, style: {
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens[spacing],
            width: "100%",
            ...style,
        }, ...props, children: children }));
});
Form.displayName = "Form";
//# sourceMappingURL=Form.js.map