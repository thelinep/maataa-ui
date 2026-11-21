import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checklist } from "./Checklist";

const items = [
  { id: "a", label: "Permits", checked: true },
  { id: "b", label: "Insurance", checked: false },
];

describe("Checklist", () => {
  it("is a section named by its title with a count", () => {
    render(<Checklist title="Before day one" items={items} onChange={() => {}} />);
    expect(screen.getByRole("region", { name: "Before day one" })).toBeInTheDocument();
    expect(screen.getByText(/1 of 2 done/)).toBeInTheDocument();
  });
  it("reports changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checklist title="Before day one" items={items} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox", { name: /Insurance/ }));
    expect(onChange).toHaveBeenCalledWith("b", true);
  });
});
