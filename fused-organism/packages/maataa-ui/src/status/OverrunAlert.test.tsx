import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverrunAlert } from "./OverrunAlert";

describe("OverrunAlert", () => {
  it("is silent under the threshold, a status when close, an alert when over", () => {
    const { container, rerender } = render(
      <OverrunAlert subject="Catering" budget={100} actual={50} />
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<OverrunAlert subject="Catering" budget={100} actual={95} />);
    expect(screen.getByRole("status")).toHaveTextContent("close to its budget");
    rerender(<OverrunAlert subject="Catering" budget={100000} actual={112000} />);
    expect(screen.getByRole("alert")).toHaveTextContent("₹12,000 over");
  });
});
