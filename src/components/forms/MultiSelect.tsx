/**
 * MultiSelect - Multi-value select component
 *
 * A styled component for selecting multiple values from a list.
 * Displays selected values as tags that can be removed.
 *
 * Features:
 * - Multiple value selection
 * - Selected values as removable tags
 * - Keyboard navigation (Tab, Enter, Backspace)
 * - Label, hint, and error support
 * - Design token integration
 */

import { forwardRef, useState, ReactNode, useId } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';
import { useField } from '@maataa/primitives';

export interface MultiSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Label text */
  label?: ReactNode;
  /** Error message */
  error?: ReactNode;
  /** Hint text */
  hint?: ReactNode;
  /** Options to display */
  options: MultiSelectOption[];
  /** Selected values */
  value?: string[];
  /** Change handler */
  onChange?: (values: string[]) => void;
  /** Whether field is required */
  required?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show asterisk for required fields */
  showRequiredAsterisk?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Custom id */
  id?: string;
  /** Maximum number of selections (optional) */
  maxSelections?: number;
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

// Label
const Label = styled.label<{ $required?: boolean; $hasError?: boolean }>`
  font-size: ${typography.label.fontSize};
  font-weight: ${typography.label.fontWeight};
  line-height: ${typography.label.lineHeight};
  text-transform: ${typography.label.textTransform};
  color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.text.primary)};
  transition: color ${transitions.normal};

  .required-asterisk {
    color: ${colorTokens.interactive.error};
    margin-left: ${spacing.xs};
  }
`;

// Multi-select container
const MultiSelectContainer = styled.div<{ $hasError?: boolean; $size?: 'sm' | 'md' | 'lg'; $disabled?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  /* Base styles */
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  font-family: ${typography.body.fontFamily};
  padding: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return `${spacing.xs} ${spacing.sm}`;
      case 'lg':
        return `${spacing.md} ${spacing.lg}`;
      default:
        return `${spacing.sm} ${spacing.md}`;
    }
  }};

  /* Colors and borders */
  color: ${colorTokens.text.primary};
  background-color: ${(props) => (props.$disabled ? colorTokens.background.secondary : colorTokens.background.primary)};
  border: 1px solid ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.border.primary)};
  border-radius: ${borderRadius.md};

  /* Transitions */
  transition:
    border-color ${transitions.fast},
    box-shadow ${transitions.fast},
    background-color ${transitions.fast};

  /* Focus state - when input inside is focused */
  &:has(input:focus) {
    border-color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.interactive.primary)};
    box-shadow: 0 0 0 3px ${(props) => {
      if (props.$hasError) return 'rgba(139, 58, 43, 0.1)';
      return 'rgba(139, 111, 71, 0.1)';
    }};
  }

  /* Hover state */
  &:hover {
    border-color: ${(props) =>
      props.$disabled ? colorTokens.border.primary : props.$hasError ? colorTokens.interactive.error : colorTokens.border.secondary};
  }

  /* Disabled state */
  ${(props) => props.$disabled && `opacity: 0.6; cursor: not-allowed;`}
`;

// Tags container
const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs};
`;

// Tag
const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colorTokens.background.secondary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.text.primary};

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    width: 1.2em;
    height: 1.2em;
    background: none;
    border: none;
    color: ${colorTokens.text.secondary};
    cursor: pointer;
    font-size: 1.1em;
    line-height: 1;
    border-radius: 50%;
    transition: all ${transitions.fast};

    &:hover {
      color: ${colorTokens.interactive.error};
      background-color: rgba(139, 58, 43, 0.1);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${colorTokens.interactive.primary};
    }
  }
`;

// Hidden select for accessibility
const HiddenSelect = styled.select`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;

// Options dropdown
const OptionsDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${spacing.xs};
  background-color: ${colorTokens.background.primary};
  border: 1px solid ${colorTokens.border.primary};
  border-radius: ${borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

// Option item
const OptionItem = styled.button<{ $isSelected?: boolean; $isDisabled?: boolean; $isHovered?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background: none;
  border: none;
  text-align: left;
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => (props.$isDisabled ? colorTokens.text.disabled : colorTokens.text.primary)};
  font-size: ${typography.body.fontSize};
  transition: background-color ${transitions.fast};
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};

  &:hover {
    background-color: ${(props) => (props.$isDisabled ? 'transparent' : colorTokens.background.secondary)};
  }

  &:focus {
    outline: none;
    background-color: ${colorTokens.background.tertiary};
  }

  /* Checkbox */
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid ${colorTokens.border.primary};
    border-radius: ${borderRadius.sm};
    background-color: ${(props) => (props.$isSelected ? colorTokens.interactive.primary : 'transparent')};
    flex-shrink: 0;
  }
