import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AIChatBubble,
  AITypingIndicator,
  InteractionModeSwitcher,
  type InteractionMode,
} from "./AssistantUI";

const meta = { title: "AI/AssistantUI", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [m, setM] = useState<InteractionMode>("voice");
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <InteractionModeSwitcher value={m} onChange={setM} />
      <AIChatBubble from="user" time="10:02">
        When is golden hour on the rooftop on 3 December?
      </AIChatBubble>
      <AIChatBubble
        from="assistant"
        name="Sochen"
        time="10:02"
        sources={[{ title: "Sun times, Delhi (computed)" }, { title: "Call sheet, Day 4" }]}
      >
        Golden hour starts at 4:52 pm and sunset is at 5:27 pm. Your call sheet has the rooftop at
        4:30, so you have about 35 minutes of warm light.
      </AIChatBubble>
      <AITypingIndicator name="Sochen" onStop={() => {}} />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
