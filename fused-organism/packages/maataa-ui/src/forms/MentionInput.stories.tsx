import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MentionInput } from "./MentionInput";

const meta = { title: "Forms/MentionInput", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const people = [
  { id: "1", name: "Asha Verma", detail: "Director" },
  { id: "2", name: "Arjun Rao", detail: "DOP" },
  { id: "3", name: "Meera Iyer", detail: "Editor" },
];

function Demo() {
  const [v, setV] = useState("Great take on 14C. @Arjun Rao can we get one more wide?");
  return <MentionInput label="Comment" value={v} onChange={(t) => setV(t)} people={people} />;
}
export const Default: Story = { render: () => <Demo /> };
