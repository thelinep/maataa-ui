import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/ValidationMessage
 * Standalone inline validation feedback message
 */
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
const iconByType = {
    error: "⊗",
    warning: "⚠",
    success: "✓",
    info: "ⓘ",
};
const colorByType = {
    error: { text: colorTokens.semantic.error.text },
    warning: { text: colorTokens.semantic.warning.text },
    success: { text: colorTokens.semantic.success.text },
    info: { text: colorTokens.semantic.info.text },
};
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
export const ValidationMessage = React.forwardRef(({ type = "error", children, style, role, ...props }, ref) => {
    const color = colorByType[type].text;
    return (_jsxs("div", { ref: ref, role: role ?? (type === "error" ? "alert" : "status"), style: {
            display: "flex",
            alignItems: "center",
            gap: spacingTokens.xs,
            fontSize: typographyTokens.fontSize.sm,
            color,
            ...style,
        }, ...props, children: [_jsx("span", { "aria-hidden": "true", children: iconByType[type] }), _jsx("span", { children: children })] }));
});
ValidationMessage.displayName = "ValidationMessage";
//# sourceMappingURL=ValidationMessage.js.map