import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VersionSelector } from "./VersionSelector";

const versions = [
  { id: "v2", label: "v2", createdAt: new Date(2026, 10, 10), author: "Asha", status: "Draft" },
  { id: "v3", label: "v3", createdAt: new Date(2026, 10, 18), author: "Asha", status: "Approved" },
];

describe("VersionSelector", () => {
  it("lists newest first and warns on old versions", async () => {
    const onChange = vi.fn();
    render(
      <VersionSelector
        subject="Budget"
        versions={versions}
        value="v2"
        currentId="v3"
        onChange={onChange}
      />
    );
    const sel = screen.getByRole("combobox", { name: "Budget version" });
    expect((sel as HTMLSelectElement).options[0].text).toMatch(/^v3 · current/);
    expect(sel).toHaveAccessibleDescription(/older version.*v3/);
    await userEvent.setup().selectOptions(sel, "v3");
    expect(onChange).toHaveBeenCalledWith("v3");
  });
});
