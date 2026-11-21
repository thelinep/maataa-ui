import type { Meta, StoryObj } from "@storybook/react";
import { PitchDeliveryReceipt, PitchRecipientSelector } from "./PitchViews";

const meta = {
  title: "Data/PitchDeliveryReceipt",
  component: PitchDeliveryReceipt,
  tags: ["autodocs"],
} satisfies Meta<typeof PitchDeliveryReceipt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    deck: "Monsoon Diaries pitch v3",
    recipient: "Ravi (Netflix)",
    sentAt: new Date(2026, 10, 20, 10),
    openedAt: new Date(2026, 10, 20, 15, 12),
    downloaded: true,
    slideTitles: ["Logline", "Why now", "Team", "Budget", "Comparables"],
    slideSeconds: [42, 65, 30, 118, 0],
  },
};
export const Recipients: Story = {
  args: Default.args,
  render: () => (
    <PitchRecipientSelector
      value={["1"]}
      onChange={() => {}}
      contacts={[
        { id: "1", name: "Ravi", company: "Netflix India", kind: "Streaming" },
        {
          id: "2",
          name: "Meera",
          company: "Studio X",
          kind: "Studio",
          lastPitched: new Date(Date.now() - 6 * 86_400_000),
        },
        { id: "3", name: "Zoya", company: "Angel network", kind: "Investor", optedOut: true },
      ]}
    />
  ),
};
