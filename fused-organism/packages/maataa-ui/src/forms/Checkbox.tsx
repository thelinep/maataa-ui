/**
 * @maataa/ui/forms/Checkbox
 * Accessible checkbox component with indeterminate state support
 */

import React from "react";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange"
> {
  /**
   * Whether checkbox is checked
   */
  checked?: boolean;

  /**
   * Callback when checkbox state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Label text displayed next to checkbox
   */
  label?: string;

  /**
   * Description text displayed below checkbox
   */
  description?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether checkbox is in indeterminate state (shows dash)
   */
  indeterminate?: boolean;

  /**
   * Checkbox size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Checkbox
 * Accessible checkbox input with support for indeterminate state
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      label,
      description,
      error,
      indeterminate = false,
      size = "md",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );
    const [focusVisible, setFocusVisible] = React.useState(false);

    // Every checkbox gets an id, so its label, description and error are
    // programmatically tied to it (WCAG 1.3.1, 4.1.2).
    const autoId = React.useId();
    const inputId = props.id ?? autoId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy =
      [props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    const sizeMap = {
      sm: { size: "16px", fontSize: "13px" },
      md: { size: "20px", fontSize: "14px" },
      lg: { size: "24px", fontSize: "15px" },
    };

    const currentSize = sizeMap[size];

    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const getCheckmarkContent = () => {
      if (indeterminate) return "−";
      if (checked) return "✓";
      return "";
    };

    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: spacingTokens.sm }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // 24px minimum pointer target (WCAG 2.5.8) around the visible box
              minWidth: "24px",
              minHeight: "24px",
            }}
          >
            {/* Native input laid over the box: it takes the clicks and the focus */}
            <input
              {...props}
              ref={setRefs}
              id={inputId}
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              aria-invalid={error ? true : props["aria-invalid"]}
              aria-describedby={describedBy}
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

            {/* Custom checkbox visual */}
            <div
              aria-hidden="true"
              style={{
                width: currentSize.size,
                height: currentSize.size,
                minWidth: currentSize.size,
                minHeight: currentSize.size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${error ? colorTokens.interactive.error : checked || indeterminate ? colorTokens.interactive.success : colorTokens.border.control}`,
                borderRadius: radiusTokens.sm,
                backgroundColor:
                  checked || indeterminate
                    ? colorTokens.interactive.success
                    : colorTokens.background.primary,
                color: colorTokens.background.primary,
                fontWeight: "bold",
                fontSize: "calc(" + currentSize.size + " * 0.6)",
                transition: "all 0.2s ease",
                opacity: disabled ? 0.6 : 1,
                outline: focusVisible ? `2px solid ${colorTokens.interactive.primary}` : "none",
                outlineOffset: "2px",
              }}
            >
              {getCheckmarkContent()}
            </div>
          </div>

          {/* Label and description */}
          {(label || description) && (
            <div
              style={{
                flex: 1,
              }}
            >
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
                    fontSize: "calc(" + currentSize.fontSize + " * 0.857)", // ~12px for md
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

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            style={{
              fontSize: "calc(" + currentSize.fontSize + " * 0.857)",
              color: colorTokens.interactive.error,
              marginTop: "4px",
              marginLeft: "calc(24px + " + spacingTokens.sm + ")",
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
