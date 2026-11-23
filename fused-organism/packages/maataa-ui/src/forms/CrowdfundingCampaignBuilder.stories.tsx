import type { Meta, StoryObj } from "@storybook/react-vite";
import { CrowdfundingCampaignBuilder } from "./CrowdfundingCampaignBuilder";

const meta = {
  title: "Forms/CrowdfundingCampaignBuilder",
  component: CrowdfundingCampaignBuilder,
  tags: ["autodocs"],
} satisfies Meta<typeof CrowdfundingCampaignBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {},
    onSubmitForReview: () => {},
    value: {
      title: "Finish Monsoon Diaries",
      goal: 1500000,
      start: "2027-01-01",
      end: "2027-01-31",
      story: "We shot Monsoon Diaries over 18 rain-soaked days in Mumbai with a crew of 30.",
      useOfFunds: "Sound mix, colour grade and festival DCPs",
      tiers: [
        {
          id: "t1",
          title: "Thank-you credit",
          amount: 500,
          description: "Your name in the end credits",
        },
        {
          id: "t2",
          title: "Premiere ticket",
          amount: 5000,
          description: "Two seats at the Mumbai premiere",
          limit: 100,
        },
      ],
    },
  },
};
