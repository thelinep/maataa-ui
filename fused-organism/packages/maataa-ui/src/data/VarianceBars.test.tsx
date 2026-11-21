import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VarianceBars } from "./VarianceBars";

describe("VarianceBars", () => {
  it("says over and under in words", () => {
    render(
      <VarianceBars
        rows={[
          { category: "Catering", budget: 40000, actual: 52000 },
          { category: "Crew", budget: 100000, actual: 90000 },
        ]}
      />
    );
    expect(screen.getByRole("table", { name: "Actuals vs budget" })).toBeInTheDocument();
    expect(screen.getByText("₹12,000 over")).toBeInTheDocument();
    expect(screen.getByText("₹10,000 under")).toBeInTheDocument();
  });
});
