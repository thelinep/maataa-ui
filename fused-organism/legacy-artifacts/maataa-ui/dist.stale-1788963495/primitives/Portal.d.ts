/**
 * @maataa/ui/primitives/Portal
 * React Portal wrapper for rendering content outside DOM hierarchy
 */
import React from "react";
export interface PortalProps {
    /**
     * Content to render in portal
     */
    children: React.ReactNode;
    /**
     * Target element for portal (defaults to document.body)
     */
    target?: Element | null;
    /**
     * Optional className for portal container
     */
    className?: string;
    /**
     * Optional styles for portal container
     */
    style?: React.CSSProperties;
}
/**
 * Portal
 * Renders content outside the normal DOM hierarchy
 * Useful for modals, dropdowns, tooltips, etc.
 */
export declare const Portal: {
    ({ children, target, className, style }: PortalProps): React.ReactPortal | null;
    displayName: string;
};
//# sourceMappingURL=Portal.d.ts.map