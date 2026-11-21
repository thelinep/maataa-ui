import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountSettingsForm, type AccountSettings } from "./AccountSettingsForm";

const initial: AccountSettings = {
  name: "Hemant",
  creditName: "PHKD",
  email: "hemant@vesahe.in",
  phone: "",
  language: "hi",
  timeZone: "Asia/Kolkata",
  notify: { email: true, sms: false, whatsapp: true, digest: "weekly" },
};

describe("AccountSettingsForm", () => {
  it("saves only when changed and explains email verification", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<AccountSettingsForm initial={initial} onSave={onSave} />);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    const email = screen.getByLabelText("Email");
    await user.clear(email);
    await user.type(email, "phkd@vesahe.in");
    expect(email).toHaveAccessibleDescription(/send a link to the new address/);
    await user.click(screen.getByRole("checkbox", { name: /SMS/ }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "phkd@vesahe.in",
        notify: expect.objectContaining({ sms: true }),
      })
    );
  });
});
