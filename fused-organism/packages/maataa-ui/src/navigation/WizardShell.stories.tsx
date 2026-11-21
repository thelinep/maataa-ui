import type { Meta, StoryObj } from "@storybook/react";
import { WizardShell } from "./WizardShell";
import { AccountTypeSelector } from "../forms/ChoiceCards";

const meta = {
  title: "Navigation/WizardShell",
  component: WizardShell,
  tags: ["autodocs"],
} satisfies Meta<typeof WizardShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Set up your workspace",
    steps: [
      { id: "type", label: "Account type" },
      { id: "roles", label: "Your roles" },
      { id: "device", label: "Your device", optional: true },
      { id: "review", label: "Review" },
    ],
    current: 0,
    onBack: () => {},
    onNext: () => {},
    onSkip: () => {},
    onSaveForLater: () => {},
    children: <AccountTypeSelector value="company" onChange={() => {}} />,
  },
};
