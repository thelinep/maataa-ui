import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/ToggleGroup
 * Mutually exclusive toggle button group
 */
import React from "react";
import { Stack } from "../primitives/Stack";
import { colorTokens, radiusTokens } from "../tokens";
/**
 * ToggleGroup
 * Group of mutually exclusive toggle buttons
 */
export const ToggleGroup = React.forwardRef(({ options, value, onChange, direction = "horizontal", label, disabled = false, size = "md", ...props }, ref) => {
    const sizeMap = {
        sm: { height: "32px", fontSize: "13px", padding: "6px 12px" },
        md: { height: "40px", fontSize: "14px", padding: "8px 16px" },
        lg: { height: "48px", fontSize: "15px", padding: "10px 20px" },
    };
    const currentSize = sizeMap[size];
    return (_jsxs("div", { ref: ref, ...props, style: { width: "100%", ...props.style }, children: [label && (_jsx("label", { style: {
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: colorTokens.text.primary,
                }, children: label })), _jsx(Stack, { direction: direction, spacing: "0", children: options.map((option, index) => {
                    const isSelected = value === option.value;
                    const isOptionDisabled = disabled || option.disabled;
                    return (_jsx("button", { type: "button", onClick: () => !isOptionDisabled && onChange?.(option.value), disabled: isOptionDisabled, "aria-pressed": isSelected, style: {
                            height: currentSize.height,
                            padding: currentSize.padding,
                            fontSize: currentSize.fontSize,
                            fontWeight: isSelected ? 600 : 500,
                            border: `1px solid ${colorTokens.border.primary}`,
                            backgroundColor: isSelected
                                ? colorTokens.interactive.primary
                                : colorTokens.background.primary,
                            color: isSelected ? colorTokens.background.primary : colorTokens.text.primary,
                            cursor: isOptionDisabled ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            opacity: isOptionDisabled ? 0.6 : 1,
                            // Remove border between adjacent buttons
                            borderLeft: index === 0 ? `1px solid ${colorTokens.border.primary}` : "none",
                            borderRight: index === options.length - 1
                                ? `1px solid ${colorTokens.border.primary}`
                                : `1px solid ${colorTokens.border.primary}`,
                            // Round corners for first and last buttons
                            borderRadius: index === 0 && index === options.length - 1
                                ? radiusTokens.md
                                : index === 0
                                    ? `${radiusTokens.md} 0 0 ${radiusTokens.md}`
                                    : index === options.length - 1
                                        ? `0 ${radiusTokens.md} ${radiusTokens.md} 0`
                                        : "0",
                        }, children: option.label }, option.value));
                }) })] }));
});
ToggleGroup.displayName = "ToggleGroup";
//# sourceMappingURL=ToggleGroup.js.map