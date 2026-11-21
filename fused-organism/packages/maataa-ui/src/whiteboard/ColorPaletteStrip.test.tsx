import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColorPaletteStrip, contrastRatio } from "./ColorPaletteStrip";

describe("ColorPaletteStrip", () => {
  it("computes contrast and says which text works", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    render(
      <ColorPaletteStrip
        title="Palette"
        colors={[
          { name: "Monsoon slate", hex: "#2F3E46", usage: "Night exteriors" },
          { name: "Turmeric", hex: "#E3A72F" },
        ]}
      />
    );
    expect(screen.getAllByText(/White text/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Black text/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy Turmeric hex code" })).toBeInTheDocument();
  });
});
