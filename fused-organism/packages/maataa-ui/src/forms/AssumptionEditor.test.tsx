import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AssumptionEditor } from "./AssumptionEditor";

describe("AssumptionEditor", () => {
  it("labels with units, explains range and flags low confidence", () => {
    const onChange = vi.fn();
    render(
      <AssumptionEditor
        title="Theatrical assumptions"
        onChange={onChange}
        assumptions={[
          {
            id: "s",
            label: "Screens in week 1",
            value: 1400,
            unit: "screens",
            min: 200,
            max: 1200,
            source: "Distributor estimate",
            confidence: "low",
          },
        ]}
      />
    );
    const input = screen.getByLabelText(/Screens in week 1 \(screens\) · low confidence/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      /Usually 200–1200 · outside the usual range · Source: Distributor estimate/
    );
    fireEvent.change(input, { target: { value: "900" } });
    expect(onChange).toHaveBeenCalledWith("s", 900);
  });
});
