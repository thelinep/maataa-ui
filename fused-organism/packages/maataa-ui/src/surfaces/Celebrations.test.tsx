import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressToast, ConfettiBurst } from "./Celebrations";

describe("ProgressToast", () => {
  it("announces milestones and the end, with a real progressbar", () => {
    const { rerender } = render(
      <ProgressToast
        title="Uploading rushes"
        percent={10}
        detail="4 of 40 files"
        onCancel={() => {}}
      />
    );
    expect(screen.getByRole("progressbar", { name: "Uploading rushes" })).toHaveAttribute(
      "aria-valuenow",
      "10"
    );
    rerender(<ProgressToast title="Uploading rushes" percent={52} onCancel={() => {}} />);
    expect(screen.getByRole("status")).toHaveTextContent("Uploading rushes: 50%");
    rerender(
      <ProgressToast title="Uploading rushes" percent={100} state="failed" onRetry={() => {}} />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Uploading rushes: failed.");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});

describe("ConfettiBurst", () => {
  it("announces the message and skips motion when reduced", () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    const { rerender, container } = render(<ConfettiBurst fireKey={0} message="Picture locked!" />);
    rerender(<ConfettiBurst fireKey={1} message="Picture locked!" />);
    expect(screen.getByRole("status")).toHaveTextContent("Picture locked!");
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
