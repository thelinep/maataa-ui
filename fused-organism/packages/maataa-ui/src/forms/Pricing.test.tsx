import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PricingSourceTable, PricingWorksheet, priceSteps } from "./Pricing";

describe("priceSteps", () => {
  it("applies percentages on the running total", () => {
    const s = priceSteps(100000, [
      { id: "m", label: "Margin", kind: "percent", value: 20 },
      { id: "g", label: "GST", kind: "percent", value: 18 },
    ]);
    expect(s.map((x) => x.running)).toEqual([120000, 141600]);
  });
});

describe("Pricing", () => {
  it("flags stale sources", () => {
    render(
      <PricingSourceTable
        now={new Date(2026, 10, 21)}
        sources={[
          {
            id: "1",
            item: "Alexa Mini",
            price: 28000,
            unit: "per day",
            source: "Rate card",
            checkedOn: new Date(2026, 4, 1),
          },
        ]}
      />
    );
    expect(screen.getByText(/days old, recheck/)).toBeInTheDocument();
  });
  it("shows working and total", () => {
    const onChange = vi.fn();
    render(
      <PricingWorksheet
        title="Screening fee"
        base={100000}
        onChange={onChange}
        approval={{ state: "approved", version: "2" }}
        lines={[{ id: "g", label: "GST", kind: "percent", value: 18 }]}
      />
    );
    expect(screen.getByText("18% of ₹1,00,000 = ₹18,000")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("₹1,18,000");
    expect(screen.getByText(/Approved/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("GST"), { target: { value: "12" } });
    expect(onChange).toHaveBeenCalledWith("g", 12);
  });
});
