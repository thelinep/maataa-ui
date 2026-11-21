import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is a status named by its label", () => {
    render(<Spinner label="Loading projects" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading projects");
  });
  it("defaults the label to Loading", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });
  it("hides the svg from assistive tech", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
