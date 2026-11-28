/**
 * @maataa/ui/tokens
 * Design system tokens for consistent styling
 */

// ---------------------------------------------------------------------------
// Theming
//
// Every themeable token (colors, radius, font families, the single-series
// chart color) is exported as a CSS custom property with the default value as
// its fallback, e.g. `colorTokens.text.primary` is
// `var(--maataa-color-text-primary, #3D2817)`. With no theme loaded the
// library looks exactly as before. To theme it, put the variables from
// `themeToCss(theme)` on `:root` (or any wrapper): every component that reads
// these tokens picks the theme up, with no provider and no re-render. The raw
// palettes (`paperColorPalette`, `darkColorTokens`, `tlpsV2Theme`) stay plain
// hex for code that needs a literal color (canvas, contrast maths).
// ---------------------------------------------------------------------------

type TokenTree = { readonly [key: string]: string | TokenTree };

/** `--maataa-<prefix>-<path>` name for a token path. */
export function tokenVarName(prefix: string, path: readonly string[]): string {
  return `--maataa-${[prefix, ...path].join("-")}`;
}

function varTree<T extends TokenTree>(prefix: string, tree: T, path: string[] = []): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(tree)) {
    out[key] =
      typeof value === "string"
        ? `var(${tokenVarName(prefix, [...path, key])}, ${value})`
        : varTree(prefix, value, [...path, key]);
  }
  return out as T;
}

function flattenTree(prefix: string, tree: TokenTree, path: string[] = []): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === "string") out[tokenVarName(prefix, [...path, key])] = value;
    else Object.assign(out, flattenTree(prefix, value, [...path, key]));
  }
  return out;
}

// Color tokens
//
// Aligned to DESIGN_SYSTEM.md's documented "paper-and-ink" warm palette
// (MUI-01 follow-up, Sept 2026). Previously this file used an unrelated
// cool-gray palette (#1a1a1a / #ffffff / #f5f5f5) that only 11 of 20
// components ever adopted; the other 9 (including the four foundational
// primitives Badge/Button/Card/Input) hardcoded the warm palette from
// DESIGN_SYSTEM.md directly instead. Consolidating onto the warm palette
// here — rather than the other way around — keeps the documented design
// system, the majority of hardcoded values already in the codebase, and
// the one color already shared by both (`interactive.primary`) consistent
// in one place. `interactive.primary`/`secondary` are unchanged from
// before since they already matched.
export const paperColorPalette = {
  // Text colors
  // Contrast (WCAG 2.2 AA, measured on all three backgrounds below):
  // primary 11+:1; secondary 6.0:1 or more; tertiary 4.6:1 or more, so it is
  // still readable as text (placeholders, captions). disabled is exempt.
  text: {
    primary: "#3D2817",
    secondary: "#6B5546",
    tertiary: "#80664E",
    inverse: "#FFFAF0",
    disabled: "#C9B8A8",
  },

  // Background colors
  background: {
    primary: "#FFFAF0",
    secondary: "#FAF6F1",
    tertiary: "#F5EDE4",
    inverse: "#3D2817",
  },

  // Border colors
  // primary/secondary/tertiary are decorative (cards, dividers) and need no
  // contrast. control outlines things you type in or click (inputs, checkboxes,
  // radios, select fields): 3.3:1 or more on every background (WCAG 1.4.11).
  border: {
    primary: "#D4AF9F",
    secondary: "#EDD8CF",
    tertiary: "#F5E9E1",
    control: "#9C7C66",
  },

  // Interactive colors
  // The success/warning/error/info values here are the "Dark" variants
  // from DESIGN_SYSTEM.md's semantic palette — legible as text, icons, and
  // borders on the light paper background. For a soft filled badge/toast
  // background + matching text pair, use `colorTokens.semantic` instead.
  interactive: {
    // 4.6:1 or more as text on every background; white on it 5.4:1
    primary: "#806641",
    secondary: "#D4AF9F",
    success: "#2D6A3E",
    warning: "#7A6100",
    error: "#8B3A2B",
    info: "#1E3A5F",
  },

  // Soft semantic fills: a pale background paired with its matching dark
  // text color, both from DESIGN_SYSTEM.md, for badges/toasts/alerts.
  semantic: {
    success: { bg: "#C7E9C0", text: "#2D6A3E" },
    warning: { bg: "#F5D547", text: "#614A00" },
    error: { bg: "#F5B5A6", text: "#742819" },
    info: { bg: "#B8D9F5", text: "#1E3A5F" },
  },

  // Shadow colors (warm-tinted, matching DESIGN_SYSTEM.md)
  shadow: {
    sm: "0 2px 8px rgba(139, 111, 71, 0.08)",
    md: "0 4px 12px rgba(139, 111, 71, 0.15)",
    lg: "0 8px 24px rgba(139, 111, 71, 0.12)",
    xl: "0 20px 48px rgba(139, 111, 71, 0.24)",
  },
};

