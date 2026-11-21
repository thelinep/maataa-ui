import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";

describe("BookingForm", () => {
  it("needs dates and shows the estimate", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const next = new Date();
    next.setMonth(next.getMonth() + 1, 1);
    render(
      <BookingForm
        subject="ARRI kit"
        booked={[]}
        dayRate={28000}
        withQuantity
        onSubmit={onSubmit}
        initialMonth={next}
      />
    );
    await user.click(screen.getByRole("button", { name: "Request booking" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Choose the dates first");
    const days = screen
      .getAllByRole("button")
      .filter((b) => /, available$/.test(b.getAttribute("aria-label") ?? ""));
    await user.click(days[2]);
    await user.click(days[3]);
    expect(
      screen
        .getAllByRole("status")
        .some((s) => /Estimate: 2 days × 1 × ₹28,000 = ₹56,000/.test(s.textContent ?? ""))
    ).toBe(true);
    await user.type(screen.getByLabelText(/What it/), "Scenes 12–14");
    await user.click(screen.getByRole("button", { name: "Request booking" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1, purpose: "Scenes 12–14" })
    );
  });
});
