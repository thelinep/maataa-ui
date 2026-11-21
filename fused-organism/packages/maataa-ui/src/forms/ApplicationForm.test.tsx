import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationForm } from "./ApplicationForm";

describe("ApplicationForm", () => {
  it("validates then submits with contact sharing off by default", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <ApplicationForm
        productionTitle="Monsoon Diaries"
        roles={["Editor", "Sound recordist"]}
        onSubmit={onSubmit}
      />
    );
    await user.click(screen.getByRole("button", { name: "Send application" }));
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("Choose the role");
    await user.selectOptions(screen.getByLabelText("Role"), "Editor");
    await user.type(screen.getByLabelText(/good fit/), "Cut two features for Netflix India.");
    await user.click(screen.getByRole("button", { name: "Send application" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: "Editor", shareContact: false })
    );
  });
});
