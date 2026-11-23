import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlotPicker } from "./SlotPicker";

const meta = {
  title: "Forms/SlotPicker",
  component: SlotPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof SlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: "Choose an audition slot",
    value: "b",
    onChange: () => {},
    slots: [
      {
        id: "a",
        start: new Date(2026, 10, 24, 10),
        end: new Date(2026, 10, 24, 10, 30),
        taken: true,
      },
      { id: "b", start: new Date(2026, 10, 24, 10, 30), end: new Date(2026, 10, 24, 11) },
      { id: "c", start: new Date(2026, 10, 24, 11), end: new Date(2026, 10, 24, 11, 30) },
      { id: "d", start: new Date(2026, 10, 25, 15), end: new Date(2026, 10, 25, 15, 30) },
    ],
  },
};
