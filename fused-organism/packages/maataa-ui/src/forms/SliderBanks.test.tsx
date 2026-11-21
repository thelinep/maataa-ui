import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { EqFaders, ColorCorrectionSliders, EffectSliderBank } from "./SliderBanks";

describe("SliderBanks", () => {
  it("EQ faders are named by band with signed dB", async () => {
    function H() {
      const [g, setG] = useState<Record<string, number>>({ "125": 3 });
      return (
        <EqFaders
          gains={g}
          onChange={(hz, db) => setG((x) => ({ ...x, [hz]: db }))}
          bands={[125, 1000]}
        />
      );
    }
    render(<H />);
    const f = screen.getByRole("slider", { name: "125 Hz" });
    expect(f).toHaveAttribute("aria-valuetext", "+3 dB");
    fireEvent.change(screen.getByRole("slider", { name: "1k Hz" }), { target: { value: "-4.5" } });
    expect(screen.getByRole("slider", { name: "1k Hz" })).toHaveAttribute(
      "aria-valuetext",
      "-4.5 dB"
    );
    await userEvent.click(screen.getByRole("button", { name: "Reset all" }));
    expect(f).toHaveAttribute("aria-valuetext", "0 dB");
  });

  it("colour tint is described in words", () => {
    render(<ColorCorrectionSliders values={{ tint: 12, temperature: 4300 }} onChange={() => {}} />);
    expect(screen.getByRole("slider", { name: "Tint" })).toHaveAttribute(
      "aria-valuetext",
      "12 magenta"
    );
    expect(screen.getByRole("slider", { name: "Temperature" })).toHaveAttribute(
      "aria-valuetext",
      "4300 K"
    );
  });

  it("effect bank can be bypassed", () => {
    render(
      <EffectSliderBank
        effectName="Film grain"
        params={[{ id: "amt", label: "Amount", min: 0, max: 100, unit: "%" }]}
        values={{ amt: 30 }}
        onChange={() => {}}
        bypassed
        onBypassChange={() => {}}
      />
    );
    expect(screen.getByRole("group", { name: "Film grain settings" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Amount" })).toBeDisabled();
  });
});
