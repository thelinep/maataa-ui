import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionExpiryWarning } from "./SessionExpiryWarning";

const meta = {
  title: "Status/SessionExpiryWarning",
  component: SessionExpiryWarning,
  tags: ["autodocs"],
} satisfies Meta<typeof SessionExpiryWarning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { expiresAt: new Date(Date.now() + 90_000), onExtend: () => {}, onSignOut: () => {} },
};
