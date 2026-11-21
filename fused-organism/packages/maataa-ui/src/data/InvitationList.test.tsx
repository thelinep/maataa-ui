import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvitationList } from "./InvitationList";

describe("InvitationList", () => {
  it("names actions by address and marks expired", async () => {
    const onResend = vi.fn();
    const onRevoke = vi.fn();
    const user = userEvent.setup();
    render(
      <InvitationList
        now={new Date(2026, 10, 21)}
        onResend={onResend}
        onRevoke={onRevoke}
        invitations={[
          {
            id: "1",
            email: "ravi@x.in",
            role: "Editor",
            sentAt: new Date(2026, 10, 1),
            expiresAt: new Date(2026, 10, 8),
          },
        ]}
      />
    );
    expect(screen.getByRole("table", { name: "Pending invitations" })).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Resend invitation to ravi@x.in" }));
    await user.click(screen.getByRole("button", { name: "Revoke invitation to ravi@x.in" }));
    expect(onResend).toHaveBeenCalledWith("1");
    expect(onRevoke).toHaveBeenCalledWith("1");
  });
});
