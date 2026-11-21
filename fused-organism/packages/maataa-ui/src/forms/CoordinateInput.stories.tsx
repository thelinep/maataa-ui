import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CoordinateInput, type Coordinates } from "./CoordinateInput";

const meta = { title: "Forms/CoordinateInput", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [v, setV] = useState<Coordinates | null>({ lat: 28.6562, lng: 77.241, accuracy: 12 });
  return (
    <CoordinateInput
      label="Unit base location"
      value={v}
      onChange={setV}
      hint="Paste “lat, lng” from a map into either field."
    />
  );
}
export const Default: Story = { render: () => <Demo /> };
