import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VisibilitySelector } from "./VisibilitySelector";

describe("VisibilitySelector", () => {
  it("explains each option", async () => {
    const onChange = vi.fn();
    render(<VisibilitySelector value="private" onChange={onChange} />);
    expect(screen.getByRole("radio", { name: /Private/ })).toBeChecked();
    await userEvent
      .setup()
      .click(screen.getByRole("radio", { name: /Public.*Contact details stay hidden/ }));
    expect(onChange).toHaveBeenCalledWith("public");
  });
});
