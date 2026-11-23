import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OnboardingTour } from "./OnboardingTour";

const meta = { title: "Surfaces/OnboardingTour", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button id="tour-new" style={{ minHeight: 44, padding: "0 16px", font: "inherit" }}>
        New project
      </button>
      <button id="tour-people" style={{ minHeight: 44, padding: "0 16px", font: "inherit" }}>
        People
      </button>
      <button
        onClick={() => setOpen(true)}
        style={{ minHeight: 44, padding: "0 16px", font: "inherit" }}
      >
        Start tour
      </button>
      <OnboardingTour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          {
            target: "#tour-new",
            title: "Start a project",
            body: "Everything — script, budget, crew — lives inside a project.",
          },
          {
            target: "#tour-people",
            title: "Add your crew",
            body: "Invite people by email; they choose their own language.",
          },
          { title: "You’re set", body: "Replay this tour any time from Help." },
        ]}
      />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
