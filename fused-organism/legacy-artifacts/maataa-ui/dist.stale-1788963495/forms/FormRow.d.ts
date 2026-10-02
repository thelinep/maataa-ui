/**
 * @maataa/ui/forms/FormRow
 * Lays multiple fields out side by side, wrapping on narrow widths
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Gap between fields, from the spacing token scale
     * @default 'md'
     */
    gap?: keyof typeof spacingTokens;
    /**
     * Whether fields should wrap onto multiple lines on narrow containers
     * @default true
     */
    wrap?: boolean;
    children?: React.ReactNode;
}
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
export declare const FormRow: React.ForwardRefExoticComponent<FormRowProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=FormRow.d.ts.map