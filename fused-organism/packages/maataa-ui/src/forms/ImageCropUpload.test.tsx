import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageCropUpload, clampCrop } from "./ImageCropUpload";

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:poster");
  URL.revokeObjectURL = vi.fn();
});

describe("clampCrop", () => {
  it("keeps the frame inside the image", () => {
    expect(clampCrop({ zoom: 1, x: 0.3, y: -0.3 })).toEqual({ zoom: 1, x: 0, y: 0 });
    expect(clampCrop({ zoom: 2, x: 0.5, y: 0 }).x).toBeCloseTo(0.25);
  });
});

describe("ImageCropUpload", () => {
  it("crops with buttons and describes the crop in words", async () => {
    const user = userEvent.setup();
    render(<ImageCropUpload label="Poster image" onCrop={() => {}} />);
    await user.upload(
      screen.getByLabelText("Poster image"),
      new File(["x"], "poster.png", { type: "image/png" })
    );
    expect(screen.getByRole("status")).toHaveTextContent("poster.png loaded");
    const zoom = screen.getByRole("slider", { name: "Zoom" });
    expect(zoom).toHaveAttribute("aria-valuetext", "1.0 times");
    await user.click(screen.getByRole("button", { name: "Move right" }));
    expect(screen.getByText(/Zoom 1.0 times; centred/)).toBeInTheDocument();
    const frame = screen.getByRole("img", { name: /Crop preview/ });
    frame.focus();
    await user.keyboard("+++");
    await user.keyboard("{ArrowRight}");
    expect(frame).toHaveAccessibleName(/Zoom 1.3 times; moved 5% right, 0% down/);
  });
});
