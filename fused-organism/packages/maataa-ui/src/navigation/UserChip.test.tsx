import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserChip } from "./UserChip";

describe("UserChip", () => {
  it("is a button named for the account", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<UserChip name="Hemant" subtitle="Producer" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Account: Hemant" });
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
    expect(button).not.toHaveAttribute("aria-expanded");
  });
  it("reflects menu state", () => {
    render(<UserChip name="Hemant" expanded={false} />);
    const button = screen.getByRole("button", { name: "Account: Hemant" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
