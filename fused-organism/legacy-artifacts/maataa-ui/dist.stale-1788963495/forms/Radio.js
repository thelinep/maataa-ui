import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/Radio
 * Accessible radio button components
 */
import React from "react";
import { Stack } from "../primitives/Stack";
import { colorTokens, spacingTokens } from "../tokens";
/**
 * Radio
 * Individual radio button component
 */
export const Radio = React.forwardRef(({ value, checked = false, onChange, label, description, size = "md", disabled = false, ...props }, ref) => {
    const sizeMap = {
        sm: { size: "16px", fontSize: "13px" },
        md: { size: "20px", fontSize: "14px" },
        lg: { size: "24px", fontSize: "15px" },
    };
    const currentSize = sizeMap[size];
    const handleChange = (e) => {
        onChange?.(e.target.checked);
    };
    return (_jsx("div", { style: { width: "100%" }, children: _jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: spacingTokens.sm }, children: [_jsxs("div", { style: { position: "relative", display: "flex", marginTop: "2px" }, children: [_jsx("input", { ref: ref, type: "radio", value: value, checked: checked, onChange: handleChange, disabled: disabled, style: {
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
                                border: `2px solid ${checked ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                                borderRadius: "50%",
                                backgroundColor: colorTokens.background.primary,
                                cursor: disabled ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                opacity: disabled ? 0.6 : 1,
                            }, children: checked && (_jsx("div", { style: {
                                    width: "calc(" + currentSize.size + " * 0.5)",
                                    height: "calc(" + currentSize.size + " * 0.5)",
                                    borderRadius: "50%",
                                    backgroundColor: colorTokens.interactive.primary,
                                } })) })] }), (label || description) && (_jsxs("div", { style: { flex: 1 }, children: [label && (_jsx("label", { style: {
                                display: "block",
                                fontSize: currentSize.fontSize,
                                fontWeight: 500,
                                color: colorTokens.text.primary,
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.6 : 1,
                            }, htmlFor: props.id, children: label })), description && (_jsx("p", { style: {
                                fontSize: "calc(" + currentSize.fontSize + " * 0.857)",
                                color: colorTokens.text.secondary,
                                marginTop: "4px",
                            }, children: description }))] }))] }) }));
});
Radio.displayName = "Radio";
/**
 * RadioGroup
 * Group of radio buttons with label and state management
 */
export const RadioGroup = React.forwardRef(({ name, options, value, onChange, label, description, direction = "vertical", disabled = false, size = "md", ...props }, ref) => {
    return (_jsxs("div", { ref: ref, ...props, style: { width: "100%", ...props.style }, children: [label && (_jsx("label", { style: {
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: colorTokens.text.primary,
                }, children: label })), description && (_jsx("p", { style: {
                    fontSize: "12px",
                    color: colorTokens.text.secondary,
                    marginBottom: "8px",
                }, children: description })), _jsx(Stack, { direction: direction === "vertical" ? "vertical" : "horizontal", spacing: "sm", children: options.map((option) => (_jsx(Radio, { name: name, value: option.value, checked: value === option.value, onChange: () => onChange?.(option.value), label: option.label, description: option.description, disabled: disabled || option.disabled, size: size }, option.value))) })] }));
});
RadioGroup.displayName = "RadioGroup";
//# sourceMappingURL=Radio.js.map