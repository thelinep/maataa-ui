import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  CountBadge,
  PriorityBadge,
  IndeterminateProgress,
  BufferingIndicator,
  LoadingOverlay,
  SkeletonTable,
} from "./Indicators";

describe("Indicators", () => {
  it("count badge caps visually but says the exact number", () => {
    render(<CountBadge count={140} noun="unread messages" />);
    expect(screen.getByText("99+")).toBeInTheDocument();
    expect(screen.getByText("140 unread messages")).toBeInTheDocument();
  });

  it("priority badge reads as words", () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText("High").parentElement).toHaveTextContent("High priority");
  });

  it("indeterminate progress and skeleton are announced once", () => {
    render(
      <>
        <IndeterminateProgress label="Rendering proxies" />
        <SkeletonTable label="Loading crew" />
      </>
    );
    expect(screen.getByRole("progressbar", { name: "Rendering proxies" })).not.toHaveAttribute(
      "aria-valuenow"
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading crew…");
  });

  it("buffering is only announced for long stalls", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<BufferingIndicator buffering announceAfterMs={1000} />);
    expect(screen.getByRole("status")).toHaveTextContent("");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Buffering…");
    rerender(<BufferingIndicator buffering={false} announceAfterMs={1000} />);
    expect(screen.getByRole("status")).toHaveTextContent("Playing");
    vi.useRealTimers();
  });

  it("loading overlay is a named busy dialog with cancel", () => {
    render(
      <LoadingOverlay loading label="Exporting the call sheet" fullPage onCancel={() => {}} />
    );
    expect(screen.getByRole("alertdialog", { name: "Exporting the call sheet" })).toHaveAttribute(
      "aria-busy",
      "true"
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });
});
