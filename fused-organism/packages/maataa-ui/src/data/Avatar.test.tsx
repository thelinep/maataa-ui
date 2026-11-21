import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar, initialsOf } from "./Avatar";

describe("initialsOf", () => {
  it("takes first and last initials", () => {
    expect(initialsOf("Asha Rao")).toBe("AR");
    expect(initialsOf("Pandit Hemant Kumar Dixit")).toBe("PD");
    expect(initialsOf("madhu")).toBe("M");
    expect(initialsOf("  ")).toBe("?");
  });
});

describe("Avatar", () => {
  it("is an image named by the person", () => {
    render(<Avatar name="Asha Rao" />);
    expect(screen.getByRole("img", { name: "Asha Rao" })).toHaveTextContent("AR");
  });
  it("adds presence to the name", () => {
    render(<Avatar name="Asha Rao" presence="busy" />);
    expect(screen.getByRole("img", { name: "Asha Rao, busy" })).toBeInTheDocument();
  });
  it("falls back to initials when the photo fails", () => {
    const { container } = render(<Avatar name="Asha Rao" src="/broken.png" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    fireEvent.error(img!);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("AR")).toBeInTheDocument();
  });
  it("can be decorative", () => {
    render(<Avatar name="Asha Rao" decorative />);
    expect(screen.queryByRole("img")).toBeNull();
  });
});
