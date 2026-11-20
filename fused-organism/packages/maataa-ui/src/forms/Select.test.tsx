import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, type SelectProps } from "./Select";
import { FieldShell } from "./FieldShell";
import { Modal } from "../surfaces/Modal";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

/** Stateful wrapper so selections show up like in an app. */
function Controlled(props: Partial<SelectProps> & { onValue?: (v: string | string[]) => void }) {
  const { onValue, ...rest } = props;
  const [value, setValue] = useState<string | string[]>(rest.multiSelect ? [] : "");
  return (
    <Select
      label="Fruit"
      options={options}
      value={value}
      onChange={(v) => {
        setValue(v);
        onValue?.(v);
      }}
      {...rest}
    />
  );
}

const combobox = () => screen.getByRole("combobox", { name: "Fruit" });
const activeOption = () => {
  const id = combobox().getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
};

describe("Select basics", () => {
  it("shows the placeholder, then the selected label", () => {
    const { rerender } = render(
      <Select label="Fruit" options={options} value="" placeholder="Choose a fruit" />
    );
    expect(combobox()).toHaveTextContent("Choose a fruit");
    rerender(<Select label="Fruit" options={options} value="cherry" />);
    expect(combobox()).toHaveTextContent("Cherry");
  });

  it("renders description and error text", () => {
    render(
      <Select
        label="Fruit"
        options={options}
        description="Choose your favorite"
        error="This field is required"
      />
    );
    expect(screen.getByText("Choose your favorite")).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("accepts each size", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { unmount } = render(<Select label="Fruit" options={options} size={size} />);
      expect(combobox()).toBeInTheDocument();
      unmount();
    }
  });
});

