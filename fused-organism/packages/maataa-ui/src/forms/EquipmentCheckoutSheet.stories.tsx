import type { Meta, StoryObj } from "@storybook/react-vite";
import { EquipmentCheckoutSheet } from "./EquipmentCheckoutSheet";

const meta = {
  title: "Forms/EquipmentCheckoutSheet",
  component: EquipmentCheckoutSheet,
  tags: ["autodocs"],
} satisfies Meta<typeof EquipmentCheckoutSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Day 4 · Camera department",
    onChange: () => {},
    lines: [
      {
        id: "1",
        name: "ARRI Alexa Mini",
        serial: "K1.71233",
        out: true,
        in: true,
        condition: "good",
      },
      { id: "2", name: "Cooke 32mm", out: true, in: false, condition: "good" },
      {
        id: "3",
        name: "SmallHD monitor",
        out: true,
        in: true,
        condition: "damaged",
        note: "Cracked hood",
      },
    ],
  },
};
