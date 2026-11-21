import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportControl } from "./ExportControl";

describe("ExportControl", () => {
  it("exports the chosen format, redacted by default", async () => {
    const onExport = vi.fn();
    const user = userEvent.setup();
    render(<ExportControl subject="budget" onExport={onExport} allowRedaction />);
    await user.click(screen.getByRole("radio", { name: /PDF/ }));
    expect(screen.getByRole("checkbox", { name: /Remove personal details/ })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Export budget" }));
    expect(onExport).toHaveBeenCalledWith("pdf", { redact: true });
  });
});
