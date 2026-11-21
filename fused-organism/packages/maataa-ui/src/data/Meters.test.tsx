import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedCounter, StackedProgressBar, ProgressRing, Gauge } from "./Meters";

describe("Meters", () => {
  it("counter exposes only the final value", () => {
    render(<AnimatedCounter value={1240} label="Applicants" />);
    expect(screen.getByText("1,240", { selector: "span:not([aria-hidden])" })).toBeInTheDocument();
  });

  it("stacked bar lists each part in words", () => {
    render(
      <StackedProgressBar
        label="Budget"
        unit="₹"
        total={100}
        segments={[
          { label: "Spent", value: 40 },
          { label: "Committed", value: 25 },
        ]}
      />
    );
    expect(screen.getByText("Spent: ₹40 (40%)")).toBeInTheDocument();
    expect(screen.getByText("₹65 of ₹100")).toBeInTheDocument();
  });

  it("ring and gauge expose values", () => {
    render(
      <>
        <ProgressRing value={3} max={4} label="Scenes shot" />
        <Gauge
          value={72}
          label="Readiness"
          bands={[
            { upTo: 40, label: "Poor", color: "#8B3A2B" },
            { upTo: 70, label: "Fair", color: "#7A6100" },
            { upTo: 100, label: "Good", color: "#2D6A3E" },
          ]}
        />
      </>
    );
    expect(screen.getByRole("progressbar", { name: "Scenes shot" })).toHaveAttribute(
      "aria-valuetext",
      "75%"
    );
    expect(screen.getByRole("meter", { name: "Readiness" })).toHaveAttribute(
      "aria-valuetext",
      "72, Good"
    );
  });
});
