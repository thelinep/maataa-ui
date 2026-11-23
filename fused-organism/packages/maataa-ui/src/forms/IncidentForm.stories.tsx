import type { Meta, StoryObj } from "@storybook/react-vite";
import { IncidentForm } from "./IncidentForm";

const meta = {
  title: "Forms/IncidentForm",
  component: IncidentForm,
  tags: ["autodocs"],
} satisfies Meta<typeof IncidentForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: () => {} } };
