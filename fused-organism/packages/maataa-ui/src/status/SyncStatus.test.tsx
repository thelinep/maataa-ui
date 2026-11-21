import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncStatus } from "./SyncStatus";

describe("SyncStatus", () => {
  it("says the state in words", () => {
    render(<SyncStatus state="pending" pendingCount={3} />);
    expect(screen.getByRole("status")).toHaveTextContent("Waiting to save (3)");
  });
  it("offers retry on error", async () => {
    const onRetry = vi.fn();
    render(<SyncStatus state="error" onRetry={onRetry} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });
});
