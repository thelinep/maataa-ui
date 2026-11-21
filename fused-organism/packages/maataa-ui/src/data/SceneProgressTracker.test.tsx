import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SceneProgressTracker } from "./SceneProgressTracker";

describe("SceneProgressTracker", () => {
  it("reports pages shot and changes state", async () => {
    const onChangeState = vi.fn();
    render(
      <SceneProgressTracker
        onChangeState={onChangeState}
        scenes={[
          { id: "a", scene: "12", set: "Kitchen", eighths: 11, state: "done", takes: 6 },
          { id: "b", scene: "14", set: "Terrace", eighths: 16, state: "shooting" },
          { id: "c", scene: "15", set: "Lane", eighths: 4, state: "moved" },
        ]}
      />
    );
    expect(screen.getByRole("meter", { name: "Pages shot" })).toHaveAttribute(
      "aria-valuetext",
      "1 3/8 of 3 3/8 pages, 41%"
    );
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "State of scene 14" }), "done");
    expect(onChangeState).toHaveBeenCalledWith("b", "done");
  });
});
