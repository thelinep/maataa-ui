import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DeliveryTracker,
  ScreeningAttendeeList,
  LegalMatterList,
  SignatureStatusList,
  SubsidyProgrammeList,
} from "./BusinessLists";

const now = new Date(2026, 10, 21);

describe("DeliveryTracker", () => {
  it("groups by recipient and states lateness", () => {
    render(
      <DeliveryTracker
        now={now}
        items={[
          {
            id: "1",
            recipient: "Netflix India",
            item: "IMF package",
            due: new Date(2026, 10, 18),
            status: "inProgress",
          },
          {
            id: "2",
            recipient: "Netflix India",
            item: "Dubbing script",
            due: new Date(2026, 10, 30),
            status: "accepted",
          },
        ]}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/Netflix India · 1 of 2 accepted/);
    expect(screen.getByText("Overdue by 3 days")).toBeInTheDocument();
  });
});

describe("ScreeningAttendeeList", () => {
  it("counts seats and access needs", async () => {
    const onToggleAttended = vi.fn();
    render(
      <ScreeningAttendeeList
        capacity={80}
        onToggleAttended={onToggleAttended}
        attendees={[
          {
            id: "1",
            name: "Asha",
            group: "Cast",
            rsvp: "yes",
            plusOnes: 1,
            access: ["Wheelchair space"],
          },
          { id: "2", name: "Ravi", group: "Press", rsvp: "pending" },
        ]}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/2 of 80 seats · 1 with access needs/);
    await userEvent.setup().click(screen.getByRole("checkbox", { name: "Asha attended" }));
    expect(onToggleAttended).toHaveBeenCalledWith("1", true);
  });
});

describe("LegalMatterList", () => {
  it("puts open, high-risk matters first", () => {
    render(
      <LegalMatterList
        matters={[
          {
            id: "a",
            title: "Location deposit",
            kind: "Agreement",
            counterparty: "Owner",
            owner: "Hemant",
            risk: "low",
            open: true,
          },
          {
            id: "b",
            title: "Song sample claim",
            kind: "Dispute",
            counterparty: "Label",
            owner: "Hemant",
            risk: "high",
            open: true,
          },
          {
            id: "c",
            title: "Old NDA",
            kind: "NDA",
            counterparty: "X",
            owner: "Hemant",
            risk: "high",
            open: false,
          },
        ]}
      />
    );
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Song sample claim");
    expect(rows[3]).toHaveTextContent("Old NDA");
  });
});

describe("SignatureStatusList", () => {
  it("summarises and reminds", async () => {
    const onRemind = vi.fn();
    render(
      <SignatureStatusList
        contract="Actor agreement"
        onRemind={onRemind}
        signatories={[
          { id: "1", name: "Hemant", role: "Producer", status: "signed" },
          { id: "2", name: "Asha", role: "Lead", status: "sent" },
        ]}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("1 of 2 signed");
    await userEvent.setup().click(screen.getByRole("button", { name: "Remind Asha" }));
    expect(onRemind).toHaveBeenCalledWith("2");
  });
});

describe("SubsidyProgrammeList", () => {
  it("states eligibility and deadline in words", () => {
    render(
      <SubsidyProgrammeList
        now={now}
        programmes={[
          {
            id: "1",
            name: "UP Film Policy",
            body: "Uttar Pradesh",
            benefit: "Up to 25%",
            eligible: "maybe",
            reason: "Needs 50% of shoot days in UP",
            deadline: new Date(2026, 10, 30),
          },
        ]}
      />
    );
    expect(screen.getByText("Check eligibility")).toBeInTheDocument();
    expect(screen.getByText(/Due in 9 days/)).toBeInTheDocument();
  });
});
