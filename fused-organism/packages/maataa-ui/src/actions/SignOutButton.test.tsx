import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignOutButton } from "./SignOutButton";

describe("SignOutButton", () => {
  it("signs out at once when everything is synced", async () => {
    const onSignOut = vi.fn();
    render(<SignOutButton onSignOut={onSignOut} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalled();
  });
  it("warns about unsynced changes", async () => {
    const onSignOut = vi.fn();
    const user = userEvent.setup();
    render(<SignOutButton onSignOut={onSignOut} unsyncedCount={2} />);
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("2 changes haven't reached the server");
    await user.click(screen.getByRole("button", { name: "Sign out anyway" }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
