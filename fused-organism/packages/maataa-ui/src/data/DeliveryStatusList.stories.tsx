import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeliveryStatusList } from "./DeliveryStatusList";

const meta = {
  title: "Data/DeliveryStatusList",
  component: DeliveryStatusList,
  tags: ["autodocs"],
} satisfies Meta<typeof DeliveryStatusList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onResend: () => {},
    records: [
      { id: "1", name: "Asha Rao", channel: "WhatsApp", status: "opened" },
      {
        id: "2",
        name: "Ravi Menon",
        channel: "SMS",
        status: "bounced",
        error: "Number not reachable",
      },
      { id: "3", name: "Meera Iyer", channel: "Email", status: "delivered" },
    ],
  },
};
