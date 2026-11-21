import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SaveDraftButton, BulkActionBar, savedAgo } from "./WorkActions";

describe("savedAgo", () => {
  it("is human", () => {
    const now = new Date("2026-11-21T12:00:00");
    expect(savedAgo(new Date("2026-11-21T11:59:50"), now)).toBe("just now");
    expect(savedAgo(new Date("2026-11-21T11:57:00"), now)).toBe("3 min ago");
  });
});

describe("SaveDraftButton", () => {
  it("reports saving and failure in words", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockRejectedValueOnce(new Error("x"));
    render(<SaveDraftButton onSave={onSave} dirty />);
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes");
    await user.click(screen.getByRole("button", { name: "Save draft" }));
    expect(await screen.findByText(/Couldn’t save the draft/)).toBeInTheDocument();
  });

  it("shows when the draft was saved", () => {
    render(<SaveDraftButton onSave={async () => {}} dirty={false} savedAt={new Date()} />);
    expect(screen.getByRole("status")).toHaveTextContent("Draft saved just now");
  });
});

describe("BulkActionBar", () => {
  it("names the selection and runs actions", async () => {
    const user = userEvent.setup();
    const del = vi.fn();
    const clear = vi.fn();
    const { rerender } = render(
      <BulkActionBar count={0} noun="shots" actions={[]} onClearSelection={clear} />
    );
    expect(screen.queryByRole("group")).toBeNull();
    rerender(
      <BulkActionBar
        count={3}
        noun="shots"
        total={20}
        onSelectAll={() => {}}
        actions={[{ id: "d", label: "Delete", onClick: del, danger: true }]}
        onClearSelection={clear}
      />
    );
    expect(screen.getByRole("group", { name: "3 shots selected" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("3 shots selected");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(del).toHaveBeenCalled();
    expect(clear).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Select all 20" })).toBeInTheDocument();
  });
});
