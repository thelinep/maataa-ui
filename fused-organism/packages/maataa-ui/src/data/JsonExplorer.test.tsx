import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JsonExplorer } from "./JsonExplorer";

const data = {
  project: "Monsoon",
  crew: [{ name: "Asha", role: "Director" }],
  budget: { total: 50000000, locked: true },
};

describe("JsonExplorer", () => {
  it("is a keyboard tree that names types and values", async () => {
    const user = userEvent.setup();
    render(<JsonExplorer data={data} label="Project data" />);
    const tree = screen.getByRole("tree", { name: "Project data" });
    expect(tree).toBeInTheDocument();
    // Filter, Expand all, Collapse all, Copy path, then the tree
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    const root = screen.getByRole("treeitem", { name: "root: object, 3 keys" });
    expect(root).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("treeitem", { name: 'project: string, "Monsoon"' })).toHaveFocus();
    await user.keyboard("{ArrowDown}{ArrowRight}");
    expect(screen.getByRole("treeitem", { name: "crew: array, 1 items" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("filters to matching paths", async () => {
    render(<JsonExplorer data={data} />);
    await userEvent.type(
      screen.getByRole("searchbox", { name: "Filter keys and values" }),
      "locked"
    );
    expect(screen.getByRole("treeitem", { name: "locked: boolean, true" })).toBeInTheDocument();
    expect(screen.queryByRole("treeitem", { name: /project:/ })).toBeNull();
  });
});
