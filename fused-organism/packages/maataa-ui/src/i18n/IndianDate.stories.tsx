import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IndianDate } from "./IndianDate";
import { LocaleProvider, type Numerals } from "./LocaleProvider";
import { NumeralsSelector } from "../forms/LocaleSelectors";

const meta = {
  title: "I18n/IndianDate",
  component: IndianDate,
  tags: ["autodocs"],
  args: { date: new Date("2026-11-25T12:00:00+05:30") },
} satisfies Meta<typeof IndianDate>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Purnimanta month, paksha, tithi at Delhi sunrise, samvat and ritu. */
export const Default: Story = {};

/** In Hindi with Devanagari digits. */
export const Hindi: Story = {
  render: (args) => (
    <LocaleProvider locale="hi-IN" numerals="deva">
      <IndianDate {...args} showShaka showGregorian />
    </LocaleProvider>
  ),
};

/** In Hindi with Brahmi digits. The page needs a Brahmi font, such as Noto Sans Brahmi. */
export const BrahmiDigits: Story = {
  render: (args) => (
    <LocaleProvider locale="hi-IN" numerals="brah">
      <IndianDate {...args} showGregorian />
    </LocaleProvider>
  ),
};

/** Months that end at the new moon, as in Gujarat, Maharashtra and the south. */
export const Amanta: Story = { args: { system: "amanta" } };

/** An adhik (extra) month: 2026 has an adhik Jyeshtha. */
export const AdhikMonth: Story = { args: { date: new Date("2026-05-25T12:00:00+05:30") } };

function Picker() {
  const [numerals, setNumerals] = useState<Numerals>("brah");
  return (
    <LocaleProvider locale="hi-IN" numerals={numerals}>
      <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <NumeralsSelector value={numerals} onChange={setNumerals} />
        <IndianDate date={new Date("2026-11-25T12:00:00+05:30")} showShaka showGregorian />
      </div>
    </LocaleProvider>
  );
}

/** Switch the digits; the date and every other number below follow. */
export const ChooseDigits: Story = { render: () => <Picker /> };
