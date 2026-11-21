# @maataa/tokens

Canonical MAATAA design tokens. This package contains the extracted color, spacing, typography, radius, shadow, and transition scales used by MAATAA UI.

## Theming

Colors, radius, font families and the single-series chart color are exported as CSS custom properties with the default value as the fallback, for example `colorTokens.text.primary` is `var(--maataa-color-text-primary, #3D2817)`. With no theme loaded the library keeps its default paper-and-ink look.

A theme is a `MaataaTheme` object. Built-in themes: `paperTheme` (default), `darkTheme` and `tlpsV2Theme` (the TLPS v2 look: ink on warm paper, square corners, Inter, signal red-orange for charts).

```tsx
// Whole page, e.g. in a Next.js root layout (works in server components)
import { ThemeStyle, tlpsV2Theme } from "@maataa/ui";
<head><ThemeStyle theme={tlpsV2Theme} /></head>

// Or as plain CSS
import { themeToCss, tlpsV2Theme } from "@maataa/tokens";
const css = themeToCss(tlpsV2Theme); // ":root{--maataa-color-text-primary:#171A1D;…}"
```

`themeToCss(theme, selector)` scopes a theme to part of a page. Code that needs a literal color (canvas drawing, contrast maths) should use the raw palettes (`paperColorPalette`, `darkColorTokens`, `tlpsV2Theme.colors`) or resolve the variable with `getComputedStyle`.
