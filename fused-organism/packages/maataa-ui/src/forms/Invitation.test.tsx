import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvitationAcceptance, InvitationRecoveryPanel } from "./Invitation";

const invitation = {
  inviterName: "Hemant",
  workspaceName: "Monsoon Diaries",
  role: "Editor",
  email: "asha@vesahe.in",
  expiresAt: new Date("2026-11-23"),
};

describe("InvitationAcceptance", () => {
  it("shows who, what and role, and accepts", async () => {
    const onAccept = vi.fn();
    render(
      <InvitationAcceptance
        invitation={invitation}
        onAccept={onAccept}
        onDecline={() => {}}
        now={new Date("2026-11-21")}
      />
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Hemant invited you to Monsoon Diaries"
    );
    expect(screen.getByText(/in 2 days/)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Accept and join" }));
    expect(onAccept).toHaveBeenCalled();
  });
  it("warns about a different signed-in account", () => {
    render(
      <InvitationAcceptance
        invitation={invitation}
        signedInAs="ravi@vesahe.in"
        onAccept={() => {}}
        onDecline={() => {}}
        onSwitchAccount={() => {}}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("ravi@vesahe.in");
  });
});

describe("InvitationRecoveryPanel", () => {
  it("offers a new invitation and confirms the request", () => {
    const { rerender } = render(
      <InvitationRecoveryPanel
        problem="expired"
        inviterName="Hemant"
        onRequestNew={() => {}}
        onGoHome={() => {}}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("expired");
    expect(screen.getByRole("button", { name: "Ask for a new invitation" })).toBeInTheDocument();
    rerender(
      <InvitationRecoveryPanel
        problem="expired"
        inviterName="Hemant"
        onRequestNew={() => {}}
        requested
        onGoHome={() => {}}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Request sent");
  });
});
