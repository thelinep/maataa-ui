/**
 * @maataa/ui/actions/ButtonGroup
 * Groups related buttons together, visually connected or spaced apart
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Layout direction
     * @default 'horizontal'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * When true, buttons are rendered edge-to-edge with shared borders,
     * like a segmented control. When false, buttons keep their own
     * shape and are simply spaced apart by `gap`.
     * @default true
     */
    attached?: boolean;
    /**
     * Gap between buttons when `attached` is false, from the spacing
     * token scale
     * @default 'sm'
     */
    gap?: keyof typeof spacingTokens;
    /**
     * The buttons to group. Each child's outer corners are rounded and
     * its border is de-duplicated with its neighbor automatically when
     * `attached` is true.
     */
    children?: React.ReactNode;
}
/**
 * ButtonGroup
 * Groups a set of buttons together, either as a connected segmented
 * control (`attached`, the default) or as simply-spaced siblings.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="secondary">Day</Button>
 *   <Button variant="secondary">Week</Button>
 *   <Button variant="secondary">Month</Button>
 * </ButtonGroup>
 * ```
 */
export declare const ButtonGroup: React.ForwardRefExoticComponent<ButtonGroupProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ButtonGroup.d.ts.map