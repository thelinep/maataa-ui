/**
 * @maataa/ui/actions
 * Category: actions
 * Action components for buttons and interactive triggers
 */
export { IconButton, type IconButtonProps } from "./IconButton";
export { ButtonGroup, type ButtonGroupProps } from "./ButtonGroup";
export { LinkButton, type LinkButtonProps, type LinkButtonVariant } from "./LinkButton";
export { FAB, type FABProps, type FABPosition } from "./FAB";
export { ConfirmButton, type ConfirmButtonProps } from "./ConfirmButton";
export declare const actionComponents: ({
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
    variants: string[];
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