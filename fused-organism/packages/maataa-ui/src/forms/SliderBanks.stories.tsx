import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EqFaders, ColorCorrectionSliders, EffectSliderBank } from "./SliderBanks";

const meta = { title: "Forms/SliderBanks", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [eq, setEq] = useState<Record<string, number>>({
    "63": 2,
    "125": 3,
    "2000": -2.5,
    "8000": 1.5,
  });
  const [cc, setCc] = useState<Record<string, number>>({
    exposure: 0.3,
    temperature: 4300,
    tint: 6,
    saturation: 110,
  });
  const [fx, setFx] = useState<Record<string, number>>({ amount: 30, size: 2 });
  const [byp, setByp] = useState(false);
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <EqFaders gains={eq} onChange={(k, v) => setEq((x) => ({ ...x, [k]: v }))} />
      <ColorCorrectionSliders values={cc} onChange={(k, v) => setCc((x) => ({ ...x, [k]: v }))} />
      <EffectSliderBank
        effectName="Film grain"
        params={[
          { id: "amount", label: "Amount", min: 0, max: 100, unit: "%" },
          { id: "size", label: "Grain size", min: 1, max: 5, step: 0.5 },
        ]}
        values={fx}
        onChange={(k, v) => setFx((x) => ({ ...x, [k]: v }))}
        bypassed={byp}
        onBypassChange={setByp}
      />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
