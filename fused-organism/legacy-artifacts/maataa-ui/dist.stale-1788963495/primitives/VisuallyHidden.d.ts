/**
 * @maataa/ui/primitives/VisuallyHidden
 * Component for hiding content visually while keeping it accessible to screen readers
 */
import React from "react";
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Children content that should be visible to screen readers
     */
    children: React.ReactNode;
    /**
     * Whether the element is focusable
     * @default false
     */
    focusable?: boolean;
}
/**
 * VisuallyHidden
 * Hides content visually while keeping it accessible to screen readers
 * Follows ARIA best practices for accessibility
 */
export declare const VisuallyHidden: React.ForwardRefExoticComponent<VisuallyHiddenProps & React.RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=VisuallyHidden.d.ts.map