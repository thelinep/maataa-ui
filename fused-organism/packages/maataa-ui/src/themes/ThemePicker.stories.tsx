import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ThemePicker } from "./ThemePicker";
import { ThemePreferenceHead } from "./ThemePreferenceHead";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { highContrastTheme, paperTheme, themeToCss, tlpsV2Theme } from "../tokens";
import { Badge, Button, Card, Input } from "../primitives";
import { Toggle } from "../forms/Toggle";

const meta = {
  title: "Themes/ThemePicker",
  component: ThemePicker,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Preview() {
  const [sms, setSms] = useState(true);
  return (
    <Card title="Next shoot day" subtitle="Sat 22 Nov · Kabir Nagar">
      <div style={{ display: "grid", gap: 12 }}>
        <Input label="Call time" defaultValue="06:30" />
        <Toggle checked={sms} onChange={setSms} label="Notify by SMS" />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge variant="success">Confirmed</Badge>
          <Badge variant="warning">Draft</Badge>
          <Button>Publish call sheet</Button>
        </div>
      </div>
    </Card>
  );
}

/** Light, Dark, TLPS v2, High contrast or System. The choice is saved in this browser. */
export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <ThemePreferenceHead />
      <ThemePicker />
      <Preview />
    </div>
  ),
};

/** A picker limited to two themes, with the label kept for screen readers only. */
export const TwoThemes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <ThemePicker
        themes={[paperTheme, tlpsV2Theme]}
        showSystem={false}
        hideLabel
        storageKey="maataa-story-two-themes"
      />
      <Preview />
    </div>
  ),
};

/** The high-contrast theme: 7:1 or more for all text. */
export const HighContrast: Story = {
  render: () => (
    <div className="hc-preview" style={{ display: "grid", gap: 16, maxWidth: 480, padding: 16 }}>
      <style>{themeToCss(highContrastTheme, ".hc-preview")}</style>
      <Preview />
    </div>
  ),
};

/** The picker in Hindi. */
export const Hindi: Story = {
  render: () => (
    <LocaleProvider locale="hi-IN">
      <ThemePicker storageKey="maataa-story-hindi" />
    </LocaleProvider>
  ),
};
