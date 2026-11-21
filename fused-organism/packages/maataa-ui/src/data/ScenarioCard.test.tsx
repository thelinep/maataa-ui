import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScenarioCard } from "./ScenarioCard";

describe("ScenarioCard", () => {
  const props = {
    name: "Lean shoot",
    summary: "12 days, small crew",
    assumptions: ["12 shoot days"],
    results: [{ label: "Total", value: "₹48 L" }],
  };
  it("is an article named by the scenario", () => {
    render(<ScenarioCard {...props} />);
    expect(screen.getByRole("article", { name: "Lean shoot" })).toBeInTheDocument();
    expect(screen.getByText("₹48 L")).toBeInTheDocument();
  });
  it("is a toggle button when selectable", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ScenarioCard {...props} onSelect={onSelect} />);
    const button = screen.getByRole("button", { name: "Use this scenario" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(onSelect).toHaveBeenCalled();
    rerender(<ScenarioCard {...props} onSelect={onSelect} selected />);
    expect(screen.getByRole("button", { name: "Selected" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
