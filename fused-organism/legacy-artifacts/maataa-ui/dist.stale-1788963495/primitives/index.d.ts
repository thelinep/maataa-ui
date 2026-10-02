/**
 * @maataa/ui/primitives
 * Core UI primitives - foundational components
 *
 * Includes: Button, Input, Card, Badge, Stack, Portal, VisuallyHidden,
 * Box, Flex, Grid, Container, Divider, Spacer, ScrollArea, AspectRatio
 */
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button";
export { Input, type InputProps } from "./Input";
export { Card, type CardProps } from "./Card";
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from "./Badge";
export { Stack, type StackProps } from "./Stack";
export { Portal, type PortalProps } from "./Portal";
export { VisuallyHidden, type VisuallyHiddenProps } from "./VisuallyHidden";
export { Box, type BoxProps } from "./Box";
export { Flex, type FlexProps } from "./Flex";
export { Grid, type GridProps } from "./Grid";
export { Container, type ContainerProps } from "./Container";
export { Divider, type DividerProps } from "./Divider";
export { Spacer, type SpacerProps } from "./Spacer";
export { ScrollArea, type ScrollAreaProps } from "./ScrollArea";
export { AspectRatio, type AspectRatioProps } from "./AspectRatio";
export declare const primitiveComponents: ({
    id: string;
    name: string;
    component: string;
    category: string;
    description: string;
    variants: string[];
    sizes: string[];
} | {
    id: string;
    name: string;
    component: string;
    category: string;
    description: string;
    variants?: undefined;
    sizes?: undefined;
} | {
    id: string;
    name: string;
    component: string;
    category: string;
    description: string;
    sizes: string[];
    variants?: undefined;
})[];
//# sourceMappingURL=index.d.ts.map