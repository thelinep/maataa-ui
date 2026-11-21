import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  AppliedFilterChips,
  SortSelector,
  type AppliedFilter,
  type SortValue,
} from "./ListControls";

describe("AppliedFilterChips", () => {
  it("removes filters with named buttons and keeps focus", async () => {
    const user = userEvent.setup();
    function H() {
      const [f, setF] = useState<AppliedFilter[]>([
        { id: "d", field: "Department", value: "Camera" },
        { id: "s", field: "Status", value: "Booked" },
      ]);
      return (
        <AppliedFilterChips
          filters={f}
          resultCount={4}
          noun="crew"
          onRemove={(id) => setF((x) => x.filter((y) => y.id !== id))}
          onClearAll={() => setF([])}
        />
      );
    }
    render(<H />);
    expect(screen.getByText("4 crew, filtered by:")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove filter: Department: Camera" }));
    expect(screen.getByRole("status")).toHaveTextContent("Removed filter Department: Camera.");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Remove filter: Status: Booked/ })).toHaveFocus()
    );
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByRole("status")).toHaveTextContent("All filters cleared.");
  });
});

describe("SortSelector", () => {
  it("offers field × direction in words", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<SortValue>({ field: "date", direction: "desc" });
      return (
        <>
          <SortSelector
            fields={[
              { value: "date", label: "Date", directions: ["Oldest first", "Newest first"] },
              { value: "name", label: "Name" },
            ]}
            value={v}
            onChange={setV}
          />
          <output>{`${v.field} ${v.direction}`}</output>
        </>
      );
    }
    render(<H />);
    const sel = screen.getByRole("combobox", { name: "Sort by" });
    expect(sel).toHaveDisplayValue("Date — Newest first");
    await user.selectOptions(sel, "Name — A to Z");
    expect(screen.getByText("name asc")).toBeInTheDocument();
  });
});
