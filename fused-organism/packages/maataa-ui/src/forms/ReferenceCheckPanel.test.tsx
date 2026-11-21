import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReferenceCheckPanel } from "./ReferenceCheckPanel";

describe("ReferenceCheckPanel", () => {
  it("counts checked references and updates status", async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ReferenceCheckPanel
        applicantName="Asha"
        onUpdate={onUpdate}
        references={[
          { id: "1", refereeName: "Ravi", relation: "Director", status: "positive" },
          { id: "2", refereeName: "Meera", relation: "Producer", status: "toContact" },
        ]}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("1 of 2 checked");
    await user.selectOptions(screen.getAllByRole("combobox", { name: "Status" })[1], "contacted");
    expect(onUpdate).toHaveBeenCalledWith("2", { status: "contacted" });
    await user.click(screen.getAllByRole("button", { name: "Add notes" })[0]);
    expect(screen.getByLabelText(/Internal notes/)).toBeInTheDocument();
  });
});
