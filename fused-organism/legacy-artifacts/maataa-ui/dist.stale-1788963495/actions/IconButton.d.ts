/**
 * @maataa/ui/actions/IconButton
 * Icon-only button for compact, high-frequency actions
 */
import React from "react";
import type { ButtonVariant } from "../primitives/Button";
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    /**
     * The icon to render. Any React node — an emoji, an SVG, or an icon
     * component from your icon set of choice.
     */
    icon: React.ReactNode;
    /**
     * Required accessible label, since there is no visible text content
     */
    "aria-label": string;
    /**
     * Visual style, matching `Button`'s variants
     * @default 'secondary'
     */
    variant?: ButtonVariant;
    /**
     * Button size
     * @default 'md'
     */
    size?: "sm" | "md" | "lg";
    /**
     * Whether the button is fully circular rather than rounded-square
     * @default true
     */
    rounded?: boolean;
}
/**
 * IconButton
 * A compact, icon-only button. Always pass `aria-label` since there is
 * no visible text for assistive technology to read.
 *
 * @example
 * ```tsx
 * <IconButton icon="✕" aria-label="Close" variant="tertiary" />
 * ```
 */
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=IconButton.d.ts.map