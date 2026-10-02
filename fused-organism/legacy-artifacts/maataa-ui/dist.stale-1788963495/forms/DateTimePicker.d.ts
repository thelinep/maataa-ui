/**
 * @maataa/ui/forms/DateTimePicker
 * Combines DatePicker and TimePicker into a single date+time value
 */
import React from "react";
export interface DateTimePickerProps {
    /** Currently selected date and time, or `null` for no selection (controlled). */
    value: Date | null;
    /** Called with the combined date+time whenever either part changes. */
    onChange: (date: Date | null) => void;
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    min?: Date;
    max?: Date;
    className?: string;
    style?: React.CSSProperties;
}
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
export declare const DateTimePicker: React.ForwardRefExoticComponent<DateTimePickerProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=DateTimePicker.d.ts.map