import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { SunPositionWidget, MoonPositionWidget, TerrainProfile, RocketLaunch } from "./SkyWidgets";

describe("SkyWidgets", () => {
  it("sun widget lists times and position in words", () => {
    render(
      <SunPositionWidget
        lat={28.6139}
        lng={77.209}
        date={new Date("2026-11-21T06:38:00Z")}
        timeZone="Asia/Kolkata"
        place="Delhi"
      />
    );
    expect(screen.getByRole("region", { name: "Sun at Delhi" })).toBeInTheDocument();
    expect(screen.getByText(/Sun is \d+° up, in the south/)).toBeInTheDocument();
    expect(screen.getByText("Golden hour starts")).toBeInTheDocument();
  });

  it("moon widget names the phase", () => {
    render(<MoonPositionWidget lat={28.6} lng={77.2} date={new Date("2026-11-24T18:00:00Z")} />);
    expect(screen.getByRole("heading", { name: "Full moon" })).toBeInTheDocument();
  });

  it("terrain profile summarises climb", () => {
    render(
      <TerrainProfile
        title="Drive to Kufri"
        samples={[
          { km: 0, m: 2100, label: "Shimla" },
          { km: 8, m: 2500 },
          { km: 16, m: 2700, label: "Kufri" },
        ]}
      />
    );
    expect(
      screen.getByRole("img", {
        name: /16.0 km, climbing 600 m and descending 0 m. Highest point 2700 m at Kufri/,
      })
    ).toBeInTheDocument();
  });

  it("rocket countdown announces milestones", async () => {
    vi.useFakeTimers();
    const start = Date.now();
    let now = start;
    const launch = vi.fn();
    render(
      <RocketLaunch
        at={new Date(start + 11000)}
        mission="GSLV-F20"
        onLaunch={launch}
        now={() => now}
      />
    );
    now = start + 1000;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(screen.getByRole("status")).toHaveTextContent("T minus 10 seconds");
    now = start + 11000;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(screen.getByRole("status")).toHaveTextContent("GSLV-F20: lift-off!");
    expect(launch).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
