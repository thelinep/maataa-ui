/**
 * @maataa/ui/primitives/ScrollArea
 * Scrollable container with consistent, themed scrollbar styling
 */
import React from "react";
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Maximum height before scrolling kicks in
     */
    maxHeight?: string;
    /**
     * Maximum width before scrolling kicks in
     */
    maxWidth?: string;
    /**
     * Which axis/axes may scroll
     * @default 'vertical'
     */
    direction?: "vertical" | "horizontal" | "both";
    /**
     * Children elements
     */
    children?: React.ReactNode;
}
/**
 * ScrollArea
 * A scrollable container with a themed, unobtrusive scrollbar.
 * Falls back gracefully to the platform's default scrollbar in
 * browsers that don't support the `::-webkit-scrollbar` pseudo-elements.
 *
 * @example
 * ```tsx
 * <ScrollArea maxHeight="240px">
 *   <LongListOfItems />
 * </ScrollArea>
 * ```
 */
export declare const ScrollArea: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ScrollArea.d.ts.map