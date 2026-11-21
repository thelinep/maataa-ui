import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {
  it("copies and announces", async () => {
    const user = userEvent.setup();
    const onCopied = vi.fn();
    render(<CopyButton value="https://maataa.in/s/abc" what="share link" onCopied={onCopied} />);
    await user.click(screen.getByRole("button", { name: "Copy share link" }));
    await expect(navigator.clipboard.readText()).resolves.toBe("https://maataa.in/s/abc");
    expect(onCopied).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Share link copied");
  });
});
