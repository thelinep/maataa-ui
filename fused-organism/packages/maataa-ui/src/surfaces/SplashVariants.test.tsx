import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ParticleSplash, GlassSplash, CameraScienceSplash } from "./SplashVariants";

describe("SplashVariants", () => {
  it.each([ParticleSplash, GlassSplash, CameraScienceSplash])(
    "focuses Skip and finishes once",
    (C) => {
      const done = vi.fn();
      const { unmount } = render(<C onDone={done} reducedMotion contained />);
      expect(screen.getByRole("button", { name: "Skip intro" })).toHaveFocus();
      fireEvent.keyDown(window, { key: "Escape" });
      fireEvent.click(screen.getByRole("button", { name: "Skip intro" }));
      expect(done).toHaveBeenCalledTimes(1);
      unmount();
    }
  );
});
