import type { Meta, StoryObj } from "@storybook/react-vite";
import { RetryCountdown } from "./RetryCountdown";

const meta = {
  title: "Status/RetryCountdown",
  component: RetryCountdown,
  tags: ["autodocs"],
} satisfies Meta<typeof RetryCountdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { message: "Couldn’t load the call sheet.", seconds: 15, onRetry: () => {} },
};
