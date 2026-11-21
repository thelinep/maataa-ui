import type { Meta, StoryObj } from "@storybook/react";
import { CallbackList } from "./CallbackList";

const meta = {
  title: "Data/CallbackList",
  component: CallbackList,
  tags: ["autodocs"],
} satisfies Meta<typeof CallbackList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    callbacks: [
      {
        id: "1",
        name: "Asha Rao",
        role: "Meera (lead)",
        at: new Date(2026, 10, 24, 10),
        material: "Scene 12 with Ravi",
        status: "confirmed",
      },
      {
        id: "2",
        name: "Meera Iyer",
        role: "Meera (lead)",
        at: new Date(2026, 10, 24, 11),
        material: "Scene 12",
        status: "invited",
      },
      {
        id: "3",
        name: "Ravi Menon",
        role: "Arjun",
        at: new Date(2026, 10, 24, 12),
        status: "rescheduling",
      },
    ],
  },
};
