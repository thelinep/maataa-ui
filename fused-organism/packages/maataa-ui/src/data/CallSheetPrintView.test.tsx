import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CallSheetPrintView } from "./CallSheetPrintView";

describe("CallSheetPrintView", () => {
  it("has the safety line and scene table", () => {
    render(
      <CallSheetPrintView
        production="Monsoon Diaries"
        version={2}
        day={{
          shootDay: 4,
          of: 18,
          date: "Tue 24 Nov",
          crewCall: "06:00",
          shootingCall: "07:30",
          hospital: "Lilavati Hospital, Bandra",
        }}
        scenes={[
          {
            id: "a",
            scene: "12",
            set: "INT. KITCHEN",
            dayNight: "D",
            pages: "1 3/8",
            cast: "1, 4",
            location: "Bandra",
          },
        ]}
        cast={[{ role: "Meera", name: "Asha Rao", call: "07:00" }]}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Monsoon Diaries" })).toBeInTheDocument();
    expect(screen.getByText(/Lilavati Hospital/)).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "12" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cast" })).toBeInTheDocument();
  });
});
