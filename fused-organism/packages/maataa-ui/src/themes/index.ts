/**
 * @maataa/ui/themes
 * Category: themes
 * Runtime light/dark theme switching: ThemeProvider, useTheme, ThemeToggle
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
  paperTheme,
  darkTheme,
  tlpsV2Theme,
  themeToCss,
  themeToCssVariables,
  type MaataaTheme,
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
    id: "theme-toggle",
    name: "ThemeToggle",
    component: "ThemeToggle",
    category: "Themes",
    description: "A labeled switch that flips the nearest ThemeProvider between light and dark",
  },
];
