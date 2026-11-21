import type { Meta, StoryObj } from "@storybook/react";
import {
  LanguageSelector,
  CountrySelector,
  RegionSelector,
  CurrencySelector,
} from "./LocaleSelectors";

const meta = {
  title: "Forms/LanguageSelector",
  component: LanguageSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: "hi", onChange: () => {} } };
export const Country: Story = {
  args: Default.args,
  render: () => <CountrySelector value="IN" onChange={() => {}} />,
};
export const Region: Story = {
  args: Default.args,
  render: () => (
    <RegionSelector
      value={{ state: "DL", district: "Shahdara" }}
      onChange={() => {}}
      districtsFor={() => ["Central Delhi", "East Delhi", "Shahdara"]}
    />
  ),
};
export const Currency: Story = {
  args: Default.args,
  render: () => <CurrencySelector value="INR" onChange={() => {}} />,
};
