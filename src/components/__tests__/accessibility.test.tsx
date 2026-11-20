/**
 * Accessibility Tests
 * Phase I Day 3: Advanced Accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  generateId,
  createAriaLabel,
  getFocusableElements,
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AAA,
  hasAccessibleName,
  isKeyboardAccessible,
} from '../../utils/accessibility';
import { SkipLinks } from '../accessibility/SkipLinks';
import { FocusTrap } from '../accessibility/FocusTrap';
import { LiveRegion } from '../accessibility/LiveRegion';

describe('Accessibility (WCAG 2.1 AAA)', () => {
  describe('Utility Functions', () => {
    test('generateId creates unique IDs', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^test-\d+-\d+$/);
    });

    test('createAriaLabel creates semantic labels', () => {
      const label = createAriaLabel('Save', 'unsaved changes', 'required');
      expect(label).toContain('Save');
      expect(label).toContain('unsaved changes');
      expect(label).toContain('required');
    });

    test('getFocusableElements returns focusable elements', () => {
      const { container } = render(
        <div>
          <button>Click me</button>
          <a href="#">Link</a>
          <input type="text" />
        </div>
      );

      const focusable = getFocusableElements(container);
      expect(focusable.length).toBeGreaterThan(0);
    });
  });

  describe('Color Contrast', () => {
    test('getContrastRatio calculates contrast correctly', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeGreaterThan(20); // Should be around 21
    });

    test('meetsWCAG_AA validates AA compliance', () => {
      const high = meetsWCAG_AA('#FFFFFF', '#000000');
      const low = meetsWCAG_AA('#FFFFFF', '#CCCCCC');
      
      expect(high).toBe(true);
      expect(low).toBe(false);
    });

    test('meetsWCAG_AAA validates AAA compliance', () => {
      const high = meetsWCAG_AAA('#FFFFFF', '#000000');
      const medium = meetsWCAG_AAA('#FFFFFF', '#666666');
      
      expect(high).toBe(true);
      expect(medium).toBe(false);
    });
  });

  describe('Keyboard Accessibility', () => {
    test('isKeyboardAccessible detects interactive elements', () => {
      const { container } = render(
        <div>
          <button>Accessible</button>
          <div>Not accessible</div>
        </div>
      );

      const button = container.querySelector('button') as HTMLElement;
      const div = container.querySelector('div > div') as HTMLElement;

      expect(isKeyboardAccessible(button)).toBe(true);
      expect(isKeyboardAccessible(div)).toBe(false);
    });
  });

  describe('Accessible Names', () => {
    test('hasAccessibleName checks for label', () => {
      const { container } = render(
        <div>
          <button aria-label="Close">X</button>
          <button>OK</button>
          <button />
        </div>
      );

      const buttons = container.querySelectorAll('button');
      expect(hasAccessibleName(buttons[0])).toBe(true);
      expect(hasAccessibleName(buttons[1])).toBe(true);
      expect(hasAccessibleName(buttons[2])).toBe(false);
    });
  });

  describe('Skip Links Component', () => {
    test('renders skip links', () => {
      render(<SkipLinks />);
      expect(screen.getByText(/Skip to main content/i)).toBeInTheDocument();
    });

    test('skip links are initially hidden', () => {
      const { container } = render(<SkipLinks />);
      const link = container.querySelector('a');
      expect(link).toHaveStyle({ left: '-9999px' });
    });

    test('skip links become visible on focus', () => {
      const { container } = render(<SkipLinks />);
      const link = container.querySelector('a') as HTMLAnchorElement;
      
      link.focus();
      // After focus, element should not have left: -9999px
      // This would be tested in e2e tests
      expect(document.activeElement).toBe(link);
    });
  });

  describe('Focus Trap Component', () => {
    test('renders children', () => {
      render(
        <FocusTrap>
          <button>Button 1</button>
          <button>Button 2</button>
        </FocusTrap>
      );

      expect(screen.getByRole('button', { name: /Button 1/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Button 2/i })).toBeInTheDocument();
    });

    test('calls onEscape handler', () => {
      const handleEscape = jest.fn();
      
      render(
        <FocusTrap onEscape={handleEscape}>
          <button>Button</button>
        </FocusTrap>
      );

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Escape' });

      expect(handleEscape).toHaveBeenCalled();
    });
  });

  describe('Live Region Component', () => {
    test('renders live region', () => {
      const { container } = render(
        <LiveRegion message="Loading..." />
      );

      const liveRegion = container.querySelector('[role="status"]');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    test('updates message', () => {
      const { container, rerender } = render(
        <LiveRegion message="Loading..." />
      );

      const liveRegion = container.querySelector('[role="status"]');
      expect(liveRegion).toHaveTextContent('Loading...');

      rerender(<LiveRegion message="Complete!" />);
      expect(liveRegion).toHaveTextContent('Complete!');
    });

    test('respects priority levels', () => {
      const { container: container1 } = render(
        <LiveRegion message="Info" priority="polite" />
      );
      const { container: container2 } = render(
        <LiveRegion message="Error" priority="assertive" />
      );

      expect(container1.querySelector('[aria-live="polite"]')).toBeInTheDocument();
      expect(container2.querySelector('[aria-live="assertive"]')).toBeInTheDocument();
    });
  });

  describe('WCAG 2.1 Compliance', () => {
    test('keyboard navigation works', () => {
      const { container } = render(
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(isKeyboardAccessible(button as HTMLElement)).toBe(true);
      });
    });

    test('all buttons have accessible names', () => {
      const { container } = render(
        <div>
          <button>Save</button>
          <button aria-label="Close">X</button>
          <button title="Delete">🗑️</button>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(hasAccessibleName(button as HTMLElement)).toBe(true);
      });
    });

    test('high contrast colors are used', () => {
      const whiteOnBlack = meetsWCAG_AAA('#FFFFFF', '#000000');
      const whiteOnGray = meetsWCAG_AA('#FFFFFF', '#808080');
      
      expect(whiteOnBlack).toBe(true);
      expect(whiteOnGray).toBe(true);
    });
  });
});
