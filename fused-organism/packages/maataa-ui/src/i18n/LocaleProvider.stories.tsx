import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LocaleProvider } from "./LocaleProvider";
import { Pagination } from "../navigation/Pagination";
import { SearchInput } from "../forms/SearchInput";
import { CopyButton } from "../actions/CopyButton";
import { DatePicker } from "../forms/DatePicker";
import { NotificationBell } from "../navigation/NotificationBell";
import { ThemePicker } from "../themes/ThemePicker";

const meta = {
  title: "I18n/LocaleProvider",
  component: LocaleProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof LocaleProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Screen() {
  const [page, setPage] = useState(2);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | null>(new Date(2026, 10, 24));
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 560 }}>
      <ThemePicker storageKey="maataa-story-locale" />
      <SearchInput aria-label="Search crew" value={query} onChange={setQuery} />
      <DatePicker label="Shoot date" value={date} onChange={setDate} />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <CopyButton value="https://maataa.example/call-sheet/12" what="link" />
        <NotificationBell unread={4} onClick={() => undefined} />
      </div>
      <Pagination currentPage={page} totalPages={6} onPageChange={setPage} />
    </div>
  );
}

/** Built-in text in Hindi; dates and numbers in hi-IN formats. */
export const Hindi: Story = {
  args: { locale: "hi-IN", children: null },
  render: (args) => (
    <LocaleProvider locale={args.locale}>
      <Screen />
    </LocaleProvider>
  ),
};

/** The default: English, en-IN formats. */
export const English: Story = {
  args: { locale: "en-IN", children: null },
  render: (args) => (
    <LocaleProvider locale={args.locale}>
      <Screen />
    </LocaleProvider>
  ),
};

/** Add or override any text with `messages`, e.g. a Tamil label for one button. */
export const CustomMessages: Story = {
  args: { locale: "ta-IN", children: null },
  render: (args) => (
    <LocaleProvider
      locale={args.locale}
      messages={{
        "Previous page": "முந்தைய பக்கம்",
        "Next page": "அடுத்த பக்கம்",
        Previous: "முந்தைய",
        "Next →": "அடுத்த →",
      }}
    >
      <Pagination currentPage={1} totalPages={3} onPageChange={() => undefined} />
    </LocaleProvider>
  ),
};
