import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CallSheetPublishBar } from "./CallSheetPublishBar";

describe("CallSheetPublishBar", () => {
  it("blocks publishing with reasons", () => {
    render(
      <CallSheetPublishBar
        state="draft"
        version={1}
        recipientCount={18}
        onPublish={() => {}}
        onWithdraw={() => {}}
        onReissue={() => {}}
        blockers={["No hospital listed"]}
      />
    );
    const b = screen.getByRole("button", { name: "Publish and send" });
    expect(b).toBeDisabled();
    expect(b).toHaveAccessibleDescription("No hospital listed");
  });
  it("withdraw needs a message", async () => {
    const onWithdraw = vi.fn();
    const user = userEvent.setup();
    render(
      <CallSheetPublishBar
        state="published"
        version={2}
        recipientCount={18}
        onPublish={() => {}}
        onWithdraw={onWithdraw}
        onReissue={() => {}}
      />
    );
    await user.click(screen.getByRole("button", { name: "Withdraw" }));
    await user.click(screen.getByRole("button", { name: "Withdraw and notify" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Tell the crew why");
    await user.type(screen.getByLabelText("Message to the crew"), "Rain, shoot moved to Thursday");
    await user.click(screen.getByRole("button", { name: "Withdraw and notify" }));
    expect(onWithdraw).toHaveBeenCalledWith("Rain, shoot moved to Thursday");
  });
});
