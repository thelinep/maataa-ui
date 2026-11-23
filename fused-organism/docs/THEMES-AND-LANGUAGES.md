# Themes and languages

## Themes

MAATAA ships four themes: **Light** (`paperTheme`, the default), **Dark** (`darkTheme`), **TLPS v2** (`tlpsV2Theme`) and **High contrast** (`highContrastTheme`, at least 7:1 for all text). `builtInThemes` lists all four in picker order.

### Let people choose

```tsx
import { ThemePreferenceHead, ThemePicker } from "@maataa/ui";

// <head>: every theme's CSS, plus a tiny script that applies the saved
// choice before the first paint (no flash of the wrong theme)
<ThemePreferenceHead />

// anywhere on the page
<ThemePicker />
```

- The picker offers **System**, which follows the device's light/dark setting and keeps following it if the setting changes. It also offers each theme.
- The choice is saved in `localStorage` under `maataa-theme`. Pickers on the same page, and in other tabs, stay in step.
- The active theme is set on `<html data-maataa-theme="…">`, and the choice (which may be `"system"`) on `data-maataa-theme-choice`.
- Pass the same options to both `ThemePreferenceHead` and `ThemePicker`: `themes`, `defaultChoice`, `systemLightTheme`, `systemDarkTheme` and `storageKey`. For example, `themes={[paperTheme, tlpsV2Theme]}` offers only those two.
- `ThemePreferenceHead` is server-safe. It is exported from `@maataa/ui/theme-style`, so it works in a Next.js root layout. With a Content Security Policy, pass `nonce`.
- `useThemePreference()` gives the same behaviour without the select, for a custom control.

For one fixed theme with no picker, `<ThemeStyle theme={tlpsV2Theme} />` is still the simplest option.

## Languages

```tsx
import { LocaleProvider } from "@maataa/ui";

<LocaleProvider locale="hi-IN">
  <App />
</LocaleProvider>
```

`LocaleProvider` sets the locale for every component inside it:

- **Built-in text** is shown in the locale's language. This covers labels, buttons, hints, errors, empty states and screen-reader names: 1,396 strings in total. English and Hindi (हिन्दी) ship with MAATAA.
- **Dates, numbers and ₹ amounts** use the locale's formats. This applies to every component that formats them; it replaces the old per-component default of `en-IN`. A component's own `locale` prop still wins.
- **`lang` and `dir`** are set on a wrapper, so screen readers pronounce the text correctly. Right-to-left locales (Urdu, Arabic and others) get `dir="rtl"`. Layout mirroring for right-to-left is not done yet.

### Add a language or change a label

Catalogs are keyed by the English text. Pass `messages` to add a language or override any label; anything missing falls back to English.

```tsx
<LocaleProvider locale="ta-IN" messages={{ Cancel: "ரத்து செய்", "Next page": "அடுத்த பக்கம்" }}>
```

To translate your own text the same way, use `useT()`:

```tsx
const t = useT();
t("Go to page {page}", { page: 3 });
t.plural(count, "{count} result", "{count} results");
```

For a label map defined outside a component, mark each value with `msg("…")` and call `t()` where it is shown.

### Keeping translations complete

`npm run check:ui-messages` (part of `certify` and `release:check`) collects every string passed to `t()`, `t.plural()` and `msg()` in `@maataa/ui`, plus the theme labels. It fails if any of them has no Hindi translation, or if a translation's `{placeholders}` don't match the English.

### Not translated yet

About 190 English strings are still built in code with template literals, in about 80 files. They are mostly screen-reader announcements, chart summaries and messages assembled in helper functions, for example a timer's spoken "2 minutes 5 seconds". Each needs converting to `t()` or `t.plural()` by hand. Until then they appear in English inside a Hindi interface.
