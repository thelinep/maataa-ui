import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPaletteStrip } from "./ColorPaletteStrip";

const meta = {
  title: "Whiteboard/ColorPaletteStrip",
  component: ColorPaletteStrip,
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPaletteStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Monsoon Diaries palette",
    colors: [
      { name: "Monsoon slate", hex: "#2F3E46", usage: "Night exteriors" },
      { name: "Turmeric", hex: "#E3A72F", usage: "Meera’s kitchen" },
      { name: "Clay", hex: "#806641", usage: "Interiors" },
      { name: "Rain grey", hex: "#C7CCCF" },
    ],
  },
};
