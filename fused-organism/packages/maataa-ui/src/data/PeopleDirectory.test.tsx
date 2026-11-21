import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeopleDirectory } from "./PeopleDirectory";

const people = [
  { id: "1", name: "Asha Rao", role: "Editor", department: "Post", city: "Mumbai" },
  { id: "2", name: "Ravi Menon", role: "Sound recordist", department: "Sound", city: "Delhi" },
];

describe("PeopleDirectory", () => {
  it("searches and filters with an announced count", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<PeopleDirectory people={people} onOpen={onOpen} />);
    expect(screen.getByRole("status")).toHaveTextContent("2 people");
    await user.type(screen.getByLabelText("Search"), "delhi");
    expect(screen.getByRole("status")).toHaveTextContent("1 person");
    await user.click(screen.getByRole("button", { name: "Open Ravi Menon" }));
    expect(onOpen).toHaveBeenCalledWith(people[1]);
  });
});
