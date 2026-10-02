/**
 * @maataa/ui/forms/TimePicker
 * A styled time-of-day input
 */
import React from "react";
export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
    /** Time value as "HH:MM" (controlled), or empty string for no selection. */
    value: string;
    /** Called with the new "HH:MM" value. */
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    helperText?: string;
}
/**
 * TimePicker
 * A time-of-day field built on the native `<input type="time">`, styled to
 * match the rest of the form components. Used standalone, or combined with
 * `DatePicker` inside `DateTimePicker`.
 *
 * @example
 * ```tsx
 * const [time, setTime] = useState("09:00");
 * <TimePicker label="Start time" value={time} onChange={setTime} />
 * ```
 */
export declare const TimePicker: React.ForwardRefExoticComponent<TimePickerProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=TimePicker.d.ts.map