import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/Slider
 * Range slider input with an optional live value readout
 */
import React, { useId } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
/**
 * Slider
 * A styled range input with an accessible label and an optional
 * live-updating value readout.
 *
 * @example
 * ```tsx
 * const [volume, setVolume] = useState(50);
 * <Slider label="Volume" value={volume} onChange={setVolume} />
 * ```
 */
export const Slider = React.forwardRef(({ value, onChange, min = 0, max = 100, step = 1, label, showValue = true, id, style, ...props }, ref) => {
    const generatedId = useId();
    const sliderId = id ?? generatedId;
    const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
    return (_jsxs("div", { style: { width: "100%" }, children: [(label || showValue) && (_jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: spacingTokens.xs,
                }, children: [label && (_jsx("label", { htmlFor: sliderId, style: {
                            fontSize: typographyTokens.fontSize.md,
                            fontWeight: typographyTokens.fontWeight.medium,
                            color: colorTokens.text.primary,
                        }, children: label })), showValue && (_jsx("span", { style: {
                            fontSize: typographyTokens.fontSize.sm,
                            color: colorTokens.text.secondary,
                        }, children: value }))] })), _jsx("input", { ref: ref, id: sliderId, type: "range", min: min, max: max, step: step, value: value, onChange: (e) => onChange(Number(e.target.value)), style: {
                    width: "100%",
                    height: "4px",
                    borderRadius: "2px",
                    appearance: "none",
                    outline: "none",
                    cursor: "pointer",
                    background: `linear-gradient(to right, ${colorTokens.interactive.primary} ${percent}%, ${colorTokens.interactive.secondary} ${percent}%)`,
                    ...style,
                }, ...props })] }));
});
Slider.displayName = "Slider";
//# sourceMappingURL=Slider.js.map