import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/surfaces/Dropdown
 * Context menu or action dropdown component
 */
import React, { useState, useRef, useEffect } from "react";
import { Portal } from "../primitives/Portal";
import { Stack } from "../primitives/Stack";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";
/**
 * Dropdown
 * Context menu or action dropdown component
 */
export const Dropdown = React.forwardRef(({ trigger, items, onSelect, position = "bottom", disabled = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const handleClickOutside = (event) => {
        if (triggerRef.current &&
            dropdownRef.current &&
            !triggerRef.current.contains(event.target) &&
            !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    const handleItemClick = (itemId) => {
        const item = items.find((i) => i.id === itemId);
        if (item && !item.disabled) {
            item.onClick?.();
            onSelect?.(itemId);
            setIsOpen(false);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        if (!isOpen || !triggerRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current?.getBoundingClientRect();
        if (!dropdownRect)
            return;
        let x = 0;
        let y = 0;
        const gap = 8;
        switch (position) {
            case "bottom":
                x = triggerRect.left;
                y = triggerRect.bottom + gap;
                break;
            case "top":
                x = triggerRect.left;
                y = triggerRect.top - dropdownRect.height - gap;
                break;
            case "left":
                x = triggerRect.left - dropdownRect.width - gap;
                y = triggerRect.top;
                break;
            case "right":
                x = triggerRect.right + gap;
                y = triggerRect.top;
                break;
        }
        setDropdownPosition({ x, y });
    }, [isOpen, position]);
    useEffect(() => {
        if (!isOpen)
            return;
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);
    return (_jsxs("div", { ref: ref, style: { position: "relative", display: "inline-block" }, children: [_jsx("button", { ref: triggerRef, onClick: () => !disabled && setIsOpen(!isOpen), onKeyDown: handleKeyDown, disabled: disabled, style: {
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                }, children: trigger }), isOpen && !disabled && (_jsx(Portal, { children: _jsx("div", { ref: dropdownRef, role: "menu", style: {
                        position: "fixed",
                        left: `${dropdownPosition.x}px`,
                        top: `${dropdownPosition.y}px`,
                        zIndex: 1000,
                        backgroundColor: colorTokens.background.primary,
                        border: `1px solid ${colorTokens.border.primary}`,
                        borderRadius: radiusTokens.md,
                        boxShadow: colorTokens.shadow.lg,
                        minWidth: "160px",
                        overflow: "hidden",
                    }, children: _jsx(Stack, { direction: "vertical", spacing: "0", children: items.map((item, index) => {
                            if (item.divider) {
                                return (_jsx("div", { style: {
                                        height: "1px",
                                        backgroundColor: colorTokens.border.primary,
                                        margin: `${spacingTokens.xs} 0`,
                                    } }, `divider-${index}`));
                            }
                            return (_jsx("button", { role: "menuitem", onClick: () => handleItemClick(item.id), disabled: item.disabled, style: {
                                    width: "100%",
                                    padding: spacingTokens.md,
                                    border: "none",
                                    backgroundColor: "transparent",
                                    textAlign: "left",
                                    color: colorTokens.text.primary,
                                    cursor: item.disabled ? "not-allowed" : "pointer",
                                    opacity: item.disabled ? 0.6 : 1,
                                    transition: "background-color 0.2s ease",
                                }, onMouseEnter: (e) => {
                                    if (!item.disabled) {
                                        e.currentTarget.style.backgroundColor =
                                            colorTokens.background.secondary;
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "transparent";
                                }, children: _jsxs("span", { style: { display: "flex", alignItems: "center", gap: spacingTokens.sm }, children: [item.icon && _jsx("span", { children: item.icon }), item.label] }) }, item.id));
                        }) }) }) }))] }));
});
Dropdown.displayName = "Dropdown";
//# sourceMappingURL=Dropdown.js.map