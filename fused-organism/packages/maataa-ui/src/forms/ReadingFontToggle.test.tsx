import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadingFontToggle, readingFontStacks } from "./ReadingFontToggle";

describe("ReadingFontToggle", () => {
  it("offers named fonts", async () => {
    const onChange = vi.fn();
    render(<ReadingFontToggle value="default" onChange={onChange} />);
    await userEvent.setup().click(screen.getByRole("radio", { name: /OpenDyslexic/ }));
    expect(onChange).toHaveBeenCalledWith("opendyslexic");
    expect(readingFontStacks.atkinson).toMatch(/Atkinson/);
  });
});
