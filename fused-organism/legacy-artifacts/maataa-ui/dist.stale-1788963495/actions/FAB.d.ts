/**
 * @maataa/ui/actions/FAB
 * Floating action button for a screen's primary, most-frequent action
 */
import React from "react";
export type FABPosition = "static" | "bottom-right" | "bottom-left" | "top-right" | "top-left";
export interface FABProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    /**
     * The icon to render
     */
    icon: React.ReactNode;
    /**
     * Optional label. When provided, the FAB extends into a pill shape
     * showing the icon and label side by side; without it, the FAB is a
     * plain circle and `aria-label` becomes required for accessibility.
     */
    label?: string;
    /**
     * Button size
     * @default 'lg'
     */
    size?: "md" | "lg";
    /**
     * Fixed screen position. `'static'` leaves the button in normal
     * document flow for embedding inside a container.
     * @default 'bottom-right'
     */
    position?: FABPosition;
}
/**
 * FAB
 * A prominent, circular (or extended, when given a `label`) button
 * for a screen's single most important action. Positioned fixed in a
 * screen corner by default.
 *
 * @example
 * ```tsx
 * <FAB icon="+" aria-label="Create new item" />
 * <FAB icon="+" label="New task" position="static" />
 * ```
 */
export declare const FAB: React.ForwardRefExoticComponent<FABProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=FAB.d.ts.map