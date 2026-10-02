/**
 * @maataa/ui/primitives/Flex
 * Low-level flexbox container primitive
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Flex direction
     * @default 'row'
     */
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    /**
     * Align items cross-axis
     * @default 'stretch'
     */
    align?: "start" | "center" | "end" | "stretch" | "baseline";
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
     * Gap between children — a spacing token key or a raw CSS value
     */
    gap?: keyof typeof spacingTokens | string;
    /**
     * Render as an inline-flex container
     * @default false
     */
    inline?: boolean;
    /**
     * Children elements
     */
    children?: React.ReactNode;
}
/**
 * Flex
 * A low-level flexbox container. Unlike `Stack`, `Flex` makes no
 * assumptions about direction or spacing defaults — it's the raw
 * primitive that `Stack` and other opinionated layouts are built from.
 *
 * @example
 * ```tsx
 * <Flex direction="row" justify="space-between" align="center" gap="md">
 *   <span>Left</span>
 *   <span>Right</span>
 * </Flex>
 * ```
 */
export declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Flex.d.ts.map