import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CueList, cueLength } from "./CueList";

describe("CueList", () => {
  it("computes length and flags uncleared music", async () => {
    expect(cueLength("01:02:10:00", "01:04:40:12")).toBe("2:30");
    const onSeek = vi.fn();
    render(
      <CueList
        onSeek={onSeek}
        cues={[
          {
            id: "1",
            code: "1M3",
            kind: "music",
            in: "01:02:10:00",
            out: "01:04:40:12",
            description: "Rain theme",
            status: "delivered",
          },
        ]}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/1 music cue not cleared/);
    expect(screen.getByText("Rights not cleared")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Go to 1M3 at 01:02:10:00" }));
    expect(onSeek).toHaveBeenCalledWith("01:02:10:00");
  });
});
