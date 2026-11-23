import type { Meta, StoryObj } from "@storybook/react-vite";
import { OfferLetterPreview } from "./OfferLetterPreview";

const meta = {
  title: "Data/OfferLetterPreview",
  component: OfferLetterPreview,
  tags: ["autodocs"],
} satisfies Meta<typeof OfferLetterPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    template:
      "Dear {{name}},\n\nVesahe Film Solutions is pleased to offer you the role of {{role}} on {{production}}, at {{fee}} per shoot day, for {{days}} days between {{start}} and {{end}}.\n\nPlease reply by {{replyBy}}.\n\nWarm regards,\nPandit Hemant Kumar Dixit\nProducer",
    values: {
      name: "Asha Rao",
      role: "Meera (lead)",
      production: "Monsoon Diaries",
      fee: "₹25,000",
      days: "14",
      start: "6 Jan 2027",
    },
  },
};
