import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LockIndicator } from "./LockIndicator";

describe("LockIndicator", () => {
  it("says locked state in words and offers unlock", async () => {
    const onUnlock = vi.fn();
    render(
      <LockIndicator
        subject="Picture"
        locked
        lockedBy="PHKD"
        lockedAt={new Date(2026, 10, 20)}
        onUnlock={onUnlock}
      />
    );
    expect(screen.getByText("Picture locked")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Unlock picture" }));
    expect(onUnlock).toHaveBeenCalled();
  });
});
