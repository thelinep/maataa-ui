import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApprovalActions } from "./ApprovalActions";

describe("ApprovalActions", () => {
  it("approves, or sends back with a reason", async () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const user = userEvent.setup();
    render(
      <ApprovalActions subject="Ravi's timesheet" onApprove={onApprove} onReject={onReject} />
    );
    expect(screen.getByRole("group", { name: "Decision on Ravi's timesheet" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send back" }));
    const box = screen.getByLabelText(/Why are you sending it back/);
    expect(box).toHaveFocus();
    await user.type(box, "short");
    await user.click(screen.getByRole("button", { name: "Send back" }));
    expect(screen.getByRole("alert")).toHaveTextContent("at least 10 characters");
    await user.type(box, " — Tuesday wrap time is missing");
    await user.click(screen.getByRole("button", { name: "Send back" }));
    expect(onReject).toHaveBeenCalledWith("short — Tuesday wrap time is missing");
    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalled();
  });
  it("explains when you can't decide", () => {
    render(
      <ApprovalActions
        subject="x"
        onApprove={() => {}}
        onReject={() => {}}
        disabledReason="You can't approve your own timesheet."
      />
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});
