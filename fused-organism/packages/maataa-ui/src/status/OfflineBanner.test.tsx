import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { OfflineBanner } from "./OfflineBanner";

describe("OfflineBanner", () => {
  it("keeps a status region mounted and says what happens to work", () => {
    const { rerender } = render(<OfflineBanner online />);
    expect(screen.getByRole("status")).toHaveTextContent("");
    rerender(<OfflineBanner online={false} pendingCount={2} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      /offline.*saved on this device.*2 changes are waiting/
    );
    rerender(<OfflineBanner online />);
    expect(screen.getByRole("status")).toHaveTextContent("Back online");
  });
  it("follows browser events when uncontrolled", () => {
    render(<OfflineBanner />);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByRole("status")).toHaveTextContent(/offline/);
  });
});
