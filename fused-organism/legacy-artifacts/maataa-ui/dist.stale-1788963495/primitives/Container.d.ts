/**
 * @maataa/ui/primitives/Container
 * Max-width centered content wrapper
 */
import React from "react";
import { spacingTokens } from "../tokens";
declare const maxWidths: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
};
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Maximum width breakpoint
     * @default 'lg'
     */
    maxWidth?: keyof typeof maxWidths;
    /**
     * Horizontal padding, from the spacing token scale
     * @default 'md'
     */
    padding?: keyof typeof spacingTokens;
    /**
     * Whether to horizontally center the container with automatic margins
     * @default true
     */
    centered?: boolean;
    /**
     * Children elements
     */
    children?: React.ReactNode;
}
/**
 * Container
 * Constrains content to a maximum width and centers it on the page,
 * with consistent horizontal padding. The standard wrapper for page
 * and section content.
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <h1>Page content</h1>
 * </Container>
 * ```
 */
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=Container.d.ts.map