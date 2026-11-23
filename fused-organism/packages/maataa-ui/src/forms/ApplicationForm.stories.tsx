import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationForm } from "./ApplicationForm";

const meta = {
  title: "Forms/ApplicationForm",
  component: ApplicationForm,
  tags: ["autodocs"],
} satisfies Meta<typeof ApplicationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    productionTitle: "Monsoon Diaries",
    roles: ["Editor", "Gaffer"],
    onSubmit: () => {},
    onCancel: () => {},
  },
};
