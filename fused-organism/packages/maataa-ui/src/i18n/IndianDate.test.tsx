import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IndianDate } from "./IndianDate";
import { LocaleProvider } from "./LocaleProvider";

const day = new Date("2026-11-25T12:00:00+05:30");

describe("IndianDate", () => {
  it("shows month, paksha, tithi, samvat and ritu", () => {
    render(<IndianDate date={day} />);
    expect(
      screen.getByText("Margashirsha Krishna Pratipada · Vikram Samvat 2083 · Hemant ritu")
    ).toHaveAttribute("datetime", "2026-11-25");
  });

  it("names a full moon without the paksha, and adds Shaka and the ordinary date", () => {
    render(
      <IndianDate
        date={new Date("2026-08-28T12:00:00+05:30")}
        showShaka
        showGregorian
        showRitu={false}
        locale="en-IN"
      />
    );
    expect(
      screen.getByText("Shravana Purnima · Vikram Samvat 2083 · Shaka 1948 · 28 August 2026")
    ).toBeInTheDocument();
  });

  it("marks an adhik month", () => {
    render(<IndianDate date={new Date("2026-05-25T12:00:00+05:30")} showRitu={false} />);
    expect(screen.getByText(/^Adhik Jyeshtha Shukla Dashami/)).toBeInTheDocument();
  });

  it("speaks Hindi with Devanagari or Brahmi digits", () => {
    const { rerender } = render(
      <LocaleProvider locale="hi-IN" numerals="deva">
        <IndianDate date={day} />
      </LocaleProvider>
    );
    expect(
      screen.getByText("मार्गशीर्ष कृष्ण प्रतिपदा · विक्रम संवत् २०८३ · हेमंत ऋतु")
    ).toBeInTheDocument();
    rerender(
      <LocaleProvider locale="hi-IN" numerals="brah">
        <IndianDate date={day} />
      </LocaleProvider>
    );
    expect(
      screen.getByText("मार्गशीर्ष कृष्ण प्रतिपदा · विक्रम संवत् 𑁨𑁦𑁮𑁩 · हेमंत ऋतु")
    ).toBeInTheDocument();
  });
});
