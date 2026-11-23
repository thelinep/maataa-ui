import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountSettingsForm } from "./AccountSettingsForm";

const meta = {
  title: "Forms/AccountSettingsForm",
  component: AccountSettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof AccountSettingsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSave: () => {},
    savedMessage: "Saved",
    initial: {
      name: "Hemant",
      creditName: "Pandit Hemant Kumar Dixit (PHKD)",
      email: "hemant@vesahe.in",
      phone: "+91 98xxxxxx10",
      language: "hi",
      timeZone: "Asia/Kolkata",
      notify: { email: true, sms: true, whatsapp: true, digest: "weekly" },
    },
  },
};
