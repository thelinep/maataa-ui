import type { Meta, StoryObj } from "@storybook/react";
import { MarketingCampaignCard, MarketingAssetLibrary } from "./MarketingViews";

const meta = {
  title: "Data/MarketingCampaignCard",
  component: MarketingCampaignCard,
  tags: ["autodocs"],
} satisfies Meta<typeof MarketingCampaignCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    campaign: {
      id: "1",
      name: "Trailer launch",
      goal: "Awareness before festival run",
      channels: ["YouTube", "Instagram", "Press"],
      start: new Date(2026, 10, 1),
      end: new Date(2026, 10, 30),
      budget: 500000,
      spent: 410000,
      status: "published",
      result: { label: "Trailer views", value: "1.2 M" },
    },
  },
};
export const AssetLibrary: Story = {
  args: Default.args,
  render: () => (
    <MarketingAssetLibrary
      onOpen={() => {}}
      now={new Date(2026, 10, 21)}
      assets={[
        {
          id: "1",
          name: "poster-final.jpg",
          kind: "image",
          type: "Poster",
          approvedFor: ["Instagram", "Press"],
        },
        { id: "2", name: "teaser.mp4", kind: "video", type: "Trailer", approvedFor: ["YouTube"] },
        {
          id: "3",
          name: "bts-still.jpg",
          kind: "image",
          type: "Still",
          approvedFor: ["Press"],
          rightsUntil: new Date(2025, 0, 1),
        },
      ]}
    />
  ),
};
