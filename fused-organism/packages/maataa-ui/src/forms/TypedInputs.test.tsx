import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  UrlInput,
  TelInput,
  PercentageInput,
  validateUrl,
  normalizeTel,
  type TelValue,
} from "./TypedInputs";

describe("validateUrl", () => {
  it("accepts https and rejects other schemes or bare words", () => {
    expect(validateUrl("https://maataa.in/films")).toBeNull();
    expect(validateUrl("ftp://x.com")).toMatch(/must start with/);
    expect(validateUrl("maataa")).toMatch(/full web address/);
    expect(validateUrl("https://intranet")).toMatch(/no domain/);
  });
});

describe("UrlInput", () => {
  it("checks on blur and reports the error on the field", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("");
      return <UrlInput label="Website" value={v} onChange={setV} />;
    }
    render(<H />);
    const input = screen.getByLabelText("Website");
    await user.type(input, "ftp://files.example.com");
    expect(input).not.toHaveAttribute("aria-invalid");
    await user.tab();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/must start with https:\/\//);
  });
});

describe("TelInput", () => {
  it("normalises and checks the digit count", async () => {
    expect(normalizeTel("098765-43210")).toBe("9876543210");
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<TelValue>({ dialCode: "+91", number: "" });
      return <TelInput label="Mobile" value={v} onChange={setV} expectedDigits={10} />;
    }
    render(<H />);
    expect(screen.getByRole("group", { name: "Mobile" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Country code" })).toHaveValue("+91");
    const num = screen.getByRole("textbox", { name: "Phone number" });
    await user.type(num, "98765");
    await user.tab();
    expect(num).toHaveAccessibleDescription(/Enter 10 digits after \+91 \(you have 5\)/);
  });
});

describe("PercentageInput", () => {
  it("reads the unit, rounds and range-checks", async () => {
    const user = userEvent.setup();
    const seen: (number | null)[] = [];
    render(<PercentageInput label="GST rate" value={null} onChange={(v) => seen.push(v)} />);
    const input = screen.getByLabelText("GST rate");
    expect(input).toHaveAccessibleDescription(/percent/);
    await user.type(input, "18.456%");
    await user.tab();
    expect(seen.at(-1)).toBe(18.46);
    await user.clear(input);
    await user.type(input, "140");
    await user.tab();
    expect(input).toHaveAccessibleDescription(/from 0 to 100/);
  });
});
