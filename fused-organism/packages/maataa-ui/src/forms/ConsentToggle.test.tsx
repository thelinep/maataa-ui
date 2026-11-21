import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsentToggle } from "./ConsentToggle";

describe("ConsentToggle", () => {
  it("is a named switch with its state and date", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ConsentToggle
        label="Use my photo"
        description="Shown on call sheets"
        linkedAccount="Google Drive"
        granted
        consentedAt={new Date("2026-11-01")}
        onChange={onChange}
      />
    );
    const sw = screen.getByRole("switch", { name: "Use my photo" });
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(sw).toHaveAccessibleDescription(/Shown on call sheets.*Google Drive.*Given on/);
    await user.click(sw);
    expect(onChange).toHaveBeenCalledWith(false);
  });
  it("cannot change when locked", () => {
    render(<ConsentToggle label="Contract terms" granted locked onChange={() => {}} />);
    expect(screen.getByRole("switch", { name: "Contract terms" })).toBeDisabled();
  });
});
