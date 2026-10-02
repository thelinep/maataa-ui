import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { WEEKDAY_LABELS, addMonths, formatMonthYear, getMonthGrid, isSameDay, isWithinRange, } from "./dateUtils";
export const CalendarGrid = ({ month, onMonthChange, onSelectDay, selected = null, rangeStart = null, rangeEnd = null, min, max, today = new Date(), "aria-label": ariaLabel = "Choose a date", }) => {
    const cells = getMonthGrid(month);
    const isInRange = (date) => {
        if (!rangeStart || !rangeEnd)
            return false;
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const rangeStartTime = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime();
        const rangeEndTime = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime();
        return dayStart >= rangeStartTime && dayStart <= rangeEndTime;
    };
    return (_jsxs("div", { role: "dialog", "aria-label": ariaLabel, style: { width: "280px" }, children: [_jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: spacingTokens.sm,
                }, children: [_jsx("button", { type: "button", "aria-label": "Previous month", onClick: () => onMonthChange(addMonths(month, -1)), style: navButtonStyle, children: "\u2039" }), _jsx("span", { style: {
                            fontSize: typographyTokens.fontSize.md,
                            fontWeight: typographyTokens.fontWeight.semibold,
                            color: colorTokens.text.primary,
                        }, children: formatMonthYear(month) }), _jsx("button", { type: "button", "aria-label": "Next month", onClick: () => onMonthChange(addMonths(month, 1)), style: navButtonStyle, children: "\u203A" })] }), _jsx("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "2px",
                    marginBottom: spacingTokens.xs,
                }, children: WEEKDAY_LABELS.map((day) => (_jsx("span", { style: {
                        textAlign: "center",
                        fontSize: typographyTokens.fontSize.xs,
                        color: colorTokens.text.secondary,
                        fontWeight: typographyTokens.fontWeight.medium,
                    }, children: day }, day))) }), _jsx("div", { role: "grid", style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "2px",
                }, children: cells.map(({ date, inMonth }) => {
                    const disabled = !isWithinRange(date, min, max);
                    const isSelected = isSameDay(date, selected) || isSameDay(date, rangeStart) || isSameDay(date, rangeEnd);
                    const inRange = isInRange(date) && !isSelected;
                    const isToday = isSameDay(date, today);
                    return (_jsx("button", { type: "button", role: "gridcell", disabled: disabled, "aria-current": isToday ? "date" : undefined, "aria-selected": isSelected, "data-in-month": inMonth, onClick: () => onSelectDay(date), style: {
                            width: "100%",
                            aspectRatio: "1",
                            border: isToday && !isSelected
                                ? `1px solid ${colorTokens.interactive.primary}`
                                : "1px solid transparent",
                            borderRadius: radiusTokens.sm,
                            backgroundColor: isSelected
                                ? colorTokens.interactive.primary
                                : inRange
                                    ? colorTokens.background.tertiary
                                    : "transparent",
                            color: isSelected
                                ? colorTokens.text.inverse
                                : inMonth
                                    ? colorTokens.text.primary
                                    : colorTokens.text.tertiary,
                            fontSize: typographyTokens.fontSize.sm,
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.4 : 1,
                        }, children: date.getDate() }, date.toISOString()));
                }) })] }));
};
CalendarGrid.displayName = "CalendarGrid";
const navButtonStyle = {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: typographyTokens.fontSize["2xl"],
    lineHeight: 1,
    padding: spacingTokens.xs,
    color: colorTokens.text.primary,
    borderRadius: radiusTokens.sm,
};
//# sourceMappingURL=CalendarGrid.js.map