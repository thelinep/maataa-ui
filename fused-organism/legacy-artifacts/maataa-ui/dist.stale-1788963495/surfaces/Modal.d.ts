/**
 * @maataa/ui/surfaces/Modal
 * Modal dialog component for focused user interactions
 */
import React from "react";
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    footer?: React.ReactNode;
    closeButton?: boolean;
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}
/**
 * Modal Component
 * A dialog component for displaying content in a focused modal overlay
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Settings">
 *   <p>Modal content here</p>
 * </Modal>
 * ```
 */
export declare const Modal: React.FC<ModalProps>;
//# sourceMappingURL=Modal.d.ts.map