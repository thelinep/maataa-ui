import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TagInput } from "./TagInput";

const meta = { title: "Forms/TagInput", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState(["Drama", "Monsoon", "Delhi"]);
  return (
    <TagInput
      label="Keywords"
      value={v}
      onChange={setV}
      suggestions={["Thriller", "Comedy", "Documentary"]}
      maxTags={8}
    />
  );
}
export const Default: Story = { render: () => <Demo /> };
