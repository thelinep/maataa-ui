import type { Meta, StoryObj } from "@storybook/react";
import { DeviceInfoCard } from "./DeviceInfoCard";

const meta = {
  title: "Data/DeviceInfoCard",
  component: DeviceInfoCard,
  tags: ["autodocs"],
} satisfies Meta<typeof DeviceInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onUse: () => {} } };
