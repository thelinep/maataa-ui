/**
 * @maataa/ui/surfaces
 * Surface components - larger UI containers and layouts
 *
 * Includes: Modal, Toast, Tooltip, Popover, Dropdown
 */
export { Modal, type ModalProps } from "./Modal";
export { Toast, ToastContainer, type ToastProps, type ToastType } from "./Toast";
export { Tooltip, type TooltipProps } from "./Tooltip";
export { Popover, type PopoverProps } from "./Popover";
export { Dropdown, type DropdownProps, type DropdownItem } from "./Dropdown";
export { Panel, type PanelProps } from "./Panel";
export { Drawer, type DrawerProps, type DrawerPlacement } from "./Drawer";
export { Sheet, type SheetProps } from "./Sheet";
export declare const surfaceComponents: ({
    id: string;
    name: string;
    component: string;
    category: string;
    description: string;
    sizes: string[];
    variants?: undefined;
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
    sizes?: undefined;
    variants?: undefined;
})[];
//# sourceMappingURL=index.d.ts.map