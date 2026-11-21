import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer, formatDuration, spokenDuration } from "./Timer";

describe("formatDuration / spokenDuration", () => {
  it("formats minutes and hours", () => {
    expect(formatDuration(65_000)).toBe("1:05");
    expect(formatDuration(3_725_000)).toBe("1:02:05");
  });
  it("speaks durations with plurals", () => {
    expect(spokenDuration(0)).toBe("0 seconds");
    expect(spokenDuration(61_000)).toBe("1 minute 1 second");
    expect(spokenDuration(7_200_000)).toBe("2 hours");
  });
});

describe("Timer", () => {
  it("starts and stops, reporting the duration", async () => {
    let t = 1_000_000;
    const onStart = vi.fn();
    const onStop = vi.fn();
    const user = userEvent.setup();
    render(<Timer label="Scene 12 take" now={() => t} onStart={onStart} onStop={onStop} />);
    expect(screen.getByRole("group", { name: "Scene 12 take" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(onStart).toHaveBeenCalledWith(new Date(1_000_000));
    expect(screen.getByRole("status")).toHaveTextContent("Scene 12 take started");
    t += 90_000;
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledWith(expect.objectContaining({ durationMs: 90_000 }));
    expect(screen.getByRole("status")).toHaveTextContent("stopped after 1 minute 30 seconds");
  });
});
