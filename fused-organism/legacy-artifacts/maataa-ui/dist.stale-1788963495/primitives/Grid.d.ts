/**
 * @maataa/ui/primitives/Grid
 * CSS Grid layout container primitive
 */
import React from "react";
import { spacingTokens } from "../tokens";
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Number of equal-width columns, or an explicit `grid-template-columns` value
     */
    columns?: number | string;
    /**
     * Number of equal-height rows, or an explicit `grid-template-rows` value
     */
    rows?: number | string;
    /**
     * Gap between rows and columns — a spacing token key or a raw CSS value.
     * Overridden individually by `columnGap` / `rowGap` when set.
     */
    gap?: keyof typeof spacingTokens | string;
    /**
     * Gap between columns only — a spacing token key or a raw CSS value
     */
    columnGap?: keyof typeof spacingTokens | string;
    /**
     * Gap between rows only — a spacing token key or a raw CSS value
     */
    rowGap?: keyof typeof spacingTokens | string;
    /**
     * Align items on the block (cross) axis
     * @default 'stretch'
     */
    align?: "start" | "center" | "end" | "stretch";
    /**
     * Justify items on the inline (main) axis
     * @default 'stretch'
     */
    justify?: "start" | "center" | "end" | "stretch" | "space-between";
    /**
     * Children elements
     */
    children?: React.ReactNode;
}
/**
 * Grid
 * A CSS Grid layout primitive. Pass a number of columns/rows for an
 * even `repeat()` track, or a raw `grid-template-columns`/`-rows`
 * string for full control.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap="md">
 *   <Card>1</Card>
 *   <Card>2</Card>
 *   <Card>3</Card>
 * </Grid>
 * ```
 */
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Grid.d.ts.map