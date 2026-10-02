import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/FormSection
 * Groups related fields under a heading and optional description
 */
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
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
export const FormSection = React.forwardRef(({ title, description, divider = true, children, style, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, style: {
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens.md,
            width: "100%",
            ...style,
        }, ...props, children: [(title || description) && (_jsxs("div", { style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: spacingTokens.xs,
                    paddingBottom: divider ? spacingTokens.md : undefined,
                    borderBottom: divider ? `1px solid ${colorTokens.border.primary}` : undefined,
                }, children: [title && (_jsx("h3", { style: {
                            margin: 0,
                            fontSize: typographyTokens.fontSize["2xl"],
                            fontWeight: typographyTokens.fontWeight.semibold,
                            color: colorTokens.text.primary,
                        }, children: title })), description && (_jsx("p", { style: {
                            margin: 0,
                            fontSize: typographyTokens.fontSize.md,
                            color: colorTokens.text.secondary,
                        }, children: description }))] })), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: spacingTokens.md }, children: children })] }));
});
FormSection.displayName = "FormSection";
//# sourceMappingURL=FormSection.js.map