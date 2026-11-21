import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EquipmentCheckoutSheet } from "./EquipmentCheckoutSheet";

describe("EquipmentCheckoutSheet", () => {
  it("summarises what's out and labels every control", async () => {
    const onChange = vi.fn();
    render(
      <EquipmentCheckoutSheet
        title="Day 4 · Camera"
        onChange={onChange}
        lines={[
          { id: "1", name: "Lens 35mm", out: true, in: false, condition: "good" },
          { id: "2", name: "Monitor", out: false, in: false, condition: "damaged" },
        ]}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("1 item still out · 1 damaged or missing");
    expect(screen.getByRole("checkbox", { name: "Monitor returned" })).toBeDisabled();
    await userEvent.setup().click(screen.getByRole("checkbox", { name: "Lens 35mm returned" }));
    expect(onChange).toHaveBeenCalledWith("1", { in: true });
  });
});
