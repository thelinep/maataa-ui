import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/SearchInput
 * Text input specialized for search, with a search icon and clear button
 */
import React, { useState } from "react";
import { colorTokens, radiusTokens } from "../tokens";
/**
 * SearchInput
 * A text input pre-configured for search: a search icon on the left
 * and a clear ("×") button that appears once there's a value.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState("");
 * <SearchInput value={query} onChange={setQuery} onClear={() => setQuery("")} />
 * ```
 */
export const SearchInput = React.forwardRef(({ value = "", onChange, onClear, placeholder = "Search...", className, style, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    return (_jsxs("div", { style: { position: "relative", display: "flex", alignItems: "center", width: "100%" }, children: [_jsx("span", { "aria-hidden": "true", style: {
                    position: "absolute",
                    left: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    color: colorTokens.text.secondary,
                    fontSize: "14px",
                }, children: "\uD83D\uDD0D" }), _jsx("input", { ref: ref, type: "search", role: "searchbox", value: value, placeholder: placeholder, onChange: (e) => onChange?.(e.target.value), onFocus: (e) => {
                    setFocused(true);
                    props.onFocus?.(e);
                }, onBlur: (e) => {
                    setFocused(false);
                    props.onBlur?.(e);
                }, className: className, style: {
                    width: "100%",
                    padding: value ? "10px 36px 10px 32px" : "10px 10px 10px 32px",
                    fontSize: "14px",
                    border: `2px solid ${focused ? colorTokens.interactive.primary : colorTokens.interactive.secondary}`,
                    borderRadius: radiusTokens.md,
                    outline: "none",
                    transition: "all 0.2s ease",
                    backgroundColor: colorTokens.background.primary,
                    color: colorTokens.text.primary,
                    boxSizing: "border-box",
                    ...style,
                }, ...props }), value && (_jsx("button", { type: "button", "aria-label": "Clear search", onClick: onClear, style: {
                    position: "absolute",
                    right: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    padding: 0,
                    border: "none",
                    borderRadius: radiusTokens.full,
                    background: "none",
                    color: colorTokens.text.secondary,
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: 1,
                }, children: "\u00D7" }))] }));
});
SearchInput.displayName = "SearchInput";
//# sourceMappingURL=SearchInput.js.map