`;

// Helper text
const HelperText = styled.div<{ $variant?: 'hint' | 'error' }>`
  font-size: ${typography.bodySmall.fontSize};
  line-height: ${typography.bodySmall.lineHeight};
  color: ${(props) => (props.$variant === 'error' ? colorTokens.interactive.error : colorTokens.text.secondary)};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
`;

/**
 * MultiSelect Component
 *
 * A styled multi-select component for selecting multiple values
 * from a list with tag-based display of selected values.
 *
 * @example
 * <MultiSelect
 *   label="Team Members"
 *   options={[
 *     { value: 'alice', label: 'Alice' },
 *     { value: 'bob', label: 'Bob' },
 *   ]}
 *   value={['alice']}
 *   onChange={setSelected}
 *   required
 * />
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      value = [],
      onChange,
      required = false,
      size = 'md',
      placeholder = 'Select options...',
      showRequiredAsterisk = true,
      disabled = false,
      id,
      maxSelections,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const field = useField();
    const generatedId = useId();
    const selectId = id || field?.id || `multiselect-${generatedId}`;
    const labelId = `${selectId}-label`;
    const hasError = !!error || !!field?.invalid;

    const selectedLabels = options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label);

    const handleToggleOption = (optionValue: string) => {
      if (disabled) return;

      const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];

      // Check max selections
      if (maxSelections && newValue.length > maxSelections) {
        return;
      }

      onChange?.(newValue);
    };

    const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      handleToggleOption(optionValue);
    };

    return (
      <Container ref={ref}>
        {label && (
          <Label id={labelId} htmlFor={selectId} $required={required} $hasError={hasError}>
            {label}
            {required && showRequiredAsterisk && <span className="required-asterisk">*</span>}
          </Label>
        )}

        <MultiSelectContainer
          $hasError={hasError}
          $size={size}
          $disabled={disabled}
          id={selectId}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? labelId : field?.labelId}
          aria-required={required || field?.required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={
            (error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined) ?? field?.describedBy
          }
          aria-disabled={disabled || undefined}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          onBlur={(e) => {
            // keep open while focus moves to an option inside
            if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
              setTimeout(() => setIsOpen(false), 100);
            }
          }}
          tabIndex={disabled ? -1 : 0}
        >
          <TagsContainer>
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, idx) => (
                <Tag key={value[idx]}>
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveTag(value[idx], e)}
                    tabIndex={0}
                    aria-label={`Remove ${label}`}
                  >
                    ×
                  </button>
                </Tag>
              ))
            ) : (
              <span style={{ color: colorTokens.text.tertiary }}>{placeholder}</span>
            )}
          </TagsContainer>

          <OptionsDropdown $isOpen={isOpen}>
            {options.map((option, idx) => (
              <OptionItem
                key={option.value}
                type="button"
                $isSelected={value.includes(option.value)}
                $isDisabled={!!(option.disabled || (maxSelections && value.length >= maxSelections && !value.includes(option.value)))}
                $isHovered={hoveredIndex === idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleToggleOption(option.value)}
              >
                {option.label}
              </OptionItem>
            ))}
          </OptionsDropdown>
        </MultiSelectContainer>

        <HiddenSelect multiple aria-hidden="true" tabIndex={-1}>
          {value.map((v) => (
            <option key={v} value={v} selected>
              {options.find((o) => o.value === v)?.label}
            </option>
          ))}
        </HiddenSelect>

        {error && (
          <HelperText id={`${selectId}-error`} $variant="error" role="alert">
            <span>⚠</span>
            {error}
          </HelperText>
        )}

        {hint && !error && (
          <HelperText id={`${selectId}-hint`} $variant="hint">
            {hint}
          </HelperText>
        )}
      </Container>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
