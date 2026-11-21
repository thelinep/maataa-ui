import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawingToolPalette } from "./DrawingToolPalette";

describe("DrawingToolPalette", () => {
  it("is a radio group with shortcuts in names, plus undo/redo", async () => {
    const onChange = vi.fn();
    const onUndo = vi.fn();
    const user = userEvent.setup();
    render(
      <DrawingToolPalette
        value="pen"
        onChange={onChange}
        onUndo={onUndo}
        onRedo={() => {}}
        canUndo
        canRedo={false}
      />
    );
    expect(screen.getByRole("group", { name: "Drawing tool" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Pen, shortcut P" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Eraser, shortcut E" }));
    expect(onChange).toHaveBeenCalledWith("eraser");
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled();
  });
});
