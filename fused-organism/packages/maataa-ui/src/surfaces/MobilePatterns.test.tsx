import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ActionSheet,
  PullToRefresh,
  BackgroundSyncToast,
  PermissionPrompt,
  BiometricUnlock,
} from "./MobilePatterns";

describe("MobilePatterns", () => {
  it("action sheet focuses first action, Escape returns focus", async () => {
    const del = vi.fn();
    function H() {
      const [o, setO] = useState(false);
      return (
        <>
          <button onClick={() => setO(true)}>Shot options</button>
          <ActionSheet
            open={o}
            onClose={() => setO(false)}
            title="Shot 14C"
            actions={[
              { id: "d", label: "Duplicate", onSelect: () => {} },
              { id: "x", label: "Delete shot", destructive: true, onSelect: del },
            ]}
          />
        </>
      );
    }
    render(<H />);
    const opener = screen.getByRole("button", { name: "Shot options" });
    await userEvent.click(opener);
    expect(screen.getByRole("dialog", { name: "Shot 14C" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(opener).toHaveFocus();
  });

  it("pull to refresh always has a button", async () => {
    const refresh = vi.fn().mockResolvedValue(undefined);
    render(
      <PullToRefresh onRefresh={refresh} lastUpdated="Updated 2 min ago">
        <p>list</p>
      </PullToRefresh>
    );
    await userEvent.click(screen.getByRole("button", { name: "↻ Refresh".replace("↻ ", "") }));
    expect(refresh).toHaveBeenCalled();
    expect(await screen.findByText("Up to date.")).toBeInTheDocument();
  });

  it("sync toast, permission prompt and biometric fallback", async () => {
    const verify = vi.fn().mockResolvedValue(false);
    render(
      <>
        <BackgroundSyncToast pending={3} state="offline" noun="timesheets" />
        <PermissionPrompt
          kind="location"
          reason="To stamp recce photos with the place."
          onAllow={() => {}}
          onDecline={() => {}}
          blocked
        />
        <BiometricUnlock verify={verify} onUsePasscode={() => {}} onUnlocked={() => {}} />
      </>
    );
    expect(
      screen.getByText("3 timesheets saved on this device. They’ll upload when you’re back online.")
    ).toBeInTheDocument();
    expect(screen.getByText("It’s turned off for this site.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Unlock with fingerprint" }));
    expect(await screen.findByText("Didn’t match. 2 tries left.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use passcode" })).toBeInTheDocument();
  });
});
