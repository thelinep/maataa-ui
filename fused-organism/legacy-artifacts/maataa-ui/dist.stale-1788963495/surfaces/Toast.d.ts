/**
 * @maataa/ui/surfaces/Toast
 * Toast notification component
 */
import React from "react";
export type ToastType = "success" | "error" | "warning" | "info";
export interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: (id: string) => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}
/**
 * Toast Component
 * A notification component that appears temporarily
 *
 * @example
 * ```tsx
 * <Toast
 *   id="1"
 *   message="Operation successful!"
 *   type="success"
 *   onClose={() => removeToast("1")}
 * />
 * ```
 */
export declare const Toast: React.FC<ToastProps>;
/**
 * ToastContainer Component
 * Container for displaying multiple toasts
 */
export interface ToastContainerProps {
    toasts: ToastProps[];
    onClose: (id: string) => void;
}
export declare const ToastContainer: React.FC<ToastContainerProps>;
//# sourceMappingURL=Toast.d.ts.map