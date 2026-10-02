/**
 * @maataa/ui/actions/LinkButton
 * A navigational, button-weight link styled as text rather than a filled button
 */
import React from "react";
export type LinkButtonVariant = "primary" | "secondary" | "danger";
export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * Text color variant
     * @default 'primary'
     */
    variant?: LinkButtonVariant;
    /**
     * When to show the underline
     * @default 'hover'
     */
    underline?: "always" | "hover" | "none";
    /**
     * Visually and functionally disables the link
     * @default false
     */
    disabled?: boolean;
    children: React.ReactNode;
}
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
export declare const LinkButton: React.ForwardRefExoticComponent<LinkButtonProps & React.RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=LinkButton.d.ts.map