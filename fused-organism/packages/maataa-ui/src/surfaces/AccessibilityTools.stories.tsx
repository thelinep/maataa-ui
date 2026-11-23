import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  ScreenReaderModeToggle,
  SimplifiedModeToggle,
  VoiceCommandGuide,
  EyeGazeCalibration,
  HapticFeedback,
  PictureBoard,
} from "./AccessibilityTools";

const meta = { title: "Surfaces/AccessibilityTools", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Modes() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [h, setH] = useState(true);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <ScreenReaderModeToggle checked={a} onChange={setA} />
      <SimplifiedModeToggle checked={b} onChange={setB} />
      <HapticFeedback enabled={h} onEnabledChange={setH} />
    </div>
  );
}
export const ModesStory: Story = { name: "Modes", render: () => <Modes /> };

export const Voice: Story = {
  render: () => (
    <VoiceCommandGuide
      commands={[
        {
          phrase: "Next scene",
          action: "Moves to the next scene",
          group: "Navigation",
          alternatives: ["Agla scene"],
        },
        { phrase: "Go to call sheet", action: "Opens today’s call sheet", group: "Navigation" },
        {
          phrase: "Mark take good",
          action: "Circles the current take",
          group: "Filming",
          alternatives: ["Print that"],
        },
        { phrase: "Start timer", action: "Starts the scene timer", group: "Filming" },
      ]}
    />
  ),
};

export const Calibration: Story = {
  render: () => <EyeGazeCalibration onPoint={() => {}} onComplete={() => {}} onCancel={() => {}} />,
};

export const Board: Story = {
  render: () => (
    <PictureBoard
      symbols={[
        { id: "i", label: "I", symbol: "🙋", category: "People" },
        { id: "you", label: "you", symbol: "👉", category: "People" },
        { id: "dir", label: "director", symbol: "🎬", category: "People" },
        { id: "want", label: "want", symbol: "🤲", category: "Needs" },
        { id: "water", label: "water", symbol: "💧", category: "Needs" },
        { id: "break", label: "a break", symbol: "☕", category: "Needs" },
        { id: "again", label: "again", symbol: "🔁", category: "Set" },
        { id: "ready", label: "ready", symbol: "✅", category: "Set" },
      ]}
    />
  ),
};
