import type { Meta, StoryObj } from "@storybook/react";
import { AccountTypeSelector, RoleSelectionGrid } from "./ChoiceCards";

const meta = {
  title: "Forms/AccountTypeSelector",
  component: AccountTypeSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof AccountTypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: "company", onChange: () => {} } };
export const Roles: Story = {
  args: Default.args,
  render: () => <RoleSelectionGrid value={["producer", "director"]} onChange={() => {}} />,
};
