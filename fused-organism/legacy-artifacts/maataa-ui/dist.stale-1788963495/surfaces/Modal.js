import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/surfaces/Modal
 * Modal dialog component for focused user interactions
 */
import React from "react";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
const modalSizes = {
    sm: { width: "400px" },
    md: { width: "600px" },
    lg: { width: "800px" },
};
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
export const Modal = ({ isOpen, onClose, title, footer, closeButton = true, size = "md", children, }) => {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { style: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(61, 40, 23, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease",
        }, onClick: onClose, children: [_jsxs("div", { onClick: (e) => e.stopPropagation(), style: {
                    backgroundColor: colorTokens.background.primary,
                    borderRadius: radiusTokens.lg,
                    boxShadow: colorTokens.shadow.xl,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    ...modalSizes[size],
                    animation: "slideUp 0.3s ease",
                }, children: [(title || closeButton) && (_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: spacingTokens.md,
                            borderBottom: `1px solid ${colorTokens.interactive.secondary}`,
                        }, children: [title && (_jsx("h2", { style: {
                                    margin: "0",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: colorTokens.text.primary,
                                }, children: title })), closeButton && (_jsx("button", { onClick: onClose, "aria-label": "Close", style: {
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: colorTokens.text.secondary,
                                    padding: "0",
                                    width: "32px",
                                    height: "32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }, children: "\u00D7" }))] })), _jsx("div", { style: { padding: spacingTokens.md }, children: children }), footer && (_jsx("div", { style: {
                            padding: `${spacingTokens.sm} ${spacingTokens.md}`,
                            borderTop: `1px solid ${colorTokens.interactive.secondary}`,
                            backgroundColor: colorTokens.background.secondary,
                        }, children: footer }))] }), _jsx("style", { children: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        ` })] }));
};
Modal.displayName = "Modal";
//# sourceMappingURL=Modal.js.map