import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/Portal
 * React Portal wrapper for rendering content outside DOM hierarchy
 */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
/**
 * Portal
 * Renders content outside the normal DOM hierarchy
 * Useful for modals, dropdowns, tooltips, etc.
 */
export const Portal = ({ children, target, className, style }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted)
        return null;
    const targetElement = target || (typeof document !== "undefined" ? document.body : null);
    if (!targetElement)
        return null;
    return createPortal(_jsx("div", { className: className, style: style, children: children }), targetElement);
};
Portal.displayName = "Portal";
//# sourceMappingURL=Portal.js.map