import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InviteForm, parseEmails } from "./InviteForm";

describe("parseEmails", () => {
  it("splits and de-duplicates", () => {
    expect(parseEmails("A@x.in, b@x.in\na@x.in; c@x.in")).toEqual(["a@x.in", "b@x.in", "c@x.in"]);
  });
});

describe("InviteForm", () => {
  it("lists problems by address, then invites", async () => {
    const onInvite = vi.fn();
    const user = userEvent.setup();
    render(
      <InviteForm
        roles={[{ value: "editor", label: "Editor" }]}
        existing={["asha@x.in"]}
        onInvite={onInvite}
      />
    );
    const box = screen.getByLabelText("Email addresses");
    await user.type(box, "ravi@, asha@x.in");
    await user.click(screen.getByRole("button", { name: "Send invitations" }));
    expect(screen.getByRole("alert")).toHaveTextContent("ravi@ isn't a valid email address");
    expect(screen.getByRole("alert")).toHaveTextContent("asha@x.in is already on the team");
    expect(onInvite).not.toHaveBeenCalled();
    await user.clear(box);
    await user.type(box, "meera@x.in");
    await user.click(screen.getByRole("button", { name: "Send invitations" }));
    expect(onInvite).toHaveBeenCalledWith(["meera@x.in"], "editor", "");
  });
});
