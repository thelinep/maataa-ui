import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "./BrandLogo";

describe("BrandLogo", () => {
  it("is one named image", () => {
    render(<BrandLogo />);
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("img", { name: "maataa" })).toBeInTheDocument();
  });
  it("can be decorative", () => {
    render(<BrandLogo decorative variant="mark" />);
    expect(screen.queryByRole("img")).toBeNull();
  });
});
