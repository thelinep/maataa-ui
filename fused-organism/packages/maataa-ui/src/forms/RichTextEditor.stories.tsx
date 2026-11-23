import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";

const meta = { title: "Forms/RichTextEditor", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState(
    "## Logline\n\nA **wedding planner** in monsoon Delhi has four days to save a family that does not want saving.\n\n- Feature, 110 minutes\n- Hindi and English\n\nMore at [maataa.in](https://maataa.in)"
  );
  return <RichTextEditor label="Synopsis" value={v} onChange={setV} />;
}
export const Default: Story = { render: () => <Demo /> };
