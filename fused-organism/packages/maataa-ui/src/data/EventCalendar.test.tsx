import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { EventCalendar, eventsOn, type CalendarView, type CalendarEvent } from "./EventCalendar";

const events: CalendarEvent[] = [
  { id: "1", title: "Shoot day 4", start: new Date(2026, 10, 21, 6, 30), kind: "shoot" },
  { id: "2", title: "Audition", start: new Date(2026, 10, 21, 15, 0), kind: "audition" },
];

function H({ onSelect }: { onSelect: (e: CalendarEvent) => void }) {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date(2026, 10, 1));
  return (
    <EventCalendar
      events={events}
      view={view}
      onViewChange={setView}
      date={date}
      onDateChange={setDate}
      onSelectEvent={onSelect}
      today={new Date(2026, 10, 21)}
    />
  );
}

describe("eventsOn", () => {
  it("filters and sorts by day", () => {
    expect(eventsOn(events, new Date(2026, 10, 21)).map((e) => e.id)).toEqual(["1", "2"]);
    expect(eventsOn(events, new Date(2026, 10, 22))).toHaveLength(0);
  });
});

describe("EventCalendar", () => {
  it("navigates months, opens a day and selects events", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<H onSelect={onSelect} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("November 2026");
    const day = screen.getByRole("button", { name: "21 November, today, 2 events" });
    expect(day).toHaveAttribute("aria-current", "date");
    await user.click(screen.getByRole("button", { name: /Shoot day 4, shoot/ }));
    expect(onSelect).toHaveBeenCalledWith(events[0]);
    await user.click(day);
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /Saturday.*21 November.*2026/
    );
    await user.click(screen.getByRole("button", { name: "Next day" }));
    expect(screen.getByText("Nothing scheduled")).toBeInTheDocument();
  });
});
