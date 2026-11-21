import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  StatusScreen,
  PermissionDeniedScreen,
  SessionExpiredScreen,
  OnboardingCompleteScreen,
  NotFoundScreen,
} from "./StatusScreen";

describe("StatusScreen", () => {
  it("focuses its heading and shows actions", () => {
    render(<StatusScreen title="Done" message="All good" actions={<button>Continue</button>} />);
    expect(screen.getByRole("heading", { level: 1, name: "Done" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });
  it.each([
    [PermissionDeniedScreen, /access/],
    [SessionExpiredScreen, /signed out/],
    [OnboardingCompleteScreen, /all set/],
    [NotFoundScreen, /couldn.t find/],
  ])("preset %#", (C, re) => {
    render(<C focusOnMount={false} />);
    expect(screen.getByRole("heading")).toHaveTextContent(re);
  });
});
