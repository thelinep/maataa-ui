import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Portal } from "../primitives/Portal";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
export const ChartTooltip = ({ state }) => {
    if (!state)
        return null;
    return (_jsx(Portal, { children: _jsxs("div", { role: "tooltip", style: {
                position: "fixed",
                left: `${state.x}px`,
                top: `${state.y}px`,
                transform: "translate(-50%, -100%)",
                zIndex: 1000,
                pointerEvents: "none",
                padding: spacingTokens.sm,
                backgroundColor: colorTokens.background.inverse,
                color: colorTokens.text.inverse,
                borderRadius: radiusTokens.md,
                boxShadow: colorTokens.shadow.md,
                fontSize: typographyTokens.fontSize.xs,
                whiteSpace: "nowrap",
            }, children: [_jsx("div", { style: { fontWeight: typographyTokens.fontWeight.semibold, marginBottom: "2px" }, children: state.title }), state.rows.map((row) => (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: spacingTokens.xs }, children: [row.color && (_jsx("span", { "aria-hidden": "true", style: {
                                display: "inline-block",
                                width: "8px",
                                height: "8px",
                                borderRadius: radiusTokens.full,
                                backgroundColor: row.color,
                            } })), _jsxs("span", { children: [row.label, ": ", row.value] })] }, row.label)))] }) }));
};
ChartTooltip.displayName = "ChartTooltip";
//# sourceMappingURL=ChartTooltip.js.map