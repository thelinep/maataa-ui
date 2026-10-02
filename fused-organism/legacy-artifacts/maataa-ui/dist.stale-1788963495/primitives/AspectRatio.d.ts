/**
 * @maataa/ui/primitives/AspectRatio
 * Constrains content to a fixed width-to-height ratio
 */
import React from "react";
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Width-to-height ratio, e.g. `16 / 9` or `1` for a square
     * @default 16/9
     */
    ratio?: number;
    /**
     * Children elements. A single child is stretched to fill the box.
     */
    children?: React.ReactNode;
}
/**
 * AspectRatio
 * Keeps its content — typically an image, video, or embed — at a fixed
 * width-to-height ratio regardless of container width.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/banner.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 * </AspectRatio>
 * ```
 */
export declare const AspectRatio: React.ForwardRefExoticComponent<AspectRatioProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=AspectRatio.d.ts.map