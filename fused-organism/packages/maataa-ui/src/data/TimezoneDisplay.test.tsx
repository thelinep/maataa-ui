import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimezoneDisplay } from "./TimezoneDisplay";

describe("TimezoneDisplay", () => {
  it("flags a different day", () => {
    render(
      <TimezoneDisplay
        at={new Date(Date.UTC(2026, 10, 21, 1, 0))}
        zones={["Asia/Kolkata", "America/Los_Angeles"]}
        labels={{ "America/Los_Angeles": "LA (VFX)" }}
      />
    );
    expect(screen.getByText(/LA \(VFX\)/)).toBeInTheDocument();
    expect(screen.getByText("(previous day)")).toBeInTheDocument();
  });
});
