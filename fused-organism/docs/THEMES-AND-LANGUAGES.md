# Themes and languages

## Themes

MAATAA ships five themes: **Light** (`paperTheme`, the default), **Dark** (`darkTheme`), **TLPS v2** (`tlpsV2Theme`), **High contrast** (`highContrastTheme`, at least 7:1 for all text) and **Hemant** (`hemantTheme`, a warm early-winter light theme: misty ivory, mustard cream, marigold and sindoor accents; WCAG AA, tested). `builtInThemes` lists all five in picker order.

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
</LocaleProvider>;
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

## Digits and the Indian calendar

`LocaleProvider` takes `numerals`: `"latn"` (0–9), `"deva"` (०–९), `"brah"` (Brahmi 𑁦–𑁯) or any Unicode numbering-system id. It is added to the locale every component formats with (`hi-IN` becomes `hi-IN-u-nu-brah`), so every number, date, count and amount below follows, while `lang` stays `hi-IN`. An id the browser doesn't know is ignored. Brahmi needs a font that has it, such as Noto Sans Brahmi; without one, the digits show as boxes. `NumeralsSelector` (in `@maataa/ui/forms`) lets people choose, with a preview of each set.

`IndianDate` shows a date as Vikram Samvat, for example "मार्गशीर्ष कृष्ण प्रतिपदा · विक्रम संवत् २०८३ · हेमंत ऋतु". `vikramDate(date, options)` returns the parts: samvat and Shaka year, lunar month (with adhik months), paksha, tithi and ritu. The tithi is the one running at local sunrise (New Delhi by default; pass `lat` and `lng`), months are purnimanta by default (`system: "amanta"` for Gujarat, Maharashtra and the south), and the ritu follows the sun's sidereal sign (Lahiri ayanamsa). It is computed from the sun and moon positions, with no lookup tables, so it works for any year. Tests check it against panchang dates for Holi, Raksha Bandhan, Janmashtami, Diwali, Gudi Padwa and the 2026 adhik Jyeshtha. A tithi that changes within minutes of sunrise, and the rare kshaya month, can differ from a printed panchang; use a panchang for religious timings.
