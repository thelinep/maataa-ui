import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  TimecodeReadout,
  MediaScrubber,
  TimelinePlayhead,
  AudioPlayer,
  Slate,
} from "./MediaPlayback";

const meta = { title: "Data/MediaPlayback", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [t, setT] = useState(65);
  const [p, setP] = useState(12.4);
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <TimecodeReadout seconds={t} fps={25} />
      <MediaScrubber
        value={t}
        duration={180}
        onChange={setT}
        buffered={120}
        markers={[
          { at: 42, label: "Cut point" },
          { at: 140, label: "Reel change" },
        ]}
      />
      <TimelinePlayhead position={p} duration={60} onChange={setP}>
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "5%",
            width: "40%",
            height: 24,
            background: "#1E3A5F",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 52,
            left: "30%",
            width: "50%",
            height: 24,
            background: "#806641",
            borderRadius: 4,
          }}
        />
      </TimelinePlayhead>
      <AudioPlayer
        src=""
        title="Sound mix v3"
        subtitle="Reel 2 · stereo downmix"
        transcript={<p>[Rain] ASHA: You said you’d call.</p>}
      />
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };

export const SlateStory: Story = {
  name: "Slate",
  render: () => (
    <Slate
      production="Monsoon Wedding"
      roll="A012"
      scene="14C"
      take={3}
      director="Asha Verma"
      camera="A"
      date="21 Nov 2026"
      flags={["Night", "Sync"]}
    />
  ),
};
