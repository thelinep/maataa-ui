import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/DateTimePicker
 * Combines DatePicker and TimePicker into a single date+time value
 */
import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { applyTimeValue, formatTimeValue } from "./dateUtils";
/**
 * DateTimePicker
 * Pairs a `DatePicker` with a `TimePicker`; the time field is disabled
 * until a date is chosen, and defaults to midnight the first time a date
 * is picked.
 *
 * @example
 * ```tsx
 * const [when, setWhen] = useState<Date | null>(null);
 * <DateTimePicker label="Starts at" value={when} onChange={setWhen} />
 * ```
 */
export const DateTimePicker = React.forwardRef(({ value, onChange, label, error, helperText, required = false, disabled = false, min, max, className, style, }, ref) => {
    const handleDateChange = (date) => {
        if (!date) {
            onChange(null);
            return;
        }
        const withTime = value ? applyTimeValue(date, formatTimeValue(value)) : date;
        onChange(withTime);
    };
    const handleTimeChange = (time) => {
        if (!value)
            return;
        onChange(applyTimeValue(value, time));
    };
    return (_jsxs("div", { ref: ref, className: className, style: { width: "100%", ...style }, children: [label && (_jsxs("span", { style: {
                    display: "block",
                    marginBottom: spacingTokens.xs,
                    fontSize: typographyTokens.fontSize.md,
                    fontWeight: typographyTokens.fontWeight.medium,
                    color: error ? colorTokens.interactive.error : colorTokens.text.primary,
                }, children: [label, required && (_jsx("span", { style: { color: colorTokens.interactive.error, marginLeft: "2px" }, "aria-hidden": "true", children: "*" }))] })), _jsxs("div", { style: { display: "flex", gap: spacingTokens.sm, alignItems: "flex-start" }, children: [_jsx("div", { style: { flex: "2 1 200px" }, children: _jsx(DatePicker, { value: value, onChange: handleDateChange, disabled: disabled, min: min, max: max }) }), _jsx("div", { style: { flex: "1 1 120px" }, children: _jsx(TimePicker, { value: value ? formatTimeValue(value) : "", onChange: handleTimeChange, disabled: disabled || !value }) })] }), error && (_jsx("span", { style: {
                    display: "block",
                    marginTop: spacingTokens.xs,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.interactive.error,
                }, children: error })), helperText && !error && (_jsx("span", { style: {
                    display: "block",
                    marginTop: spacingTokens.xs,
                    fontSize: typographyTokens.fontSize.xs,
                    color: colorTokens.text.secondary,
                }, children: helperText }))] }));
});
DateTimePicker.displayName = "DateTimePicker";
//# sourceMappingURL=DateTimePicker.js.map