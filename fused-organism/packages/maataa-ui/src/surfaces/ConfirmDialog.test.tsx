import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog, TypedConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("focuses Cancel first and confirms on click", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen
        title="Archive this project?"
        message="It moves to Archived."
        confirmLabel="Archive"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(onConfirm).toHaveBeenCalled();
  });
  it("cancels on Escape", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog isOpen title="Sure?" message="x" onConfirm={() => {}} onCancel={onCancel} />
    );
    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalled();
  });
  it("renders nothing when closed", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Sure?"
        message="x"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("TypedConfirmDialog", () => {
  it("enables confirm only after the exact text is typed", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <TypedConfirmDialog
        isOpen
        title="Delete Monsoon Diaries?"
        message="Cannot be undone."
        confirmationText="Monsoon Diaries"
        confirmLabel="Delete forever"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );
    const confirm = screen.getByRole("button", { name: "Delete forever" });
    expect(confirm).toBeDisabled();
    const input = screen.getByLabelText(/to confirm/);
    expect(input).toHaveFocus();
    await user.type(input, "Monsoon");
    expect(confirm).toBeDisabled();
    await user.type(input, " Diaries");
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalled();
  });
});
