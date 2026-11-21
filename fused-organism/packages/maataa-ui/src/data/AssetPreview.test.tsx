import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetPreview, AssetGrid } from "./AssetPreview";

describe("AssetPreview", () => {
  it("warns about missing alt text and captions", () => {
    const { rerender } = render(
      <AssetPreview asset={{ id: "1", name: "still.jpg", kind: "image", url: "/s.jpg" }} />
    );
    expect(screen.getByText(/No description yet/)).toBeInTheDocument();
    rerender(
      <AssetPreview
        asset={{ id: "2", name: "teaser.mp4", kind: "video", url: "/t.mp4", captionsUrl: "/t.vtt" }}
      />
    );
    expect(document.querySelector("track[kind='captions']")).not.toBeNull();
    expect(screen.queryByText(/No captions/)).toBeNull();
  });
});

describe("AssetGrid", () => {
  it("names thumbnails and selection boxes", async () => {
    const onOpen = vi.fn();
    const onToggleSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <AssetGrid
        assets={[{ id: "1", name: "still.jpg", kind: "image" }]}
        onOpen={onOpen}
        onToggleSelect={onToggleSelect}
        selected={[]}
      />
    );
    await user.click(screen.getByRole("button", { name: "still.jpg, image" }));
    await user.click(screen.getByRole("checkbox", { name: "Select still.jpg" }));
    expect(onOpen).toHaveBeenCalled();
    expect(onToggleSelect).toHaveBeenCalledWith("1");
  });
});
