import type { Meta, StoryObj } from "@storybook/react";
import { BookingForm } from "./BookingForm";

const meta = {
  title: "Forms/BookingForm",
  component: BookingForm,
  tags: ["autodocs"],
} satisfies Meta<typeof BookingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subject: "ARRI Alexa Mini kit",
    booked: [],
    dayRate: 28000,
    withQuantity: true,
    onSubmit: () => {},
    onCancel: () => {},
  },
};
