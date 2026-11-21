import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("announces one busy status and hides the shapes", () => {
    const { container } = render(<Skeleton label="Loading crew" avatar lines={2} />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveTextContent("Loading crew");
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });
});
