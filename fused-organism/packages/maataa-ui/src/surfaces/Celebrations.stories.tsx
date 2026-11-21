import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ProgressToast, ConfettiBurst } from "./Celebrations";

const meta = { title: "Surfaces/Celebrations", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Progress: Story = {
  render: () => (
    <div style={{ height: 180, position: "relative", transform: "translateZ(0)" }}>
      <ProgressToast
        title="Uploading rushes"
        percent={46}
        detail="18 of 40 files · about 6 min left"
        onCancel={() => {}}
      />
    </div>
  ),
};

function ConfettiDemo() {
  const [n, setN] = useState(0);
  return (
    <button
      onClick={() => setN((x) => x + 1)}
      style={{ minHeight: 44, padding: "0 16px", font: "inherit" }}
    >
      Lock picture
      <ConfettiBurst fireKey={n} message="Picture locked!" />
    </button>
  );
}
export const Confetti: Story = { render: () => <ConfettiDemo /> };
