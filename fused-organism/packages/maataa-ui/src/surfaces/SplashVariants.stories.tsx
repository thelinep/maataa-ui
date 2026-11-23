import type { Meta, StoryObj } from "@storybook/react-vite";
import { ParticleSplash, GlassSplash, CameraScienceSplash } from "./SplashVariants";

const meta = { title: "Surfaces/SplashVariants", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const noop = () => {};

export const Particles: Story = {
  render: () => <ParticleSplash onDone={noop} duration={600000} contained />,
};
export const Glass: Story = {
  render: () => <GlassSplash onDone={noop} duration={600000} contained reducedMotion />,
};
export const CameraScience: Story = {
  render: () => <CameraScienceSplash onDone={noop} duration={600000} contained reducedMotion />,
};
