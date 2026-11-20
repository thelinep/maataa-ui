import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { InitialsAvatar, initialsOf, withAvatars } from './InitialsAvatar';

describe('InitialsAvatar', () => {
  it('uses the first and last initials', () => {
    expect(initialsOf('Alice Johnson')).toBe('AJ');
    expect(initialsOf('  mary ann  de souza ')).toBe('MS');
    expect(initialsOf('Cher')).toBe('C');
    expect(initialsOf('')).toBe('?');
  });

  it('is decorative and picks the same colour for the same name', () => {
    const { container, rerender } = render(<InitialsAvatar name="Bob Smith" />);
    const first = container.firstElementChild as HTMLElement;
    expect(first).toHaveAttribute('aria-hidden', 'true');
    const colour = first.style.backgroundColor;
    rerender(<InitialsAvatar name="Bob Smith" />);
    expect((container.firstElementChild as HTMLElement).style.backgroundColor).toBe(colour);
  });

  it('adds an avatar icon to each person option', () => {
    const options = withAvatars([{ label: 'Carol Williams', value: 'u3' }]);
    expect(options[0]).toMatchObject({ label: 'Carol Williams', value: 'u3' });
    const { container } = render(options[0].icon);
    expect(container).toHaveTextContent('CW');
  });
});
