import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { SplashScreen } from "./SplashScreen";

afterEach(() => {
  vi.useRealTimers();
});

describe("SplashScreen", () => {
  it("focuses Skip and ends early", () => {
    const onDone = vi.fn();
    render(<SplashScreen onDone={onDone} reducedMotion />);
    const skip = screen.getByRole("button", { name: "Skip intro" });
    expect(skip).toHaveFocus();
    fireEvent.click(skip);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
  it("ends by itself, and Escape skips", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<SplashScreen onDone={onDone} duration={2000} reducedMotion={false} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
