import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsPanel } from "./SettingsPanel";

describe("SettingsPanel", () => {
  it("shows the save bar only when dirty", async () => {
    const onSave = vi.fn();
    const sections = [
      { id: "g", title: "General", content: <p>x</p> },
      { id: "d", title: "Danger zone", danger: true, content: <p>y</p> },
    ];
    const { rerender } = render(
      <SettingsPanel
        title="Project settings"
        sections={sections}
        onSave={onSave}
        savedMessage="Saved"
      />
    );
    expect(screen.getByRole("region", { name: "General" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save changes" })).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    rerender(<SettingsPanel title="Project settings" sections={sections} onSave={onSave} dirty />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalled();
  });
});
