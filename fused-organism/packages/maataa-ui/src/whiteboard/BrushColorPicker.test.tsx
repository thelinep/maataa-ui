import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrushColorPicker } from "./BrushColorPicker";

describe("BrushColorPicker", () => {
  it("names colours and shows size", async () => {
    const onColorChange = vi.fn();
    const onSizeChange = vi.fn();
    render(
      <BrushColorPicker
        color="#111111"
        onColorChange={onColorChange}
        size={6}
        onSizeChange={onSizeChange}
      />
    );
    expect(screen.getByRole("group", { name: "Colour: Black" })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("radio", { name: "Camera red" }));
    expect(onColorChange).toHaveBeenCalledWith("#C0392B");
    const slider = screen.getByRole("slider", { name: "Brush size" });
    expect(slider).toHaveAttribute("aria-valuetext", "6 pixels");
    fireEvent.change(slider, { target: { value: "12" } });
    expect(onSizeChange).toHaveBeenCalledWith(12);
  });
});
