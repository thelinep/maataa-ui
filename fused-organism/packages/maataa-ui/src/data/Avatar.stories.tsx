import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Data/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: "Asha Rao" } };
export const WithPresence: Story = { args: { name: "Ravi Menon", presence: "online", size: "lg" } };
export const BrokenPhoto: Story = { args: { name: "Meera Iyer", src: "/missing.png", size: "xl" } };
