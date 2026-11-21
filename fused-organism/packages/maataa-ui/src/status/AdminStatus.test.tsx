import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LastOwnerWarning, ScreenReaderModeIndicator, SyncOpsDashboard } from "./AdminStatus";

describe("LastOwnerWarning", () => {
  it("explains the block", () => {
    render(<LastOwnerWarning workspace="Vesahe Films" action="leave" onAddOwner={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You can’t leave until someone else is an owner"
    );
  });
});

describe("ScreenReaderModeIndicator", () => {
  it("is a switch with its state", async () => {
    const onToggle = vi.fn();
    render(<ScreenReaderModeIndicator on={false} onToggle={onToggle} />);
    const sw = screen.getByRole("switch", { name: /Screen reader mode/ });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.setup().click(sw);
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});

describe("SyncOpsDashboard", () => {
  it("totals and retries per device", async () => {
    const onRetryFailed = vi.fn();
    const now = new Date(2026, 10, 21, 12);
    render(
      <SyncOpsDashboard
        now={now}
        conflicts={2}
        onRetryFailed={onRetryFailed}
        onOpenConflicts={() => {}}
        devices={[
          {
            id: "a",
            name: "MacBook",
            lastSync: new Date(2026, 10, 21, 11, 50),
            pending: 3,
            failed: 1,
            online: true,
          },
        ]}
      />
    );
    expect(screen.getByText("10 min ago")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resolve 2 conflicts" })).toBeInTheDocument();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Retry failed changes on MacBook" }));
    expect(onRetryFailed).toHaveBeenCalledWith("a");
  });
});
