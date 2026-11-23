import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TreeSelect } from "./TreeSelect";

const meta = { title: "Forms/TreeSelect", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState(["dl", "mh"]);
  return (
    <TreeSelect
      legend="Release territories"
      defaultExpanded={["india", "north"]}
      nodes={[
        {
          value: "india",
          label: "India",
          children: [
            {
              value: "north",
              label: "North",
              children: [
                { value: "dl", label: "Delhi" },
                { value: "pb", label: "Punjab" },
              ],
            },
            { value: "mh", label: "Maharashtra" },
          ],
        },
        {
          value: "gcc",
          label: "Gulf",
          children: [
            { value: "ae", label: "UAE" },
            { value: "qa", label: "Qatar" },
          ],
        },
      ]}
      value={v}
      onChange={setV}
    />
  );
}
export const Default: Story = { render: () => <Demo /> };
