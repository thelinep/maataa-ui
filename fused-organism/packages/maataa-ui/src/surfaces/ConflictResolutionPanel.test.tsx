import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConflictResolutionPanel } from "./ConflictResolutionPanel";

const fields = [
  { key: "amount", label: "Amount", mine: "40000", theirs: "45000" },
  { key: "note", label: "Note", mine: "Lunch", theirs: "Lunch + tea" },
];

describe("ConflictResolutionPanel", () => {
  it("chooses per field and saves", async () => {
    const onResolve = vi.fn();
    const user = userEvent.setup();
    render(
      <ConflictResolutionPanel
        recordName="Catering"
        theirAuthor="Ravi"
        fields={fields}
        onResolve={onResolve}
      />
    );
    expect(screen.getByRole("group", { name: "Amount" })).toBeInTheDocument();
    await user.click(screen.getAllByRole("radio", { name: /Ravi.s version/ })[0]);
    await user.click(screen.getByRole("button", { name: "Save chosen values" }));
    expect(onResolve).toHaveBeenCalledWith({ amount: "45000", note: "Lunch" });
  });
  it("keeps all of one side", async () => {
    const onResolve = vi.fn();
    const user = userEvent.setup();
    render(
      <ConflictResolutionPanel
        recordName="Catering"
        theirAuthor="Ravi"
        fields={fields}
        onResolve={onResolve}
      />
    );
    await user.click(screen.getByRole("button", { name: "Keep all Ravi’s" }));
    await user.click(screen.getByRole("button", { name: "Save chosen values" }));
    expect(onResolve).toHaveBeenCalledWith({ amount: "45000", note: "Lunch + tea" });
  });
});
