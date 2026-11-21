import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("labels selects, announces count and clears", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const filters = [
      { id: "genre", label: "Genre", options: [{ value: "drama", label: "Drama" }] },
    ];
    const { rerender } = render(
      <FilterBar
        label="Filter productions"
        filters={filters}
        values={{ genre: "" }}
        onChange={onChange}
        resultCount={1}
        resultNoun="productions"
      />
    );
    expect(screen.getByRole("group", { name: "Filter productions" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 production");
    await user.selectOptions(screen.getByRole("combobox", { name: "Genre" }), "drama");
    expect(onChange).toHaveBeenCalledWith({ genre: "drama" });
    rerender(
      <FilterBar
        label="Filter productions"
        filters={filters}
        values={{ genre: "drama" }}
        onChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));
    expect(onChange).toHaveBeenLastCalledWith({ genre: "" });
  });
});
