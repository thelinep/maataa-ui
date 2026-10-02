import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/actions/ButtonGroup
 * Groups related buttons together, visually connected or spaced apart
 */
import React, { Children, cloneElement, isValidElement } from "react";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
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
export const ButtonGroup = React.forwardRef(({ orientation = "horizontal", attached = true, gap = "sm", children, style, role, ...props }, ref) => {
    const items = Children.toArray(children).filter(isValidElement);
    const isHorizontal = orientation === "horizontal";
    return (_jsx("div", { ref: ref, role: role ?? "group", style: {
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
            gap: attached ? 0 : spacingTokens[gap],
            ...style,
        }, ...props, children: items.map((child, index) => {
            if (!attached)
                return cloneElement(child, { key: index });
            const isFirst = index === 0;
            const isLast = index === items.length - 1;
            const attachedStyle = {
                borderRadius: radiusTokens.none,
                ...(isHorizontal
                    ? {
                        borderTopLeftRadius: isFirst ? radiusTokens.md : undefined,
                        borderBottomLeftRadius: isFirst ? radiusTokens.md : undefined,
                        borderTopRightRadius: isLast ? radiusTokens.md : undefined,
                        borderBottomRightRadius: isLast ? radiusTokens.md : undefined,
                        borderRight: isLast ? undefined : `1px solid ${colorTokens.background.primary}`,
                    }
                    : {
                        borderTopLeftRadius: isFirst ? radiusTokens.md : undefined,
                        borderTopRightRadius: isFirst ? radiusTokens.md : undefined,
                        borderBottomLeftRadius: isLast ? radiusTokens.md : undefined,
                        borderBottomRightRadius: isLast ? radiusTokens.md : undefined,
                        borderBottom: isLast ? undefined : `1px solid ${colorTokens.background.primary}`,
                    }),
            };
            return cloneElement(child, {
                key: index,
                style: { ...child.props.style, ...attachedStyle },
            });
        }) }));
});
ButtonGroup.displayName = "ButtonGroup";
//# sourceMappingURL=ButtonGroup.js.map