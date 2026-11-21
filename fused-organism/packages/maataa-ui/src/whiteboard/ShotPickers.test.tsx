import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShotTypeSelector, CameraAnglePicker } from "./ShotPickers";

describe("Shot pickers", () => {
  it("offer named shot sizes and angles", async () => {
    const onChange = vi.fn();
    render(
      <>
        <ShotTypeSelector value="MS" onChange={onChange} />
        <CameraAnglePicker value={undefined} onChange={onChange} />
      </>
    );
    expect(screen.getByRole("radio", { name: /Medium \(MS\)/ })).toBeChecked();
    await userEvent.setup().click(screen.getByRole("radio", { name: /Over the shoulder \(OTS\)/ }));
    expect(onChange).toHaveBeenCalledWith("OTS");
    expect(screen.getByRole("group", { name: "Camera angle" })).toBeInTheDocument();
  });
});
