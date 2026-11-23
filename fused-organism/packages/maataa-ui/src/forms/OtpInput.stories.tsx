import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OtpInput } from "./OtpInput";

const meta = { title: "Forms/OtpInput", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState("4829");
  return <OtpInput value={v} onChange={setV} onResend={() => {}} resendAfterSeconds={24} />;
}
export const Default: Story = { render: () => <Demo /> };
