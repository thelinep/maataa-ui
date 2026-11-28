import { describe, expect, it } from "vitest";
import { encodeQr } from "./qr";

// Decoded with OpenCV's QRCodeDetector when this encoder was written; these
// checks pin the structure so a regression shows up here.
describe("encodeQr", () => {
  it("picks the smallest version that fits", () => {
    expect(encodeQr("VFS-0142").version).toBe(1);
    expect(encodeQr("https://tlps.in/crew/VFS-0142?production=Bhairav").version).toBe(4);
    expect(encodeQr("x".repeat(300), "L").version).toBe(11);
  });

  it("draws the three finder patterns and the timing rows", () => {
    const { size, modules } = encodeQr("VFS-0142");
    expect(size).toBe(21);
    for (const [x, y] of [
      [0, 0],
      [size - 7, 0],
      [0, size - 7],
    ] as const) {
      expect(modules[y]![x]).toBe(true);
      expect(modules[y + 1]![x + 1]).toBe(false);
      expect(modules[y + 3]![x + 3]).toBe(true);
    }
    for (let i = 8; i < size - 8; i++) expect(modules[6]![i]).toBe(i % 2 === 0);
    expect(modules[size - 8]![8]).toBe(true); // the dark module
  });

  it("encodes UTF-8, so Hindi works", () => {
    expect(encodeQr("हेमंत", "Q").version).toBe(2);
  });

  it("refuses data longer than a QR code holds", () => {
    expect(() => encodeQr("x".repeat(3000), "H")).toThrow(/Too much data/);
  });
});
