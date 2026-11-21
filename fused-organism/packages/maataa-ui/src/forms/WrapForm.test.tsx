import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WrapForm, WrapSummary } from "./WrapForm";

describe("WrapForm", () => {
  it("won't submit without a confirmed backup", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<WrapForm shootDay={4} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Wrap time"), { target: { value: "19:30" } });
    await user.click(screen.getByRole("button", { name: "Submit wrap report" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Confirm the cards are backed up");
    await user.click(screen.getByRole("checkbox", { name: /cards are backed up/ }));
    await user.type(screen.getByLabelText("Backed up by"), "Ravi (DIT)");
    await user.click(screen.getByRole("checkbox", { name: /injury, damage or near miss/ }));
    expect(screen.getByText(/File an incident report/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Submit wrap report" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ wrapTime: "19:30", backupBy: "Ravi (DIT)", incidents: true })
    );
  });
  it("summary reads back", () => {
    render(
      <WrapSummary
        shootDay={4}
        wrap={{
          wrapTime: "19:30",
          scenesCompleted: "12, 14",
          scenesMoved: "",
          pagesShot: "3 3/8",
          setups: 18,
          cardsBackedUp: true,
          backupBy: "Ravi",
          incidents: false,
          notes: "",
        }}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Day 4 wrapped at 19:30");
    expect(screen.getByText("Done by Ravi")).toBeInTheDocument();
  });
});
