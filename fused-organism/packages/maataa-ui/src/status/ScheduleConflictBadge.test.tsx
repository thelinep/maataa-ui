import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScheduleConflictBadge } from "./ScheduleConflictBadge";

describe("ScheduleConflictBadge", () => {
  it("discloses the conflicts", async () => {
    render(
      <ScheduleConflictBadge
        subject="Day 4"
        conflicts={[{ id: "1", description: "Asha is booked elsewhere" }]}
      />
    );
    const b = screen.getByRole("button", { name: "1 conflict on Day 4" });
    expect(b).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Asha is booked elsewhere")).not.toBeVisible();
    await userEvent.setup().click(b);
    expect(screen.getByText("Asha is booked elsewhere")).toBeVisible();
  });
  it("says when there are none", () => {
    render(<ScheduleConflictBadge conflicts={[]} />);
    expect(screen.getByText(/No conflicts/)).toBeInTheDocument();
  });
});
