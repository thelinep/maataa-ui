/**
 * @maataa/ui/actions/ConfirmButton
 * A button that requires an inline second confirmation before firing
 */
import React from "react";
import { type ButtonProps } from "../primitives/Button";
export interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
    /**
     * Called only after the user confirms the action
     */
    onConfirm: () => void;
    /**
     * Prompt text shown once the button is clicked
     * @default 'Are you sure?'
     */
    confirmText?: string;
    /**
     * Label for the confirming action button
     * @default 'Yes'
     */
    confirmLabel?: string;
    /**
     * Label for the button that cancels the confirmation
     * @default 'Cancel'
     */
    cancelLabel?: string;
}
/**
 * ConfirmButton
 * Guards a destructive or hard-to-undo action behind an inline
 * "Are you sure?" step, rather than a blocking modal dialog. The
 * initial button's label and variant are shown until clicked, at
 * which point it's replaced by a confirm/cancel prompt in place.
 *
 * @example
 * ```tsx
 * <ConfirmButton variant="danger" onConfirm={() => deleteItem(id)}>
 *   Delete
 * </ConfirmButton>
 * ```
 */
export declare const ConfirmButton: React.ForwardRefExoticComponent<ConfirmButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=ConfirmButton.d.ts.map