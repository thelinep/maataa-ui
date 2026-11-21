import type { Meta, StoryObj } from "@storybook/react";
import { OfflineBanner } from "./OfflineBanner";

const meta = {
  title: "Status/OfflineBanner",
  component: OfflineBanner,
  tags: ["autodocs"],
} satisfies Meta<typeof OfflineBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { online: false, pendingCount: 3 } };
