/**
 * @maataa/ui/primitives/Input
 * Core input field primitive component
 */
import React from "react";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}
/**
 * Input Component
 * A text input component with optional label, error messaging, and helper text
 *
 * @example
 * ```tsx
 * <Input label="Email" type="email" placeholder="user@example.com" />
 * <Input label="Password" type="password" error="Password is required" />
 * <Input helperText="Enter a valid email address" />
 * ```
 */
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Input.d.ts.map