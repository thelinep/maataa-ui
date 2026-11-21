import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timeline } from "./Timeline";

describe("Timeline", () => {
  it("lists events in a labelled ordered list", () => {
    render(
      <Timeline
        label="Activity"
        events={[
          {
            id: "1",
            title: "Budget approved",
            at: new Date("2026-11-20T10:00:00Z"),
            actor: "Asha",
          },
          { id: "2", title: "Draft created", at: new Date("2026-11-19T10:00:00Z") },
        ]}
      />
    );
    expect(screen.getByRole("list", { name: "Activity" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText(/Asha/)).toBeInTheDocument();
  });
  it("shows empty text", () => {
    render(<Timeline label="Activity" events={[]} emptyText="No activity yet" />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });
});
