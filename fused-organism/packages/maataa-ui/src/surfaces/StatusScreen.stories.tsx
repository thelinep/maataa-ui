import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusScreen, PermissionDeniedScreen, SessionExpiredScreen } from "./StatusScreen";
import { Button } from "../primitives/Button";

const meta = {
  title: "Surfaces/StatusScreen",
  component: StatusScreen,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Budget sent for approval",
    message: "Asha will get an email. You can keep editing other sections.",
    icon: "📨",
    actions: <Button>Back to budget</Button>,
    focusOnMount: false,
  },
};
export const PermissionDenied: Story = {
  args: Default.args,
  render: () => (
    <PermissionDeniedScreen focusOnMount={false} actions={<Button>Go to projects</Button>} />
  ),
};
export const SessionExpired: Story = {
  args: Default.args,
  render: () => <SessionExpiredScreen focusOnMount={false} actions={<Button>Sign in</Button>} />,
};
