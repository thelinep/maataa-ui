import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/DatePicker
 * A single-date input backed by a floating month calendar
 */
import React, { useEffect, useId, useRef, useState } from "react";
import { Portal } from "../primitives/Portal";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { CalendarGrid } from "./CalendarGrid";
import { formatDisplayDate } from "./dateUtils";
/**
 * DatePicker
 * A trigger button showing the selected date, opening a floating month
 * calendar on click. Closes on selection, Escape, or an outside click.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState<Date | null>(null);
 * <DatePicker label="Event date" value={date} onChange={setDate} />
 * ```
 */
export const DatePicker = React.forwardRef(({ value, onChange, label, error, helperText, required = false, disabled = false, min, max, placeholder = "Select a date", id, className, style, }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState(value ?? new Date());
    const triggerRef = useRef(null);
    const popupRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (!isOpen)
            return;
        setVisibleMonth(value ?? new Date());
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect)
            setPosition({ x: rect.left, y: rect.bottom + 8 });
    }, [isOpen, value]);
    useEffect(() => {
        if (!isOpen)
            return;
        const handleOutside = (e) => {
            if (triggerRef.current &&
                !triggerRef.current.contains(e.target) &&
                popupRef.current &&
                !popupRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleKey = (e) => {
            if (e.key === "Escape")
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);
    const handleSelectDay = (date) => {
        onChange(date);
        setIsOpen(false);
    };
    return (_jsxs("div", { className: className, style: { display: "flex", flexDirection: "column", gap: spacingTokens.xs, ...style }, children: [label && (
            // Deliberately not `<label htmlFor>`-associated with the trigger
            // button below: for a labelable element like `<button>`, the
            // accessible-name algorithm gives an associated `<label>`
            // priority over the element's own text content, which would
            // replace the announced selected date with just the label text.
            // A plain preceding label (matching Select's pattern) keeps the
            // button's own content — the actual selected date — as its name.
            _jsxs("span", { style: {
                    fontSize: typographyTokens.fontSize.md,
                    fontWeight: typographyTokens.fontWeight.medium,
                    color: error ? colorTokens.interactive.error : colorTokens.text.primary,
                }, children: [label, required && (_jsx("span", { style: { color: colorTokens.interactive.error, marginLeft: "2px" }, "aria-hidden": "true", children: "*" }))] })), _jsxs("button", { ref: (node) => {
                    triggerRef.current = node;
                    if (typeof ref === "function")
                        ref(node);
                    else if (ref)
                        ref.current = node;
                }, id: fieldId, type: "button", disabled: disabled, onClick: () => setIsOpen((prev) => !prev), "aria-haspopup": "dialog", "aria-expanded": isOpen, style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px",
                    fontSize: typographyTokens.fontSize.md,
                    border: `2px solid ${error ? colorTokens.interactive.error : colorTokens.interactive.secondary}`,
                    borderRadius: radiusTokens.md,
                    backgroundColor: disabled
                        ? colorTokens.background.tertiary
                        : colorTokens.background.primary,
                    color: value ? colorTokens.text.primary : colorTokens.text.tertiary,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                }, children: [_jsx("span", { children: value ? formatDisplayDate(value) : placeholder }), _jsx("span", { "aria-hidden": "true", style: { color: colorTokens.text.secondary }, children: "\uD83D\uDCC5" })] }), error && (_jsx("span", { style: { fontSize: typographyTokens.fontSize.xs, color: colorTokens.interactive.error }, children: error })), helperText && !error && (_jsx("span", { style: { fontSize: typographyTokens.fontSize.xs, color: colorTokens.text.secondary }, children: helperText })), isOpen && (_jsx(Portal, { children: _jsx("div", { ref: popupRef, style: {
                        position: "fixed",
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        zIndex: 1000,
                        padding: spacingTokens.md,
                        backgroundColor: colorTokens.background.primary,
                        border: `1px solid ${colorTokens.border.primary}`,
                        borderRadius: radiusTokens.lg,
                        boxShadow: colorTokens.shadow.lg,
                    }, children: _jsx(CalendarGrid, { month: visibleMonth, onMonthChange: setVisibleMonth, onSelectDay: handleSelectDay, selected: value, min: min, max: max, "aria-label": label ? `Choose ${label}` : "Choose a date" }) }) }))] }));
});
DatePicker.displayName = "DatePicker";
//# sourceMappingURL=DatePicker.js.map