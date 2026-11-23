import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecordHeader } from "./RecordHeader";

const meta = {
  title: "Data/RecordHeader",
  component: RecordHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof RecordHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Monsoon Diaries",
    subtitle: "Feature film · Hindi · Mumbai",
    status: "Filming",
    statusVariant: "info",
    back: { label: "Projects", href: "#" },
    facts: [
      { label: "Budget", value: "₹48 L" },
      { label: "Shoot days", value: "12 of 18" },
      { label: "Director", value: "PHKD" },
    ],
  },
};
