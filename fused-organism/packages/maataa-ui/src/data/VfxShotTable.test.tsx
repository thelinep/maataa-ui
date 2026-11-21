import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VfxShotTable } from "./VfxShotTable";

describe("VfxShotTable", () => {
  it("assigns artists and flags overdue shots", async () => {
    const onAssign = vi.fn();
    render(
      <VfxShotTable
        now={new Date(2026, 10, 21)}
        artists={[{ id: "a", name: "Asha" }]}
        onAssign={onAssign}
        shots={[
          {
            id: "1",
            code: "MD_042_010",
            scene: "42",
            description: "Window",
            work: "Rain comp",
            frames: 120,
            due: new Date(2026, 10, 18),
            render: "rendering",
          },
        ]}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/1 shots, 1 unassigned/);
    expect(screen.getByText(/overdue/)).toBeInTheDocument();
    expect(screen.getByText(/Rendering/)).toBeInTheDocument();
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "Artist for MD_042_010" }), "a");
    expect(onAssign).toHaveBeenCalledWith("1", "a");
  });
});
