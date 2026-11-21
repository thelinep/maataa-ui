import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CodeEditor } from "./CodeEditor";

const meta = { title: "Forms/CodeEditor", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState(
    '{\n  "deliverable": "DCP",\n  "resolution": "4096x1716",\n  "audio": ["5.1", "stereo"]\n}'
  );
  return <CodeEditor label="Delivery spec" language="JSON" value={v} onChange={setV} rows={8} />;
}
export const Default: Story = { render: () => <Demo /> };
