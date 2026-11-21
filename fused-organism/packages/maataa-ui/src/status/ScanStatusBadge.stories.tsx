import type { Meta, StoryObj } from "@storybook/react";
import { ScanStatusBadge } from "./ScanStatusBadge";

const meta = {
  title: "Status/ScanStatusBadge",
  component: ScanStatusBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof ScanStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { status: "clean" } };
export const Quarantined: Story = { args: { status: "quarantined" } };
export const Scanning: Story = { args: { status: "scanning" } };
