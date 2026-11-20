import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";

const meta = {
  title: "Forms/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <Select options={basicOptions} value={value} onChange={setValue} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        label="Choose a fruit"
        placeholder="Select a fruit"
      />
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        label="Favorite Fruit"
        description="Pick your favorite fruit from the list"
        placeholder="Select one"
      />
    );
  },
};

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        label="Search Fruits"
        searchable
        placeholder="Type to search..."
      />
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        label="Select Fruits"
        placeholder="Choose one or more"
        multiSelect
        searchable
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        label="Choose a fruit"
        error="This field is required"
        placeholder="Select a fruit"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Select
      options={basicOptions}
      value=""
      label="Choose a fruit"
      disabled
      placeholder="Disabled"
    />
  ),
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        size="sm"
        placeholder="Small select"
      />
    );
  },
};

export const Large: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        size="lg"
        placeholder="Large select"
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Rich options and views

const swatch = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="${color}"/></svg>`
  )}`;

const gradeOptions = [
  { value: "warm", label: "Warm", description: "Golden hour", thumbnail: swatch("#c98a3e") },
  { value: "cool", label: "Cool", description: "Blue night", thumbnail: swatch("#3e6ac9") },
  { value: "noir", label: "Noir", description: "High contrast", thumbnail: swatch("#2b2b2b") },
  { value: "pastel", label: "Pastel", description: "Soft and airy", thumbnail: swatch("#f2c6d8") },
  {
    value: "teal",
    label: "Teal & Orange",
    description: "Blockbuster",
    thumbnail: swatch("#2f8f8a"),
  },
  { value: "bleach", label: "Bleach bypass", description: "Unavailable", disabled: true },
];

const departmentOptions = [
  { value: "camera", label: "Camera", icon: "🎥", description: "DP, operators, ACs" },
  { value: "sound", label: "Sound", icon: "🎙", description: "Mixer and boom" },
  { value: "art", label: "Art", icon: "🎨", description: "Sets and props" },
  { value: "edit", label: "Editorial", icon: "✂️", description: "Editor and assistants" },
];

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Select label="Department" options={departmentOptions} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const CompactView: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 280 }}>
        <Select
          label="Department"
          view="compact"
          options={departmentOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const ThumbnailView: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Select
          label="Look"
          view="thumbnail"
          options={gradeOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const GridView: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Select
          label="Look"
          view="grid"
          gridColumns={3}
          options={gradeOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const MultiSelectChips: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["camera", "sound"]);
    return (
      <div style={{ width: 360 }}>
        <Select
          label="Departments"
          multiSelect
          searchable
          selectedDisplay="chips"
          options={departmentOptions}
          value={value}
          onChange={(v) => setValue(v as string[])}
        />
      </div>
    );
  },
};

export const CustomRender: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Select
          label="Look"
          options={gradeOptions}
          value={value}
          onChange={setValue}
          renderOption={(option, { selected }) => (
            <span style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span>{option.label}</span>
              <small>{selected ? "current" : option.description}</small>
            </span>
          )}
        />
      </div>
    );
  },
};
