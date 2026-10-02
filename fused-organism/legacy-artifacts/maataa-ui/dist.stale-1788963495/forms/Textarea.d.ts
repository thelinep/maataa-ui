/**
 * @maataa/ui/forms/Textarea
 * Multi-line text input with label, error, and helper text support
 */
import React from "react";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    /**
     * Whether the textarea can be resized by the user
     * @default 'vertical'
     */
    resize?: "none" | "vertical" | "horizontal" | "both";
}
/**
 * Textarea
 * A multi-line text input built on `FieldShell` for consistent
 * label/error/helper-text presentation.
 *
 * @example
 * ```tsx
 * <Textarea label="Bio" placeholder="Tell us about yourself" rows={4} />
 * <Textarea label="Notes" error="Notes are required" />
 * ```
 */
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
//# sourceMappingURL=Textarea.d.ts.map