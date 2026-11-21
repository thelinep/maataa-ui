import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProviderSignInButtons } from "./ProviderSignInButtons";

const providers = [
  { id: "google", name: "Google" },
  { id: "apple", name: "Apple" },
];

describe("ProviderSignInButtons", () => {
  it("names each provider", async () => {
    const onSelect = vi.fn();
    render(<ProviderSignInButtons providers={providers} onSelect={onSelect} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Continue with Apple" }));
    expect(onSelect).toHaveBeenCalledWith("apple");
  });
  it("disables all while redirecting", () => {
    render(<ProviderSignInButtons providers={providers} onSelect={() => {}} pendingId="google" />);
    expect(screen.getByRole("button", { name: "Opening Google…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Continue with Apple" })).toBeDisabled();
  });
});
