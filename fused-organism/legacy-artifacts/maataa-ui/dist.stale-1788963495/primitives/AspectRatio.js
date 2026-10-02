import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/primitives/AspectRatio
 * Constrains content to a fixed width-to-height ratio
 */
import React from "react";
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
export const AspectRatio = React.forwardRef(({ ratio = 16 / 9, children, style, ...props }, ref) => {
    return (_jsx("div", { ref: ref, style: {
            position: "relative",
            width: "100%",
            aspectRatio: `${ratio}`,
            overflow: "hidden",
            ...style,
        }, ...props, children: children }));
});
AspectRatio.displayName = "AspectRatio";
//# sourceMappingURL=AspectRatio.js.map