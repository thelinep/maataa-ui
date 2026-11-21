import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SourceAttribution } from "./SourceAttribution";

describe("SourceAttribution", () => {
  const now = new Date("2026-11-21");
  it("links the source and marks new-tab", () => {
    render(
      <SourceAttribution
        title="M&E report"
        url="https://example.com"
        accessedAt={new Date("2026-10-01")}
        now={now}
      />
    );
    const link = screen.getByRole("link", { name: "M&E report (opens in a new tab)" });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("opens in a new tab");
    expect(screen.queryByText(/may be out of date/)).toBeNull();
  });
  it("flags stale sources in words", () => {
    render(<SourceAttribution title="Old survey" accessedAt={new Date("2025-01-01")} now={now} />);
    expect(screen.getByText(/may be out of date/)).toBeInTheDocument();
  });
});
