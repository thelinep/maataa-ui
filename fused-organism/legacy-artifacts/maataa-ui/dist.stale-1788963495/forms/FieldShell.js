import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
/**
 * FieldShell
 * Wraps any form control with a consistent label, required indicator,
 * and helper/error message — the same visual contract `Input` applies
 * internally, made reusable for custom controls like `Textarea`,
 * `SearchInput`, `FileInput`, and `Slider`.
 *
 * @example
 * ```tsx
 * <FieldShell label="Bio" htmlFor="bio" helperText="Max 200 characters">
 *   <textarea id="bio" />
 * </FieldShell>
 * ```
 */
export const FieldShell = ({ label, htmlFor, required = false, error, helperText, children, className, style, }) => {
    return (_jsxs("div", { className: className, style: {
            display: "flex",
            flexDirection: "column",
            gap: spacingTokens.xs,
            width: "100%",
            ...style,
        }, children: [label && (_jsxs("label", { htmlFor: htmlFor, style: {
                    fontSize: typographyTokens.fontSize.md,
                    fontWeight: typographyTokens.fontWeight.medium,
                    color: error ? colorTokens.interactive.error : colorTokens.text.primary,
                }, children: [label, required && (_jsx("span", { style: { color: colorTokens.interactive.error, marginLeft: "2px" }, "aria-hidden": "true", children: "*" }))] })), children, error && (_jsx("span", { style: { fontSize: typographyTokens.fontSize.xs, color: colorTokens.interactive.error }, children: error })), helperText && !error && (_jsx("span", { style: { fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }, children: helperText }))] }));
};
FieldShell.displayName = "FieldShell";
//# sourceMappingURL=FieldShell.js.map