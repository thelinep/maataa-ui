import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AttachmentUploader } from "./AttachmentUploader";

describe("AttachmentUploader", () => {
  it("lists attachments with progress, scan state and remove", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <AttachmentUploader
        label="Attach"
        onAdd={() => {}}
        onRemove={onRemove}
        attachments={[
          { id: "1", name: "call-sheet.pdf", size: 2048, state: "uploading", progress: 40 },
          { id: "2", name: "map.png", size: 4096, state: "done", scan: "clean" },
          { id: "3", name: "big.mov", size: 1, state: "error", error: "too large" },
        ]}
      />
    );
    expect(screen.getByRole("list", { name: "Attached files" })).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Uploading call-sheet.pdf" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Upload failed: too large/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove map.png" }));
    expect(onRemove).toHaveBeenCalledWith("2");
  });
});
