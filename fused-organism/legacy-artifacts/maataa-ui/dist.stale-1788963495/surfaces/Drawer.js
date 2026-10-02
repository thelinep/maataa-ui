import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/surfaces/Drawer
 * Slide-in overlay panel anchored to a screen edge
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
const placementStyles = {
    left: (size) => ({ top: 0, left: 0, bottom: 0, width: size, height: "100%" }),
    right: (size) => ({ top: 0, right: 0, bottom: 0, width: size, height: "100%" }),
    top: (size) => ({ top: 0, left: 0, right: 0, height: size, width: "100%" }),
    bottom: (size) => ({ bottom: 0, left: 0, right: 0, height: size, width: "100%" }),
};
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
export const Drawer = ({ isOpen, onClose, placement = "right", title, closeButton = true, size = "320px", children, }) => {
    useEffect(() => {
        if (!isOpen)
            return;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    if (typeof document === "undefined")
        return null;
    return createPortal(_jsxs("div", { style: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(61, 40, 23, 0.4)",
            zIndex: 1000,
            animation: "maataa-drawer-fade-in 0.2s ease",
        }, onClick: onClose, children: [_jsxs("div", { role: "dialog", "aria-modal": "true", "aria-label": title, onClick: (e) => e.stopPropagation(), style: {
                    position: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: colorTokens.background.primary,
                    boxShadow: colorTokens.shadow.xl,
                    animation: `maataa-drawer-slide-in-${placement} 0.25s ease`,
                    ...placementStyles[placement](size),
                }, children: [(title || closeButton) && (_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: spacingTokens.md,
                            borderBottom: `1px solid ${colorTokens.interactive.secondary}`,
                        }, children: [title && (_jsx("h2", { style: {
                                    margin: 0,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    color: colorTokens.text.primary,
                                }, children: title })), closeButton && (_jsx("button", { onClick: onClose, "aria-label": "Close", style: {
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: colorTokens.text.secondary,
                                    padding: 0,
                                    width: "32px",
                                    height: "32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: radiusTokens.sm,
                                }, children: "\u00D7" }))] })), _jsx("div", { style: { flex: 1, overflowY: "auto", padding: spacingTokens.md }, children: children })] }), _jsx("style", { children: `
          @keyframes maataa-drawer-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes maataa-drawer-slide-in-left {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes maataa-drawer-slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes maataa-drawer-slide-in-top {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
          @keyframes maataa-drawer-slide-in-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        ` })] }), document.body);
};
Drawer.displayName = "Drawer";
//# sourceMappingURL=Drawer.js.map