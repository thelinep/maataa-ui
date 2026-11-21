import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JobPostingForm } from "./JobPostingForm";

describe("JobPostingForm", () => {
  it("requires pay and checks dates", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<JobPostingForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Role title"), "Gaffer");
    await user.type(
      screen.getByLabelText("What the role involves"),
      "Lead the lighting team for a 12-day indie shoot."
    );
    fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2027-01-10" } });
    fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2027-01-01" } });
    await user.click(screen.getByRole("button", { name: "Save opening" }));
    const summary = screen.getAllByRole("alert")[0];
    expect(summary).toHaveTextContent("State the pay");
    expect(summary).toHaveTextContent("End date is before the start date");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
