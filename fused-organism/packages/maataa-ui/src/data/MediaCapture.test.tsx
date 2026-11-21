import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CameraPreview,
  ScreenshotButton,
  VoiceCommandButton,
  LiveTranscript,
  VideoCallTile,
} from "./MediaCapture";

describe("CameraPreview", () => {
  it("never starts on load and explains a refusal", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi
          .fn()
          .mockRejectedValue(Object.assign(new Error("no"), { name: "NotAllowedError" })),
      },
    });
    render(<CameraPreview label="Recce camera" />);
    expect(screen.getByRole("status")).toHaveTextContent("Camera is off.");
    await userEvent.click(screen.getByRole("button", { name: "Turn camera on" }));
    expect(await screen.findByText(/Camera permission was refused/)).toBeInTheDocument();
  });
});

describe("ScreenshotButton", () => {
  it("announces and shows a thumbnail", async () => {
    URL.createObjectURL = vi.fn(() => "blob:shot");
    URL.revokeObjectURL = vi.fn();
    const got = vi.fn();
    render(<ScreenshotButton capture={async () => new Blob(["x"])} onCaptured={got} />);
    await userEvent.click(screen.getByRole("button", { name: "Take screenshot" }));
    expect(await screen.findByRole("img", { name: "Latest screenshot" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Screenshot taken.");
    expect(got).toHaveBeenCalled();
  });
});

describe("VoiceCommandButton", () => {
  it("says when speech recognition is missing", () => {
    render(<VoiceCommandButton onCommand={() => {}} />);
    expect(
      screen.getByText("Voice commands aren’t available in this browser.")
    ).toBeInTheDocument();
  });
});

describe("LiveTranscript", () => {
  it("is a log that does not announce by default", () => {
    render(<LiveTranscript segments={[{ id: "1", speaker: "Asha", text: "Rolling.", at: 3 }]} />);
    const log = screen.getByRole("log", { name: "Live transcript" });
    expect(log).toHaveAttribute("aria-live", "off");
    expect(log).toHaveTextContent("0:03Asha:Rolling.");
  });
});

describe("VideoCallTile", () => {
  it("names states in words", () => {
    render(<VideoCallTile name="Meera Iyer" role="ISL interpreter" muted handRaised pinned />);
    expect(
      screen.getByRole("figure", { name: "Meera Iyer, muted, hand raised, pinned" })
    ).toBeInTheDocument();
  });
});
