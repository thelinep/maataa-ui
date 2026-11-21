import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";

describe("ContextMenu", () => {
  const items = [{ id: "rename", label: "Rename", onSelect: vi.fn() }];
  it("opens on right-click, Shift+F10 and a visible button; focus returns", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu label="Scene 12" items={items}>
        <button>Scene 12</button>
      </ContextMenu>
    );
    const scene = screen.getByRole("button", { name: "Scene 12" });
    fireEvent.contextMenu(scene);
    expect(screen.getByRole("menu", { name: "Scene 12" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    scene.focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(scene).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "More actions: Scene 12" }));
    await user.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(items[0]!.onSelect).toHaveBeenCalled();
  });
});
