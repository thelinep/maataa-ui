import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VersionHistoryList } from "./VersionHistoryList";

describe("VersionHistoryList", () => {
  it("orders newest first and names actions", async () => {
    const onCompare = vi.fn();
    const onRestore = vi.fn();
    const user = userEvent.setup();
    render(
      <VersionHistoryList
        title="Edit versions"
        currentId="v7"
        onCompare={onCompare}
        onRestore={onRestore}
        versions={[
          { id: "v6", label: "Cut v6", createdAt: new Date(2026, 10, 10) },
          { id: "v7", label: "Cut v7", createdAt: new Date(2026, 10, 18), status: "Locked" },
        ]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Cut v7");
    expect(items[0]).toHaveTextContent("Current");
    await user.click(screen.getByRole("button", { name: "Compare Cut v6 with current" }));
    await user.click(screen.getByRole("button", { name: "Restore Cut v6" }));
    expect(onCompare).toHaveBeenCalled();
    expect(onRestore).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Restore Cut v7" })).toBeNull();
  });
});
