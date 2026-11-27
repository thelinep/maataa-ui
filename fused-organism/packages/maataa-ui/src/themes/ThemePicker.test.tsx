import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { LocaleProvider } from "../i18n/LocaleProvider";
import {
  builtInThemes,
  darkTheme,
  highContrastTheme,
  paperTheme,
  themeToCssVariables,
  themesToCss,
  tlpsV2Theme,
} from "../tokens";
import { ThemePicker } from "./ThemePicker";
import { ThemePreferenceHead } from "./ThemePreferenceHead";
import { resolveThemeChoice, themeInitScript } from "./themePreference";

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function mockSystemDark(dark: boolean) {
  const listeners = new Set<(event: { matches: boolean }) => void>();
  window.matchMedia = ((query: string) => ({
    matches: dark,
    media: query,
    addEventListener: (_: string, fn: (event: { matches: boolean }) => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: (event: { matches: boolean }) => void) =>
      listeners.delete(fn),
  })) as unknown as typeof window.matchMedia;
  return (next: boolean) => listeners.forEach((fn) => fn({ matches: next }));
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-maataa-theme");
  document.documentElement.removeAttribute("data-maataa-theme-choice");
  mockSystemDark(false);
});

describe("highContrastTheme", () => {
  const c = highContrastTheme.colors;
  const backgrounds = Object.values(c.background).filter((v) => v !== c.background.inverse);

  it("meets WCAG AAA (7:1) for text and accents on every background", () => {
    for (const bg of backgrounds) {
      for (const fg of [
        c.text.primary,
        c.text.secondary,
        c.text.tertiary,
        c.interactive.primary,
        c.interactive.success,
        c.interactive.warning,
        c.interactive.error,
        c.interactive.info,
      ]) {
        expect(contrast(fg, bg)).toBeGreaterThanOrEqual(7);
      }
      expect(contrast(c.border.control, bg)).toBeGreaterThanOrEqual(7);
      expect(contrast(c.text.disabled, bg)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(c.text.inverse, c.interactive.primary)).toBeGreaterThanOrEqual(7);
    for (const pair of Object.values(c.semantic)) {
      expect(contrast(pair.text, pair.bg)).toBeGreaterThanOrEqual(7);
    }
  });

  it("themes every color variable the default theme does", () => {
    const names = (t: typeof paperTheme) => Object.keys(themeToCssVariables(t)).sort();
    const colorNames = (t: typeof paperTheme) =>
      names(t).filter((n) => n.startsWith("--maataa-color-"));
    expect(colorNames(highContrastTheme)).toEqual(colorNames(paperTheme));
  });
});

describe("themesToCss", () => {
  it("puts the default on :root, each theme on its attribute, and dark on a dark system", () => {
    const css = themesToCss(builtInThemes);
    expect(css).toContain(":root{--maataa-color-text-primary:#3D2817;");
    expect(css).toContain(':root[data-maataa-theme="high-contrast"]{');
    expect(css).toContain(':root[data-maataa-theme="tlps-v2"]{');
    expect(css).toMatch(
      /@media \(prefers-color-scheme: dark\)\{:root:not\(\[data-maataa-theme\]\)\{--maataa-color-text-primary:#F4F6F8;/
    );
  });
});

describe("resolveThemeChoice", () => {
  it("maps system to light or dark and keeps explicit choices", () => {
    expect(resolveThemeChoice("system", false)).toBe("paper");
    expect(resolveThemeChoice("system", true)).toBe("dark");
    expect(resolveThemeChoice("high-contrast", true)).toBe("high-contrast");
    expect(resolveThemeChoice("unknown", false)).toBe("paper");
  });
});

describe("themeInitScript", () => {
  it("applies the saved choice before paint", () => {
    window.localStorage.setItem("maataa-theme", "tlps-v2");
    new Function(themeInitScript())();
    expect(document.documentElement.getAttribute("data-maataa-theme")).toBe("tlps-v2");
    expect(document.documentElement.getAttribute("data-maataa-theme-choice")).toBe("tlps-v2");
  });

  it("follows the system when nothing is saved", () => {
    mockSystemDark(true);
    new Function(themeInitScript())();
    expect(document.documentElement.getAttribute("data-maataa-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-maataa-theme-choice")).toBe("system");
  });

  it("ignores a saved value that is not an offered theme", () => {
    window.localStorage.setItem("maataa-theme", "</script><script>alert(1)</script>");
    new Function(themeInitScript())();
    expect(document.documentElement.getAttribute("data-maataa-theme")).toBe("paper");
  });

  it("renders on the server with no script-breaking characters", () => {
    const html = renderToStaticMarkup(<ThemePreferenceHead nonce="abc" />);
    expect(html).toContain('nonce="abc"');
    expect(html).toContain("data-maataa-theme-preference");
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
});

describe("ThemePicker", () => {
  it("lists System and every built-in theme, labelled", () => {
    render(<ThemePicker />);
    const select = screen.getByRole("combobox", { name: "Theme" });
    const options = Array.from((select as HTMLSelectElement).options).map((o) => o.text);
    expect(options).toEqual(["System", "Light", "Dark", "TLPS v2", "High contrast"]);
    expect(select).toHaveValue("system");
  });

  it("applies, saves and restores the choice", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { unmount } = render(<ThemePicker onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox", { name: "Theme" }), "high-contrast");
    expect(document.documentElement.getAttribute("data-maataa-theme")).toBe("high-contrast");
    expect(window.localStorage.getItem("maataa-theme")).toBe("high-contrast");
    expect(onChange).toHaveBeenCalledWith("high-contrast", "high-contrast");
    unmount();
    render(<ThemePicker />);
    expect(screen.getByRole("combobox", { name: "Theme" })).toHaveValue("high-contrast");
  });

  it("follows the system setting live when System is chosen", () => {
    const setSystemDark = mockSystemDark(false);
    render(<ThemePicker />);
    expect(document.documentElement.getAttribute("data-maataa-theme")).toBe("paper");
    act(() => setSystemDark(true));
    expect(document.documentElement.getAttribute("data-maataa-theme")).toBe("dark");
  });

  it("keeps two pickers in step", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ThemePicker label="Header theme" />
        <ThemePicker label="Settings theme" />
      </>
    );
    await user.selectOptions(screen.getByRole("combobox", { name: "Header theme" }), "dark");
    expect(screen.getByRole("combobox", { name: "Settings theme" })).toHaveValue("dark");
  });

  it("offers only the given themes, without System", () => {
    render(<ThemePicker themes={[paperTheme, tlpsV2Theme]} showSystem={false} hideLabel />);
    const select = screen.getByRole("combobox", { name: "Theme" }) as HTMLSelectElement;
    expect(Array.from(select.options).map((o) => o.value)).toEqual(["paper", "tlps-v2"]);
    expect(select).toHaveValue("paper");
  });

  it("is labelled in the active language", () => {
    render(
      <LocaleProvider locale="hi-IN">
        <ThemePicker />
      </LocaleProvider>
    );
    const select = screen.getByRole("combobox", { name: "थीम" }) as HTMLSelectElement;
    expect(Array.from(select.options).map((o) => o.text)).toEqual([
      "सिस्टम",
      "हल्की",
      "गहरी",
      "TLPS v2",
      "उच्च कंट्रास्ट",
    ]);
  });

  it("works with darkTheme as the only dark option", () => {
    expect(resolveThemeChoice("system", true, { themes: [paperTheme, darkTheme] })).toBe("dark");
  });
});
