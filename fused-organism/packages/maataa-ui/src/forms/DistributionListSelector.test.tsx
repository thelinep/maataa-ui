import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DistributionListSelector } from "./DistributionListSelector";

const people = [
  { id: "1", name: "Asha", role: "DOP", department: "Camera" },
  { id: "2", name: "Ravi", role: "Focus puller", department: "Camera" },
  { id: "3", name: "Meera", role: "Gaffer", department: "Lighting", unreachable: true },
];

describe("DistributionListSelector", () => {
  it("selects whole departments and skips unreachable people", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DistributionListSelector recipients={people} value={["1"]} onChange={onChange} />);
    expect(screen.getByRole("checkbox", { name: "Camera (1/2)" })).toHaveProperty(
      "indeterminate",
      true
    );
    await user.click(screen.getByRole("checkbox", { name: "Camera (1/2)" }));
    expect(onChange).toHaveBeenCalledWith(["1", "2"]);
    expect(screen.getByRole("checkbox", { name: /Meera/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Choose everyone" }));
    expect(onChange).toHaveBeenLastCalledWith(["1", "2"]);
  });
});
