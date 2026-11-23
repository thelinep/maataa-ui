import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandLogo } from "./BrandLogo";

const meta = {
  title: "Surfaces/BrandLogo",
  component: BrandLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "full", size: 40 } };
export const Mark: Story = { args: { variant: "mark", size: 48 } };
export const Inverse: Story = {
  args: { tone: "inverse", size: 40 },
  globals: {
    backgrounds: {
      value: "dark"
    }
  },
};
