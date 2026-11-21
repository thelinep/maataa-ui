import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SignedUrlStatus } from "./SignedUrlStatus";

describe("SignedUrlStatus", () => {
  it("moves from valid to expiring to expired", () => {
    const onRefresh = vi.fn();
    const at = new Date(1_000_000 + 300_000);
    const { rerender } = render(
      <SignedUrlStatus expiresAt={at} now={() => 1_000_000} onRefresh={onRefresh} />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Link valid");
    rerender(
      <SignedUrlStatus
        expiresAt={new Date(1_000_000 + 30_000)}
        now={() => 1_000_000}
        onRefresh={onRefresh}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Link expires soon");
    rerender(
      <SignedUrlStatus
        expiresAt={new Date(1_000_000 - 1)}
        now={() => 1_000_000}
        onRefresh={onRefresh}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Link expired");
    fireEvent.click(screen.getByRole("button", { name: "Get a new link" }));
    expect(onRefresh).toHaveBeenCalled();
  });
});
