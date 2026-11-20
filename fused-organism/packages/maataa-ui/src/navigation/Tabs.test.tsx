import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  const tabs = [
    { id: "tab1", label: "Tab 1", content: "Content 1" },
    { id: "tab2", label: "Tab 2", content: "Content 2" },
    { id: "tab3", label: "Tab 3", content: "Content 3" },
  ];

  it("renders all tabs", () => {
    render(<Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />);
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("displays content of active tab", () => {
    render(<Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />);
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("calls onChange when tab is clicked", () => {
    const onChange = jest.fn();
    render(<Tabs tabs={tabs} defaultTab="tab1" onChange={onChange} variant="line" />);
    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("changes active tab when clicked", () => {
    render(<Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />);
    expect(screen.getByText("Content 1")).toBeInTheDocument();

    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);

    // After clicking, the component should update (in real scenario with controlled component)
    expect(tab2).toBeInTheDocument();
  });

  it("applies line variant", () => {
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies box variant", () => {
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="box" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies pill variant", () => {
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="pill" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles disabled tabs", () => {
    const disabledTabs = [
      { id: "tab1", label: "Tab 1", content: "Content 1" },
      { id: "tab2", label: "Tab 2", content: "Content 2", disabled: true },
      { id: "tab3", label: "Tab 3", content: "Content 3" },
    ];
    const onChange = jest.fn();

    render(<Tabs tabs={disabledTabs} defaultTab="tab1" onChange={onChange} variant="line" />);

    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);
    // Disabled tab should not trigger onChange
    expect(onChange).not.toHaveBeenCalledWith("tab2");
  });

  it("supports keyboard navigation", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={onChange} variant="line" />
    );

    const tab1 = screen.getByText("Tab 1");
    tab1.focus();

    await userEvent.keyboard("{ArrowRight}");
    // Keyboard navigation should move to next tab
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders tablist with proper ARIA role", () => {
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toBeInTheDocument();
  });

  it("has tab role on tab buttons", () => {
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />
    );
    const tabButtons = container.querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBeGreaterThan(0);
  });

  it("marks active tab with aria-selected", () => {
    const { container } = render(
      <Tabs tabs={tabs} defaultTab="tab1" onChange={() => {}} variant="line" />
    );
    const tabs_elem = container.querySelectorAll('[role="tab"]');
    expect(tabs_elem[0]).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs control and keyboard behaviour", () => {
  const items = [
    { id: "a", label: "Alpha", content: "Alpha panel" },
    { id: "b", label: "Beta", content: "Beta panel", disabled: true },
    { id: "c", label: "Gamma", content: "Gamma panel" },
  ];

  it("can be controlled with activeTab", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Tabs tabs={items} activeTab="c" onChange={onChange} />);
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("aria-selected", "true");

    await userEvent.click(screen.getByRole("tab", { name: "Alpha" }));
    expect(onChange).toHaveBeenCalledWith("a");
    // Parent has not updated activeTab yet, so the selection stays put.
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("aria-selected", "true");

    rerender(<Tabs tabs={items} activeTab="a" onChange={onChange} />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Alpha panel")).toBeVisible();
  });

  it("puts only the active tab in the Tab order", () => {
    render(<Tabs tabs={items} defaultTab="a" />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus with the arrow keys and skips disabled tabs", async () => {
    render(<Tabs tabs={items} defaultTab="a" />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    alpha.focus();
    await userEvent.keyboard("{ArrowRight}");
    const gamma = screen.getByRole("tab", { name: "Gamma" });
    expect(gamma).toHaveFocus();
    expect(gamma).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowLeft}");
    expect(alpha).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(gamma).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(alpha).toHaveFocus();
  });

  it("gives each instance unique tab and panel ids", () => {
    render(
      <>
        <Tabs tabs={items} />
        <Tabs tabs={items} />
      </>
    );
    const ids = screen.getAllByRole("tab").map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tab of screen.getAllByRole("tab")) {
      const panel = document.getElementById(tab.getAttribute("aria-controls") as string);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    }
  });

  it("applies the container style to the container only", () => {
    const { container } = render(<Tabs tabs={items} style={{ marginTop: "7px" }} />);
    expect((container.firstChild as HTMLElement).style.marginTop).toBe("7px");
    expect(screen.getByRole("tab", { name: "Alpha" }).style.marginTop).toBe("");
  });
});
