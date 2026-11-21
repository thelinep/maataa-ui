import type { Meta, StoryObj } from "@storybook/react";
import { RoleAssignmentTable } from "./RoleAssignmentTable";

const meta = {
  title: "Forms/RoleAssignmentTable",
  component: RoleAssignmentTable,
  tags: ["autodocs"],
} satisfies Meta<typeof RoleAssignmentTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {},
    roles: [
      { value: "owner", label: "Owner" },
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Viewer" },
    ],
    members: [
      { id: "1", name: "Hemant", email: "hemant@vesahe.in", role: "owner" },
      { id: "2", name: "Asha Rao", email: "asha@vesahe.in", role: "editor" },
      { id: "3", name: "Ravi Menon", role: "viewer" },
    ],
  },
};
