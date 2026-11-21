import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewThread } from "./ReviewThread";

const notes = [
  {
    id: "1",
    timecode: "00:12:04:10",
    author: "PHKD",
    text: "Hold on Meera a beat longer",
    at: new Date(),
    replies: [{ id: "r", author: "Asha", text: "Done in v8", at: new Date() }],
  },
  {
    id: "2",
    timecode: "00:03:00:00",
    author: "Ravi",
    text: "Sound dip",
    at: new Date(),
    resolved: true,
  },
];

describe("ReviewThread", () => {
  it("seeks, replies, resolves and hides resolved", async () => {
    const onSeek = vi.fn();
    const onReply = vi.fn();
    const onToggleResolved = vi.fn();
    const user = userEvent.setup();
    render(
      <ReviewThread
        notes={notes}
        onSeek={onSeek}
        onReply={onReply}
        onToggleResolved={onToggleResolved}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("1 open of 2");
    await user.click(screen.getByRole("button", { name: "Go to 00:12:04:10" }));
    expect(onSeek).toHaveBeenCalledWith("00:12:04:10");
    await user.type(screen.getByLabelText("Reply to PHKD at 00:12:04:10"), "Will do{Enter}");
    expect(onReply).toHaveBeenCalledWith("1", "Will do");
    await user.click(screen.getByRole("button", { name: "Resolve note at 00:12:04:10" }));
    expect(onToggleResolved).toHaveBeenCalledWith("1");
    await user.click(screen.getByLabelText("Hide resolved"));
    expect(screen.queryByText("Sound dip")).toBeNull();
  });
});
