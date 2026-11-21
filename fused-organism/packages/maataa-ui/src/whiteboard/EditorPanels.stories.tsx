import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ShapeToolPicker,
  LayerStack,
  EffectsLibrary,
  LiveDrawingOverlay,
  RenderQueue,
  type Layer,
  type ShapeKind,
  type Annotation,
} from "./EditorPanels";

const meta = { title: "Whiteboard/EditorPanels", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ToolsDemo() {
  const [s, setS] = useState<ShapeKind>("arrow");
  const [f, setF] = useState(false);
  const [l, setL] = useState<Layer[]>([
    { id: "t", name: "Titles", visible: true, locked: false },
    { id: "g", name: "Grade", visible: true, locked: false },
    { id: "v", name: "Plate", visible: false, locked: true },
  ]);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ShapeToolPicker value={s} onChange={setS} filled={f} onFilledChange={setF} />
      <LayerStack layers={l} onChange={setL} selectedId="g" onSelect={() => {}} />
    </div>
  );
}
export const Tools: Story = { render: () => <ToolsDemo /> };

export const Effects: Story = {
  render: () => (
    <EffectsLibrary
      applied={["bloom"]}
      onApply={() => {}}
      effects={[
        { id: "grain", name: "Film grain", category: "Texture", description: "35 mm style grain" },
        { id: "bloom", name: "Bloom", category: "Light" },
        { id: "vign", name: "Vignette", category: "Light" },
        { id: "chroma", name: "Chromatic aberration", category: "Lens" },
      ]}
    />
  ),
};

function Review() {
  const [a, setA] = useState<Annotation[]>([
    { id: "1", at: 42, note: "Boom dips into frame top left", author: "Asha" },
  ]);
  return (
    <LiveDrawingOverlay
      currentTime={75}
      annotations={a}
      onAdd={(x) => setA((l) => [...l, { ...x, id: String(l.length + 1) }])}
      author="You"
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          background: "linear-gradient(135deg, #2B1F14, #806641)",
          borderRadius: 8,
        }}
      />
    </LiveDrawingOverlay>
  );
}
export const ReviewOverlay: Story = { render: () => <Review /> };

export const Queue: Story = {
  render: () => (
    <RenderQueue
      onCancel={() => {}}
      onRetry={() => {}}
      onPause={() => {}}
      jobs={[
        {
          id: "1",
          name: "Reel 1",
          preset: "ProRes 422 HQ · 4K",
          state: "rendering",
          percent: 46,
          eta: 420,
        },
        { id: "2", name: "Trailer", preset: "H.264 · 1080p", state: "queued" },
        {
          id: "3",
          name: "Reel 2",
          preset: "ProRes 422 HQ · 4K",
          state: "failed",
          error: "Missing media: A012C004.mov",
        },
        { id: "4", name: "Teaser", preset: "H.264 · 1080p", state: "done" },
      ]}
    />
  ),
};
