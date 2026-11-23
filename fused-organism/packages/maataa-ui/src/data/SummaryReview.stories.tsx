import type { Meta, StoryObj } from "@storybook/react-vite";
import { SummaryReview } from "./SummaryReview";

const meta = {
  title: "Data/SummaryReview",
  component: SummaryReview,
  tags: ["autodocs"],
} satisfies Meta<typeof SummaryReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: [
      {
        id: "type",
        title: "Account type",
        rows: [
          { label: "Type", value: "Company" },
          { label: "Name", value: "Vesahe Film Solutions" },
        ],
        onEdit: () => {},
      },
      {
        id: "loc",
        title: "Location",
        rows: [
          { label: "State", value: "Delhi" },
          { label: "District", value: "Shahdara" },
          { label: "GSTIN", value: "" },
        ],
        onEdit: () => {},
      },
    ],
  },
};
