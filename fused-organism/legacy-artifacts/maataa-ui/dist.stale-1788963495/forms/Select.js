import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/Select
 * Advanced dropdown select component with search and multi-select support
 */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Portal } from "../primitives/Portal";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";
/**
 * Select
 * Advanced dropdown select component with optional search and multi-select capabilities
 */
export const Select = React.forwardRef(({ options, value, onChange, placeholder = "Select an option", searchable = false, multiSelect = false, disabled = false, error, label, description, size = "md", ...props }, ref) => {
    const normalizedValue = value !== undefined ? value : multiSelect ? [] : "";
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const currentValue = Array.isArray(normalizedValue)
        ? normalizedValue
        : normalizedValue
            ? [normalizedValue]
            : [];
    // Filter options based on search term
    const filteredOptions = searchable
        ? options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;
    // Get display text for selected values
    const getDisplayText = useCallback(() => {
        if (currentValue.length === 0)
            return placeholder;
        if (multiSelect)
            return `${currentValue.length} selected`;
        const selected = options.find((opt) => opt.value === currentValue[0]);
        return selected ? selected.label : placeholder;
    }, [currentValue, multiSelect, options, placeholder]);
    // Handle option selection
    const handleSelect = (selectedValue) => {
        if (multiSelect) {
            const newValue = currentValue.includes(selectedValue)
                ? currentValue.filter((v) => v !== selectedValue)
                : [...currentValue, selectedValue];
            onChange?.(newValue);
        }
        else {
            onChange?.(selectedValue);
            setIsOpen(false);
            setSearchTerm("");
        }
    };
    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex].value);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearchTerm("");
                break;
            default:
                break;
        }
    };
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        if (!isOpen)
            return;
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);
    // Reset highlighted index when filtered options change
    useEffect(() => {
        setHighlightedIndex(0);
    }, [filteredOptions]);
    // Focus management
    useEffect(() => {
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable]);
    const sizeMap = {
        sm: { height: "32px", fontSize: "14px", padding: "8px 12px" },
        md: { height: "40px", fontSize: "14px", padding: "10px 14px" },
        lg: { height: "48px", fontSize: "15px", padding: "12px 16px" },
    };
    const currentSize = sizeMap[size];
    return (_jsxs("div", { ref: ref, ...props, style: {
            width: "100%",
            ...props.style,
        }, children: [label && (_jsx("label", { style: {
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: colorTokens.text.primary,
                }, children: label })), description && (_jsx("p", { style: {
                    fontSize: "12px",
                    color: colorTokens.text.secondary,
                    marginBottom: "8px",
                }, children: description })), _jsxs("div", { ref: containerRef, style: {
                    position: "relative",
                    width: "100%",
                }, children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), disabled: disabled, onKeyDown: handleKeyDown, style: {
                            width: "100%",
                            ...currentSize,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: `1px solid ${error ? colorTokens.interactive.error : colorTokens.border.primary}`,
                            borderRadius: radiusTokens.md,
                            backgroundColor: disabled
                                ? colorTokens.background.tertiary
                                : colorTokens.background.primary,
                            color: colorTokens.text.primary,
                            cursor: disabled ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            opacity: disabled ? 0.6 : 1,
                        }, "aria-expanded": isOpen, "aria-haspopup": "listbox", children: [searchable && isOpen ? (_jsx("input", { ref: inputRef, type: "text", placeholder: placeholder, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyDown: handleKeyDown, style: {
                                    flex: 1,
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "transparent",
                                    color: colorTokens.text.primary,
                                    fontSize: "inherit",
                                } })) : (_jsx("span", { children: getDisplayText() })), _jsx("span", { style: {
                                    marginLeft: spacingTokens.sm,
                                    color: colorTokens.text.secondary,
                                }, children: "\u25BC" })] }), error && (_jsx("p", { style: {
                            fontSize: "12px",
                            color: colorTokens.interactive.error,
                            marginTop: "4px",
                        }, children: error })), isOpen && (_jsx(Portal, { children: _jsx("div", { ref: dropdownRef, style: {
                                position: "fixed",
                                top: "0",
                                left: "0",
                                zIndex: 1000,
                                width: containerRef.current?.offsetWidth,
                                maxHeight: "300px",
                                marginTop: spacingTokens.sm,
                                backgroundColor: colorTokens.background.primary,
                                border: `1px solid ${colorTokens.border.primary}`,
                                borderRadius: radiusTokens.md,
                                boxShadow: colorTokens.shadow.md,
                                overflow: "hidden",
                                ...(() => {
                                    if (!containerRef.current)
                                        return {};
                                    const rect = containerRef.current.getBoundingClientRect();
                                    return {
                                        top: `${rect.bottom + 8}px`,
                                        left: `${rect.left}px`,
                                    };
                                })(),
                            }, role: "listbox", "aria-label": label, children: _jsx("div", { style: { maxHeight: "300px", overflowY: "auto" }, children: filteredOptions.length === 0 ? (_jsx("div", { style: {
                                        padding: spacingTokens.md,
                                        textAlign: "center",
                                        color: colorTokens.text.secondary,
                                    }, children: "No options found" })) : (filteredOptions.map((option, index) => {
                                    const isSelected = currentValue.includes(option.value);
                                    const isHighlighted = index === highlightedIndex;
                                    return (_jsxs("div", { role: "option", "aria-selected": isSelected, onClick: () => !option.disabled && handleSelect(option.value), style: {
                                            padding: spacingTokens.md,
                                            backgroundColor: isHighlighted
                                                ? colorTokens.background.secondary
                                                : "transparent",
                                            cursor: option.disabled ? "not-allowed" : "pointer",
                                            opacity: option.disabled ? 0.6 : 1,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: spacingTokens.sm,
                                        }, children: [multiSelect && (_jsx("input", { type: "checkbox", checked: isSelected, onChange: () => { }, style: { cursor: "pointer" } })), _jsx("span", { children: option.label })] }, option.value));
                                })) }) }) }))] })] }));
});
Select.displayName = "Select";
//# sourceMappingURL=Select.js.map