/** A color palette with the same shape as the default one. */
export type ColorPalette = {
  [Group in keyof typeof paperColorPalette]: {
    [Key in keyof (typeof paperColorPalette)[Group]]: (typeof paperColorPalette)[Group][Key] extends string
      ? string
      : { [Sub in keyof (typeof paperColorPalette)[Group][Key]]: string };
  };
};

/** Default colors, as CSS variables that fall back to the paper palette. */
export const colorTokens: ColorPalette = varTree("color", paperColorPalette);

// Dark theme color tokens — "night ops" palette
//
// Extracted from the MAATAA Desktop application itself (Sept 2026): its
// screenshots were sampled pixel-by-pixel (whole-image color-frequency and
// hue-bucket analysis, not eyeballed) to pull out the actual near-black
// navy base, the brand gold, and the per-workspace accent hues (blue/info,
// green/success, amber/warning, red/error) it already ships with. This is
// the first dark theme in the system — `colorTokens` above stays the
// default/light "paper-and-ink" palette; `darkColorTokens` is a same-shape
// sibling for anything that opts in via `ThemeProvider`/`useTheme` (see
// `src/themes/`). Existing components that import `colorTokens` directly
// are unaffected until they're migrated to read from theme context.
export const darkColorTokens: ColorPalette = {
  text: {
    primary: "#F4F6F8",
    secondary: "#7C8A96",
    // 4.6:1 or more on every dark background
    tertiary: "#798A98",
    inverse: "#0B1622",
    disabled: "#3A4550",
  },

  background: {
    primary: "#04080E",
    secondary: "#0B1420",
    tertiary: "#152030",
    inverse: "#F4F6F8",
  },

  border: {
    primary: "#2A3D4B",
    secondary: "#1B2833",
    tertiary: "#121C27",
    // Outline for inputs and controls: 3.3:1 or more on every dark background
    control: "#50748E",
  },

  interactive: {
    primary: "#E0B060",
    secondary: "#2070B0",
    success: "#5DD35A",
    warning: "#E8A23C",
    error: "#F03830",
    info: "#3C8FD0",
  },

  // Soft filled badge/toast backgrounds: a low-opacity tint of the
  // interactive color over the dark surface (a pale flat tint, as the
  // light theme uses, would either wash out or blind against near-black),
  // paired with the same bright interactive color as the text/icon.
  semantic: {
    success: { bg: "rgba(93, 211, 90, 0.16)", text: "#5DD35A" },
    warning: { bg: "rgba(232, 162, 60, 0.16)", text: "#E8A23C" },
    error: { bg: "rgba(240, 56, 48, 0.16)", text: "#F03830" },
    info: { bg: "rgba(60, 143, 208, 0.16)", text: "#3C8FD0" },
  },

  shadow: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.40)",
    md: "0 4px 16px rgba(0, 0, 0, 0.50)",
    lg: "0 8px 28px rgba(0, 0, 0, 0.55)",
    xl: "0 24px 56px rgba(0, 0, 0, 0.60)",
  },
};

// Spacing tokens (4px base unit)
export const spacingTokens = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "40px",
  "3xl": "48px",
  "4xl": "56px",
};

// Border radius tokens
export const radiusPalette = {
  none: "0",
  sm: "2px",
  md: "6px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
};

export type RadiusScale = { [Key in keyof typeof radiusPalette]: string };

/** Radius scale, as CSS variables that fall back to `radiusPalette`. */
export const radiusTokens: RadiusScale = varTree("radius", radiusPalette);

export const fontFamilyPalette = {
  base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
};

export type FontFamilies = { [Key in keyof typeof fontFamilyPalette]: string };

