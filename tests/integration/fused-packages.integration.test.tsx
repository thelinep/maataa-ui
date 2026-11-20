/**
 * Root ↔ fused-organism integration: the app consumes @maataa/* packages via
 * file: dependencies (see package.json, .npmrc install-links).
 */

import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { colorTokens as fusedColors, spacingTokens, radiusTokens } from '@maataa/tokens';
import { Button, Card, Input } from '@maataa/primitives';
import { ThemeProvider } from '@maataa/ui';
import { colorTokens, spacing, borderRadius, typography } from '@/utils/tokens';
import { colorTokens as legacyPathTokens } from '@/design-system/theme-colors';

function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b2] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b2);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('@maataa packages', () => {
  it('render on the app’s single React instance', () => {
    const onClick = vi.fn();
    render(
      <ThemeProvider>
        <Card>
          <Input aria-label="Name" />
          <Button onClick={onClick}>Save</Button>
        </Card>
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(React.version.startsWith('19.')).toBe(true);
  });
});

describe('root tokens are sourced from @maataa/tokens', () => {
  it('uses fused values for colour, spacing and radius', () => {
    expect(colorTokens.interactive.primary).toBe(fusedColors.interactive.primary);
    expect(colorTokens.primary.main).toBe(fusedColors.interactive.primary);
    expect(colorTokens.background.primary).toBe(fusedColors.background.primary);
    expect(colorTokens.text.primary).toBe(fusedColors.text.primary);
    expect(spacing.md).toBe(spacingTokens.md);
    expect(borderRadius.md).toBe(radiusTokens.md);
  });

  it('exposes the same object through both legacy import paths', () => {
    expect(legacyPathTokens).toBe(colorTokens);
  });

  it('keeps colours as 6-digit hex (components append alpha suffixes)', () => {
    const hexes = [colorTokens.primary.main, colorTokens.primary.light, colorTokens.shadow, colorTokens.neutral.light];
    hexes.forEach((h) => expect(h).toMatch(/^#[0-9A-Fa-f]{6}$/));
  });

  it('meets WCAG AA (4.5:1) for text and brand buttons', () => {
    const bgs = [colorTokens.background.primary, colorTokens.background.secondary, colorTokens.background.tertiary];
    for (const bg of bgs) {
      expect(contrast(colorTokens.text.primary, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colorTokens.text.secondary, bg)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast('#FFFFFF', colorTokens.primary.main)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#FFFFFF', colorTokens.primary.dark)).toBeGreaterThanOrEqual(4.5);
    for (const c of ['success', 'warning', 'error', 'info'] as const) {
      expect(contrast(colorTokens.interactive[c], colorTokens.background.primary)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('builds typography roles from the fused scale', () => {
    expect(typography.body.fontSize).toBe('14px');
    expect(typography.label.textTransform).toBe('uppercase');
    expect(typography.heading2.fontSize).toBe('24px');
  });
});
