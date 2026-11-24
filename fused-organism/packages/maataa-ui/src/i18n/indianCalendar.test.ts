import { describe, expect, it } from "vitest";
import { elongation, sunSign, vikramDate } from "./indianCalendar";

const ist = (iso: string) => new Date(`${iso}+05:30`);

describe("vikramDate", () => {
  // Checked against printed panchangs (Delhi, purnimanta, tithi at sunrise).
  it.each([
    ["2026-03-03T12:00", 2082, "Phalguna", false, "shukla", 15, "Purnima", "Shishir"], // Holi
    ["2026-05-25T12:00", 2083, "Jyeshtha", true, "shukla", 10, "Dashami", "Grishma"], // adhik Jyeshtha
    ["2026-08-28T12:00", 2083, "Shravana", false, "shukla", 15, "Purnima", "Varsha"], // Raksha Bandhan
    ["2026-09-04T12:00", 2083, "Bhadrapada", false, "krishna", 8, "Ashtami", "Varsha"], // Janmashtami
    ["2026-01-14T12:00", 2082, "Magha", false, "krishna", 11, "Ekadashi", "Hemant"], // Shattila Ekadashi
    ["2025-10-21T12:00", 2082, "Kartika", false, "krishna", 15, "Amavasya", "Sharad"], // Diwali 2025
    ["2024-04-09T12:00", 2081, "Chaitra", false, "shukla", 1, "Pratipada", "Vasant"], // Gudi Padwa 2024
  ] as const)("%s", (iso, samvat, month, adhik, paksha, tithi, tithiName, ritu) => {
    const v = vikramDate(ist(iso));
    expect(v).toMatchObject({
      samvat,
      monthName: month,
      adhik,
      paksha,
      tithi,
      tithiName,
      rituName: ritu,
    });
    expect(v.shaka).toBe(samvat - 135);
  });

  it("names the krishna paksha after the next month in purnimanta, the same month in amanta", () => {
    const diwali = ist("2025-10-21T12:00");
    expect(vikramDate(diwali).monthName).toBe("Kartika");
    expect(vikramDate(diwali, { system: "amanta" }).monthName).toBe("Ashvin");
  });

  it("reads the tithi at the day's sunrise, so before dawn is still the previous day", () => {
    const beforeDawn = vikramDate(ist("2026-11-25T03:00"));
    const afterDawn = vikramDate(ist("2026-11-25T12:00"));
    expect(beforeDawn.tithiName).toBe("Purnima");
    expect(afterDawn).toMatchObject({ paksha: "krishna", tithi: 1, monthName: "Margashirsha" });
    expect(afterDawn.rituName).toBe("Hemant");
  });

  it("can read the tithi at the exact moment", () => {
    const v = vikramDate(ist("2026-11-25T03:00"), { at: "instant" });
    expect(v.observedAt.toISOString()).toBe(ist("2026-11-25T03:00").toISOString());
  });

  it("finds new and full moons from the sun and moon positions", () => {
    // New moon 2026-03-19 01:23 UTC; full moon 2026-03-03 11:38 UTC (lunar eclipse).
    expect(
      Math.min(
        elongation(new Date("2026-03-19T01:23Z")),
        360 - elongation(new Date("2026-03-19T01:23Z"))
      )
    ).toBeLessThan(0.5);
    expect(Math.abs(elongation(new Date("2026-03-03T11:38Z")) - 180)).toBeLessThan(0.5);
    expect(sunSign(new Date("2026-01-14T12:00Z"))).toBe(9); // Makara Sankranti
  });
});
