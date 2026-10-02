/**
 * @maataa/ui/forms/DatePicker
 * A single-date input backed by a floating month calendar
 */
import React from "react";
export interface DatePickerProps {
    /** Currently selected date, or `null` for no selection (controlled). */
    value: Date | null;
    /** Called with the newly selected date. */
    onChange: (date: Date | null) => void;
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    /** Earliest selectable date (inclusive). */
    min?: Date;
    /** Latest selectable date (inclusive). */
    max?: Date;
    placeholder?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=DatePicker.d.ts.map