import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProviderSignInButtons } from "./ProviderSignInButtons";

const meta = {
  title: "Actions/ProviderSignInButtons",
  component: ProviderSignInButtons,
  tags: ["autodocs"],
} satisfies Meta<typeof ProviderSignInButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    providers: [
      { id: "google", name: "Google" },
      { id: "apple", name: "Apple" },
      { id: "microsoft", name: "Microsoft" },
    ],
    onSelect: () => {},
  },
};
