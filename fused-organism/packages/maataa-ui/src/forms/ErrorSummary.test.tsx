import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorSummary } from "./ErrorSummary";

describe("ErrorSummary", () => {
  it("takes focus and links to fields", async () => {
    render(
      <>
        <input id="email" aria-label="Email" />
        <ErrorSummary errors={[{ fieldId: "email", message: "Enter your email" }]} />
      </>
    );
    expect(screen.getByRole("alert")).toHaveFocus();
    await userEvent.setup().click(screen.getByRole("link", { name: "Enter your email" }));
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });
  it("renders nothing without errors", () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
