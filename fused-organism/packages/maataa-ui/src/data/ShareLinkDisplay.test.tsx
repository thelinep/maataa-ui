import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareLinkDisplay } from "./ShareLinkDisplay";

describe("ShareLinkDisplay", () => {
  it("labels the link, describes access and copies", async () => {
    const onRevoke = vi.fn();
    const user = userEvent.setup();
    render(
      <ShareLinkDisplay
        url="https://maataa.in/cs/abc"
        what="call sheet"
        audience="Cast and crew on this call sheet"
        onRevoke={onRevoke}
      />
    );
    expect(screen.getByLabelText("Link to the call sheet")).toHaveAccessibleDescription(
      /Cast and crew/
    );
    await user.click(screen.getByRole("button", { name: "Copy call sheet link" }));
    await expect(navigator.clipboard.readText()).resolves.toBe("https://maataa.in/cs/abc");
    await user.click(screen.getByRole("button", { name: "Turn off this link" }));
    expect(onRevoke).toHaveBeenCalled();
  });
});
