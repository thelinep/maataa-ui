import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationPanel, NotificationDetail, type NotificationItem } from "./NotificationPanel";

const items: NotificationItem[] = [
  {
    id: "1",
    type: "approval",
    title: "Budget needs approval",
    at: new Date("2026-11-20T10:00:00Z"),
    read: false,
    actor: "Asha",
  },
  {
    id: "2",
    type: "schedule",
    title: "Day 4 call time moved",
    at: new Date("2026-11-19T10:00:00Z"),
    read: true,
  },
];

describe("NotificationPanel", () => {
  it("filters, marks read and opens", async () => {
    const onOpen = vi.fn();
    const onMarkRead = vi.fn();
    const onMarkAllRead = vi.fn();
    const user = userEvent.setup();
    render(
      <NotificationPanel
        items={items}
        typeLabels={{ approval: "Approvals" }}
        onOpen={onOpen}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("1 unread");
    await user.click(screen.getByRole("button", { name: "Unread" }));
    expect(screen.getByRole("button", { name: "Unread" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("Day 4 call time moved")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Unread: Budget needs approval" }));
    expect(onOpen).toHaveBeenCalledWith(items[0]);
    await user.click(screen.getByRole("button", { name: "Mark read: Budget needs approval" }));
    expect(onMarkRead).toHaveBeenCalledWith("1", true);
    await user.click(screen.getByRole("button", { name: "Mark all read" }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });
  it("detail shows the action", async () => {
    const onAction = vi.fn();
    render(
      <NotificationDetail
        item={items[0]}
        onBack={() => {}}
        actionLabel="Review budget"
        onAction={onAction}
      />
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Review budget" }));
    expect(onAction).toHaveBeenCalled();
  });
});

describe("NotificationPanel heading name", () => {
  it("separates title and count", () => {
    render(
      <NotificationPanel
        items={[]}
        onOpen={() => {}}
        onMarkRead={() => {}}
        onMarkAllRead={() => {}}
      />
    );
    expect(screen.getByRole("heading", { name: "Notifications · 0 unread" })).toBeInTheDocument();
  });
});
