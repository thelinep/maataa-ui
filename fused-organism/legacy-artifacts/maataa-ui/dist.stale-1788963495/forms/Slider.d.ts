/**
 * @maataa/ui/forms/Slider
 * Range slider input with an optional live value readout
 */
import React from "react";
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
    /**
     * Current value (controlled)
     */
    value: number;
    /**
     * Called with the new numeric value as the slider moves
     */
    onChange: (value: number) => void;
    /**
     * Minimum value
     * @default 0
     */
    min?: number;
    /**
     * Maximum value
     * @default 100
     */
    max?: number;
    /**
     * Step increment
     * @default 1
     */
    step?: number;
    /**
     * Label text displayed above the slider
     */
    label?: string;
    /**
     * Whether to show the current numeric value next to the label
     * @default true
     */
    showValue?: boolean;
}
/**
 * Slider
 * A styled range input with an accessible label and an optional
 * live-updating value readout.
 *
 * @example
 * ```tsx
 * const [volume, setVolume] = useState(50);
 * <Slider label="Volume" value={volume} onChange={setVolume} />
 * ```
 */
export declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Slider.d.ts.map