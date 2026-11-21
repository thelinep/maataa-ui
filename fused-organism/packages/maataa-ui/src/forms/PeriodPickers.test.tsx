import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { MonthPicker, WeekPicker, isoWeek, isoWeekStart, weeksInYear } from "./PeriodPickers";

describe("ISO week helpers", () => {
  it("matches known dates", () => {
    expect(isoWeek(new Date(2026, 10, 21))).toEqual({ year: 2026, week: 47 });
    expect(isoWeek(new Date(2027, 0, 1))).toEqual({ year: 2026, week: 53 });
    expect(weeksInYear(2026)).toBe(53);
    expect(isoWeekStart(2026, 47).toISOString().slice(0, 10)).toBe("2026-11-16");
  });
});

describe("MonthPicker", () => {
  it("changes month with selects and buttons, wrapping the year", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("2026-12");
      return (
        <>
          <MonthPicker label="Release month" value={v} onChange={setV} />
          <output>{v}</output>
        </>
      );
    }
    render(<H />);
    expect(screen.getByRole("group", { name: "Release month" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("2027-01")).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "Month" }), "March");
    expect(screen.getByText("2027-03")).toBeInTheDocument();
  });
});

describe("WeekPicker", () => {
  it("shows the date range of the week in words", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("2026-W47");
      return <WeekPicker label="Shoot week" value={v} onChange={setV} />;
    }
    render(<H />);
    const week = screen.getByRole("combobox", { name: "Week" });
    expect(week).toHaveAccessibleDescription("Week 47: 16 Nov – 22 Nov 2026");
    await user.click(screen.getByRole("button", { name: "Next week" }));
    expect(week).toHaveValue("48");
  });
});
