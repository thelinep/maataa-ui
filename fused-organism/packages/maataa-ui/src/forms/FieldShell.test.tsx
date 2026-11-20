import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldShell } from "./FieldShell";
import { Input, useField } from "../primitives/Input";

describe("FieldShell", () => {
  it("renders children", () => {
    render(
      <FieldShell>
        <input aria-label="test-input" />
      </FieldShell>
    );
    expect(screen.getByLabelText("test-input")).toBeInTheDocument();
  });

  it("renders a label associated with the control via htmlFor", () => {
    render(
      <FieldShell label="Email" htmlFor="email-field">
        <input id="email-field" />
      </FieldShell>
    );
    const label = screen.getByText("Email");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "email-field");
  });

  it("shows a required indicator when required is true", () => {
    render(
      <FieldShell label="Email" required>
        <input />
      </FieldShell>
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not show a required indicator by default", () => {
    render(
      <FieldShell label="Email">
        <input />
      </FieldShell>
    );
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("renders an error message", () => {
    render(
      <FieldShell error="This field is required">
        <input />
      </FieldShell>
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders helper text when there is no error", () => {
    render(
      <FieldShell helperText="Enter your email">
        <input />
      </FieldShell>
    );
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("prefers the error message over helper text", () => {
    render(
      <FieldShell error="Invalid email" helperText="Enter your email">
        <input />
      </FieldShell>
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.queryByText("Enter your email")).not.toBeInTheDocument();
  });

  it("applies a custom className", () => {
    const { container } = render(
      <FieldShell className="custom-shell">
        <input />
      </FieldShell>
    );
    expect(container.firstChild).toHaveClass("custom-shell");
  });

  it("sets displayName", () => {
    expect(FieldShell.displayName).toBe("FieldShell");
  });
});

describe("FieldShell field context", () => {
  it("wires its label, required state and error to an Input inside it", () => {
    render(
      <FieldShell label="Budget name" required error="Name is required">
        <Input />
      </FieldShell>
    );
    const input = screen.getByRole("textbox", { name: /Budget name/ });
    // Announced as required without enabling native constraint validation.
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).not.toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Name is required");
  });

  it("gives any control the label target and description ids via useField", () => {
    const NativeSelect = () => {
      const field = useField();
      return (
        <select id={field?.id} aria-describedby={field?.describedBy}>
          <option>USD</option>
        </select>
      );
    };
    render(
      <FieldShell label="Currency" helperText="ISO code">
        <NativeSelect />
      </FieldShell>
    );
    const select = screen.getByRole("combobox", { name: "Currency" });
    expect(select).toHaveAccessibleDescription("ISO code");
  });

  it("keeps an explicit htmlFor", () => {
    render(
      <FieldShell label="Title" htmlFor="title-field">
        <Input />
      </FieldShell>
    );
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveAttribute("id", "title-field");
  });
});

describe("FieldShell labelId for non-labelable controls", () => {
  it("lets a custom control be named by the visible label", () => {
    const CustomTrigger = () => {
      const field = useField();
      return (
        <div role="button" tabIndex={0} id={field?.id} aria-labelledby={field?.labelId}>
          2 selected
        </div>
      );
    };
    render(
      <FieldShell label="Team members">
        <CustomTrigger />
      </FieldShell>
    );
    expect(screen.getByRole("button", { name: "Team members" })).toBeInTheDocument();
  });
});
