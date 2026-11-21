import type { Meta, StoryObj } from "@storybook/react";
import { PinSelector } from "./PinSelector";

const meta = {
  title: "Forms/PinSelector",
  component: PinSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof PinSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: "Locations for Day 4",
    multiple: true,
    value: ["a"],
    onChange: () => {},
    onAddPin: () => {},
    places: [
      { id: "a", label: "Juhu beach", lat: 19.0988, lng: 72.8267 },
      { id: "b", label: "Film City gate 2", lat: 19.1627, lng: 72.8724 },
      { id: "c", label: "Bandra bungalow", lat: 19.0596, lng: 72.8295 },
    ],
  },
};
