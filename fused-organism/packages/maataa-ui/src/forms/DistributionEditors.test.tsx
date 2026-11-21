import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerritoryMatrix, WindowEditor, windowConflicts } from "./DistributionEditors";

describe("TerritoryMatrix", () => {
  it("labels each cell by territory and right", async () => {
    const onChange = vi.fn();
    render(
      <TerritoryMatrix
        territories={["India", "UAE"]}
        rights={["Theatrical", "SVOD"]}
        value={{ India: { SVOD: "sold" } }}
        buyers={{ India: { SVOD: "Netflix" } }}
        onChange={onChange}
      />
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(/1 of 4 sold/);
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    await userEvent
      .setup()
      .selectOptions(screen.getByRole("combobox", { name: "UAE, Theatrical" }), "negotiating");
    expect(onChange).toHaveBeenCalledWith("UAE", "Theatrical", "negotiating");
  });
});

describe("WindowEditor", () => {
  it("finds overlapping exclusive windows", () => {
    const w = [
      {
        id: "a",
        platform: "Theatrical",
        territory: "India",
        start: "2027-01-10",
        end: "2027-03-10",
        exclusive: true,
      },
      {
        id: "b",
        platform: "Netflix",
        territory: "India",
        start: "2027-03-01",
        end: "",
        exclusive: true,
      },
      {
        id: "c",
        platform: "Prime",
        territory: "UAE",
        start: "2027-03-01",
        end: "",
        exclusive: true,
      },
    ];
    expect(windowConflicts(w)).toEqual([["a", "b"]]);
    render(<WindowEditor windows={w} onChange={() => {}} territories={["India", "UAE"]} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Theatrical (India) and Netflix (India)");
    expect(screen.getByRole("checkbox", { name: "Prime is exclusive" })).toBeChecked();
  });
});
