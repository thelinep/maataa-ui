import type { Meta, StoryObj } from "@storybook/react-vite";
import { PersonForm } from "./PersonForm";

const meta = {
  title: "Forms/PersonForm",
  component: PersonForm,
  tags: ["autodocs"],
} satisfies Meta<typeof PersonForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: () => {}, onCancel: () => {}, initial: { name: "Asha Rao", role: "Editor" } },
};
