import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { RetryCountdown } from "./RetryCountdown";

afterEach(() => {
  vi.useRealTimers();
});

describe("RetryCountdown", () => {
  it("alerts once and retries when the countdown ends", () => {
    vi.useFakeTimers();
    const onRetry = vi.fn();
    render(<RetryCountdown message="Couldn't load." seconds={2} onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load.");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
  it("retries now on demand", () => {
    const onRetry = vi.fn();
    render(<RetryCountdown message="x" seconds={30} onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry now" }));
    expect(onRetry).toHaveBeenCalled();
  });
});
