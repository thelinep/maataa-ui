/**
 * @maataa/ui/primitives/Badge
 * Status badge primitive component
 */
import React from "react";
export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
export type BadgeSize = "sm" | "md" | "lg";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: React.ReactNode;
    onDismiss?: () => void;
}
/**
 * Badge Component
 * A compact status indicator component with multiple variants
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="lg">Failed</Badge>
 * <Badge variant="warning" onDismiss={() => {}}>Warning</Badge>
 * ```
 */
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=Badge.d.ts.map