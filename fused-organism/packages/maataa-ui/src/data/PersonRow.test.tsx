import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonRow } from "./PersonRow";

describe("PersonRow", () => {
  it("shows name, subtitle and status", () => {
    render(
      <PersonRow name="Asha Rao" subtitle="Editor" status="Confirmed" statusVariant="success" />
    );
    expect(screen.getByText("Asha Rao")).toBeInTheDocument();
    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });
  it("does not repeat the name through the avatar", () => {
    render(<PersonRow name="Asha Rao" />);
    expect(screen.queryByRole("img")).toBeNull();
  });
  it("renders actions", () => {
    render(<PersonRow name="Asha Rao" actions={<button>Message</button>} />);
    expect(screen.getByRole("button", { name: "Message" })).toBeInTheDocument();
  });
});
