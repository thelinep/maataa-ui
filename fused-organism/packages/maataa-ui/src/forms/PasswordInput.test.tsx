import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { PasswordInput, defaultPasswordRules } from "./PasswordInput";

function H() {
  const [v, setV] = useState("");
  return (
    <PasswordInput label="New password" value={v} onChange={setV} rules={defaultPasswordRules} />
  );
}

describe("PasswordInput", () => {
  it("toggles visibility and reports rules in words", async () => {
    const user = userEvent.setup();
    render(<H />);
    const input = screen.getByLabelText("New password");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveFocus();
    await user.type(input, "a long passphrase");
    expect(screen.getByText(/At least 12 characters/)).toHaveTextContent(", met");
  });
});
