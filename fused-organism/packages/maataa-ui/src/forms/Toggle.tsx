/**
 * @maataa/ui/forms/Toggle
 * Boolean toggle switch component
 */

import React from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface ToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange"
> {
  /**
   * Whether toggle is checked
   */
  checked?: boolean;

  /**
   * Callback when toggle state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Label text displayed next to toggle
   */
  label?: string;

  /**
   * Description text displayed below toggle
   */
  description?: string;

  /**
   * Toggle size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Color variant
   * @default 'primary'
   */
  color?: "primary" | "success" | "warning" | "error";
}

/**
 * Toggle
 * Boolean toggle switch with animated thumb
 */
export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked = false,
      onChange,
      label,
      description,
      size = "md",
      color = "primary",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: { width: "36px", height: "20px", thumbSize: "16px", fontSize: "13px" },
      md: { width: "48px", height: "24px", thumbSize: "20px", fontSize: "14px" },
      lg: { width: "56px", height: "28px", thumbSize: "24px", fontSize: "15px" },
    };

    const colorMap = {
      primary: colorTokens.interactive.primary,
      success: colorTokens.interactive.success,
      warning: colorTokens.interactive.warning,
      error: colorTokens.interactive.error,
    };

    const currentSize = sizeMap[size];
    const currentColor = colorMap[color];

    // Every switch gets an id, so its label and description are tied to it.
    const autoId = React.useId();
    const inputId = props.id ?? autoId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const describedBy =
      [props["aria-describedby"], descriptionId].filter(Boolean).join(" ") || undefined;
    const [focusVisible, setFocusVisible] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onChange?.(!checked);
      }
    };

    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: spacingTokens.sm }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              // 24px minimum pointer target (WCAG 2.5.8)
              minHeight: "24px",
            }}
          >
            {/* Native input laid over the track: it takes the clicks and the focus */}
            <input
              {...props}
              ref={ref}
              id={inputId}
              type="checkbox"
              role="switch"
              aria-checked={checked}
              aria-describedby={describedBy}
              checked={checked}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              onFocus={(e) => {
                setFocusVisible(e.currentTarget.matches?.(":focus-visible") ?? true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocusVisible(false);
                props.onBlur?.(e);
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                opacity: 0,
                cursor: disabled ? "not-allowed" : "pointer",
                zIndex: 1,
                ...props.style,
              }}
            />

            {/* Toggle background */}
            <div
              aria-hidden="true"
              style={{
                width: currentSize.width,
                height: currentSize.height,
                minWidth: currentSize.width,
                minHeight: currentSize.height,
                display: "flex",
                alignItems: "center",
                paddingLeft: checked ? "auto" : spacingTokens.xs,
                paddingRight: checked ? spacingTokens.xs : "auto",
                borderRadius: currentSize.height,
                backgroundColor: checked ? currentColor : colorTokens.background.secondary,
                // The off track needs a 3:1 outline against the page (WCAG 1.4.11)
                border: `1px solid ${checked ? currentColor : colorTokens.border.control}`,
                boxSizing: "border-box",
                outline: focusVisible ? `2px solid ${colorTokens.interactive.primary}` : "none",
                outlineOffset: "2px",
                transition: "background-color 0.3s ease",
                opacity: disabled ? 0.6 : 1,
                position: "relative",
              }}
            >
              {/* Animated thumb */}
              <div
                style={{
                  width: currentSize.thumbSize,
                  height: currentSize.thumbSize,
                  borderRadius: "50%",
                  backgroundColor: colorTokens.background.primary,
                  position: "absolute",
                  left: checked
                    ? `calc(${currentSize.width} - ${currentSize.thumbSize} - ${spacingTokens.xs})`
                    : spacingTokens.xs,
                  transition: "left 0.3s ease",
                  boxShadow: colorTokens.shadow.sm,
                }}
              />
            </div>
          </div>

          {/* Label and description */}
          {(label || description) && (
            <div style={{ flex: 1 }}>
              {label && (
                <label
                  style={{
                    display: "block",
                    fontSize: currentSize.fontSize,
                    fontWeight: 500,
                    // Disabled text stays readable; the state is conveyed by the control
                    color: disabled ? colorTokens.text.secondary : colorTokens.text.primary,
                    cursor: disabled ? "not-allowed" : "pointer",
                    lineHeight: "24px",
                  }}
                  htmlFor={inputId}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  id={descriptionId}
                  style={{
                    fontSize: "calc(" + currentSize.fontSize + " * 0.857)",
                    color: colorTokens.text.secondary,
                    marginTop: "4px",
                  }}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
