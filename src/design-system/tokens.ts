/**
 * Component design tokens: single source of truth is @maataa/tokens
 * (fused-organism/packages/tokens).
 *
 * This module keeps the token names root components already use
 * (colorTokens.primary.main, spacing.md, typography.heading2, zIndex.modal, …)
 * and fills every value from @maataa/tokens. Root-only names are aliases onto
 * existing palette entries; nothing here defines a new colour.
 *
 * Colours stay 6-digit hex so components can append an alpha suffix
 * (e.g. `${colorTokens.primary.light}30`).
 */

import {
  colorTokens as fused,
  radiusTokens,
  spacingTokens,
  transitionTokens,
  typographyTokens,
} from '@maataa/tokens';


export const colorTokens = {
  text: {
    primary: fused.text.primary,
    secondary: fused.text.secondary,
    tertiary: fused.text.tertiary,
    inverse: fused.text.inverse,
    disabled: fused.text.disabled,
  },
  background: {
    primary: fused.background.primary,
    secondary: fused.background.secondary,
    tertiary: fused.background.tertiary,
    inverse: fused.background.inverse,
  },
  border: {
    primary: fused.border.primary,
    secondary: fused.border.secondary,
    tertiary: fused.border.tertiary,
    /** Outline of inputs and controls, 3:1 or more (WCAG 1.4.11) */
    control: fused.border.control,
    light: fused.border.secondary,
  },
  interactive: {
    primary: fused.interactive.primary,
    /** Hover/pressed brand: the palette's darkest brown (13.9:1 with white) */
    primaryHover: fused.text.primary,
    secondary: fused.interactive.secondary,
    success: fused.interactive.success,
    warning: fused.interactive.warning,
    error: fused.interactive.error,
    info: fused.interactive.info,
  },
  /** Flat semantic pairs (root shape); fused keeps them as { bg, text } */
  semantic: {
    success: fused.semantic.success.text,
    warning: fused.semantic.warning.text,
    error: fused.semantic.error.text,
    info: fused.semantic.info.text,
    successBg: fused.semantic.success.bg,
    warningBg: fused.semantic.warning.bg,
    errorBg: fused.semantic.error.bg,
    infoBg: fused.semantic.info.bg,
  },

  // ---- root aliases onto the fused palette --------------------------------
  primary: {
    main: fused.interactive.primary,
    dark: fused.text.primary,
    light: fused.interactive.secondary,
  },
  secondary: {
    light: fused.border.secondary,
  },
  neutral: {
    light: fused.background.tertiary,
    lighter: fused.background.secondary,
  },
  /** Base colour for box-shadow alpha suffixes (`${colorTokens.shadow}10`) */
  shadow: fused.text.primary,
} as const;

export const spacing = {
  xs: spacingTokens.xs,
  sm: spacingTokens.sm,
  md: spacingTokens.md,
  lg: spacingTokens.lg,
  xl: spacingTokens.xl,
  '2xl': spacingTokens['2xl'],
  '3xl': spacingTokens['3xl'],
  '4xl': spacingTokens['4xl'],
  xxl: spacingTokens['3xl'],
  xxxl: spacingTokens['4xl'],
} as const;

export const borderRadius = {
  none: radiusTokens.none,
  xs: radiusTokens.sm,
  sm: radiusTokens.sm,
  md: radiusTokens.md,
  lg: radiusTokens.lg,
  xl: radiusTokens.xl,
  '2xl': radiusTokens['2xl'],
  full: radiusTokens.full,
  round: '50%',
} as const;

export const shadows = {
  sm: fused.shadow.sm,
  md: fused.shadow.md,
  lg: fused.shadow.lg,
  xl: fused.shadow.xl,
} as const;

/** Durations + easing; usable alone or after a property (`background ${transitions.fast}`) */
export const transitions = {
  fast: transitionTokens.fast,
  normal: transitionTokens.base,
  base: transitionTokens.base,
  slow: transitionTokens.slow,
} as const;

/** Stacking order. Not yet in @maataa/tokens. Candidate for upstreaming. */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const;

const { fontFamily, fontSize, fontWeight, lineHeight } = typographyTokens;

const text = (size: string, weight: number, height: number, family = fontFamily.base) => ({
  fontFamily: family,
  fontSize: size,
  fontWeight: weight,
  lineHeight: height,
});

/**
 * Typography roles built on the @maataa/tokens scale (12–32px).
 * label / heading.* are not yet in @maataa/tokens. Candidates for upstreaming.
 */
export const typography = {
  heading1: text(fontSize['5xl'], fontWeight.bold, lineHeight.tight),
  heading2: text(fontSize['4xl'], fontWeight.semibold, lineHeight.tight),
  heading3: text(fontSize['3xl'], fontWeight.semibold, lineHeight.tight),
  body: text(fontSize.md, fontWeight.normal, lineHeight.normal),
  bodySmall: text(fontSize.sm, fontWeight.normal, lineHeight.normal),
  label: { ...text(fontSize.xs, fontWeight.semibold, lineHeight.normal), textTransform: 'uppercase' as const },
  heading: {
    sm: text(fontSize['2xl'], fontWeight.semibold, lineHeight.tight),
    md: text(fontSize['3xl'], fontWeight.semibold, lineHeight.tight),
    lg: text(fontSize['4xl'], fontWeight.bold, lineHeight.tight),
  },
  fontFamily: {
    body: fontFamily.base,
    heading: fontFamily.base,
    mono: fontFamily.mono,
  },
} as const;
