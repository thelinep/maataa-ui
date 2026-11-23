import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  ActionSheet,
  PullToRefresh,
  BackgroundSyncToast,
  PermissionPrompt,
  BiometricUnlock,
} from "./MobilePatterns";

const meta = { title: "Surfaces/MobilePatterns", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const noop = () => {};

function SheetDemo() {
  const [o, setO] = useState(false);
  return (
    <>
      <button
        onClick={() => setO(true)}
        style={{ minHeight: 44, padding: "0 16px", font: "inherit" }}
      >
        Shot options
      </button>
      <ActionSheet
        open={o}
        onClose={() => setO(false)}
        title="Shot 14C"
        message="Ext. rooftop, take 3"
        actions={[
          { id: "d", label: "Duplicate", onSelect: noop },
          { id: "m", label: "Move to day 5", onSelect: noop },
          { id: "x", label: "Delete shot", destructive: true, onSelect: noop },
        ]}
      />
    </>
  );
}

export const Patterns: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <SheetDemo />
      <PullToRefresh onRefresh={async () => {}} lastUpdated="Updated 2 min ago">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Scene 14C — shot</li>
          <li>Scene 15 — next</li>
        </ul>
      </PullToRefresh>
      <BackgroundSyncToast pending={3} state="offline" noun="timesheets" />
      <BackgroundSyncToast pending={2} state="failed" noun="photos" onRetry={noop} />
      <PermissionPrompt
        kind="location"
        reason="To stamp recce photos with where they were taken."
        onAllow={noop}
        onDecline={noop}
      />
      <BiometricUnlock verify={async () => false} onUsePasscode={noop} onUnlocked={noop} />
    </div>
  ),
};
