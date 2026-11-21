import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { TimesheetEntryForm, hoursWorked, formatHM, type TimesheetDay } from "./TimesheetEntryForm";

describe("hoursWorked", () => {
  it("handles breaks and overnight wraps", () => {
    expect(hoursWorked({ callTime: "06:00", wrapTime: "19:30", breakMinutes: 60 })).toBe(750);
    expect(hoursWorked({ callTime: "18:00", wrapTime: "02:00", breakMinutes: 30 })).toBe(450);
    expect(formatHM(750)).toBe("12 h 30 min");
  });
});

function H() {
  const [v, setV] = useState<TimesheetDay>({
    date: "2026-11-24",
    callTime: "06:00",
    wrapTime: "19:30",
    breakMinutes: 60,
  });
  return <TimesheetEntryForm value={v} onChange={setV} />;
}

describe("TimesheetEntryForm", () => {
  it("shows total and overtime live", () => {
    render(<H />);
    expect(screen.getByRole("status")).toHaveTextContent("Total 12 h 30 min");
    expect(screen.getByRole("status")).toHaveTextContent("30 min overtime");
    fireEvent.change(screen.getByLabelText("Wrap time"), { target: { value: "17:00" } });
    expect(screen.getByRole("status")).toHaveTextContent("Within shift");
  });
});
