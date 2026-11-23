import type { Meta, StoryObj } from "@storybook/react-vite";
import { EquipmentCatalog } from "./EquipmentCatalog";

const meta = {
  title: "Data/EquipmentCatalog",
  component: EquipmentCatalog,
  tags: ["autodocs"],
} satisfies Meta<typeof EquipmentCatalog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onBook: () => {},
    items: [
      {
        id: "1",
        name: "ARRI Alexa Mini",
        category: "Camera",
        dayRate: 28000,
        available: 1,
        total: 2,
      },
      {
        id: "2",
        name: "Cooke S4 lens set",
        category: "Camera",
        dayRate: 15000,
        available: 1,
        total: 1,
      },
      {
        id: "3",
        name: "Aputure 600d",
        category: "Lighting",
        dayRate: 3500,
        available: 0,
        total: 4,
      },
      {
        id: "4",
        name: "Sound Devices 833",
        category: "Sound",
        dayRate: 4000,
        available: 2,
        total: 2,
      },
    ],
  },
};
