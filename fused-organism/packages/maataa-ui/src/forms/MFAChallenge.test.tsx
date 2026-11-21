import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MFAChallenge } from "./MFAChallenge";

describe("MFAChallenge", () => {
  it("accepts a pasted code with spaces", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<MFAChallenge onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Verification code");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    await user.type(input, "123 456");
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(onSubmit).toHaveBeenCalledWith("123456", "totp");
  });
  it("switches to recovery codes and validates", async () => {
    const user = userEvent.setup();
    render(<MFAChallenge onSubmit={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Use a recovery code instead" }));
    expect(screen.getByLabelText("Recovery code")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(screen.getByRole("alert")).toHaveTextContent("recovery codes");
  });
});
