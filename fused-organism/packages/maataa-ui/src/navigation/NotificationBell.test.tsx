import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationBell } from "./NotificationBell";

describe("NotificationBell", () => {
  it("names the unread count once", () => {
    render(<NotificationBell unread={120} expanded={false} />);
    const b = screen.getByRole("button", { name: "Notifications, 120 unread" });
    expect(b).toHaveAttribute("aria-expanded", "false");
    expect(b).toHaveTextContent("99+");
  });
  it("has a plain name with nothing unread", () => {
    render(<NotificationBell unread={0} />);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });
});
