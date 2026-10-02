import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/navigation/Tabs
 * Tabbed interface component with keyboard navigation
 */
import React, { useState } from "react";
import { Stack } from "../primitives/Stack";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";
/**
 * Tabs
 * Tabbed interface with keyboard navigation support
 */
export const Tabs = React.forwardRef(({ tabs, defaultTab, onChange, variant = "line", disabled = false, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
    const handleTabChange = (tabId) => {
        const tab = tabs.find((t) => t.id === tabId);
        if (tab && !tab.disabled && !disabled) {
            setActiveTab(tabId);
            onChange?.(tabId);
        }
    };
    const handleKeyDown = (e, index) => {
        let newIndex = index;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                e.preventDefault();
                newIndex = Math.min(index + 1, tabs.length - 1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                e.preventDefault();
                newIndex = Math.max(index - 1, 0);
                break;
            case "Home":
                e.preventDefault();
                newIndex = 0;
                break;
            case "End":
                e.preventDefault();
                newIndex = tabs.length - 1;
                break;
            default:
                return;
        }
        handleTabChange(tabs[newIndex].id);
    };
    const tabIndex = tabs.findIndex((t) => t.id === activeTab);
    const variantStyles = {
        line: {
            tab: (isActive) => ({
                padding: `${spacingTokens.md} ${spacingTokens.lg}`,
                borderBottom: `3px solid ${isActive ? colorTokens.interactive.primary : "transparent"}`,
                color: isActive ? colorTokens.interactive.primary : colorTokens.text.secondary,
                fontWeight: isActive ? 600 : 500,
            }),
            indicator: { display: "none" },
        },
        box: {
            tab: (isActive) => ({
                padding: spacingTokens.md,
                border: `1px solid ${colorTokens.border.primary}`,
                borderRadius: radiusTokens.md,
                backgroundColor: isActive
                    ? colorTokens.interactive.primary
                    : colorTokens.background.secondary,
                color: isActive ? colorTokens.background.primary : colorTokens.text.primary,
                fontWeight: isActive ? 600 : 500,
                margin: spacingTokens.sm,
            }),
            indicator: { display: "none" },
        },
        pill: {
            tab: (isActive) => ({
                padding: `${spacingTokens.sm} ${spacingTokens.lg}`,
                borderRadius: radiusTokens.full,
                backgroundColor: isActive
                    ? colorTokens.interactive.primary
                    : colorTokens.background.secondary,
                color: isActive ? colorTokens.background.primary : colorTokens.text.primary,
                fontWeight: isActive ? 600 : 500,
                margin: spacingTokens.xs,
            }),
            indicator: { display: "none" },
        },
    };
    const currentVariant = variantStyles[variant];
    return (_jsxs("div", { ref: ref, ...props, style: { width: "100%", ...props.style }, children: [_jsx(Stack, { direction: "horizontal", spacing: "0", role: "tablist", style: {
                    borderBottom: variant === "line" ? `1px solid ${colorTokens.border.primary}` : "none",
                    flexWrap: "wrap",
                }, children: tabs.map((tab, index) => {
                    const isActive = tab.id === activeTab;
                    return (_jsx("button", { role: "tab", "aria-selected": isActive, "aria-controls": `tabpanel-${tab.id}`, id: `tab-${tab.id}`, onClick: () => handleTabChange(tab.id), onKeyDown: (e) => handleKeyDown(e, index), disabled: tab.disabled || disabled, style: {
                            border: "none",
                            background: "none",
                            cursor: tab.disabled || disabled ? "not-allowed" : "pointer",
                            opacity: tab.disabled || disabled ? 0.6 : 1,
                            transition: "all 0.2s ease",
                            ...currentVariant.tab(isActive),
                            ...props.style,
                        }, children: tab.label }, tab.id));
                }) }), tabs.map((tab) => (_jsxs("div", { id: `tabpanel-${tab.id}`, role: "tabpanel", "aria-labelledby": `tab-${tab.id}`, hidden: tab.id !== activeTab, style: {
                    padding: spacingTokens.lg,
                    display: tab.id === activeTab ? "block" : "none",
                }, children: [_jsxs(VisuallyHidden, { children: ["Tab ", tabIndex + 1, " of ", tabs.length] }), tab.content] }, tab.id)))] }));
});
Tabs.displayName = "Tabs";
//# sourceMappingURL=Tabs.js.map