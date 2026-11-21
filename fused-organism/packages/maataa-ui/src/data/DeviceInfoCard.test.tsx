import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceInfoCard, detectDevice } from "./DeviceInfoCard";

describe("DeviceInfoCard", () => {
  it("detects something sensible", () => {
    const d = detectDevice();
    expect(d.timeZone).toBeTruthy();
  });
  it("lists settings and offers to use them", async () => {
    const info = {
      browser: "Chrome",
      os: "macOS",
      screen: "1440 × 900",
      language: "en-IN",
      timeZone: "Asia/Calcutta",
      reducedMotion: true,
      touch: false,
    };
    const onUse = vi.fn();
    render(<DeviceInfoCard info={info} onUse={onUse} />);
    expect(screen.getByText("Chrome on macOS")).toBeInTheDocument();
    expect(screen.getByText(/Reduced/)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Use these settings" }));
    expect(onUse).toHaveBeenCalledWith(info);
  });
});
