/**
 * @maataa/ui/forms/dateUtils
 * Small internal date helpers shared by DatePicker, DateTimePicker, and
 * DateRangePicker. Not part of the public API — deliberately dependency-free
 * (no date library) since the calendar UI only needs month/day arithmetic.
 */
export declare const WEEKDAY_LABELS: string[];
export declare function isSameDay(a: Date | null, b: Date | null): boolean;
/** Strips the time portion, returning a new Date at local midnight. */
export declare function startOfDay(date: Date): Date;
export declare function addMonths(date: Date, count: number): Date;
export declare function isBeforeDay(a: Date, b: Date): boolean;
export declare function isAfterDay(a: Date, b: Date): boolean;
export declare function isWithinRange(date: Date, min?: Date, max?: Date): boolean;
/** Deterministic, locale-independent display format: "Sep 9, 2026" */
export declare function formatDisplayDate(date: Date): string;
export declare function formatMonthYear(date: Date): string;
/**
 * Builds a 6x7 (42-cell) grid of dates for the given month, including the
 * trailing days of the previous month and leading days of the next month
 * needed to fill complete weeks (Sunday-first).
 */
export declare function getMonthGrid(monthDate: Date): {
    date: Date;
    inMonth: boolean;
}[];
/** Formats a Date's time-of-day as "HH:MM" for use with <input type="time">. */
export declare function formatTimeValue(date: Date): string;
/** Applies an "HH:MM" time string onto a date, returning a new Date. */
export declare function applyTimeValue(date: Date, time: string): Date;
//# sourceMappingURL=dateUtils.d.ts.map