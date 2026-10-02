/**
 * @maataa/ui/forms/ValidationMessage
 * Standalone inline validation feedback message
 */
import React from "react";
export type ValidationMessageType = "error" | "warning" | "success" | "info";
export interface ValidationMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Message severity, controlling icon and color
     * @default 'error'
     */
    type?: ValidationMessageType;
    /**
     * The message text
     */
    children: React.ReactNode;
}
/**
 * ValidationMessage
 * A standalone inline feedback message with a severity icon, for use
 * anywhere a field's own `error`/`helperText` prop isn't sufficient —
 * for example, form-level validation summaries.
 *
 * @example
 * ```tsx
 * <ValidationMessage type="error">Please fix the errors below.</ValidationMessage>
 * <ValidationMessage type="success">Changes saved.</ValidationMessage>
 * ```
 */
export declare const ValidationMessage: React.ForwardRefExoticComponent<ValidationMessageProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ValidationMessage.d.ts.map