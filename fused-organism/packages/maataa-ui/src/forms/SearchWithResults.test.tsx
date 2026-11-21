import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SearchWithResults, type SearchResult } from "./SearchWithResults";

const all: SearchResult[] = [
  { id: "1", label: "Asha Rao", group: "People" },
  { id: "2", label: "Monsoon Diaries", group: "Projects" },
];

function Harness({ onSelect }: { onSelect: (r: SearchResult) => void }) {
  const [q, setQ] = useState("");
  const results = all.filter((r) => q && r.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <SearchWithResults
      label="Search"
      query={q}
      onQueryChange={setQ}
      results={results}
      onSelect={onSelect}
    />
  );
}

describe("SearchWithResults", () => {
  it("is a combobox driving a listbox by keyboard", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelect={onSelect} />);
    const box = screen.getByRole("combobox", { name: "Search" });
    expect(box).toHaveAttribute("aria-expanded", "false");
    await user.type(box, "a");
    expect(box).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("status")).toHaveTextContent("2 results");
    await user.keyboard("{ArrowDown}");
    expect(box.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[1].id);
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(all[1]);
  });
  it("Escape clears the query", async () => {
    const user = userEvent.setup();
    render(<Harness onSelect={() => {}} />);
    const box = screen.getByRole("combobox");
    await user.type(box, "zz");
    expect(screen.getByRole("status")).toHaveTextContent("No matches");
    await user.keyboard("{Escape}");
    expect(box).toHaveValue("");
  });
});
