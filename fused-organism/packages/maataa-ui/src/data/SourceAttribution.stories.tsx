import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceAttribution } from "./SourceAttribution";

const meta = {
  title: "Data/SourceAttribution",
  component: SourceAttribution,
  tags: ["autodocs"],
} satisfies Meta<typeof SourceAttribution>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Indian M&E report",
    publisher: "FICCI-EY",
    url: "https://www.ey.com/en_in",
    accessedAt: new Date("2026-10-01"),
  },
};
export const Stale: Story = {
  args: { title: "Box office survey", accessedAt: new Date("2024-06-01") },
};
