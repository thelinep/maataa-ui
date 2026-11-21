import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CallSheetEditor, type SceneRow, type CallSheetDay } from "./CallSheetEditor";

function H() {
  const [day, setDay] = useState<CallSheetDay>({
    shootDay: 4,
    of: 18,
    date: "2026-11-24",
    crewCall: "06:00",
    shootingCall: "07:30",
    hospital: "",
  });
  const [rows, setRows] = useState<SceneRow[]>([
    {
      id: "a",
      scene: "12",
      set: "INT. KITCHEN",
      dayNight: "D",
      pages: "1 3/8",
      cast: "1, 4",
      location: "Bandra",
    },
    {
      id: "b",
      scene: "14",
      set: "EXT. TERRACE",
      dayNight: "N",
      pages: "2",
      cast: "1",
      location: "Bandra",
    },
  ]);
  return (
    <CallSheetEditor
      day={day}
      onDayChange={setDay}
      scenes={rows}
      onScenesChange={setRows}
      newId={() => "n"}
    />
  );
}

describe("CallSheetEditor", () => {
  it("labels cells by scene, totals pages and reorders", async () => {
    const user = userEvent.setup();
    render(<H />);
    expect(screen.getByRole("table")).toHaveAccessibleName(/2 scenes, 3 3\/8 pages/);
    expect(screen.getByLabelText("Set for scene 12")).toHaveValue("INT. KITCHEN");
    expect(screen.getByLabelText(/Nearest hospital/)).toBeRequired();
    await user.click(screen.getByRole("button", { name: "Move scene 14 up" }));
    expect(screen.getAllByLabelText(/^Scene number/)[0]).toHaveValue("14");
    await user.click(screen.getByRole("button", { name: "Add scene" }));
    expect(screen.getAllByLabelText(/^Scene number/)).toHaveLength(3);
  });
});
