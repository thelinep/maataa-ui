/**
 * @maataa/ui/primitives/Divider
 * Visual separator between sections of content
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Divider orientation
     * @default 'horizontal'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * Margin along the axis perpendicular to the divider's length,
     * from the spacing token scale
     * @default 'md'
     */
    spacing?: keyof typeof spacingTokens;
    /**
     * Optional label rendered inline within a horizontal divider
     */
    label?: React.ReactNode;
}
/**
 * Divider
 * A thin line separating sections of content, optionally carrying a
 * text label (horizontal orientation only).
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 * ```
 */
export declare const Divider: React.ForwardRefExoticComponent<DividerProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Divider.d.ts.map