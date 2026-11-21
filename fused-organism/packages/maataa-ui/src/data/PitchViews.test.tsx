import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PitchRecipientSelector, PitchDeliveryReceipt } from "./PitchViews";

describe("PitchRecipientSelector", () => {
  it("blocks opted-out contacts and flags recent pitches", () => {
    render(
      <PitchRecipientSelector
        value={[]}
        onChange={() => {}}
        contacts={[
          {
            id: "1",
            name: "Ravi",
            company: "Netflix",
            kind: "Streaming",
            lastPitched: new Date(Date.now() - 5 * 86_400_000),
          },
          { id: "2", name: "Meera", company: "Studio", kind: "Studio", optedOut: true },
        ]}
      />
    );
    expect(
      screen.getByRole("checkbox", { name: /Meera.*Asked not to receive pitches/ })
    ).toBeDisabled();
    expect(screen.getByText(/Pitched on/)).toBeInTheDocument();
  });
});

describe("PitchDeliveryReceipt", () => {
  it("shows time on each slide as a table", () => {
    render(
      <PitchDeliveryReceipt
        deck="Pitch v3"
        recipient="Ravi"
        sentAt={new Date(2026, 10, 20)}
        openedAt={new Date(2026, 10, 20, 15)}
        slideSeconds={[40, 0]}
        slideTitles={["Logline", "Budget"]}
      />
    );
    expect(screen.getByText("Opened")).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "2. Budget" })).toBeInTheDocument();
    expect(screen.getByText("Not viewed")).toBeInTheDocument();
  });
});
