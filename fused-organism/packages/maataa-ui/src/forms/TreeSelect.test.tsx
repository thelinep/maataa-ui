import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { TreeSelect, leavesOf, type TreeNode } from "./TreeSelect";

const nodes: TreeNode[] = [
  {
    value: "india",
    label: "India",
    children: [
      {
        value: "north",
        label: "North",
        children: [
          { value: "dl", label: "Delhi" },
          { value: "pb", label: "Punjab" },
        ],
      },
      { value: "mh", label: "Maharashtra" },
    ],
  },
];

describe("TreeSelect", () => {
  it("selects a whole branch and shows mixed state", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<string[]>([]);
      return <TreeSelect legend="Territories" nodes={nodes} value={v} onChange={setV} />;
    }
    render(<H />);
    expect(leavesOf(nodes[0]!)).toEqual(["dl", "pb", "mh"]);
    await user.click(screen.getByRole("button", { name: "Show India" }));
    await user.click(screen.getByRole("button", { name: "Show North" }));
    await user.click(screen.getByRole("checkbox", { name: "Delhi" }));
    const india = screen.getByRole("checkbox", { name: /India/ }) as HTMLInputElement;
    expect(india.indeterminate).toBe(true);
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /North/ }));
    expect(screen.getByText("2 selected")).toBeInTheDocument();
    await user.click(india);
    expect(screen.getByText("3 selected")).toBeInTheDocument();
    expect(india.checked).toBe(true);
  });
});
