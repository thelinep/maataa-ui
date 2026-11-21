import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoleBreakdownCard } from "./RoleBreakdownCard";

describe("RoleBreakdownCard", () => {
  it("shows stage, needs and applicants", () => {
    render(
      <RoleBreakdownCard
        role={{
          id: "1",
          title: "Meera (lead)",
          kind: "cast",
          stage: "Callbacks",
          requirements: ["Hindi and Marathi"],
          applicants: 14,
          scenes: 32,
        }}
      />
    );
    expect(screen.getByRole("article", { name: "Meera (lead)" })).toHaveTextContent("Callbacks");
    expect(screen.getByText("14 applicants")).toBeInTheDocument();
    expect(screen.getByText(/32 scenes/)).toBeInTheDocument();
  });
});
