import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Waveform, SpectrumAnalyzer, VUMeter, peaksFrom, levelZone } from "./AudioViz";

describe("AudioViz", () => {
  it("waveform counts clipping peaks", () => {
    render(<Waveform label="Take 3 audio" peaks={[0.2, 0.99, 0.5, 1]} />);
    expect(
      screen.getByRole("img", { name: "Take 3 audio. 2 clipping peaks." })
    ).toBeInTheDocument();
    expect(peaksFrom([0, -0.5, 0.25, 1], 2)).toEqual([0.5, 1]);
  });

  it("spectrum describes the dominant range", () => {
    const bands = Array.from({ length: 32 }, (_, i) => (i === 2 ? 1 : 0.2));
    render(<SpectrumAnalyzer bands={bands} />);
    expect(screen.getByText(/strongest in the low range/)).toBeInTheDocument();
  });

  it("VU meter states level and zone", () => {
    render(<VUMeter level={-8} label="Boom mic" />);
    expect(screen.getByRole("meter", { name: "Boom mic" })).toHaveAttribute(
      "aria-valuetext",
      "-8 dB, loud"
    );
    expect(levelZone(-0.1)).toBe("clipping");
  });
});
