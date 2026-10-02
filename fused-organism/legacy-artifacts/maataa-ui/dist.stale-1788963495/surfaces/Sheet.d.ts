/**
 * @maataa/ui/surfaces/Sheet
 * Bottom sheet overlay — the mobile-friendly counterpart to Modal/Drawer
 */
import React from "react";
export interface SheetProps {
    /**
     * Whether the sheet is open
     */
    isOpen: boolean;
    /**
     * Called when the backdrop is clicked or the Escape key is pressed
     */
    onClose: () => void;
    /**
     * Title shown above the content, with a drag handle above it
     */
    title?: string;
    /**
     * How much of the viewport height the sheet occupies
     * @default 'md'
     */
    height?: "sm" | "md" | "lg" | "full";
    children: React.ReactNode;
}
/**
 * Sheet
 * A panel that slides up from the bottom of the screen, with a drag
 * handle and rounded top corners — the standard mobile pattern for
 * contextual actions and forms. Closes on backdrop click or Escape.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Share" height="sm">
 *   <p>Sheet content</p>
 * </Sheet>
 * ```
 */
export declare const Sheet: React.FC<SheetProps>;
//# sourceMappingURL=Sheet.d.ts.map