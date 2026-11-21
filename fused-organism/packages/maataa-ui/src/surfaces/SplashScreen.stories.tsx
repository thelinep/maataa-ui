import type { Meta, StoryObj } from "@storybook/react";
import { SplashScreen } from "./SplashScreen";

const meta = {
  title: "Surfaces/SplashScreen",
  component: SplashScreen,
  tags: ["autodocs"],
} satisfies Meta<typeof SplashScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onDone: () => {}, duration: 6000 } };
export const ReducedMotion: Story = { args: { onDone: () => {}, reducedMotion: true } };
