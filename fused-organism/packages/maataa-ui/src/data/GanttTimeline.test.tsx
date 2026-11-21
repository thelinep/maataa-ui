import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GanttTimeline } from "./GanttTimeline";

describe("GanttTimeline", () => {
  it("is a readable table with milestones and conflicts", () => {
    render(
      <GanttTimeline
        tasks={[
          {
            id: "a",
            name: "Pre-production",
            start: new Date(2026, 10, 1),
            end: new Date(2026, 10, 20),
            progress: 0.6,
          },
          {
            id: "b",
            name: "Shoot",
            start: new Date(2026, 10, 21),
            end: new Date(2026, 11, 5),
            conflict: "Camera team double-booked",
          },
        ]}
        milestones={[{ id: "m", name: "Picture lock", date: new Date(2026, 11, 20) }]}
      />
    );
    expect(screen.getByRole("table", { name: /Schedule/ })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: /Milestone: Picture lock/ })).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText(/Camera team double-booked/)).toBeInTheDocument();
  });
});
