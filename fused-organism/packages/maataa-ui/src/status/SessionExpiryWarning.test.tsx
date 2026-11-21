import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionExpiryWarning } from "./SessionExpiryWarning";

describe("SessionExpiryWarning", () => {
  it("stays closed until the warning window", () => {
    render(
      <SessionExpiryWarning
        expiresAt={new Date(1_000_000 + 600_000)}
        now={() => 1_000_000}
        onExtend={() => {}}
        onSignOut={() => {}}
      />
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("opens with Stay signed in focused", async () => {
    const onExtend = vi.fn();
    render(
      <SessionExpiryWarning
        expiresAt={new Date(1_000_000 + 90_000)}
        now={() => 1_000_000}
        onExtend={onExtend}
        onSignOut={() => {}}
      />
    );
    expect(screen.getByRole("dialog")).toHaveTextContent("2 minutes");
    const stay = screen.getByRole("button", { name: "Stay signed in" });
    expect(stay).toHaveFocus();
    await userEvent.setup().click(stay);
    expect(onExtend).toHaveBeenCalled();
  });
});