describe("Select accessibility", () => {
  it("is a combobox named by its label that controls a listbox", async () => {
    render(<Controlled />);
    const box = combobox();
    expect(box).toHaveAttribute("aria-haspopup", "listbox");
    expect(box).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(box);
    expect(box).toHaveAttribute("aria-expanded", "true");
    const listbox = screen.getByRole("listbox", { name: "Fruit" });
    expect(box).toHaveAttribute("aria-controls", listbox.id);
  });

  it("links the error and description and marks the field invalid", () => {
    render(<Select label="Fruit" options={options} description="Pick one" error="Required" />);
    expect(combobox()).toHaveAttribute("aria-invalid", "true");
    expect(combobox()).toHaveAccessibleDescription("Required Pick one");
  });

  it("takes its name, required state and error from FieldShell", () => {
    render(
      <FieldShell label="Currency" required error="Currency required">
        <Select options={[{ value: "usd", label: "USD" }]} />
      </FieldShell>
    );
    const box = screen.getByRole("combobox", { name: /Currency/ });
    expect(box).toHaveAttribute("aria-required", "true");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription("Currency required");
  });

  it("marks options selected and disabled", async () => {
    render(<Controlled />);
    await userEvent.click(combobox());
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(screen.getByRole("option", { name: "Cherry" }));
    await userEvent.click(combobox());
    expect(screen.getByRole("option", { name: "Cherry" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "false");
  });

  it("never nests interactive elements (no input inside a button)", async () => {
    const { container } = render(<Controlled searchable />);
    await userEvent.click(combobox());
    expect(container.querySelector("button input, button button")).toBeNull();
  });
});

describe("Select pointer", () => {
  it("selects with a click, closes, and keeps focus on the combobox", async () => {
    const onValue = vi.fn();
    render(<Controlled onValue={onValue} />);
    await userEvent.click(combobox());
    await userEvent.click(screen.getByRole("option", { name: "Date" }));
    expect(onValue).toHaveBeenCalledWith("date");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(combobox()).toHaveFocus();
    expect(combobox()).toHaveTextContent("Date");
  });

  it("ignores clicks on disabled options", async () => {
    const onValue = vi.fn();
    render(<Controlled onValue={onValue} />);
    await userEvent.click(combobox());
    await userEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(onValue).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes on a click outside", async () => {
    render(
      <>
        <Controlled />
        <button>Elsewhere</button>
      </>
    );
    await userEvent.click(combobox());
    await userEvent.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does nothing when disabled", async () => {
    render(<Controlled disabled />);
    expect(combobox()).toHaveAttribute("aria-disabled", "true");
    expect(combobox()).toHaveAttribute("tabindex", "-1");
    await userEvent.click(combobox());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Select keyboard", () => {
  it("opens with ArrowDown, moves past disabled options and selects with Enter", async () => {
    const onValue = vi.fn();
    render(<Controlled onValue={onValue} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(activeOption()).toHaveTextContent("Apple");
    await userEvent.keyboard("{ArrowDown}");
    expect(activeOption()).toHaveTextContent("Cherry"); // Banana is disabled
    await userEvent.keyboard("{Enter}");
    expect(onValue).toHaveBeenCalledWith("cherry");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("starts on the selected option and supports Home/End", async () => {
    render(<Select label="Fruit" options={options} value="cherry" onChange={() => {}} />);
    combobox().focus();
    await userEvent.keyboard("{Enter}");
    expect(activeOption()).toHaveTextContent("Cherry");
    await userEvent.keyboard("{End}");
    expect(activeOption()).toHaveTextContent("Date");
    await userEvent.keyboard("{Home}");
    expect(activeOption()).toHaveTextContent("Apple");
  });

  it("selects with Space", async () => {
    const onValue = vi.fn();
    render(<Controlled onValue={onValue} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ }");
    expect(onValue).toHaveBeenCalledWith("cherry");
  });

  it("closes on Escape without changing the value", async () => {
    const onValue = vi.fn();
    render(<Controlled onValue={onValue} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onValue).not.toHaveBeenCalled();
    expect(combobox()).toHaveFocus();
  });

  it("jumps to an option by typing its first letters", async () => {
    render(<Controlled />);
    combobox().focus();
    await userEvent.keyboard("d");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(activeOption()).toHaveTextContent("Date");
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("ch");
    expect(activeOption()).toHaveTextContent("Cherry");
  });

  it("accepts the highlighted option on Tab", async () => {
    const onValue = vi.fn();
    render(
      <>
        <Controlled onValue={onValue} />
        <button>Next</button>
      </>
    );
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.tab();
    expect(onValue).toHaveBeenCalledWith("apple");
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes only the listbox when Escape is pressed inside a Modal", async () => {
    render(
      <Modal isOpen onClose={() => {}} title="Edit">
        <Controlled />
      </Modal>
    );
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  });
});

describe("Select searchable", () => {
  it("filters as you type and selects with the keyboard", async () => {
    const onValue = vi.fn();
    render(<Controlled searchable onValue={onValue} />);
    const input = combobox();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    await userEvent.type(input, "er");
    const list = screen.getByRole("listbox");
    expect(
      within(list)
        .getAllByRole("option")
        .map((o) => o.textContent)
    ).toEqual(["Cherry"]);
    expect(activeOption()).toHaveTextContent("Cherry");
    await userEvent.keyboard("{Enter}");
    expect(onValue).toHaveBeenCalledWith("cherry");
    expect(input).toHaveValue("Cherry");
  });

  it("says when nothing matches", async () => {
    render(<Controlled searchable noOptionsText="Nothing here" />);
    await userEvent.type(combobox(), "zzz");
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});

describe("Select multiSelect", () => {
  it("toggles options, stays open and reports arrays", async () => {
    const onValue = vi.fn();
    render(<Controlled multiSelect onValue={onValue} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValue).toHaveBeenLastCalledWith(["apple"]);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValue).toHaveBeenLastCalledWith(["apple", "cherry"]);
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowUp}{Enter}");
    expect(onValue).toHaveBeenLastCalledWith(["cherry"]);
    await userEvent.keyboard("{Escape}");
    expect(combobox()).toHaveTextContent("Cherry");
  });

  it("summarises many selections", () => {
    render(
      <Select label="Fruit" multiSelect options={options} value={["apple", "cherry", "date"]} />
    );
    expect(combobox()).toHaveTextContent("3 selected");
  });
});

describe("Select native form submission", () => {
  it("renders hidden inputs for the selected values when named", () => {
    const { container, rerender } = render(
      <Select label="Fruit" name="fruit" options={options} value="cherry" />
    );
    expect(container.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue("cherry");
    rerender(
      <Select label="Fruit" name="fruit" multiSelect options={options} value={["apple", "date"]} />
    );
    const values = Array.from(container.querySelectorAll('input[type="hidden"][name="fruit"]')).map(
      (i) => (i as HTMLInputElement).value
    );
    expect(values).toEqual(["apple", "date"]);
  });

  it("forwards its ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Select ref={ref} label="Fruit" options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toContainElement(combobox());
  });

  it("closes when focus leaves", async () => {
    render(
      <>
        <Controlled />
        <button>Next</button>
      </>
    );
    await userEvent.click(combobox());
    fireEvent.blur(combobox());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Select popup styling", () => {
  it("uses the control's font even though the listbox is portalled", async () => {
    render(
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}>
        <Controlled />
      </div>
    );
    await userEvent.click(combobox());
    const listbox = screen.getByRole("listbox");
    expect(listbox.style.fontFamily).toContain("Inter");
  });
});
