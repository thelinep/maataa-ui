import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoleAssignmentTable } from "./RoleAssignmentTable";

const roles = [
  { value: "owner", label: "Owner" },
  { value: "editor", label: "Editor" },
];

describe("RoleAssignmentTable", () => {
  it("labels each select and locks the last owner", async () => {
    const onChange = vi.fn();
    render(
      <RoleAssignmentTable
        roles={roles}
        onChange={onChange}
        members={[
          { id: "1", name: "Hemant", role: "owner" },
          { id: "2", name: "Asha Rao", role: "editor" },
        ]}
      />
    );
    const owner = screen.getByRole("combobox", { name: "Role for Hemant" });
    expect(owner).toBeDisabled();
    expect(owner).toHaveAccessibleDescription(/Only owner/);
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "Role for Asha Rao" }), "owner");
    expect(onChange).toHaveBeenCalledWith("2", "owner");
  });
});
