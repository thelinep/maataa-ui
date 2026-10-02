/**
 * @maataa/ui/primitives/Card
 * Core card container primitive component
 */
import React from "react";
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
    elevated?: boolean;
    interactive?: boolean;
    children: React.ReactNode;
}
/**
 * Card Component
 * A flexible container component for content with optional header and footer
 *
 * @example
 * ```tsx
 * <Card title="Profile" subtitle="User Information">
 *   <p>Card content goes here</p>
 *   <p slot="footer">Footer content</p>
 * </Card>
 * ```
 */
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Card.d.ts.map