import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DurationPicker, formatMinutes } from "./DurationPicker";

describe("formatMinutes", () => {
  it("formats", () => {
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(120)).toBe("2 h");
    expect(formatMinutes(95)).toBe("1 h 35 min");
  });
});

describe("DurationPicker", () => {
  it("is a named group with hour and minute inputs", () => {
    render(<DurationPicker label="Scene length" value={95} onChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Scene length" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Hours" })).toHaveValue(1);
    expect(screen.getByRole("spinbutton", { name: "Minutes" })).toHaveValue(35);
  });
  it("reports total minutes, clamped to max", () => {
    const onChange = vi.fn();
    render(<DurationPicker label="Scene length" value={95} onChange={onChange} max={120} />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Hours" }), { target: { value: "0" } });
    expect(onChange).toHaveBeenLastCalledWith(35);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Hours" }), { target: { value: "5" } });
    expect(onChange).toHaveBeenLastCalledWith(120);
  });
  it("links the error", () => {
    render(
      <DurationPicker label="Scene length" value={0} onChange={() => {}} error="Enter a length." />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a length.");
  });
});
