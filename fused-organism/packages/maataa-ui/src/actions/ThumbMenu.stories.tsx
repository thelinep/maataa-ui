import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ThumbMenu } from "./ThumbMenu";

const meta = {
  title: "Actions/ThumbMenu",
  component: ThumbMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ThumbMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function Phone({ children, said }: { children: React.ReactNode; said: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 420,
        border: "1px solid var(--maataa-color-border-primary, #D4AF9F)",
        borderRadius: 24,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        background: "var(--maataa-color-background-secondary, #FAF6F1)",
      }}
    >
      <p role="status" style={{ alignSelf: "flex-start", margin: 0 }}>
        {said}
      </p>
      {children}
    </div>
  );
}

const actions = (say: (s: string) => void) => [
  { id: "call", label: "New call sheet", icon: "📄", onSelect: () => say("New call sheet") },
  { id: "scan", label: "Scan receipt", icon: "📷", onSelect: () => say("Scan receipt") },
  { id: "note", label: "Voice note", icon: "🎙", onSelect: () => say("Voice note") },
];

/** Up to four actions open as an arc of big round buttons, within reach of the thumb. */
export const Arc: Story = {
  args: { label: "Quick actions", items: [] },
  render: (args) => {
    const [said, setSaid] = useState("Tap the round button.");
    return (
      <Phone said={said}>
        <ThumbMenu {...args} items={actions(setSaid)} fixed={false} storageKey="story-thumb-arc" />
      </Phone>
    );
  },
};

/** Five to seven actions stack up from the button. */
export const Stack: Story = {
  args: { label: "Quick actions", items: [] },
  render: (args) => {
    const [said, setSaid] = useState("Tap the round button.");
    return (
      <Phone said={said}>
        <ThumbMenu
          {...args}
          items={[
            ...actions(setSaid),
            {
              id: "loc",
              label: "Share location",
              icon: "📍",
              onSelect: () => setSaid("Share location"),
            },
            {
              id: "sos",
              label: "Report incident",
              icon: "⚠️",
              danger: true,
              onSelect: () => setSaid("Report incident"),
            },
          ]}
          fixed={false}
          storageKey="story-thumb-stack"
        />
      </Phone>
    );
  },
};

/** Many actions open as a bottom sheet grid. */
export const Sheet: Story = {
  args: { label: "All actions", items: [] },
  render: (args) => {
    const [said, setSaid] = useState("Tap the round button.");
    const labels = [
      "Call sheet",
      "Receipt",
      "Voice note",
      "Location",
      "Incident",
      "Crew",
      "Schedule",
      "Budget",
      "Notes",
    ];
    return (
      <Phone said={said}>
        <ThumbMenu
          {...args}
          items={labels.map((l) => ({ id: l, label: l, icon: "•", onSelect: () => setSaid(l) }))}
          fixed={false}
          showHandSwitch={false}
        />
      </Phone>
    );
  },
};
