import { render, screen } from "@testing-library/react";
import { ThemeStyle } from "./ThemeStyle";
import {
  colorTokens,
  darkTheme,
  paperColorPalette,
  paperTheme,
  radiusTokens,
  themeToCss,
  themeToCssVariables,
  tlpsV2Theme,
  typographyTokens,
} from "../tokens";

describe("themeable tokens", () => {
  it("are CSS variables that fall back to the default palette", () => {
    expect(colorTokens.text.primary).toBe(
      `var(--maataa-color-text-primary, ${paperColorPalette.text.primary})`
    );
    expect(colorTokens.semantic.success.bg).toBe(
      "var(--maataa-color-semantic-success-bg, #C7E9C0)"
    );
    expect(radiusTokens.md).toBe("var(--maataa-radius-md, 6px)");
    expect(typographyTokens.fontFamily.mono).toMatch(/^var\(--maataa-font-mono, /);
  });

  it("maps every color token of a theme to a variable", () => {
    const vars = themeToCssVariables(tlpsV2Theme);
    expect(vars["--maataa-color-text-primary"]).toBe("#171A1D");
    expect(vars["--maataa-color-semantic-error-text"]).toBe("#8C2119");
    expect(vars["--maataa-radius-md"]).toBe("2px");
    expect(vars["--maataa-font-base"]).toMatch(/^Inter/);
    expect(vars["--maataa-chart-single"]).toBe("#C2442D");
    // Same set of color variables as the defaults, so nothing is left unthemed
    const names = (t: typeof paperTheme) =>
      Object.keys(themeToCssVariables(t)).filter((n) => n.startsWith("--maataa-color-"));
    expect(names(tlpsV2Theme).sort()).toEqual(names(paperTheme).sort());
    expect(names(darkTheme).sort()).toEqual(names(paperTheme).sort());
  });

  it("builds a CSS rule for a selector", () => {
    const css = themeToCss(tlpsV2Theme, ".tlps");
    expect(css.startsWith(".tlps{")).toBe(true);
    expect(css).toContain("--maataa-color-background-primary:#FFFEFA;");
    expect(css).toContain("color-scheme:light;");
  });
});

describe("ThemeStyle", () => {
  it("writes the theme into a style element", () => {
    const { container } = render(<ThemeStyle theme={tlpsV2Theme} />);
    const style = container.querySelector("style[data-maataa-theme-style='tlps-v2']");
    expect(style?.textContent).toBe(themeToCss(tlpsV2Theme));
  });

  it("themes components that read the tokens", () => {
    render(
      <>
        <ThemeStyle theme={tlpsV2Theme} />
        <p style={{ color: colorTokens.text.primary }}>Ink</p>
      </>
    );
    expect(screen.getByText("Ink").style.color).toBe(colorTokens.text.primary);
  });

  it("scopes to a selector and passes a nonce", () => {
    const { container } = render(<ThemeStyle theme={darkTheme} selector="#panel" nonce="abc" />);
    const style = container.querySelector("style")!;
    expect(style.textContent!.startsWith("#panel{")).toBe(true);
    expect(style.getAttribute("nonce")).toBe("abc");
  });
});

describe("TLPS v2 theme contrast (WCAG 2.2 AA)", () => {
  const lum = (hex: string) =>
    [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
      .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0);
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi! + 0.05) / (lo! + 0.05);
  };
  const { text, background, border, interactive, semantic } = tlpsV2Theme.colors;
  const surfaces = [background.primary, background.secondary, background.tertiary];

  it.each([
    ["text.primary", text.primary, 4.5],
    ["text.secondary", text.secondary, 4.5],
    ["text.tertiary", text.tertiary, 4.5],
    ["interactive.primary", interactive.primary, 4.5],
    ["interactive.success", interactive.success, 4.5],
    ["interactive.warning", interactive.warning, 4.5],
    ["interactive.error", interactive.error, 4.5],
    ["interactive.info", interactive.info, 4.5],
    ["border.control", border.control, 3],
  ])("%s on every background", (_, color, min) => {
    for (const bg of surfaces) expect(ratio(color, bg)).toBeGreaterThanOrEqual(min);
  });

  it("keeps semantic text readable on its fill, and inverse text on ink", () => {
    for (const pair of Object.values(semantic))
      expect(ratio(pair.text, pair.bg)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(text.inverse, interactive.primary)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(text.inverse, background.inverse)).toBeGreaterThanOrEqual(4.5);
  });
});
