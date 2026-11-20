import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, type SelectOption, type SelectProps } from "./Select";
import { FieldShell } from "./FieldShell";

const swatch = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${color}"/></svg>`
  )}`;

const looks: SelectOption[] = [
  { value: "warm", label: "Warm", description: "Golden hour", thumbnail: swatch("#c98a3e") },
  { value: "cool", label: "Cool", description: "Blue night", thumbnail: swatch("#3e6ac9") },
  { value: "noir", label: "Noir", description: "High contrast", thumbnail: swatch("#222") },
  { value: "bleach", label: "Bleach", description: "Bypass", disabled: true },
  { value: "pastel", label: "Pastel", description: "Soft", thumbnail: swatch("#f2c6d8") },
  { value: "teal", label: "Teal & Orange", icon: <span>🎞</span> },
];

function Controlled(props: Partial<SelectProps> & { onValue?: (v: string | string[]) => void }) {
  const { onValue, ...rest } = props;
  const [value, setValue] = useState<string | string[]>(rest.multiSelect ? [] : "");
  return (
    <Select
      label="Look"
      options={looks}
      value={value}
      onChange={(v) => {
        setValue(v);
        onValue?.(v);
      }}
      {...rest}
    />
  );
}

const combobox = () => screen.getByRole("combobox", { name: "Look" });
const activeOption = () => {
  const id = combobox().getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
};

describe("Select option content", () => {
  it("names options by label and describes them by description", async () => {
    render(<Controlled />);
    await userEvent.click(combobox());
    const warm = screen.getByRole("option", { name: "Warm" });
    expect(warm).toHaveAccessibleDescription("Golden hour");
  });

  it("shows thumbnails and icons as decorative visuals", async () => {
    render(<Controlled view="thumbnail" />);
    await userEvent.click(combobox());
    const warm = screen.getByRole("option", { name: "Warm" });
    const img = warm.querySelector("img") as HTMLImageElement;
    expect(img).toHaveAttribute("alt", "");
    expect(img.style.width).toBe("40px");
    const teal = screen.getByRole("option", { name: "Teal & Orange" });
    const decorative = Array.from(teal.querySelectorAll('[aria-hidden="true"]'));
    expect(decorative.some((el) => el.textContent === "🎞")).toBe(true);
  });

  it("hides descriptions in the compact view", async () => {
    render(<Controlled view="compact" />);
    await userEvent.click(combobox());
    expect(screen.queryByText("Golden hour")).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Warm" })).not.toHaveAttribute("aria-describedby");
  });

  it("shows the selected option's visual in the control", async () => {
    render(<Controlled />);
    await userEvent.click(combobox());
    await userEvent.click(screen.getByRole("option", { name: "Cool" }));
    expect(combobox()).toHaveTextContent("Cool");
    expect(combobox().querySelector("img")).toHaveAttribute("alt", "");
  });

  it("renders custom content with renderOption and still names the option", async () => {
    const renderOption = vi.fn((o: SelectOption, s: { selected: boolean }) => (
      <strong>
        {o.label.toUpperCase()}
        {s.selected ? " (on)" : ""}
      </strong>
    ));
    render(<Controlled renderOption={renderOption} value="noir" />);
    await userEvent.click(combobox());
    const noir = screen.getByRole("option", { name: "Noir" });
    expect(noir).toHaveTextContent("NOIR (on)");
    expect(noir).toHaveAttribute("aria-selected", "true");
  });
});

describe("Select grid view", () => {
  it("lays options out in columns", async () => {
    render(<Controlled view="grid" gridColumns={3} />);
    await userEvent.click(combobox());
    const listbox = screen.getByRole("listbox");
    expect(listbox.style.display).toBe("grid");
    expect(listbox.style.gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
  });

  it("moves by column with Left/Right and by row with Up/Down, skipping disabled", async () => {
    // Grid of 3: [Warm, Cool, Noir] / [Bleach (disabled), Pastel, Teal & Orange]
    render(<Controlled view="grid" gridColumns={3} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(activeOption()).toHaveTextContent("Warm");
    await userEvent.keyboard("{ArrowDown}");
    expect(activeOption()).toHaveTextContent("Warm"); // Bleach below is disabled
    await userEvent.keyboard("{ArrowRight}");
    expect(activeOption()).toHaveTextContent("Cool");
    await userEvent.keyboard("{ArrowDown}");
    expect(activeOption()).toHaveTextContent("Pastel");
    await userEvent.keyboard("{ArrowLeft}");
    expect(activeOption()).toHaveTextContent("Noir"); // skips disabled Bleach
    await userEvent.keyboard("{ArrowUp}");
    expect(activeOption()).toHaveTextContent("Noir"); // top row
    await userEvent.keyboard("{End}{Enter}");
    expect(combobox()).toHaveTextContent("Teal & Orange");
  });

  it("keeps Left/Right for the caret when searchable", async () => {
    render(<Controlled view="grid" searchable />);
    const input = combobox();
    await userEvent.type(input, "o");
    const before = activeOption()?.textContent;
    await userEvent.keyboard("{ArrowRight}");
    expect(activeOption()?.textContent).toBe(before);
  });
});

describe("Select chips", () => {
  it("shows the selection as removable chips under the control", async () => {
    const onValue = vi.fn();
    render(<Controlled multiSelect selectedDisplay="chips" onValue={onValue} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}{ArrowDown}{Enter}{Escape}");
    const chips = screen.getByRole("list", { name: "Selected Look" });
    expect(
      within(chips)
        .getAllByRole("listitem")
        .map((li) => li.textContent?.replace("×", ""))
    ).toEqual(["Warm", "Cool"]);
    expect(combobox()).toHaveTextContent("2 selected");

    await userEvent.click(screen.getByRole("button", { name: "Remove Warm" }));
    expect(onValue).toHaveBeenLastCalledWith(["cool"]);
  });

  it("removes the last chip with Backspace", async () => {
    const onValue = vi.fn();
    render(<Controlled multiSelect selectedDisplay="chips" onValue={onValue} />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}{ArrowDown}{Enter}{Escape}{Backspace}");
    expect(onValue).toHaveBeenLastCalledWith(["warm"]);
  });

  it("has no remove buttons when disabled", () => {
    render(
      <Select
        label="Look"
        options={looks}
        multiSelect
        selectedDisplay="chips"
        value={["warm"]}
        disabled
      />
    );
    expect(screen.getByRole("list", { name: "Selected Look" })).toHaveTextContent("Warm");
    expect(screen.queryByRole("button", { name: /Remove/ })).not.toBeInTheDocument();
  });

  it("keeps the text summary when chips are not requested", async () => {
    render(<Controlled multiSelect />);
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}{Escape}");
    expect(combobox()).toHaveTextContent("Warm");
    expect(screen.queryByRole("list", { name: /Selected/ })).not.toBeInTheDocument();
  });
});

describe("Select chips inside FieldShell", () => {
  it("names the chip list after the FieldShell label", () => {
    render(
      <FieldShell label="Team members">
        <Select
          options={looks}
          multiSelect
          selectedDisplay="chips"
          value={["warm"]}
          onChange={() => {}}
        />
      </FieldShell>
    );
    expect(screen.getByRole("list", { name: "Selected Team members" })).toHaveTextContent("Warm");
  });
});
