import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/Checkbox
 * Accessible checkbox component with indeterminate state support
 */
import React from "react";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";
/**
 * Checkbox
 * Accessible checkbox input with support for indeterminate state
 */
export const Checkbox = React.forwardRef(({ checked = false, onChange, label, description, error, indeterminate = false, size = "md", disabled = false, ...props }, ref) => {
    const inputRef = React.useRef(null);
    const mergedRef = React.useMemo(() => (ref || inputRef), [ref]);
    const sizeMap = {
        sm: { size: "16px", fontSize: "13px" },
        md: { size: "20px", fontSize: "14px" },
        lg: { size: "24px", fontSize: "15px" },
    };
    const currentSize = sizeMap[size];
    React.useEffect(() => {
        const input = mergedRef?.current;
        if (input) {
            input.indeterminate = indeterminate;
        }
    }, [indeterminate, mergedRef]);
    const handleChange = (e) => {
        onChange?.(e.target.checked);
    };
    const getCheckmarkContent = () => {
        if (indeterminate)
            return "−";
        if (checked)
            return "✓";
        return "";
    };
    return (_jsxs("div", { style: { width: "100%" }, children: [_jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: spacingTokens.sm }, children: [_jsxs("div", { style: { position: "relative", display: "flex", marginTop: "2px" }, children: [_jsx("input", { ref: mergedRef, type: "checkbox", checked: checked, onChange: handleChange, disabled: disabled, style: {
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                }, ...props }), _jsx("div", { style: {
                                    width: currentSize.size,
                                    height: currentSize.size,
                                    minWidth: currentSize.size,
                                    minHeight: currentSize.size,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `2px solid ${error ? colorTokens.interactive.error : checked || indeterminate ? colorTokens.interactive.success : colorTokens.border.primary}`,
                                    borderRadius: radiusTokens.sm,
                                    backgroundColor: checked || indeterminate
                                        ? colorTokens.interactive.success
                                        : colorTokens.background.primary,
                                    color: colorTokens.background.primary,
                                    fontWeight: "bold",
                                    fontSize: "calc(" + currentSize.size + " * 0.6)",
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    opacity: disabled ? 0.6 : 1,
                                }, children: getCheckmarkContent() })] }), (label || description) && (_jsxs("div", { style: {
                            flex: 1,
                        }, children: [label && (_jsx("label", { style: {
                                    display: "block",
                                    fontSize: currentSize.fontSize,
                                    fontWeight: 500,
                                    color: colorTokens.text.primary,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    opacity: disabled ? 0.6 : 1,
                                }, htmlFor: props.id, children: label })), description && (_jsx("p", { style: {
                                    fontSize: "calc(" + currentSize.fontSize + " * 0.857)", // ~12px for md
                                    color: colorTokens.text.secondary,
                                    marginTop: "4px",
                                }, children: description }))] }))] }), error && (_jsx("p", { style: {
                    fontSize: "calc(" + currentSize.fontSize + " * 0.857)",
                    color: colorTokens.interactive.error,
                    marginTop: "4px",
                    marginLeft: "calc(" + currentSize.size + " + " + spacingTokens.sm + ")",
                }, children: error }))] }));
});
Checkbox.displayName = "Checkbox";
//# sourceMappingURL=Checkbox.js.map