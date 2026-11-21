import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { VerticalTabs, SegmentedTabs, type TabItem } from "./TabVariants";

const tabs: TabItem[] = [
  { id: "profile", label: "Profile", content: <p>Profile panel</p> },
  { id: "security", label: "Security", content: <p>Security panel</p>, badge: 2 },
  { id: "billing", label: "Billing", content: <p>Billing panel</p>, disabled: true },
];

describe("VerticalTabs", () => {
  it("moves with Up/Down, skipping disabled tabs", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("profile");
      return <VerticalTabs label="Settings" tabs={tabs} value={v} onChange={setV} />;
    }
    render(<H />);
    expect(screen.getByRole("tablist", { name: "Settings" })).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Security 2" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Security 2" })).toHaveTextContent(
      "Security panel"
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("SegmentedTabs", () => {
  it("uses Left/Right", async () => {
    const user = userEvent.setup();
    function H() {
      const [v, setV] = useState("profile");
      return <SegmentedTabs label="View" tabs={tabs.slice(0, 2)} value={v} onChange={setV} />;
    }
    render(<H />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Security panel");
  });
});
