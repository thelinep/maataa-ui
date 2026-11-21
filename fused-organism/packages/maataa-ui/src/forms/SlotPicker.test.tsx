import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SlotPicker } from "./SlotPicker";

const d = (h: number) => new Date(2026, 10, 24, h);

describe("SlotPicker", () => {
  it("groups by day and disables taken slots", async () => {
    const onChange = vi.fn();
    render(
      <SlotPicker
        legend="Audition slot"
        value={undefined}
        onChange={onChange}
        slots={[
          { id: "a", start: d(10), end: d(11) },
          { id: "b", start: d(11), end: d(12), taken: true },
        ]}
      />
    );
    expect(screen.getByRole("group", { name: /Tuesday/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /taken/ })).toBeDisabled();
    await userEvent.setup().click(screen.getAllByRole("radio")[0]);
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
