import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "revenue", header: "Revenue", align: "right" as const, sortable: true },
  ];
  const data = [
    { name: "Acme", revenue: 12400 },
    { name: "Globex", revenue: 8600 },
  ];

  it("renders column headers", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders one row per data entry", () => {
    render(<DataTable columns={columns} data={data} />);
    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it("renders cell values", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("12400")).toBeInTheDocument();
  });

  it("uses a custom cell renderer when provided", () => {
    const customColumns = [
      { key: "name", header: "Name" },
      {
        key: "revenue",
        header: "Revenue",
        render: (value: unknown) => `$${value}`,
      },
    ];
    render(<DataTable columns={customColumns} data={data} />);
    expect(screen.getByText("$12400")).toBeInTheDocument();
  });

  it("sorts ascending then descending when a sortable header is clicked", () => {
    render(<DataTable columns={columns} data={data} />);
    const sortButton = screen.getByRole("button", { name: /Revenue/ });

    fireEvent.click(sortButton);
    let rows = screen.getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Globex")).toBeInTheDocument();

    fireEvent.click(sortButton);
    rows = screen.getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Acme")).toBeInTheDocument();
  });

  it("does not render a sort button for a non-sortable column", () => {
    const readOnlyColumns = [{ key: "name", header: "Name" }];
    render(<DataTable columns={readOnlyColumns} data={data} />);
    expect(screen.queryByRole("button", { name: /Name/ })).not.toBeInTheDocument();
  });

  it("renders the default empty state when data is empty", () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders a custom empty state when provided", () => {
    render(<DataTable columns={columns} data={[]} emptyState={<div>Nothing here</div>} />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("uses getRowKey when provided", () => {
    const getRowKey = (row: Record<string, unknown>) => String(row.name);
    render(<DataTable columns={columns} data={data} getRowKey={getRowKey} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("forwards a ref to the table element", () => {
    const ref = React.createRef<HTMLTableElement>();
    render(<DataTable ref={ref} columns={columns} data={data} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("sets displayName", () => {
    expect(DataTable.displayName).toBe("DataTable");
  });
});

describe("DataTable row actions", () => {
  const columns = [{ key: "name", header: "Name", sortable: true }];
  const data = [{ name: "Bravo" }, { name: "Alpha" }];

  it("calls onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("Bravo"));
    expect(onRowClick).toHaveBeenCalledWith({ name: "Bravo" }, 0);
  });

  it("makes rows keyboard-operable with Enter and Space", () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    const row = screen.getByText("Alpha").closest("tr") as HTMLElement;
    expect(row).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });
    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(onRowClick).toHaveBeenLastCalledWith({ name: "Alpha" }, 1);
  });

  it("reports the index in the current sort order", () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByRole("button", { name: /name/i }));
    fireEvent.click(screen.getByText("Alpha"));
    expect(onRowClick).toHaveBeenCalledWith({ name: "Alpha" }, 0);
  });

  it("leaves rows inert without onRowClick", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Alpha").closest("tr")).not.toHaveAttribute("tabindex");
  });
});
