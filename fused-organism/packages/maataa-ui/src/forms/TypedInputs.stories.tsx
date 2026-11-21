import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { UrlInput, TelInput, PercentageInput, type TelValue } from "./TypedInputs";

const meta = { title: "Forms/TypedInputs", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [url, setUrl] = useState("ftp://rushes.example.com");
  const [tel, setTel] = useState<TelValue>({ dialCode: "+91", number: "98765 43210" });
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <UrlInput
        label="Showreel link"
        value={url}
        onChange={setUrl}
        error="Addresses must start with https:// or http://"
      />
      <TelInput
        label="Mobile number"
        value={tel}
        onChange={setTel}
        expectedDigits={10}
        hint="We text call times to this number."
      />
      <PercentageInput
        label="Producer share"
        value={12.5}
        onChange={() => {}}
        hint="Share of net receipts."
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
