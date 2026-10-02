/**
 * @maataa/ui/surfaces/Drawer
 * Slide-in overlay panel anchored to a screen edge
 */
import React from "react";
export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export interface DrawerProps {
    /**
     * Whether the drawer is open
     */
    isOpen: boolean;
    /**
     * Called when the backdrop is clicked, the close button is pressed,
     * or the Escape key is pressed
     */
    onClose: () => void;
    /**
     * Edge the drawer slides in from
     * @default 'right'
     */
    placement?: DrawerPlacement;
    /**
     * Drawer title, shown in the header along with the close button
     */
    title?: string;
    /**
     * Whether to render the close ("×") button
     * @default true
     */
    closeButton?: boolean;
    /**
     * Size along the sliding axis (width for left/right, height for top/bottom)
     * @default '320px'
     */
    size?: string;
    children: React.ReactNode;
}
/**
 * Drawer
 * An overlay panel that slides in from a screen edge, with a backdrop
 * that closes it on click. Closes on Escape as well.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filters" placement="right">
 *   <p>Drawer content</p>
 * </Drawer>
 * ```
 */
export declare const Drawer: React.FC<DrawerProps>;
//# sourceMappingURL=Drawer.d.ts.map