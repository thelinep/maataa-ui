/**
 * @maataa/ui/forms/DateRangePicker
 * A start/end date range input backed by a floating month calendar
 */
import React from "react";
export interface DateRange {
    start: Date | null;
    end: Date | null;
}
export interface DateRangePickerProps {
    /** Currently selected range (controlled). */
    value: DateRange;
    /** Called with the updated range. Fires once per endpoint picked. */
    onChange: (range: DateRange) => void;
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    min?: Date;
    max?: Date;
    placeholder?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * DateRangePicker
 * Click one day to set the range start, click a second day to set the end
 * (order is normalized automatically) and close the popup. Click the start
 * day again to restart the selection.
 *
 * @example
 * ```tsx
 * const [range, setRange] = useState<DateRange>({ start: null, end: null });
 * <DateRangePicker label="Booking dates" value={range} onChange={setRange} />
 * ```
 */
export declare const DateRangePicker: React.ForwardRefExoticComponent<DateRangePickerProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=DateRangePicker.d.ts.map