/**
 * @maataa/ui/forms/FormActions
 * Footer row for form submit/cancel buttons
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Horizontal alignment of the action buttons
     * @default 'end'
     */
    align?: "start" | "center" | "end" | "space-between";
    /**
     * Gap between buttons, from the spacing token scale
     * @default 'sm'
     */
    gap?: keyof typeof spacingTokens;
    children?: React.ReactNode;
}
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
export declare const FormActions: React.ForwardRefExoticComponent<FormActionsProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=FormActions.d.ts.map