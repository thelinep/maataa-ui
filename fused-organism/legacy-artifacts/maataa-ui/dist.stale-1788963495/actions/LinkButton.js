import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @maataa/ui/actions/LinkButton
 * A navigational, button-weight link styled as text rather than a filled button
 */
import React from "react";
import { colorTokens, transitionTokens } from "../tokens";
const colorByVariant = {
    primary: colorTokens.interactive.primary,
    secondary: colorTokens.text.secondary,
    danger: colorTokens.interactive.error,
};
/**
 * LinkButton
 * A link styled with button-like weight and color, for actions that
 * navigate (or behave like navigation) rather than mutate in place —
 * "View all", "Learn more", a "Cancel" that returns to a previous page.
 *
 * @example
 * ```tsx
 * <LinkButton href="/settings">View all settings</LinkButton>
 * <LinkButton variant="danger" underline="always" href="/logout">Sign out</LinkButton>
 * ```
 */
export const LinkButton = React.forwardRef(({ variant = "primary", underline = "hover", disabled = false, children, style, onClick, ...props }, ref) => {
    const [hovering, setHovering] = React.useState(false);
    const showUnderline = underline === "always" || (underline === "hover" && hovering);
    return (_jsx("a", { ref: ref, "aria-disabled": disabled, tabIndex: disabled ? -1 : props.tabIndex, onClick: (e) => {
            if (disabled) {
                e.preventDefault();
                return;
            }
            onClick?.(e);
        }, onMouseEnter: () => setHovering(true), onMouseLeave: () => setHovering(false), style: {
            color: colorByVariant[variant],
            fontWeight: 500,
            fontSize: "14px",
            textDecoration: showUnderline ? "underline" : "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
            transition: `color ${transitionTokens.fast}`,
            ...style,
        }, ...props, children: children }));
});
LinkButton.displayName = "LinkButton";
//# sourceMappingURL=LinkButton.js.map