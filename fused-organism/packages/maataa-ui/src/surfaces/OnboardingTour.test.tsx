import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OnboardingTour } from "./OnboardingTour";

describe("OnboardingTour", () => {
  it("steps through and finishes", async () => {
    const close = vi.fn();
    render(
      <>
        <button id="new-project">New project</button>
        <OnboardingTour
          open
          onClose={close}
          steps={[
            { target: "#new-project", title: "Start here", body: "Create your first project." },
            { title: "That’s it", body: "You can replay this from Help." },
          ]}
        />
      </>
    );
    expect(screen.getByRole("dialog", { name: "Start here" })).toHaveFocus();
    expect(screen.getByText("Step 1 of 2")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Finish" }));
    expect(close).toHaveBeenCalledWith(true);
  });
});
