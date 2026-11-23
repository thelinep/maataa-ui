import type { Meta, StoryObj } from "@storybook/react-vite";
import { DurationPicker } from "./DurationPicker";

const meta = {
  title: "Forms/DurationPicker",
  component: DurationPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof DurationPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Scene length",
    value: 95,
    onChange: () => {},
    helperText: "Screen time, not shoot time",
  },
};
