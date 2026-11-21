import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SignaturePad, type SignatureValue } from "./SignaturePad";

const meta = { title: "Forms/SignaturePad", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState<SignatureValue>({
    kind: "typed",
    name: "Asha Verma",
    signedAt: "2026-11-21T08:32:00Z",
  });
  return (
    <SignaturePad
      label="Location release"
      statement="I agree that Vesahe Films may film at 14 Kabir Nagar on 3–4 December 2026."
      value={v}
      onChange={setV}
      defaultMode="type"
    />
  );
}
export const Default: Story = { render: () => <Demo /> };
