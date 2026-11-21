import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecordHeader, DetailList } from "./RecordHeader";

describe("RecordHeader", () => {
  it("has the h1, status, facts and a named back link", () => {
    render(
      <RecordHeader
        title="Monsoon Diaries"
        status="Filming"
        facts={[{ label: "Budget", value: "₹48 L" }]}
        back={{ label: "Projects", href: "/projects" }}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Monsoon Diaries" })).toBeInTheDocument();
    expect(screen.getByText("Filming")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Projects/ })).toHaveAttribute(
      "href",
      "/projects"
    );
    expect(screen.getByText("₹48 L")).toBeInTheDocument();
  });
  it("DetailList fills empty values", () => {
    render(<DetailList items={[{ label: "GSTIN", value: "" }]} />);
    expect(screen.getByText("Not given")).toBeInTheDocument();
  });
});
