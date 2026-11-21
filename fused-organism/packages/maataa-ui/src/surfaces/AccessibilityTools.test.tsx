import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  ScreenReaderModeToggle,
  SimplifiedModeToggle,
  VoiceCommandGuide,
  EyeGazeCalibration,
  HapticFeedback,
  PictureBoard,
} from "./AccessibilityTools";

describe("Mode switches", () => {
  it("are switches with descriptions", async () => {
    function H() {
      const [a, setA] = useState(false);
      return (
        <>
          <ScreenReaderModeToggle checked={a} onChange={setA} />
          <SimplifiedModeToggle checked onChange={() => {}} />
        </>
      );
    }
    render(<H />);
    const sr = screen.getByRole("switch", { name: "Screen-reader mode" });
    expect(sr).toHaveAccessibleDescription(/Turns off animations/);
    await userEvent.click(sr);
    expect(sr).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("switch", { name: "Simplified mode" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});

describe("VoiceCommandGuide", () => {
  it("searches commands under group headings", async () => {
    render(
      <VoiceCommandGuide
        speakable={false}
        commands={[
          { phrase: "Next scene", action: "Moves to the next scene", group: "Navigation" },
          {
            phrase: "Mark take good",
            action: "Circles the current take",
            group: "Filming",
            alternatives: ["Print that"],
          },
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: "Navigation" })).toBeInTheDocument();
    await userEvent.type(screen.getByRole("searchbox", { name: "Find a command" }), "print");
    expect(screen.getByRole("status")).toHaveTextContent("1 command");
    expect(screen.queryByRole("heading", { name: "Navigation" })).toBeNull();
  });
});

describe("EyeGazeCalibration", () => {
  it("advances with Space and completes", () => {
    const onPoint = vi.fn();
    const done = vi.fn();
    render(
      <EyeGazeCalibration
        onPoint={onPoint}
        onComplete={done}
        points={[
          { x: 0.1, y: 0.1 },
          { x: 0.9, y: 0.9 },
        ]}
      />
    );
    const app = screen.getByRole("application");
    expect(screen.getByRole("status")).toHaveTextContent("Point 1 of 2");
    fireEvent.keyDown(app, { key: " " });
    fireEvent.keyDown(app, { key: "Enter" });
    expect(onPoint).toHaveBeenCalledTimes(2);
    expect(done).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Calibration complete.");
  });
});

describe("HapticFeedback", () => {
  it("falls back to a visual pulse and says why", async () => {
    render(<HapticFeedback enabled onEnabledChange={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Try success" }));
    expect(screen.getAllByText(/can’t vibrate/).length).toBeGreaterThan(0);
  });
});

describe("PictureBoard", () => {
  it("builds and speaks a sentence", async () => {
    const user = userEvent.setup();
    const spoke = vi.fn();
    render(
      <PictureBoard
        onSpeak={spoke}
        symbols={[
          { id: "i", label: "I", symbol: "🙋", category: "People" },
          { id: "w", label: "want water", symbol: "💧", category: "Needs" },
        ]}
      />
    );
    await user.click(screen.getByRole("button", { name: "I" }));
    await user.click(screen.getByRole("button", { name: "Needs" }));
    await user.click(screen.getByRole("button", { name: "want water" }));
    expect(screen.getByRole("group", { name: "Sentence: I want water" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Speak" }));
    expect(spoke).toHaveBeenCalledWith("I want water");
    await user.click(screen.getByRole("button", { name: "Remove I" }));
    expect(screen.getByRole("group", { name: "Sentence: want water" })).toBeInTheDocument();
  });
});
