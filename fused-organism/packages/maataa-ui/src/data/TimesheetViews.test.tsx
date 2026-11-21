import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimesheetList, TimesheetWeekSummary } from "./TimesheetViews";

describe("TimesheetList", () => {
  it("counts waiting sheets and opens by name", async () => {
    const onOpen = vi.fn();
    render(
      <TimesheetList
        onOpen={onOpen}
        sheets={[
          {
            id: "1",
            person: "Ravi",
            role: "Gaffer",
            period: "Week 47",
            minutes: 4200,
            overtimeMinutes: 120,
            status: "submitted",
          },
        ]}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/1 waiting for approval/);
    expect(screen.getByText("Waiting for approval")).toBeInTheDocument();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Open Ravi's timesheet, Week 47" }));
    expect(onOpen).toHaveBeenCalled();
  });
});

describe("TimesheetWeekSummary", () => {
  it("totals hours and overtime", () => {
    render(
      <TimesheetWeekSummary
        week="Week 47"
        days={[
          { date: new Date(2026, 10, 16), minutes: 780 },
          { date: new Date(2026, 10, 17), minutes: 0 },
        ]}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Week 47: 13 h · 1 h overtime");
    expect(screen.getByText("Off")).toBeInTheDocument();
  });
});
