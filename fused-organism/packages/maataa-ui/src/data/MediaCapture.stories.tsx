import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CameraPreview,
  ScreenRecordingBar,
  ScreenshotButton,
  AudioRecorder,
  LiveTranscript,
  VideoCallTile,
} from "./MediaCapture";

const meta = { title: "Data/MediaCapture", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Capture: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <CameraPreview label="Recce camera" onCapture={() => {}} />
      <ScreenRecordingBar onRecorded={() => {}} />
      <ScreenshotButton capture={async () => new Blob()} onCaptured={() => {}} />
      <AudioRecorder onRecorded={() => {}} maxSeconds={120} />
    </div>
  ),
};

export const Call: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <VideoCallTile name="Asha Verma" role="Director" speaking />
        <VideoCallTile name="Meera Iyer" role="ISL interpreter" pinned />
        <VideoCallTile name="Arjun Rao" muted handRaised />
        <VideoCallTile name="Hemant Dixit" isYou cameraOff muted />
      </div>
      <LiveTranscript
        height={140}
        segments={[
          { id: "1", speaker: "Asha", text: "Let’s go again from the top of the scene.", at: 12 },
          { id: "2", speaker: "Arjun", text: "Can we move the key light a little left?", at: 18 },
          { id: "3", speaker: "Asha", text: "Yes — and roll sound", at: 24, interim: true },
        ]}
      />
    </div>
  ),
};
