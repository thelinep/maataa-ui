import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodBoardGallery } from "./MoodBoardGallery";

describe("MoodBoardGallery", () => {
  it("flags missing alt text and reorders", async () => {
    const onChange = vi.fn();
    const images = [
      { id: "1", url: "/a.jpg", alt: "Rain on a tin roof" },
      { id: "2", url: "/b.jpg", alt: "" },
    ];
    render(<MoodBoardGallery title="Monsoon evenings" images={images} onChange={onChange} />);
    expect(screen.getByText(/1 needs a description/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Rain on a tin roof" })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Move image 2 earlier" }));
    expect(onChange).toHaveBeenCalledWith([images[1], images[0]]);
  });
});
