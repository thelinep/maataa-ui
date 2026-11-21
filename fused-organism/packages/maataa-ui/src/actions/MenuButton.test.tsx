import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuButton, SplitButton, ShareMenu, FabMenu, type MenuAction } from "./MenuButton";

const mk = (fn = vi.fn()): MenuAction[] => [
  { id: "dup", label: "Duplicate", onSelect: fn },
  { id: "move", label: "Move to day 2", onSelect: fn, disabled: true },
  { id: "del", label: "Delete", onSelect: fn, danger: true },
];

describe("MenuButton", () => {
  it("opens with arrows, skips disabled items, type-ahead and Escape", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<MenuButton label="Shot actions" items={mk(fn)} />);
    const btn = screen.getByRole("button", { name: "Shot actions" });
    btn.focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("d");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(btn).toHaveFocus();
    expect(screen.queryByRole("menu")).toBeNull();
    await user.keyboard("{Enter}");
    await user.keyboard("{Enter}");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("SplitButton", () => {
  it("has a main action and a named menu button", async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    const other = vi.fn();
    render(
      <SplitButton
        label="Save"
        onClick={save}
        items={[{ id: "copy", label: "Save as copy", onSelect: other }]}
      />
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(save).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "More save options" }));
    await user.click(screen.getByRole("menuitem", { name: "Save as copy" }));
    expect(other).toHaveBeenCalled();
  });
});

describe("ShareMenu", () => {
  it("copies the link and announces it", async () => {
    const user = userEvent.setup();
    const write = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: write },
    });
    render(<ShareMenu url="https://maataa.in/p/1" title="Monsoon Wedding" />);
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("menu", { name: "Share Monsoon Wedding" })).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Copy link" }));
    expect(write).toHaveBeenCalledWith("https://maataa.in/p/1");
    expect(await screen.findByText("Link copied.")).toBeInTheDocument();
  });
});

describe("FabMenu", () => {
  it("opens a menu of quick actions", async () => {
    const user = userEvent.setup();
    render(<FabMenu label="Create" items={mk()} fixed={false} />);
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(screen.getByRole("menu", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
  });
});
