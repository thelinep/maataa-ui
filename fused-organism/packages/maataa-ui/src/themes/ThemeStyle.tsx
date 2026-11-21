/**
 * @maataa/ui/themes/ThemeStyle
 * Applies a whole-library theme (e.g. the TLPS v2 look) with one <style> tag.
 */

import React from "react";
import { themeToCss, type MaataaTheme } from "../tokens";

export interface ThemeStyleProps {
  /** The theme to apply, e.g. `tlpsV2Theme`. */
  theme: MaataaTheme;
  /** Where the theme applies. @default ":root" (the whole page) */
  selector?: string;
  /** CSP nonce, if the page uses one for inline styles. */
  nonce?: string;
}

/**
 * ThemeStyle
 * Writes the theme's `--maataa-*` CSS variables into a `<style>` element.
 * Every component that reads the design tokens follows them, with no
 * provider, context or re-render, so it works in server components (for
 * example a Next.js root layout) as well as in the browser. Without it the
 * library keeps its default paper-and-ink look.
 *
 * @example
 * ```tsx
 * import { ThemeStyle, tlpsV2Theme } from "@maataa/ui";
 * <head><ThemeStyle theme={tlpsV2Theme} /></head>
 * ```
 */
export function ThemeStyle({ theme, selector = ":root", nonce }: ThemeStyleProps) {
  return (
    <style data-maataa-theme-style={theme.name} nonce={nonce}>
      {themeToCss(theme, selector)}
    </style>
  );
}

ThemeStyle.displayName = "ThemeStyle";
