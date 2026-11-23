/**
 * @maataa/ui/themes/ThemePreferenceHead
 * Server-safe `<head>` tags for a user-chosen theme: every theme's CSS plus a
 * tiny script that applies the saved choice before the first paint.
 */

import React from "react";
import {
  themeInitScript,
  themePreferenceCss,
  type ThemePreferenceOptions,
} from "./themePreference";

export interface ThemePreferenceHeadProps extends ThemePreferenceOptions {
  /** CSP nonce, if the page uses one for inline styles and scripts. */
  nonce?: string;
}

/**
 * ThemePreferenceHead
 * Put this in `<head>` (e.g. a Next.js root layout) and a `ThemePicker`
 * anywhere on the page. Pass the same options to both.
 *
 * @example
 * ```tsx
 * <head><ThemePreferenceHead /></head>
 * <body><ThemePicker /></body>
 * ```
 */
export function ThemePreferenceHead({ nonce, ...options }: ThemePreferenceHeadProps) {
  return (
    <>
      <style data-maataa-theme-preference="" nonce={nonce}>
        {themePreferenceCss(options)}
      </style>
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript(options) }} />
    </>
  );
}

ThemePreferenceHead.displayName = "ThemePreferenceHead";
