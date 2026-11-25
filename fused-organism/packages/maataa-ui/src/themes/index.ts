/**
 * @maataa/ui/themes
 * Category: themes
 * Themes: ThemePicker (Light, Dark, TLPS v2, High contrast, System), ThemeStyle,
 * and runtime light/dark switching with ThemeProvider, useTheme, ThemeToggle
 */

export {
  ThemeProvider,
  useTheme,
  type ThemeName,
  type ThemeContextValue,
  type ThemeProviderProps,
} from "./ThemeProvider";
export { ThemeToggle, type ThemeToggleProps } from "./ThemeToggle";
export { ThemeStyle, type ThemeStyleProps } from "./ThemeStyle";
export {
  ThemePicker,
  useThemePreference,
  type ThemePickerProps,
  type ThemePreference,
} from "./ThemePicker";
export { ThemePreferenceHead, type ThemePreferenceHeadProps } from "./ThemePreferenceHead";
export {
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  DEFAULT_THEME_STORAGE_KEY,
  resolveThemeChoice,
  themeInitScript,
  themePreferenceCss,
  type ThemeChoice,
  type ThemePreferenceOptions,
} from "./themePreference";
export {
  paperTheme,
  darkTheme,
  tlpsV2Theme,
  highContrastTheme,
  hemantTheme,
  limeTheme,
  builtInThemes,
  themeToCss,
  themeToCssVariables,
  themesToCss,
  type MaataaTheme,
  type ThemesToCssOptions,
} from "../tokens";

// Component metadata for Storybook and docs
export const themeComponents = [
  {
    id: "theme-provider",
    name: "ThemeProvider",
    component: "ThemeProvider",
    category: "Themes",
    description: "Runtime light/dark theme context, mirrored as CSS custom properties",
  },
  {
    id: "theme-style",
    name: "ThemeStyle",
    component: "ThemeStyle",
    category: "Themes",
    description: "Applies a whole-library theme (paper, dark, TLPS v2) as CSS variables",
  },
  {
    id: "theme-picker",
    name: "ThemePicker",
    component: "ThemePicker",
    category: "Themes",
    description: "Chooses Light, Dark, TLPS v2, High contrast or System, and remembers the choice",
  },
  {
    id: "theme-preference-head",
    name: "ThemePreferenceHead",
    component: "ThemePreferenceHead",
    category: "Themes",
    description: "Head tags that load the saved theme before first paint, with no flash",
  },
  {
    id: "theme-toggle",
    name: "ThemeToggle",
    component: "ThemeToggle",
    category: "Themes",
    description: "A labeled switch that flips the nearest ThemeProvider between light and dark",
  },
];
