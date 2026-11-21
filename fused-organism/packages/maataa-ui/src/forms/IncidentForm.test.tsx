import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IncidentForm } from "./IncidentForm";

describe("IncidentForm", () => {
  it("leads with emergency advice and needs a follow-up owner", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<IncidentForm onSubmit={onSubmit} />);
    expect(screen.getByText(/call 112/)).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Injury" }));
    expect(screen.getByRole("checkbox", { name: "First aid given" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("When"), { target: { value: "2026-11-24T14:30" } });
    await user.type(
      screen.getByLabelText("What happened"),
      "Grip cut his hand on a C-stand clamp."
    );
    await user.type(screen.getByLabelText("What needs to happen"), "Replace the clamp");
    await user.click(screen.getByRole("button", { name: "Submit report" }));
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("owner and a date");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
