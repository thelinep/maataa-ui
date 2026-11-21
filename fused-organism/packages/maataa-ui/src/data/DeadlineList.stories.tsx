import type { Meta, StoryObj } from "@storybook/react";
import { DeadlineList } from "./DeadlineList";

const meta = {
  title: "Data/DeadlineList",
  component: DeadlineList,
  tags: ["autodocs"],
} satisfies Meta<typeof DeadlineList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Shoot permit renewal",
        due: new Date(Date.now() - 2 * 86_400_000),
        context: "Monsoon Diaries",
      },
      { id: "2", title: "Lock script v4", due: new Date(), context: "Kabir Nagar Nights" },
      {
        id: "3",
        title: "Festival submission",
        due: new Date(Date.now() + 9 * 86_400_000),
        context: "Dev's Song",
      },
    ],
  },
};
