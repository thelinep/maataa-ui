import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FrameTimelineStrip, moveItem } from "./FrameTimelineStrip";

const frames = [
  { id: "a", number: "1", description: "Wide street", duration: 4 },
  { id: "b", number: "2", description: "Meera enters", duration: 3, shot: "MS" },
  { id: "c", number: "3", description: "", duration: 2 },
];

describe("moveItem", () => {
  it("moves", () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
  });
});

describe("FrameTimelineStrip", () => {
  it("selects and reorders without dragging", async () => {
    const onSelect = vi.fn();
    const onReorder = vi.fn();
    const user = userEvent.setup();
    render(
      <FrameTimelineStrip
        frames={frames}
        selectedId="b"
        onSelect={onSelect}
        onReorder={onReorder}
      />
    );
    expect(screen.getByText(/0:09 running time/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Frame 2, 2 of 3, MS: Meera enters/ })
    ).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("button", { name: /Frame 3, 3 of 3: no description/ }));
    expect(onSelect).toHaveBeenCalledWith("c");
    await user.click(screen.getByRole("button", { name: "← Earlier" }));
    expect(onReorder).toHaveBeenCalledWith(["b", "a", "c"]);
    expect(screen.getByRole("status")).toHaveTextContent("Frame 2 moved to position 1 of 3");
  });
});
