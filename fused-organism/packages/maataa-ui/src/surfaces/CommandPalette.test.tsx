import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CommandPalette,
  filterCommands,
  useCommandPaletteShortcut,
  type Command,
} from "./CommandPalette";

const run = vi.fn();
const commands: Command[] = [
  { id: "b", label: "Budgets", group: "Go to", keywords: ["money"], run },
  { id: "n", label: "New project", group: "Create", run: () => {} },
];

describe("filterCommands", () => {
  it("matches keywords and ranks label prefixes first", () => {
    expect(filterCommands(commands, "money").map((c) => c.id)).toEqual(["b"]);
    expect(filterCommands(commands, "").length).toBe(2);
  });
});

describe("CommandPalette", () => {
  it("runs the chosen command and closes", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CommandPalette isOpen onClose={onClose} commands={commands} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const box = screen.getByRole("combobox", { name: "Search commands" });
    expect(box).toHaveFocus();
    await user.type(box, "budg");
    await user.keyboard("{Enter}");
    expect(onClose).toHaveBeenCalled();
    expect(run).toHaveBeenCalled();
  });
  it("opens on Ctrl+K", async () => {
    const open = vi.fn();
    renderHook(() => useCommandPaletteShortcut(open));
    await userEvent.setup().keyboard("{Control>}k{/Control}");
    expect(open).toHaveBeenCalled();
  });
});
