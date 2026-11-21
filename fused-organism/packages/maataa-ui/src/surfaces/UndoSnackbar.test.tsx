import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { UndoSnackbar } from "./UndoSnackbar";

describe("UndoSnackbar", () => {
  it("undoes with the button or Alt+Z, pauses on hover and times out", async () => {
    vi.useFakeTimers();
    const undo = vi.fn();
    const dismiss = vi.fn();
    render(
      <UndoSnackbar
        message="Scene 12 deleted"
        onUndo={undo}
        onDismiss={dismiss}
        durationMs={2000}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Scene 12 deleted");
    fireEvent.keyDown(window, { key: "z", altKey: true });
    expect(undo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Undo" })).toHaveAttribute(
      "aria-keyshortcuts",
      "Alt+Z"
    );
    fireEvent.mouseEnter(screen.getByText("Scene 12 deleted").parentElement!);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(dismiss).not.toHaveBeenCalled();
    fireEvent.mouseLeave(screen.getByText("Scene 12 deleted").parentElement!);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(dismiss).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
