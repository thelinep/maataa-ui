import type { Meta, StoryObj } from "@storybook/react";
import { AssetPreview } from "./AssetPreview";

const meta = {
  title: "Data/AssetPreview",
  component: AssetPreview,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset: {
      id: "1",
      name: "location-still.jpg",
      kind: "image",
      size: 1_200_000,
      meta: "4000 × 3000",
    },
  },
};
export const VideoNoCaptions: Story = {
  args: { asset: { id: "2", name: "teaser.mp4", kind: "video", meta: "4K · 0:45" } },
};
