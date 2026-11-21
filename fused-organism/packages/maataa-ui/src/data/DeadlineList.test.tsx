import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeadlineList, relativeDue } from "./DeadlineList";

const now = new Date(2026, 10, 21, 12);

describe("relativeDue", () => {
  it("speaks relative dates", () => {
    expect(relativeDue(new Date(2026, 10, 19), now).text).toBe("Overdue by 2 days");
    expect(relativeDue(new Date(2026, 10, 21, 18), now).text).toBe("Due today");
    expect(relativeDue(new Date(2026, 10, 22), now).text).toBe("Due tomorrow");
    expect(relativeDue(new Date(2026, 10, 30), now).text).toBe("Due in 9 days");
  });
});

describe("DeadlineList", () => {
  it("sorts soonest first and hides done", () => {
    render(
      <DeadlineList
        now={now}
        items={[
          { id: "1", title: "Lock script", due: new Date(2026, 10, 30) },
          { id: "2", title: "Permits", due: new Date(2026, 10, 19) },
          { id: "3", title: "Done thing", due: new Date(2026, 10, 20), done: true },
        ]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Permits");
    expect(items[0]).toHaveTextContent("Overdue by 2 days");
  });
});
