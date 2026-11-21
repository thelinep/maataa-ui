import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnonymizeButton } from "./AnonymizeButton";

describe("AnonymizeButton", () => {
  it("needs the name typed before anonymizing", async () => {
    const onAnonymize = vi.fn();
    const user = userEvent.setup();
    render(
      <AnonymizeButton
        personName="Asha Rao"
        retainedNote="Hours stay for the accounts."
        onAnonymize={onAnonymize}
      />
    );
    await user.click(screen.getByRole("button", { name: "Anonymize Asha Rao" }));
    expect(screen.getByText("Hours stay for the accounts.")).toBeInTheDocument();
    const confirm = screen.getByRole("button", { name: "Anonymize" });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText(/to confirm/), "Asha Rao");
    await user.click(confirm);
    expect(onAnonymize).toHaveBeenCalled();
  });
});
