import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  formatTimecode,
  parseTimecode,
  clock,
  TimecodeReadout,
  MediaScrubber,
  TimelinePlayhead,
  AudioPlayer,
  Slate,
} from "./MediaPlayback";

describe("timecode helpers", () => {
  it("round-trips SMPTE", () => {
    expect(formatTimecode(3725.5, 25)).toBe("01:02:05:13");
    expect(parseTimecode("01:02:05:12", 25)).toBeCloseTo(3725.48);
    expect(parseTimecode("01:62:05:00")).toBeNull();
    expect(clock(65)).toBe("1:05");
    expect(clock(3725)).toBe("1:02:05");
  });
});

describe("TimecodeReadout", () => {
  it("speaks time in words", () => {
    render(<TimecodeReadout seconds={65.2} fps={25} />);
    expect(screen.getByText("00:01:05:05")).toBeInTheDocument();
    expect(screen.getByText("1 minute 5 seconds, frame 5")).toBeInTheDocument();
  });
});

describe("MediaScrubber", () => {
  it("is a named slider with spoken value text and marker jumps", async () => {
    const onChange = vi.fn();
    render(
      <MediaScrubber
        value={65}
        duration={180}
        onChange={onChange}
        markers={[{ at: 120, label: "Reel change" }]}
      />
    );
    const s = screen.getByRole("slider", { name: "Seek" });
    expect(s).toHaveAttribute("aria-valuetext", "1 minute 5 seconds of 3 minutes");
    await userEvent.click(screen.getByRole("button", { name: /Reel change/ }));
    expect(onChange).toHaveBeenCalledWith(120);
  });
});

describe("TimelinePlayhead", () => {
  it("moves a frame or a second with the keyboard", () => {
    function H() {
      const [t, setT] = useState(10);
      return <TimelinePlayhead position={t} duration={60} onChange={setT} fps={25} />;
    }
    render(<H />);
    const ph = screen.getByRole("slider", { name: "Playhead" });
    fireEvent.keyDown(ph, { key: "ArrowRight" });
    expect(ph).toHaveAttribute("aria-valuetext", "00:00:10:01");
    fireEvent.keyDown(ph, { key: "ArrowRight", shiftKey: true });
    expect(ph).toHaveAttribute("aria-valuetext", "00:00:11:01");
    fireEvent.keyDown(ph, { key: "End" });
    expect(ph).toHaveAttribute("aria-valuetext", "00:01:00:00");
  });
});

describe("AudioPlayer", () => {
  it("has named controls and a transcript", () => {
    render(
      <AudioPlayer
        src="mix.mp3"
        title="Sound mix v3"
        transcript={<p>[Rain] Asha: You said you'd call.</p>}
      />
    );
    expect(screen.getByRole("region", { name: "Sound mix v3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "↺ Back 10 seconds".replace("↺ ", "") })
    ).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuetext",
      "100%"
    );
    expect(screen.getByText("Transcript")).toBeInTheDocument();
  });
});

describe("Slate", () => {
  it("reads as a described figure", () => {
    render(
      <Slate production="Monsoon Wedding" roll="A012" scene="14C" take={3} flags={["Night"]} />
    );
    expect(screen.getByRole("figure", { name: "Slate: scene 14C, take 3" })).toBeInTheDocument();
    expect(screen.getByText("Take").nextSibling).toHaveTextContent("3");
  });
});
