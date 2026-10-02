/**
 * @maataa/ui/primitives/Spacer
 * Flexible or fixed-size gap for flex layouts
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Fixed size, from the spacing token scale or a raw CSS value.
     * When omitted, the Spacer grows to fill available space (`flex: 1`).
     */
    size?: keyof typeof spacingTokens | string;
    /**
     * Which axis the fixed `size` applies to when a flex-growing spacer
     * is not being used
     * @default 'vertical'
     */
    axis?: "horizontal" | "vertical";
}
/**
 * Spacer
 * Used inside a `Flex` or `Stack` to either grow and fill remaining
 * space (default) or insert a fixed-size gap along one axis.
 *
 * @example
 * ```tsx
 * <Flex>
 *   <span>Left</span>
 *   <Spacer />
 *   <span>Right</span>
 * </Flex>
 * <Spacer size="lg" axis="vertical" />
 * ```
 */
export declare const Spacer: React.ForwardRefExoticComponent<SpacerProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Spacer.d.ts.map