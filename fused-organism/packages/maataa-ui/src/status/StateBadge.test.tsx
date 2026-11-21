import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  StateBadge,
  qcStates,
  clearanceStates,
  renderStates,
  signatureStates,
  deliveryStates,
  publicationStates,
  approvalStates,
  permitStates,
} from "./StateBadge";

describe("StateBadge", () => {
  it("shows words, mark and a readable prefix", () => {
    render(<StateBadge state="passed" states={qcStates} prefix="QC" />);
    expect(screen.getByText(/QC passed/)).toBeInTheDocument();
    expect(screen.getByText("QC:")).toBeInTheDocument();
  });
  it("falls back to the raw state", () => {
    render(<StateBadge state="mystery" states={qcStates} />);
    expect(screen.getByText("mystery")).toBeInTheDocument();
  });
  it("every preset has unique labels", () => {
    for (const m of [
      qcStates,
      clearanceStates,
      renderStates,
      signatureStates,
      deliveryStates,
      publicationStates,
      approvalStates,
      permitStates,
    ]) {
      const labels = Object.values(m).map((d) => d.label);
      expect(new Set(labels).size).toBe(labels.length);
    }
  });
});
