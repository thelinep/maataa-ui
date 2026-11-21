import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectSummaryCard } from "./ProjectSummaryCard";

describe("ProjectSummaryCard", () => {
  it("states budget use in words, flagging overrun", () => {
    render(
      <ProjectSummaryCard
        project={{
          id: "1",
          title: "Monsoon Diaries",
          stage: "Filming",
          budgetUsed: 1.08,
          budgetLabel: "₹48 L",
          team: ["Asha Rao", "Ravi Menon"],
        }}
      />
    );
    expect(screen.getByRole("link", { name: "Monsoon Diaries" })).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Budget used" })).toHaveAttribute(
      "aria-valuetext",
      "108%, over budget"
    );
    expect(screen.getByText(/2 people/)).toBeInTheDocument();
  });
});
