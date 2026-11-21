import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArchiveButton } from "./ArchiveButton";

describe("ArchiveButton", () => {
  it("asks before archiving", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ArchiveButton itemName="Monsoon Diaries" archived={false} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Archive Monsoon Diaries" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
  it("restores at once", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ArchiveButton itemName="Monsoon Diaries" archived onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Restore Monsoon Diaries" }));
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
