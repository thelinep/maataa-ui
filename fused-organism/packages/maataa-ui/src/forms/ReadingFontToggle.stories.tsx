import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReadingFontToggle } from "./ReadingFontToggle";

const meta = {
  title: "Forms/ReadingFontToggle",
  component: ReadingFontToggle,
  tags: ["autodocs"],
} satisfies Meta<typeof ReadingFontToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: "atkinson", onChange: () => {} } };