// Typography tokens
export const typographyTokens = {
  fontFamily: varTree("font", fontFamilyPalette) as FontFamilies,
  fontSize: {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "15px",
    xl: "16px",
    "2xl": "18px",
    "3xl": "20px",
    "4xl": "24px",
    "5xl": "32px",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Transition/Animation tokens
export const transitionTokens = {
  fast: "0.1s ease-out",
  base: "0.2s ease-out",
  slow: "0.3s ease-out",
};

// Data visualization tokens (MUI-07 start)
//
// Chart series need real hue diversity to encode identity, which the
// paper-and-ink UI palette above doesn't provide (it's tuned for chrome,
// not for 6-8 mutually-distinguishable series) — reusing it validates with
// hard FAILs (lightness band, chroma floor, and CVD separation all fail).
// `categorical` below is a color-vision-deficiency-safe categorical order,
// validated on this system's paper background (#FFFAF0): every adjacent
// pair clears the CVD Delta E >= 8 target and the >= 15 normal-vision floor;
// three slots (aqua/yellow/magenta) sit under 3:1 contrast on our light
// surface and so are used only with a direct label or legend swatch, never
// as unlabeled text or a lone color-only fill. The order is the safety
// mechanism — never reorder or cycle past 8 without re-running the
// palette's validator. Single-series charts (Sparkline, a lone metric
// trend) use `chartTokens.single` instead — the system's own brand color —
// since there's nothing for a single series to be confused with.
export const chartTokens = {
  single: "var(--maataa-chart-single, #8B6F47)",
  categorical: [
    "#2a78d6", // 1 blue
    "#eb6834", // 2 orange
    "#1baf7a", // 3 aqua
    "#eda100", // 4 yellow
    "#e87ba4", // 5 magenta
    "#008300", // 6 green
    "#4a3aa7", // 7 violet
    "#e34948", // 8 red
  ],
  // Sequential ramp (single hue, light -> dark), for future magnitude
  // encoding (heatmaps, choropleths). Lightest step reads as "near zero".
  sequential: ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"],
  grid: colorTokens.border.secondary,
  areaOpacity: 0.1,
};

// Data visualization tokens for the dark theme.
//
// Reuses the dataviz skill's documented dark-mode categorical steps
// (`references/palette.md`) rather than hand-picking new hues — they're
// the *same eight hues* as `chartTokens.categorical` above, re-stepped for
// a dark surface, so a chart keeps its series identity across a theme
// switch. Re-validated with the skill's `validate_palette.js` against this
// system's actual dark surface (`darkColorTokens.background.primary`,
// `#04080E` — notably darker than the skill's own `#1a1a19` reference):
// all checks pass (lightness band, chroma floor, CVD separation >= 8 ΔE
// on every adjacent pair, normal-vision floor, and >= 3:1 contrast on
// all 8 slots). The sequential ramp is the same blue ramp read in
// reverse (dark = near-zero/recedes into the surface, light = high
// magnitude/stands out) and capped at step 600 (`#184f95`) per the
// skill's guidance not to go darker on a dark surface, where the next
// step down (`#0d366b`) would sit under 2:1 and disappear into `#04080E`.
export const darkChartTokens = {
  single: darkColorTokens.interactive.primary,
  categorical: [
    "#3987e5", // 1 blue
    "#d95926", // 2 orange
    "#199e70", // 3 aqua
    "#c98500", // 4 yellow
    "#d55181", // 5 magenta
    "#008300", // 6 green
    "#9085e9", // 7 violet
    "#e66767", // 8 red
  ],
  sequential: ["#184f95", "#256abf", "#3987e5", "#6da7ec", "#9ec5f4", "#cde2fb"],
  grid: darkColorTokens.border.secondary,
  areaOpacity: 0.12,
};

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

/** Everything a theme can change. Leave out radius/fonts/chart to keep the defaults. */
export interface MaataaTheme {
  /** Stable id, used in `data-maataa-theme` and saved preferences. */
  name: string;
  /** Human-readable name for theme pickers. Defaults to `name`. */
  label?: string;
  colors: ColorPalette;
  radius?: Partial<RadiusScale>;
  fontFamily?: Partial<FontFamilies>;
  /** Color for single-series charts (sparklines, a lone trend line). */
  chartSingle?: string;
  /** CSS `color-scheme` for native controls and scrollbars. */
  colorScheme?: "light" | "dark";
}

/** The default look: warm paper and ink. */
export const paperTheme: MaataaTheme = {
  name: "paper",
  label: "Light",
  colors: paperColorPalette,
  radius: radiusPalette,
  fontFamily: fontFamilyPalette,
  chartSingle: "#8B6F47",
  colorScheme: "light",
};

/** The "night ops" dark look. */
export const darkTheme: MaataaTheme = {
  name: "dark",
  label: "Dark",
  colors: darkColorTokens,
  chartSingle: darkColorTokens.interactive.primary,
  colorScheme: "dark",
};

/**
 * TLPS v2 look: near-black ink on warm paper, white panels, hairline borders,
 * square 2px corners, Inter, with the signal red-orange as the brand mark and
 * the v2 green for success. Primary actions are solid ink, as in v2.
 *
 * Contrast (WCAG 2.2 AA), measured on all three backgrounds (#FFFEFA,
 * #F4F1EB, #EBE7DF): text.primary 14.2:1 or more, secondary 9.3:1 or more,
 * tertiary 4.85:1 or more; border.control 3.18:1 or more (WCAG 1.4.11);
 * interactive.primary 14.2:1 or more, with white on it 17.5:1; success,
 * warning, error and info 5.0:1 or more; every semantic text-on-fill pair
 * 5.1:1 or more. v2's own --muted (#696b69) is darkened slightly for
 * tertiary text so it also passes on the tertiary background.
 */
export const tlpsV2Theme: MaataaTheme = {
  name: "tlps-v2",
  label: "TLPS v2",
  colors: {
    text: {
      primary: "#171A1D",
      secondary: "#363A3D",
      tertiary: "#62645F",
      inverse: "#FFFEFA",
      disabled: "#B6B2AA",
    },
    background: {
      primary: "#FFFEFA",
      secondary: "#F4F1EB",
      tertiary: "#EBE7DF",
      inverse: "#171A1D",
    },
    border: {
      primary: "#D8D3CA",
      secondary: "#E4DFD6",
      tertiary: "#EEEAE2",
      control: "#858077",
    },
    interactive: {
      primary: "#171A1D",
      secondary: "#E2DDD3",
      success: "#315F4E",
      warning: "#7A5B3D",
      error: "#8C2119",
      info: "#1F4E79",
    },
    semantic: {
      success: { bg: "#E6EEE8", text: "#315F4E" },
      warning: { bg: "#F1E9DC", text: "#7A5B3D" },
      error: { bg: "#FAE9E6", text: "#8C2119" },
      info: { bg: "#E3ECF4", text: "#1F4E79" },
    },
    shadow: {
      sm: "0 2px 0 rgba(23, 26, 29, 0.03)",
      md: "0 8px 30px rgba(32, 32, 26, 0.03)",
      lg: "0 18px 60px rgba(32, 32, 26, 0.07)",
      xl: "0 24px 72px rgba(32, 32, 26, 0.12)",
    },
  },
  radius: { sm: "2px", md: "2px", lg: "4px", xl: "8px", "2xl": "14px" },
  fontFamily: {
    base: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  chartSingle: "#C2442D",
  colorScheme: "light",
};

/**
 * High-contrast look for low vision and bright light: black on white, solid
 * black control outlines, saturated dark accents.
 *
 * Contrast (WCAG 2.2 AAA, 7:1 for text), measured on all three backgrounds
 * (#FFFFFF, #F3F3F3, #E8E8E8): text.primary 17.1:1 or more, secondary 13.4:1
 * or more, tertiary 9.8:1 or more, disabled 4.6:1 or more; border.control
 * 17.1:1 or more and border.primary 5.4:1 or more (both beyond WCAG 1.4.11);
 * interactive.primary 8.3:1 or more with white on it 10.2:1; success,
 * warning, error and info 7.0:1 or more; every semantic text-on-fill pair
 * 8.1:1 or more. Checked by `highContrastTheme` tests in @maataa/ui.
 */
export const highContrastTheme: MaataaTheme = {
  name: "high-contrast",
  label: "High contrast",
  colors: {
    text: {
      primary: "#000000",
      secondary: "#1F1F1F",
      tertiary: "#363636",
      inverse: "#FFFFFF",
      disabled: "#5E5E5E",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#F3F3F3",
      tertiary: "#E8E8E8",
      inverse: "#000000",
    },
    border: {
      primary: "#5C5C5C",
      secondary: "#767676",
      tertiary: "#8A8A8A",
      control: "#000000",
    },
    interactive: {
      primary: "#0037A0",
      secondary: "#5C5C5C",
      success: "#00591A",
      warning: "#5C3D00",
      error: "#900000",
      info: "#003D73",
    },
    semantic: {
      success: { bg: "#DDF2E1", text: "#00471A" },
      warning: { bg: "#FFF0C2", text: "#4D3300" },
      error: { bg: "#FDE0E0", text: "#8A0000" },
      info: { bg: "#DCEBFA", text: "#00325E" },
    },
    shadow: {
      sm: "0 0 0 1px #000000",
      md: "0 0 0 2px #000000",
      lg: "0 0 0 2px #000000",
      xl: "0 0 0 3px #000000",
    },
  },
  chartSingle: "#0037A0",
  colorScheme: "light",
};

/**
 * Hemant (हेमंत), the early-winter ritu: misty ivory mornings, mustard-field
 * cream, marigold and sindoor accents, wood-smoke ink. A warm light theme.
 *
 * Contrast (WCAG 2.2 AA), measured on all three backgrounds (#FBF7EE,
 * #F4ECDA, #EADFC4): text.primary 12.3:1 or more, secondary 8.5:1 or more,
 * tertiary 5.5:1 or more; border.control 3.3:1 or more (WCAG 1.4.11);
 * interactive.primary 5.1:1 or more, with the inverse text on it 6.4:1;
 * success, warning, error and info 4.8:1 or more; every semantic
 * text-on-fill pair 6.8:1 or more. Checked by `hemantTheme` tests in @maataa/ui.
 */
export const hemantTheme: MaataaTheme = {
  name: "hemant",
  label: "Hemant",
  colors: {
    text: {
      primary: "#2B1D12",
      secondary: "#4A3726",
      tertiary: "#685239",
      inverse: "#FBF7EE",
      disabled: "#9C8B73",
    },
    background: {
      primary: "#FBF7EE",
      secondary: "#F4ECDA",
      tertiary: "#EADFC4",
      inverse: "#2B1D12",
    },
    border: {
      primary: "#D6C7A6",
      secondary: "#E2D6BA",
      tertiary: "#ECE3CF",
      control: "#8A7553",
    },
    interactive: {
      primary: "#9C3D0C",
      secondary: "#E6D7B5",
      success: "#3D6A26",
      warning: "#805300",
      error: "#A11D22",
      info: "#2C4E78",
    },
    semantic: {
      success: { bg: "#E5EED9", text: "#33591F" },
      warning: { bg: "#F6E7C4", text: "#6B4500" },
      error: { bg: "#F9E1DC", text: "#8E1A1E" },
      info: { bg: "#E0E8F2", text: "#264468" },
    },
    shadow: {
      sm: "0 1px 2px rgba(43, 29, 18, 0.06)",
      md: "0 6px 20px rgba(43, 29, 18, 0.08)",
      lg: "0 14px 40px rgba(43, 29, 18, 0.12)",
      xl: "0 22px 60px rgba(43, 29, 18, 0.16)",
    },
  },
  chartSingle: "#C2640F",
  colorScheme: "light",
};

/**
 * Lime: clean white and cool grey surfaces with a fresh lime accent. A crisp,
 * modern light theme. Lime itself is too pale for text on white, so buttons
 * and links use a deep lime (#3F6212); the bright lime (#D9F99D) is for
 * selected and secondary fills, and #65A30D for single-series charts.
 *
 * Contrast (WCAG 2.2 AA), measured on all three backgrounds (#FFFFFF,
 * #F6F7F6, #ECEEEC): text.primary 14.2:1 or more, secondary 7.7:1 or more,
 * tertiary 5.2:1 or more; border.control 3.3:1 or more (WCAG 1.4.11);
 * interactive.primary 6.0:1 or more, with white text on it 7.0:1;
 * success, warning, error and info 5.4:1 or more; every semantic
 * text-on-fill pair 6.6:1 or more. Checked by `limeTheme` tests in @maataa/ui.
 */
export const limeTheme: MaataaTheme = {
  name: "lime",
  label: "Lime",
  colors: {
    text: {
      primary: "#1C1F1C",
      secondary: "#454A45",
      tertiary: "#5E645E",
      inverse: "#FFFFFF",
      disabled: "#9AA09A",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#F6F7F6",
      tertiary: "#ECEEEC",
      inverse: "#1C1F1C",
    },
    border: {
      primary: "#D4D8D4",
      secondary: "#E2E5E2",
      tertiary: "#EDEFED",
      control: "#7C827C",
    },
    interactive: {
      primary: "#3F6212",
      secondary: "#D9F99D",
      success: "#2F6B2F",
      warning: "#8A5300",
      error: "#B42318",
      info: "#2B5A8C",
    },
    semantic: {
      success: { bg: "#ECFCCB", text: "#365314" },
      warning: { bg: "#FEF3C7", text: "#7A4A00" },
      error: { bg: "#FEE4E2", text: "#9F1A12" },
      info: { bg: "#E0ECF8", text: "#24507E" },
    },
    shadow: {
      sm: "0 1px 2px rgba(28, 31, 28, 0.06)",
      md: "0 6px 20px rgba(28, 31, 28, 0.08)",
      lg: "0 14px 40px rgba(28, 31, 28, 0.12)",
      xl: "0 22px 60px rgba(28, 31, 28, 0.16)",
    },
  },
  chartSingle: "#65A30D",
  colorScheme: "light",
};

/** Every theme that ships with MAATAA, in picker order. */
export const builtInThemes: readonly MaataaTheme[] = [
  paperTheme,
  darkTheme,
  tlpsV2Theme,
  highContrastTheme,
  hemantTheme,
  limeTheme,
];

/** The CSS custom properties for a theme, as a `{ "--maataa-…": value }` map. */
export function themeToCssVariables(theme: MaataaTheme): Record<string, string> {
  const vars: Record<string, string> = {
    ...flattenTree("color", theme.colors),
    ...flattenTree("radius", (theme.radius ?? {}) as TokenTree),
    ...flattenTree("font", (theme.fontFamily ?? {}) as TokenTree),
  };
  if (theme.chartSingle) vars["--maataa-chart-single"] = theme.chartSingle;
  return vars;
}

/**
 * A CSS rule that applies a theme, e.g. `themeToCss(tlpsV2Theme)` for the
 * whole page, or `themeToCss(darkTheme, '[data-theme="dark"]')` for a part.
 */
export function themeToCss(theme: MaataaTheme, selector = ":root"): string {
  const body = Object.entries(themeToCssVariables(theme))
    .map(([name, value]) => `${name}:${value};`)
    .join("");
  const scheme = theme.colorScheme ? `color-scheme:${theme.colorScheme};` : "";
  return `${selector}{${body}${scheme}}`;
}

/** Options for {@link themesToCss}. */
export interface ThemesToCssOptions {
  /** Theme used when nothing is chosen. @default the first theme */
  defaultTheme?: string;
  /** Theme used for "follow the system" when the system is dark. @default "dark" if present */
  systemDarkTheme?: string;
  /** Attribute on `<html>` that names the active theme. @default "data-maataa-theme" */
  attribute?: string;
}

/**
 * One stylesheet holding several themes. The default theme applies to
 * `:root`; each theme also applies to `:root[data-maataa-theme="<name>"]`.
 * With no attribute set (no JavaScript yet, or "follow the system"), a dark
 * system preference picks `systemDarkTheme`.
 */
export function themesToCss(themes: readonly MaataaTheme[], options: ThemesToCssOptions = {}): string {
  if (!themes.length) return "";
  const attribute = options.attribute ?? "data-maataa-theme";
  const byName = new Map(themes.map((theme) => [theme.name, theme]));
  const base = byName.get(options.defaultTheme ?? themes[0].name) ?? themes[0];
  const systemDark = byName.get(options.systemDarkTheme ?? "dark");
  const rules = [themeToCss(base, ":root")];
  if (systemDark && systemDark !== base) {
    rules.push(`@media (prefers-color-scheme: dark){${themeToCss(systemDark, `:root:not([${attribute}])`)}}`);
  }
  for (const theme of themes) rules.push(themeToCss(theme, `:root[${attribute}="${theme.name}"]`));
  return rules.join("\n");
}
