/**
 * Button Component Tests
 * Unit tests for variants, sizes, states, and interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with text content', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render all variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'destructive', 'ghost'] as const;

      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByText(variant)).toBeInTheDocument();
        unmount();
      });
    });

    it('should render all sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { unmount } = render(<Button size={size}>Size</Button>);
        expect(screen.getByText('Size')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByText('Enabled');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click</Button>);
      await user.click(screen.getByText('Click'));

      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      await user.click(screen.getByText('Disabled'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByText('Keyboard');
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should indicate disabled state to screen readers', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Props', () => {
    it('should accept className prop', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByText('Custom');
      expect(button).toHaveClass('custom-class');
    });

    it('should accept style prop', () => {
      render(<Button style={{ color: 'red' }}>Styled</Button>);
      const button = screen.getByText('Styled');
      expect(button).toHaveStyle({ color: 'red' });
    });

    it('should support children as React nodes', () => {
      render(
        <Button>
          <span>Icon</span>
          Text
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('should use primary variant by default', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('primary');
    });

    it('should use md size by default', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('md');
    });
  });
});
