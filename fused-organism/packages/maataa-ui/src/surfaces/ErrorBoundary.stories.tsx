import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorFallback } from "./ErrorBoundary";

const meta = {
  title: "Surfaces/ErrorFallback",
  component: ErrorFallback,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error("Cannot read properties of undefined (reading 'lines')"),
    reset: () => {},
    region: "Budget",
  },
};
