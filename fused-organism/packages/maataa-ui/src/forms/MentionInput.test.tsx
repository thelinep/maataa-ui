import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { MentionInput, mentionedIn, type Mentionable } from "./MentionInput";

const people: Mentionable[] = [
  { id: "1", name: "Asha Verma", detail: "Director" },
  { id: "2", name: "Arjun Rao", detail: "DOP" },
  { id: "3", name: "Meera Iyer", detail: "Editor" },
];

describe("MentionInput", () => {
  it("suggests people after @ and inserts the chosen one", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("");
      return <MentionInput label="Note" value={v} onChange={(t) => setV(t)} people={people} />;
    }
    render(<H />);
    const box = screen.getByRole("textbox", { name: "Note" });
    await user.type(box, "Thanks @a");
    expect(box).toHaveAttribute("aria-controls");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.type(box, "r");
    expect(screen.getByRole("status")).toHaveTextContent("1 person found");
    await user.keyboard("{Enter}");
    expect(box).toHaveValue("Thanks @Arjun Rao ");
    expect(screen.getByText("Will notify: Arjun Rao")).toBeInTheDocument();
    expect(mentionedIn("hi @Meera Iyer", people)).toEqual(["3"]);
  });
});
