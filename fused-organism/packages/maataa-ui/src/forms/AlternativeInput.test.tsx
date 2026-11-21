import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  GazeSelectionGrid,
  ScanningSelector,
  YesNoButtons,
  type GazeItem,
} from "./AlternativeInput";

afterEach(() => {
  vi.useRealTimers();
});

const items: GazeItem[] = [
  { id: "water", label: "Water", symbol: "💧" },
  { id: "break", label: "Break", symbol: "☕" },
  { id: "help", label: "Help", symbol: "🙋" },
];

describe("GazeSelectionGrid", () => {
  it("selects by click and by dwelling", async () => {
    vi.useFakeTimers();
    const onSelect = vi.fn();
    render(<GazeSelectionGrid label="Requests" items={items} onSelect={onSelect} dwellMs={500} />);
    fireEvent.click(screen.getByRole("button", { name: "Water" }));
    expect(onSelect).toHaveBeenLastCalledWith("water");
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Help" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });
    expect(onSelect).toHaveBeenLastCalledWith("help");
    expect(screen.getByRole("status")).toHaveTextContent("Help selected");
    vi.useRealTimers();
  });
});

describe("ScanningSelector", () => {
  it("cycles items and picks the lit one with a switch press", async () => {
    vi.useFakeTimers();
    const onSelect = vi.fn();
    function H() {
      const [run, setRun] = useState(false);
      return (
        <ScanningSelector
          label="Requests"
          items={items}
          onSelect={onSelect}
          running={run}
          onRunningChange={setRun}
          intervalMs={1000}
        />
      );
    }
    render(<H />);
    fireEvent.click(screen.getByRole("button", { name: "Start scanning" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("aria-current", "true");
    fireEvent.click(screen.getByRole("button", { name: "Select" }));
    expect(onSelect).toHaveBeenCalledWith("break");
    expect(screen.getByRole("button", { name: "Start scanning" })).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe("YesNoButtons", () => {
  it("marks the chosen answer as pressed", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState<"yes" | "no" | "unsure" | null>(null);
      return <YesNoButtons question="Ready for the take?" value={v} onChange={setV} allowUnsure />;
    }
    render(<H />);
    expect(screen.getByRole("group", { name: "Ready for the take?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(screen.getByRole("button", { name: "No" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Not sure" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
