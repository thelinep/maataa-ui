import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NetworkingContactList, PrivateNotes } from "./NetworkingViews";

describe("NetworkingContactList", () => {
  it("shows consent and flags withdrawn contacts", async () => {
    render(
      <NetworkingContactList
        onOpen={() => {}}
        contacts={[
          { id: "1", name: "Zoya", role: "Producer", consent: "withdrawn" },
          {
            id: "2",
            name: "Asha",
            role: "Editor",
            company: "Cutroom",
            consent: "given",
            tags: ["post"],
          },
        ]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Asha");
    expect(items[1]).toHaveTextContent("Anonymise this contact");
    await userEvent.setup().type(screen.getByLabelText("Search contacts"), "post");
    expect(screen.getByRole("status")).toHaveTextContent("1 contact");
  });
});

describe("PrivateNotes", () => {
  it("is labelled private and adds notes", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<PrivateNotes about="Asha" notes={[]} onAdd={onAdd} />);
    expect(screen.getByRole("region", { name: "Private notes about Asha" })).toHaveTextContent(
      "Asha never does"
    );
    await user.type(screen.getByLabelText("Add a note"), "Prefers WhatsApp");
    await user.click(screen.getByRole("button", { name: "Save note" }));
    expect(onAdd).toHaveBeenCalledWith("Prefers WhatsApp");
  });
});
