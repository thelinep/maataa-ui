import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScanStatusBadge, scanStatusLabel } from "./ScanStatusBadge";

describe("ScanStatusBadge", () => {
  it.each(["pending", "scanning", "clean", "quarantined", "failed"] as const)(
    "renders %s as text",
    (s) => {
      render(<ScanStatusBadge status={s} />);
      expect(screen.getByText(scanStatusLabel(s))).toBeInTheDocument();
    }
  );
  it("gives each status a distinct label", () => {
    const labels = (["pending", "scanning", "clean", "quarantined", "failed"] as const).map(
      scanStatusLabel
    );
    expect(new Set(labels).size).toBe(5);
  });
});
