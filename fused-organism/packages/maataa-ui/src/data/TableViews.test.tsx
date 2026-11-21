import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { AgendaView, InlineEditGrid, ComparisonTable, DiffView, diffLines } from "./TableViews";

describe("AgendaView", () => {
  it("groups by day with headings and skips empty days", () => {
    const today = new Date(2026, 10, 21);
    render(
      <AgendaView
        from={today}
        today={today}
        events={[
          { id: "1", title: "Recce, Chandni Chowk", start: new Date(2026, 10, 21, 9) },
          { id: "2", title: "Table read", start: new Date(2026, 10, 23, 15), kind: "Rehearsal" },
        ]}
      />
    );
    const hs = screen.getAllByRole("heading", { level: 3 });
    expect(hs).toHaveLength(2);
    expect(hs[0]).toHaveTextContent(/Saturday.*21 November.*Today/);
    expect(screen.getByText("Table read")).toBeInTheDocument();
  });
});

describe("InlineEditGrid", () => {
  it("edits a named cell, validates and moves down on Enter", async () => {
    const user = userEvent.setup();
    type Row = { id: string; role: string; rate: number };
    function H() {
      const [rows, setRows] = useState<Row[]>([
        { id: "a", role: "DOP", rate: 25000 },
        { id: "b", role: "Gaffer", rate: 9000 },
      ]);
      return (
        <InlineEditGrid<Row>
          label="Crew rates"
          rowHeaderKey="role"
          rows={rows}
          columns={[
            { key: "role", header: "Role" },
            {
              key: "rate",
              header: "Rate",
              editable: true,
              type: "number",
              validate: (v) => (Number(v) < 0 ? "Rate can’t be negative" : null),
            },
          ]}
          onChange={(id, k, v) =>
            setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)))
          }
        />
      );
    }
    render(<H />);
    expect(screen.getByRole("columnheader", { name: "Rate (editable)" })).toBeInTheDocument();
    const dop = screen.getByRole("textbox", { name: "Rate, DOP" });
    await user.clear(dop);
    await user.type(dop, "-5{Enter}");
    expect(dop).toHaveAccessibleDescription("Rate can’t be negative");
    await user.clear(dop);
    await user.type(dop, "30000{Enter}");
    expect(screen.getByRole("textbox", { name: "Rate, Gaffer" })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Rate for DOP saved.");
  });
});

describe("ComparisonTable", () => {
  it("writes yes/no in words and filters to differences", async () => {
    const user = userEvent.setup();
    render(
      <ComparisonTable
        label="Camera packages"
        options={[
          { id: "a", name: "Alexa 35" },
          { id: "b", name: "FX9", recommended: true },
        ]}
        rows={[
          { feature: "Lenses included", values: { a: true, b: true } },
          { feature: "Day rate", values: { a: "₹45,000", b: "₹18,000" } },
          { feature: "Raw", values: { a: true, b: false } },
        ]}
      />
    );
    expect(screen.getByRole("columnheader", { name: "FX9 Recommended" })).toBeInTheDocument();
    expect(screen.getAllByText("No")).toHaveLength(1);
    await user.click(screen.getByRole("checkbox", { name: "Only show differences (2)" }));
    expect(screen.queryByRole("rowheader", { name: "Lenses included" })).toBeNull();
  });
});

describe("DiffView", () => {
  it("diffs lines and labels changes in words", () => {
    expect(diffLines("a\nb\nc", "a\nc\nd").map((l) => l.kind)).toEqual([
      "same",
      "removed",
      "same",
      "added",
    ]);
    render(
      <DiffView
        label="Scene 4 changes"
        before={"INT. FLAT\nRAIN"}
        after={"INT. FLAT\nSUN"}
        beforeLabel="v2"
        afterLabel="v3"
      />
    );
    expect(screen.getByText("1 added")).toBeInTheDocument();
    expect(screen.getByText("Removed:")).toBeInTheDocument();
  });
});
