import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Button } from "./Button";
import { colorTokens, paperTheme, themeToCssVariables, tlpsV2Theme } from "../tokens";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each(["primary", "secondary", "tertiary", "danger"] as const)(
    "renders the %s variant without throwing",
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
    }
  );

  it.each(["sm", "md", "lg"] as const)("renders the %s size without throwing", (size) => {
    render(<Button size={size}>{size}</Button>);
    expect(screen.getByRole("button", { name: size })).toBeInTheDocument();
  });

  it("shows loading text and disables the button when isLoading is true", () => {
    render(<Button isLoading>Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Loading...");
    expect(button).toBeDisabled();
  });

  it("respects the disabled prop", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies a passed-in className instead of dropping it", () => {
    render(<Button className="my-custom-class">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-custom-class");
  });

  it("merges a custom style with its own", () => {
    render(<Button style={{ marginTop: "10px" }}>Save</Button>);
    expect(screen.getByRole("button")).toHaveStyle({ marginTop: "10px" });
  });

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("Button form and loading behaviour", () => {
  it("defaults to type=button so it does not submit an enclosing form", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Cancel</Button>
        <Button type="submit">Save</Button>
      </form>
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("type", "button");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows custom loading text and marks itself busy", () => {
    render(
      <Button isLoading loadingText="Enregistrement…">
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Enregistrement…" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("is not marked busy when idle", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute("aria-busy");
  });
});

describe.each([paperTheme, tlpsV2Theme])(
  "Button colour contrast in the $name theme (WCAG AA, 4.5:1 for normal text)",
  (theme) => {
    const vars = themeToCssVariables(theme);
    // Resolve `var(--name, fallback)` the way a browser would with the theme loaded.
    const resolve = (value: string): string =>
      value.replace(
        /var\((--[\w-]+),\s*([^)]*)\)/g,
        (_, name: string, fallback: string) => vars[name] ?? fallback
      );
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const toHex = (color: string) => {
      const value = resolve(color);
      if (value.startsWith("#")) return value.toUpperCase();
      const m = value.match(/\d+/g);
      if (!m) return value;
      return (
        "#" +
        m
          .slice(0, 3)
          .map((n) => Number(n).toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );
    };
    const contrast = (a: string, b: string) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const surfaces = [
      toHex(colorTokens.background.primary),
      toHex(colorTokens.background.secondary),
    ];

    it.each(["primary", "secondary", "tertiary", "danger"] as const)(
      "%s label meets 4.5:1",
      (variant) => {
        render(<Button variant={variant}>Label</Button>);
        const style = screen.getByRole("button", { name: "Label" }).style;
        const fg = toHex(style.color);
        const fill = style.backgroundColor;
        const backgrounds = fill === "transparent" || fill === "" ? surfaces : [toHex(fill)];
        for (const bg of backgrounds) {
          expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
        }
      }
    );
  }
);
