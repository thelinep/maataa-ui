/**
 * @maataa/ui/primitives/Stack
 * Flexible container for stacking elements with consistent spacing
 */
import React from "react";
declare const spacingMap: Record<string, string>;
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Stack direction
     * @default 'vertical'
     */
    direction?: "vertical" | "horizontal";
    /**
     * Spacing between children
     * @default 'md'
     */
    spacing?: keyof typeof spacingMap | string;
    /**
     * Align items cross-axis
     * @default 'start'
     */
    align?: "start" | "center" | "end" | "stretch";
    /**
     * Justify items main-axis
     * @default 'start'
     */
    justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
    /**
     * Whether items can wrap
     * @default false
     */
    wrap?: boolean;
    /**
     * Whether stack takes full width
     * @default false
     */
    fullWidth?: boolean;
    /**
     * Children elements
     */
    children: React.ReactNode;
}
/**
 * Stack
 * Flexible container for stacking elements with consistent spacing
 */
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=Stack.d.ts.map