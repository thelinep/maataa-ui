import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { AvailabilityCalendar, type DateRangeValue } from "./AvailabilityCalendar";

function H() {
  const [v, setV] = useState<DateRangeValue>({ start: null, end: null });
  const [m, setM] = useState(new Date(2026, 10, 1));
  return (
    <AvailabilityCalendar
      subject="Bandra bungalow"
      month={m}
      onMonthChange={setM}
      booked={[new Date(2026, 10, 12)]}
      value={v}
      onChange={setV}
    />
  );
}

describe("AvailabilityCalendar", () => {
  it("picks a range, refuses booked days and spans", async () => {
    const user = userEvent.setup();
    render(<H />);
    expect(screen.getByRole("grid", { name: "November 2026" })).toBeInTheDocument();
    const booked = screen.getByRole("button", { name: /12 November, booked/ });
    expect(booked).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: /^Tuesday, 10 November/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Start 10 Nov");
    await user.click(screen.getByRole("button", { name: /^Saturday, 14 November/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Start 14 Nov");
    await user.click(screen.getByRole("button", { name: /^Monday, 16 November/ }));
    expect(screen.getByRole("status")).toHaveTextContent("14 Nov to 16 Nov chosen");
  });
});
