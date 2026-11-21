import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountTypeSelector, RoleSelectionGrid } from "./ChoiceCards";

describe("AccountTypeSelector", () => {
  it("is a radio group of four", async () => {
    const onChange = vi.fn();
    render(<AccountTypeSelector value="individual" onChange={onChange} />);
    expect(screen.getByRole("group", { name: /kind of account/ })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    await userEvent.setup().click(screen.getByRole("radio", { name: /Government/ }));
    expect(onChange).toHaveBeenCalledWith("government");
  });
});

describe("RoleSelectionGrid", () => {
  it("toggles several roles", async () => {
    const onChange = vi.fn();
    render(<RoleSelectionGrid value={["producer"]} onChange={onChange} />);
    await userEvent.setup().click(screen.getByRole("checkbox", { name: /Editor/ }));
    expect(onChange).toHaveBeenCalledWith(["producer", "editor"]);
  });
});
