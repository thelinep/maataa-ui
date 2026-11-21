import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { FrameCanvas } from "./FrameCanvas";

function H() {
  const [d, setD] = useState("");
  return (
    <FrameCanvas
      frame="12A"
      tool="pen"
      color="#111"
      size={4}
      description={d}
      onDescriptionChange={setD}
    />
  );
}

describe("FrameCanvas", () => {
  it("is an image named by its description", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<H />);
    expect(screen.getByRole("img", { name: "Frame 12A: no description yet" })).toBeInTheDocument();
    await userEvent
      .setup()
      .type(screen.getByLabelText("What happens in frame 12A"), "MCU Meera at the window");
    expect(
      screen.getByRole("img", { name: "Frame 12A: MCU Meera at the window" })
    ).toBeInTheDocument();
    spy.mockRestore();
  });
});
