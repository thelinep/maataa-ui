/**
 * FormInput Component Tests
 * Unit tests for input types, validation, and states
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from './FormInput';

describe('FormInput Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<FormInput type="text" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<FormInput type="text" label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render all input types', () => {
      const types = ['text', 'email', 'password', 'number', 'url'] as const;

      types.forEach(type => {
        const { unmount } = render(<FormInput type={type} />);
        expect(screen.getByRole(type === 'text' ? 'textbox' : 'spinbutton', { hidden: true })).toBeInTheDocument();
        unmount();
      });
    });

    it('should render with placeholder', () => {
      render(<FormInput type="text" placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });

    it('should render hint text', () => {
      render(<FormInput type="text" hint="This is a hint" />);
      expect(screen.getByText('This is a hint')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(<FormInput type="text" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<FormInput type="text" disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<FormInput type="text" />);
      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });

    it('should have correct type attribute', () => {
      render(<FormInput type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('Interactions', () => {
    it('should update value on user input', async () => {
      const user = userEvent.setup();
      render(<FormInput type="text" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'Hello');

      expect(input.value).toBe('Hello');
    });

    it('should call onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormInput type="text" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'A');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle focus events', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<FormInput type="text" onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('should handle blur events', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(
        <>
          <FormInput type="text" onBlur={handleBlur} />
          <button>Next</button>
        </>
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.click(screen.getByText('Next'));

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should accept defaultValue', () => {
      render(<FormInput type="text" defaultValue="Initial value" />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial value');
    });

    it('should accept value prop for controlled input', () => {
      const { rerender } = render(<FormInput type="text" value="Controlled" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Controlled');

      rerender(<FormInput type="text" value="Updated" readOnly />);
      expect(screen.getByRole('textbox')).toHaveValue('Updated');
    });

    it('should support email type validation', () => {
      render(<FormInput type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should support number type validation', () => {
      render(<FormInput type="number" />);
      const input = screen.getByRole('spinbutton', { hidden: true });
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      render(<FormInput type="text" label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(<FormInput type="text" error="Required field" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<FormInput type="text" />);

      const input = screen.getByRole('textbox');
      await user.tab();

      expect(input).toHaveFocus();
    });
  });

  describe('Visual States', () => {
    it('should show error styling when error is present', () => {
      const { container } = render(
        <FormInput type="text" error="This field is required" />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not show error styling when no error', () => {
      const { container } = render(<FormInput type="text" />);

      const input = container.querySelector('input');
      expect(input).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<FormInput type="text" className="custom-class" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should accept custom style', () => {
      const { container } = render(
        <FormInput type="text" style={{ width: '100%' }} />
      );
      const input = container.querySelector('input');
      expect(input).toHaveStyle({ width: '100%' });
    });

    it('should support HTML attributes', () => {
      render(
        <FormInput
          type="text"
          maxLength={50}
          minLength={3}
          required
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '50');
      expect(input).toHaveAttribute('minLength', '3');
      expect(input).toHaveAttribute('required');
    });
  });
});
