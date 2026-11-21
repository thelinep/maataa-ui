import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PipelineBoard } from "./PipelineBoard";

describe("PipelineBoard", () => {
  it("moves a card by select and announces it", async () => {
    const onMove = vi.fn();
    const stages = [
      { id: "new", label: "New" },
      { id: "cb", label: "Callbacks" },
    ];
    render(
      <PipelineBoard
        stages={stages}
        cards={[{ id: "a", title: "Asha Rao", stage: "new", person: true }]}
        onMove={onMove}
      />
    );
    expect(screen.getByRole("list", { name: /New/ })).toBeInTheDocument();
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "Move Asha Rao to" }), "cb");
    expect(onMove).toHaveBeenCalledWith("a", "cb");
    expect(screen.getByRole("status")).toHaveTextContent("Asha Rao moved to Callbacks");
  });
});
