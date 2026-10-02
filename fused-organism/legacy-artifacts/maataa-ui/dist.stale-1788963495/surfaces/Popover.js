import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/surfaces/Popover
 * Floating panel with more content than a tooltip
 */
import React, { useState, useRef, useEffect } from "react";
import { Portal } from "../primitives/Portal";
import { Stack } from "../primitives/Stack";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";
/**
 * Popover
 * Floating panel with more content than a tooltip
 */
export const Popover = React.forwardRef(({ content, children, position = "bottom", title, isOpen: controlledIsOpen, onOpenChange, disabled = false, }) => {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const handleOpenChange = (newIsOpen) => {
        if (!disabled) {
            setUncontrolledIsOpen(newIsOpen);
            onOpenChange?.(newIsOpen);
        }
    };
    const handleClickOutside = (event) => {
        if (triggerRef.current &&
            popoverRef.current &&
            !triggerRef.current.contains(event.target) &&
            !popoverRef.current.contains(event.target)) {
            handleOpenChange(false);
        }
    };
    useEffect(() => {
        if (!isOpen || !triggerRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current?.getBoundingClientRect();
        if (!popoverRect)
            return;
        let x = 0;
        let y = 0;
        const gap = 8;
        switch (position) {
            case "top":
                x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
                y = triggerRect.top - popoverRect.height - gap;
                break;
            case "bottom":
                x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
                y = triggerRect.bottom + gap;
                break;
            case "left":
                x = triggerRect.left - popoverRect.width - gap;
                y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
                break;
            case "right":
                x = triggerRect.right + gap;
                y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
                break;
        }
        setPopoverPosition({ x, y });
    }, [isOpen, position]);
    useEffect(() => {
        if (!isOpen)
            return;
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleClickOutside]);
    return (_jsxs("div", { ref: triggerRef, style: {
            display: "inline-block",
        }, children: [React.cloneElement(children, {
                onClick: () => handleOpenChange(!isOpen),
            }), isOpen && !disabled && (_jsx(Portal, { children: _jsx("div", { ref: popoverRef, role: "dialog", style: {
                        position: "fixed",
                        left: `${popoverPosition.x}px`,
                        top: `${popoverPosition.y}px`,
                        zIndex: 1000,
                        backgroundColor: colorTokens.background.primary,
                        border: `1px solid ${colorTokens.border.primary}`,
                        borderRadius: radiusTokens.lg,
                        boxShadow: colorTokens.shadow.lg,
                        minWidth: "200px",
                        maxWidth: "400px",
                    }, children: _jsxs(Stack, { direction: "vertical", spacing: "0", children: [title && (_jsx("div", { style: {
                                    padding: spacingTokens.md,
                                    borderBottom: `1px solid ${colorTokens.border.primary}`,
                                    fontWeight: 600,
                                    color: colorTokens.text.primary,
                                }, children: title })), _jsx("div", { style: {
                                    padding: spacingTokens.md,
                                    color: colorTokens.text.primary,
                                }, children: content })] }) }) }))] }));
});
Popover.displayName = "Popover";
//# sourceMappingURL=Popover.js.map