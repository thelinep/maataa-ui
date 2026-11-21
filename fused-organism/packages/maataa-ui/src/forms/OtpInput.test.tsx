import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { OtpInput } from "./OtpInput";

describe("OtpInput", () => {
  it("is one field with one-time-code autofill, strips separators and completes", async () => {
    const user = userEvent.setup();
    const done = vi.fn();
    function H() {
      const [v, setV] = useState("");
      return <OtpInput value={v} onChange={setV} onComplete={done} />;
    }
    render(<H />);
    const input = screen.getByLabelText("Verification code");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    await user.click(input);
    await user.paste("123-4");
    expect(input).toHaveAccessibleDescription(/4 of 6 digits/);
    await user.type(input, "56");
    expect(done).toHaveBeenCalledWith("123456");
  });

  it("offers a resend after the cooldown", async () => {
    vi.useFakeTimers();
    const resend = vi.fn();
    render(<OtpInput value="" onChange={() => {}} onResend={resend} resendAfterSeconds={2} />);
    expect(screen.getByRole("button", { name: "Send a new code in 2 s" })).toBeDisabled();
    await vi.advanceTimersByTimeAsync(2100);
    expect(screen.getByRole("button", { name: "Send a new code" })).toBeEnabled();
    vi.useRealTimers();
  });
});
