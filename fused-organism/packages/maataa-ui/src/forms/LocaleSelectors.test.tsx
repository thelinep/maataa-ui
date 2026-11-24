import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  LanguageSelector,
  CountrySelector,
  RegionSelector,
  CurrencySelector,
  NumeralsSelector,
} from "./LocaleSelectors";
import { displayName, indianStates, indianLanguages } from "./localeData";

describe("locale data", () => {
  it("has 36 states and UTs and 23 languages", () => {
    expect(indianStates).toHaveLength(36);
    expect(indianLanguages).toHaveLength(23);
    expect(displayName("IN", "region")).toBe("India");
  });
});

describe("selectors", () => {
  it("language shows native names", async () => {
    render(<LanguageSelector value="ta" onChange={() => {}} />);
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveValue("Tamil · தமிழ்");
  });
  it("country puts India first", async () => {
    const user = userEvent.setup();
    render(<CountrySelector value="" onChange={() => {}} />);
    await user.click(screen.getByRole("combobox", { name: "Country" }));
    expect(screen.getAllByRole("option")[0]).toHaveTextContent("India");
  });
  it("currency shows code, name and symbol", () => {
    render(<CurrencySelector value="INR" onChange={() => {}} />);
    expect(screen.getByRole("combobox", { name: "Currency" })).toHaveValue(
      "INR · Indian Rupee (₹)"
    );
  });
  it("region clears the district when the state changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RegionSelector
        value={{ state: "DL", district: "Shahdara" }}
        onChange={onChange}
        districtsFor={() => ["Shahdara", "East Delhi"]}
      />
    );
    await user.click(screen.getByRole("combobox", { name: "State or union territory" }));
    await user.click(screen.getByRole("option", { name: "Goa" }));
    expect(onChange).toHaveBeenCalledWith({ state: "GA", district: undefined });
  });
});

describe("NumeralsSelector", () => {
  it("previews each digit set and reports the choice", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumeralsSelector value="latn" onChange={onChange} locale="hi-IN" />);
    const box = screen.getByRole("combobox", { name: "Digits" });
    expect(box).toHaveTextContent("International (0–9) · 123");
    await user.click(box);
    const options = screen.getAllByRole("option").map((o) => o.textContent?.replace("✓", ""));
    expect(options).toEqual(["International (0–9) · 123", "Devanagari · १२३", "Brahmi · 𑁧𑁨𑁩"]);
    await user.click(screen.getByRole("option", { name: "Brahmi · 𑁧𑁨𑁩" }));
    expect(onChange).toHaveBeenCalledWith("brah");
  });
});
