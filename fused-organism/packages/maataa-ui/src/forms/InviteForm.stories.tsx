import type { Meta, StoryObj } from "@storybook/react-vite";
import { InviteForm } from "./InviteForm";

const meta = {
  title: "Forms/InviteForm",
  component: InviteForm,
  tags: ["autodocs"],
} satisfies Meta<typeof InviteForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roles: [
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Viewer" },
    ],
    onInvite: () => {},
    existing: ["asha@vesahe.in"],
  },
};
