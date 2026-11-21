import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScreeningFeedbackForm } from "./ScreeningFeedbackForm";

describe("ScreeningFeedbackForm", () => {
  it("needs only an overall rating, anonymous by default", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ScreeningFeedbackForm film="Monsoon Diaries" onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Send feedback" }));
    expect(screen.getByRole("alert")).toHaveTextContent("overall rating");
    await user.click(screen.getAllByRole("radio", { name: "4 · Very good" })[0]);
    await user.click(screen.getByRole("button", { name: "Send feedback" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ overall: 4, anonymous: true }));
  });
});
