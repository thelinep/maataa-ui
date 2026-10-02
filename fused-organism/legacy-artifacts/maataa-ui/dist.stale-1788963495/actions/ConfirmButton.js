import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/actions/ConfirmButton
 * A button that requires an inline second confirmation before firing
 */
import React, { useState } from "react";
import { spacingTokens, typographyTokens } from "../tokens";
import { Button } from "../primitives/Button";
import { colorTokens } from "../tokens";
/**
 * ConfirmButton
 * Guards a destructive or hard-to-undo action behind an inline
 * "Are you sure?" step, rather than a blocking modal dialog. The
 * initial button's label and variant are shown until clicked, at
 * which point it's replaced by a confirm/cancel prompt in place.
 *
 * @example
 * ```tsx
 * <ConfirmButton variant="danger" onConfirm={() => deleteItem(id)}>
 *   Delete
 * </ConfirmButton>
 * ```
 */
export const ConfirmButton = React.forwardRef(({ onConfirm, confirmText = "Are you sure?", confirmLabel = "Yes", cancelLabel = "Cancel", children, variant = "danger", size, ...props }, ref) => {
    const [confirming, setConfirming] = useState(false);
    if (confirming) {
        return (_jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: spacingTokens.sm }, children: [_jsx("span", { style: { fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }, children: confirmText }), _jsx(Button, { variant: variant, size: size, onClick: () => {
                        setConfirming(false);
                        onConfirm();
                    }, children: confirmLabel }), _jsx(Button, { variant: "secondary", size: size, onClick: () => setConfirming(false), children: cancelLabel })] }));
    }
    return (_jsx(Button, { ref: ref, variant: variant, size: size, onClick: () => setConfirming(true), ...props, children: children }));
});
ConfirmButton.displayName = "ConfirmButton";
//# sourceMappingURL=ConfirmButton.js.map