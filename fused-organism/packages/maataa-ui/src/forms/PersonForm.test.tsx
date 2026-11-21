import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonForm } from "./PersonForm";

describe("PersonForm", () => {
  it("needs a way to reach the person", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<PersonForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Full name"), "Asha Rao");
    await user.type(screen.getByLabelText("Role"), "Editor");
    await user.click(screen.getByRole("button", { name: "Save person" }));
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("Add an email or a phone number");
    await user.type(screen.getByLabelText("Phone"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Save person" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Asha Rao", phone: "+91 98765 43210" })
    );
  });
});
