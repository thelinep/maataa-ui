import { describe, it, expect } from "vitest";
import {
  sunTimes,
  sunPosition,
  moonIllumination,
  compassWord,
  haversineKm,
  bearingDeg,
} from "./skyMath";

const delhi = { lat: 28.6139, lng: 77.209 };
const ist = (d: Date | null) =>
  d!.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });

describe("skyMath", () => {
  it("gives Delhi sun times within a few minutes", () => {
    const t = sunTimes(new Date("2026-11-21T06:30:00Z"), delhi.lat, delhi.lng);
    expect(ist(t.sunrise)).toMatch(/^06:(4[6-9]|5[0-3])$/);
    expect(ist(t.sunset)).toMatch(/^17:(2[3-9]|30)$/);
  });
  it("puts the noon sun roughly south and the moon full on 24 Nov 2026", () => {
    const p = sunPosition(new Date("2026-11-21T06:38:00Z"), delhi.lat, delhi.lng);
    expect(p.azimuth).toBeGreaterThan(170);
    expect(p.azimuth).toBeLessThan(190);
    expect(moonIllumination(new Date("2026-11-24T12:00:00Z")).name).toBe("Full moon");
  });
  it("distances and bearings", () => {
    expect(Math.round(haversineKm(delhi, { lat: 19.076, lng: 72.8777 }))).toBeGreaterThan(1140);
    expect(compassWord(bearingDeg(delhi, { lat: 19.076, lng: 72.8777 }))).toBe("south-south-west");
  });
});
