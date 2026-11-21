import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { ValidationMessage } from "./ValidationMessage";
import { colorTokens } from "../tokens";

/** jsdom can't compute var() in shorthands and lower-cases hex, so read the inline style. */
const inlineStyle = (el: Element | null) => (el?.getAttribute("style") ?? "").toLowerCase();

describe("ValidationMessage", () => {
  it("renders its message", () => {
    render(<ValidationMessage>Please fix the errors below.</ValidationMessage>);
    expect(screen.getByText("Please fix the errors below.")).toBeInTheDocument();
  });

  it("defaults to the error type with an alert role", () => {
    render(<ValidationMessage>Something went wrong</ValidationMessage>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses a status role for non-error types", () => {
    render(<ValidationMessage type="success">Saved</ValidationMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies the error color", () => {
    render(<ValidationMessage type="error">Error text</ValidationMessage>);
    expect(inlineStyle(screen.getByRole("alert"))).toContain(
      `color: ${colorTokens.semantic.error.text.toLowerCase()}`
    );
  });

  it("applies the success color", () => {
    render(<ValidationMessage type="success">Success text</ValidationMessage>);
    expect(inlineStyle(screen.getByRole("status"))).toContain(
      `color: ${colorTokens.semantic.success.text.toLowerCase()}`
    );
  });

  it("applies the warning color", () => {
    render(<ValidationMessage type="warning">Warning text</ValidationMessage>);
    expect(inlineStyle(screen.getByRole("status"))).toContain(
      `color: ${colorTokens.semantic.warning.text.toLowerCase()}`
    );
  });

  it("applies the info color", () => {
    render(<ValidationMessage type="info">Info text</ValidationMessage>);
    expect(inlineStyle(screen.getByRole("status"))).toContain(
      `color: ${colorTokens.semantic.info.text.toLowerCase()}`
    );
  });

  it("allows overriding the role", () => {
    render(
      <ValidationMessage role="note" type="info">
        Note text
      </ValidationMessage>
    );
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("forwards ref to the underlying div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ValidationMessage ref={ref}>Text</ValidationMessage>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sets displayName", () => {
    expect(ValidationMessage.displayName).toBe("ValidationMessage");
  });
});
