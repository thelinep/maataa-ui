/**
 * Combobox - Searchable select component
 *
 * A searchable select/dropdown component that combines text input
 * with option filtering.
 *
 * Features:
 * - Text search filtering
 * - Keyboard navigation
 * - Option highlighting
 * - Custom filtering
 * - Design token integration
 */

import { useState, useRef, ReactNode, useId } from 'react';
import styled from 'styled-components';
import { colorTokens, spacing, typography, borderRadius, transitions } from '@/utils/tokens';
import { useFormField } from './FormFieldWrapper';

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Options to display */
  options: ComboboxOption[];
  /** Selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Label text */
  label?: ReactNode;
  /** Error message */
  error?: ReactNode;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Custom id */
  id?: string;
  /** Custom filter function */
  filterOptions?: (options: ComboboxOption[], inputValue: string) => ComboboxOption[];
}

// Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  position: relative;
  width: 100%;
`;

// Label
const Label = styled.label<{ $hasError?: boolean }>`
  font-size: ${typography.label.fontSize};
  font-weight: ${typography.label.fontWeight};
  line-height: ${typography.label.lineHeight};
  text-transform: ${typography.label.textTransform};
  color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.text.primary)};
`;

// Input wrapper
const InputWrapper = styled.div<{ $isOpen?: boolean; $hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
`;

// Input
const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.body.fontFamily};
  font-size: ${typography.body.fontSize};
  color: ${colorTokens.text.primary};
  background-color: ${colorTokens.background.primary};
  border: 1px solid ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.border.primary)};
  border-radius: ${borderRadius.md};
  transition: all ${transitions.fast};

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.interactive.primary)};
    box-shadow: 0 0 0 3px ${(props) => {
      if (props.$hasError) return 'rgba(139, 58, 43, 0.1)';
      return 'rgba(139, 111, 71, 0.1)';
    }};
  }

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.$hasError ? colorTokens.interactive.error : colorTokens.border.secondary)};
  }

  &:disabled {
    background-color: ${colorTokens.background.secondary};
    color: ${colorTokens.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${colorTokens.text.tertiary};
  }
`;

// Options dropdown
const OptionsDropdown = styled.div<{ $isOpen: boolean }>`
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
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
`;

// Option item
const OptionItem = styled.button<{ $isHighlighted?: boolean; $isSelected?: boolean; $isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  background: none;
  border: none;
  text-align: left;
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => (props.$isDisabled ? colorTokens.text.disabled : colorTokens.text.primary)};
  font-size: ${typography.body.fontSize};
  transition: background-color ${transitions.fast};
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};

  background-color: ${(props) =>
    props.$isHighlighted ? colorTokens.background.tertiary : 'transparent'};

  &:hover:not(:disabled) {
    background-color: ${colorTokens.background.tertiary};
  }

  &:focus {
    outline: none;
    background-color: ${colorTokens.background.tertiary};
  }

  ${(props) =>
    props.$isSelected &&
    `
    color: ${colorTokens.interactive.primary};
    font-weight: 600;
  `}
`;

// No options message
const NoOptions = styled.div`
  padding: ${spacing.md};
  text-align: center;
  color: ${colorTokens.text.secondary};
  font-size: ${typography.bodySmall.fontSize};
`;

// Error text
const ErrorText = styled.div`
  font-size: ${typography.bodySmall.fontSize};
  color: ${colorTokens.interactive.error};
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
 * Combobox Component
 *
 * A searchable select component with keyboard navigation.
 *
 * @example
 * <Combobox
 *   label="Select country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="Search countries..."
 * />
 */
export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Search...',
  required = false,
  disabled = false,
  id,
  filterOptions: customFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFormField();
  const generatedId = useId();
  const comboboxId = id || field?.id || `combobox-${generatedId}`;
  const hasError = !!error;

  // Filter options
  const defaultFilter = (opts: ComboboxOption[], input: string) =>
    opts.filter((opt) => opt.label?.toString().toLowerCase().includes(input.toLowerCase()));

  const filteredOptions = customFilter ? customFilter(options, inputValue) : defaultFilter(options, inputValue);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleSelectOption = (option: ComboboxOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setInputValue('');
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(Math.min(highlightedIndex + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      {label && <Label htmlFor={comboboxId} $hasError={hasError}>{label}</Label>}

      <InputWrapper>
        <Input
          ref={inputRef}
          id={comboboxId}
          type="text"
          value={selectedOption && !inputValue ? String(selectedOption.label) : inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          $hasError={hasError}
          aria-autocomplete="list"
          aria-controls={`${comboboxId}-listbox`}
          aria-expanded={isOpen}
          required={required}
        />
      </InputWrapper>

      <OptionsDropdown id={`${comboboxId}-listbox`} $isOpen={isOpen} role="listbox">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <OptionItem
              key={option.value}
              role="option"
              $isHighlighted={index === highlightedIndex}
              $isSelected={option.value === value}
              $isDisabled={option.disabled}
              onClick={() => handleSelectOption(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </OptionItem>
          ))
        ) : (
          <NoOptions>No options found</NoOptions>
        )}
      </OptionsDropdown>

      {error && (
        <ErrorText role="alert">
          <span>⚠</span>
          {error}
        </ErrorText>
      )}
    </Container>
  );
};

Combobox.displayName = 'Combobox';

export default Combobox;
