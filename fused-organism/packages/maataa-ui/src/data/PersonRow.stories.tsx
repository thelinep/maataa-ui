import type { Meta, StoryObj } from "@storybook/react";
import { PersonRow } from "./PersonRow";

const meta = {
  title: "Data/PersonRow",
  component: PersonRow,
  tags: ["autodocs"],
} satisfies Meta<typeof PersonRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Asha Rao",
    subtitle: "Editor",
    status: "Confirmed",
    statusVariant: "success",
    presence: "online",
  },
};
