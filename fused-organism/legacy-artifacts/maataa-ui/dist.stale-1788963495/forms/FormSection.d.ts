/**
 * @maataa/ui/forms/FormSection
 * Groups related fields under a heading and optional description
 */
import React from "react";
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Section heading
     */
    title?: string;
    /**
     * Supporting text displayed below the heading
     */
    description?: string;
    /**
     * Whether to render a divider line below the heading/description
     * @default true
     */
    divider?: boolean;
    children?: React.ReactNode;
}
/**
 * FormSection
 * Groups a set of related fields under a heading and optional
 * description, separated from the fields by a thin divider.
 *
 * @example
 * ```tsx
 * <FormSection title="Personal details" description="This is shown on your public profile.">
 *   <Input label="Name" />
 *   <Input label="Email" />
 * </FormSection>
 * ```
 */
export declare const FormSection: React.ForwardRefExoticComponent<FormSectionProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=FormSection.d.ts.map