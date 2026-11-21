import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuickActionPanel } from "./QuickActionPanel";

describe("QuickActionPanel", () => {
  it("runs actions and explains disabled ones", async () => {
    const onSelect = vi.fn();
    render(
      <QuickActionPanel
        actions={[
          { id: "a", label: "New call sheet", onSelect },
          {
            id: "b",
            label: "Approve budget",
            onSelect: () => {},
            disabled: true,
            disabledReason: "Nothing waiting",
          },
        ]}
      />
    );
    expect(screen.getByRole("region", { name: "Quick actions" })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: /New call sheet/ }));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Approve budget.*Nothing waiting/ })).toBeDisabled();
  });
});
