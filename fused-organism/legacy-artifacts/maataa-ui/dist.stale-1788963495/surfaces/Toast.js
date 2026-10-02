import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/surfaces/Toast
 * Toast notification component
 */
import { useEffect } from "react";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
const toastIcons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
};
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
export const Toast = ({ id, message, type = "info", duration = 3000, onClose, action, }) => {
    const style = colorTokens.semantic[type];
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => onClose(id), duration);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [id, duration, onClose]);
    return (_jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: spacingTokens.sm,
            padding: `${spacingTokens.sm} ${spacingTokens.md}`,
            backgroundColor: style.bg,
            color: style.text,
            borderRadius: radiusTokens.md,
            boxShadow: colorTokens.shadow.md,
            marginBottom: spacingTokens.xs,
            animation: "slideInRight 0.3s ease",
        }, children: [_jsx("span", { style: { fontSize: "18px", fontWeight: "bold" }, children: toastIcons[type] }), _jsx("span", { style: { flex: 1, fontSize: "14px" }, children: message }), action && (_jsx("button", { onClick: action.onClick, style: {
                    backgroundColor: "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    fontWeight: "600",
                    textDecoration: "underline",
                    padding: "0",
                    fontSize: "12px",
                }, children: action.label })), _jsx("button", { onClick: () => onClose(id), "aria-label": "Dismiss notification", style: {
                    backgroundColor: "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "0",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: "\u00D7" }), _jsx("style", { children: `
          @keyframes slideInRight {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        ` })] }));
};
Toast.displayName = "Toast";
export const ToastContainer = ({ toasts, onClose }) => {
    return (_jsx("div", { style: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 2000,
            maxWidth: "400px",
        }, children: toasts.map((toast) => (_jsx(Toast, { ...toast, onClose: onClose }, toast.id))) }));
};
ToastContainer.displayName = "ToastContainer";
//# sourceMappingURL=Toast.js.map