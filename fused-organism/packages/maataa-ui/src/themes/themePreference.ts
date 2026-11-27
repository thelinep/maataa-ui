/**
 * @maataa/ui/themes/themePreference
 * Server-safe helpers for remembering a theme choice and applying it before
 * the first paint. No React hooks or browser globals at module load.
 */

import { builtInThemes, themesToCss, type MaataaTheme } from "../tokens";

/** A theme name, or "system" to follow the device's light/dark setting. */
export type ThemeChoice = string;

export interface ThemePreferenceOptions {
  /** Themes on offer. @default builtInThemes (Light, Dark, TLPS v2, High contrast) */
  themes?: readonly MaataaTheme[];
  /** Choice when nothing is saved yet. @default "system" */
  defaultChoice?: ThemeChoice;
  /** Theme "system" uses when the system is light. @default the first theme */
  systemLightTheme?: string;
  /** Theme "system" uses when the system is dark. @default "dark" */
  systemDarkTheme?: string;
  /** localStorage key the choice is saved under. @default "maataa-theme" */
  storageKey?: string;
}

/** Attribute on `<html>` naming the active theme. */
export const THEME_ATTRIBUTE = "data-maataa-theme";
/** Attribute on `<html>` naming the user's choice (may be "system"). */
export const THEME_CHOICE_ATTRIBUTE = "data-maataa-theme-choice";
export const DEFAULT_THEME_STORAGE_KEY = "maataa-theme";

/** Fills in defaults for {@link ThemePreferenceOptions}. */
export function resolveThemeOptions(options: ThemePreferenceOptions = {}) {
  const themes = options.themes ?? builtInThemes;
  const names = themes.map((theme) => theme.name);
  const light = options.systemLightTheme ?? names[0];
  const dark = options.systemDarkTheme ?? (names.includes("dark") ? "dark" : light);
  return {
    themes,
    names,
    defaultChoice: options.defaultChoice ?? "system",
    systemLightTheme: light,
    systemDarkTheme: dark,
    storageKey: options.storageKey ?? DEFAULT_THEME_STORAGE_KEY,
  };
}

/** The theme a choice shows: "system" becomes the light or dark theme. */
export function resolveThemeChoice(
  choice: ThemeChoice,
  systemPrefersDark: boolean,
  options: ThemePreferenceOptions = {}
): string {
  const resolved = resolveThemeOptions(options);
  if (choice !== "system" && resolved.names.includes(choice)) return choice;
  return systemPrefersDark ? resolved.systemDarkTheme : resolved.systemLightTheme;
}

/** CSS for every offered theme, switchable by the `data-maataa-theme` attribute. */
export function themePreferenceCss(options: ThemePreferenceOptions = {}): string {
  const resolved = resolveThemeOptions(options);
  return themesToCss(resolved.themes, {
    defaultTheme: resolved.systemLightTheme,
    systemDarkTheme: resolved.systemDarkTheme,
    attribute: THEME_ATTRIBUTE,
  });
}

/**
 * A small inline script for `<head>` that applies the saved theme before the
 * page paints, so there is no flash of the wrong theme on load.
 */
export function themeInitScript(options: ThemePreferenceOptions = {}): string {
  const resolved = resolveThemeOptions(options);
  const config = JSON.stringify({
    k: resolved.storageKey,
    d: resolved.defaultChoice,
    n: resolved.names,
    l: resolved.systemLightTheme,
    x: resolved.systemDarkTheme,
  }).replace(/</g, "\\u003c");
  return (
    `(function(){var c=${config},s=null;` +
    `try{s=localStorage.getItem(c.k)}catch(e){}` +
    `var h=s&&(s==="system"||c.n.indexOf(s)>-1)?s:c.d;` +
    `var t=h!=="system"&&c.n.indexOf(h)>-1?h:` +
    `(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?c.x:c.l);` +
    `var r=document.documentElement;r.setAttribute("${THEME_ATTRIBUTE}",t);` +
    `r.setAttribute("${THEME_CHOICE_ATTRIBUTE}",h)})();`
  );
}
