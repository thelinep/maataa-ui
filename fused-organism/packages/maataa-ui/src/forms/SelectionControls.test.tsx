import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  CascadingSelect,
  FilterPills,
  SegmentedControl,
  NumberStepper,
  type CascadeOption,
} from "./SelectionControls";

const opts: CascadeOption[] = [
  {
    value: "cam",
    label: "Camera",
    children: [
      { value: "dop", label: "DOP" },
      { value: "ac", label: "Focus puller" },
    ],
  },
  { value: "snd", label: "Sound", children: [{ value: "mix", label: "Mixer" }] },
];

describe("CascadingSelect", () => {
  it("enables the next level and clears later ones", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<string[]>([]);
      return (
        <CascadingSelect
          legend="Crew role"
          levels={["Department", "Role"]}
          options={opts}
          value={v}
          onChange={setV}
        />
      );
    }
    render(<H />);
    const role = screen.getByRole("combobox", { name: "Role" });
    expect(role).toBeDisabled();
    expect(role).toHaveDisplayValue("Choose department first");
    await user.selectOptions(screen.getByRole("combobox", { name: "Department" }), "Camera");
    await user.selectOptions(role, "Focus puller");
    expect(role).toHaveValue("ac");
    await user.selectOptions(screen.getByRole("combobox", { name: "Department" }), "Sound");
    expect(screen.getByRole("combobox", { name: "Role" })).toHaveValue("");
  });
});

describe("FilterPills", () => {
  it("toggles pressed pills with counts in the name", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<string[]>([]);
      return (
        <FilterPills
          label="Time of day"
          pills={[
            { value: "day", label: "Day", count: 8 },
            { value: "night", label: "Night", count: 1 },
          ]}
          value={v}
          onChange={setV}
        />
      );
    }
    render(<H />);
    const night = screen.getByRole("button", { name: "Night, 1 result" });
    await user.click(night);
    expect(night).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(night).toHaveAttribute("aria-pressed", "false");
  });
});

describe("SegmentedControl", () => {
  it("is a radio group with arrow-key selection", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("list");
      return (
        <SegmentedControl
          label="View"
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
            { value: "map", label: "Map" },
          ]}
          value={v}
          onChange={setV}
        />
      );
    }
    render(<H />);
    expect(screen.getByRole("radiogroup", { name: "View" })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("radio", { name: "List" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Grid" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Map" })).toHaveFocus();
  });
});

describe("NumberStepper", () => {
  it("steps within limits and says when a limit is reached", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState(1);
      return (
        <NumberStepper label="Crew vans" value={v} onChange={setV} min={1} max={3} unit="vans" />
      );
    }
    render(<H />);
    const spin = screen.getByRole("spinbutton", { name: "Crew vans" });
    expect(screen.getByRole("button", { name: "Decrease crew vans" })).toBeDisabled();
    expect(spin).toHaveAccessibleDescription("Minimum is 1.");
    await user.click(screen.getByRole("button", { name: "Increase crew vans" }));
    expect(spin).toHaveAttribute("aria-valuetext", "2 vans");
    spin.focus();
    await user.keyboard("{End}");
    expect(spin).toHaveValue("3");
    expect(spin).toHaveAccessibleDescription("Maximum is 3.");
  });
});
