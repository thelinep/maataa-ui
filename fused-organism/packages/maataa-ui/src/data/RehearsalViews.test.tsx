import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RehearsalSceneList,
  AttendanceGrid,
  DirectorNotesPanel,
  RescheduleRequest,
} from "./RehearsalViews";

describe("RehearsalSceneList", () => {
  it("computes start times", () => {
    render(
      <RehearsalSceneList
        start={new Date(2026, 10, 24, 10)}
        scenes={[
          { id: "a", scene: "12", title: "Kitchen fight", cast: ["Asha"], minutes: 45 },
          { id: "b", scene: "14", title: "Terrace", cast: ["Ravi"], minutes: 30 },
        ]}
      />
    );
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent(/10:45/);
  });
});

describe("AttendanceGrid", () => {
  it("labels each cell and counts", async () => {
    const onChange = vi.fn();
    render(
      <AttendanceGrid
        people={[{ id: "p", name: "Asha" }]}
        sessions={[
          { id: "s1", label: "Mon" },
          { id: "s2", label: "Tue" },
        ]}
        value={{ p: { s1: "present" } }}
        onChange={onChange}
      />
    );
    expect(screen.getByText("1/2")).toBeInTheDocument();
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "Asha, Tue" }), "late");
    expect(onChange).toHaveBeenCalledWith("p", "s2", "late");
  });
});

describe("DirectorNotesPanel", () => {
  it("adds and resolves notes", async () => {
    const onAdd = vi.fn();
    const onToggleResolved = vi.fn();
    const user = userEvent.setup();
    render(
      <DirectorNotesPanel
        cast={["Asha"]}
        onAdd={onAdd}
        onToggleResolved={onToggleResolved}
        notes={[
          { id: "n", scene: "12", forWhom: "Asha", text: "Slower on the reveal", at: new Date() },
        ]}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("1 open");
    await user.type(screen.getByLabelText("Note"), "Hold the look");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(onAdd).toHaveBeenCalledWith({ scene: "", forWhom: "All", text: "Hold the look" });
    await user.click(screen.getByRole("checkbox", { name: "Worked on: Slower on the reveal" }));
    expect(onToggleResolved).toHaveBeenCalledWith("n");
  });
});

describe("RescheduleRequest", () => {
  it("asks consent plainly and needs a reason and time", async () => {
    const onConsent = vi.fn();
    const onRequestReschedule = vi.fn();
    const user = userEvent.setup();
    render(
      <RescheduleRequest
        session="Rehearsal, Tue 24 Nov"
        needsConsent
        consentDescription="Scene 22 includes a kiss."
        onConsent={onConsent}
        onRequestReschedule={onRequestReschedule}
      />
    );
    await user.click(screen.getByRole("radio", { name: "I agree" }));
    expect(onConsent).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole("button", { name: /can.t make it/ }));
    await user.click(screen.getByRole("button", { name: "Ask to reschedule" }));
    expect(screen.getByRole("alert")).toHaveTextContent("reason and a time");
  });
});
