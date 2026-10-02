/**
 * @maataa/ui/forms/CalendarGrid
 * Internal month-grid calendar UI shared by DatePicker and DateRangePicker.
 * Not part of the public API.
 */
import React from "react";
export interface CalendarGridProps {
    /** The month currently displayed (any date within it). */
    month: Date;
    onMonthChange: (month: Date) => void;
    onSelectDay: (date: Date) => void;
    /** Single-selection mode: the selected date. */
    selected?: Date | null;
    /** Range-selection mode: highlights every day between start and end (inclusive). */
    rangeStart?: Date | null;
    rangeEnd?: Date | null;
    min?: Date;
    max?: Date;
    /** Injectable "today" for deterministic tests. Defaults to `new Date()`. */
    today?: Date;
    "aria-label"?: string;
}
export declare const CalendarGrid: React.FC<CalendarGridProps>;
//# sourceMappingURL=CalendarGrid.d.ts.map