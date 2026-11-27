import { render, screen } from "@testing-library/react";
import { Pagination } from "../navigation/Pagination";
import { relativeDue } from "../data/DeadlineList";
import { ConfirmDialog } from "../surfaces/ConfirmDialog";
import { hi } from "./messages";
import {
  LocaleProvider,
  directionOf,
  translate,
  useLocale,
  useT,
  type MessageValues,
} from "./LocaleProvider";

function Probe({
  source,
  values,
  override,
}: {
  source?: string;
  values?: MessageValues;
  override?: string;
}) {
  const t = useT();
  const locale = useLocale(override);
  return (
    <p>
      <span data-testid="locale">{locale}</span>
      {source && <span data-testid="text">{t(source, values)}</span>}
      <span data-testid="plural-1">{t.plural(1, "{count} result", "{count} results")}</span>
      <span data-testid="plural-3">{t.plural(3, "{count} result", "{count} results")}</span>
    </p>
  );
}

describe("LocaleProvider", () => {
  it("defaults to en-IN and English text without a provider", () => {
    render(<Probe source="Cancel" />);
    expect(screen.getByTestId("locale")).toHaveTextContent("en-IN");
    expect(screen.getByTestId("text")).toHaveTextContent("Cancel");
    expect(screen.getByTestId("plural-1")).toHaveTextContent("1 result");
    expect(screen.getByTestId("plural-3")).toHaveTextContent("3 results");
  });

  it("shows built-in text in Hindi and fills placeholders", () => {
    render(
      <LocaleProvider locale="hi-IN">
        <Probe source="Go to page {page}" values={{ page: 4 }} />
      </LocaleProvider>
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("hi-IN");
    expect(screen.getByTestId("text")).toHaveTextContent("पेज 4 पर जाएँ");
    expect(screen.getByTestId("plural-3")).toHaveTextContent("3 परिणाम");
  });

  it("sets lang and dir so screen readers use the right voice", () => {
    const { container } = render(
      <LocaleProvider locale="ur-IN">
        <Probe />
      </LocaleProvider>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("lang", "ur-IN");
    expect(wrapper).toHaveAttribute("dir", "rtl");
    expect(directionOf("hi-IN")).toBe("ltr");
  });

  it("lets a component's own locale prop win", () => {
    render(
      <LocaleProvider locale="hi-IN">
        <Probe override="en-GB" />
      </LocaleProvider>
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en-GB");
  });

  it("merges custom messages over the built-in catalog, and adds languages", () => {
    render(
      <LocaleProvider locale="ta-IN" messages={{ Cancel: "ரத்து செய்" }}>
        <Probe source="Cancel" />
      </LocaleProvider>
    );
    expect(screen.getByTestId("text")).toHaveTextContent("ரத்து செய்");
  });

  it("falls back to English for anything a catalog lacks", () => {
    expect(translate({}, "Hello {name}", { name: "Meera" })).toBe("Hello Meera");
    expect(translate(hi, "Not in any catalog")).toBe("Not in any catalog");
    expect(translate({}, "Missing {value}", { value: undefined })).toBe("Missing ");
  });

  it("translates real components: labels, defaults and plurals", () => {
    render(
      <LocaleProvider locale="hi-IN">
        <Pagination currentPage={2} totalPages={5} onPageChange={() => undefined} />
        <ConfirmDialog
          isOpen
          title="Archive?"
          message="It moves to the archive."
          onConfirm={() => undefined}
          onCancel={() => undefined}
        />
      </LocaleProvider>
    );
    expect(screen.getByRole("navigation", { name: "पेज नेविगेशन" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "पेज 3 पर जाएँ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "रद्द करें" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "पुष्टि करें" })).toBeInTheDocument();
  });

  it("formats relative due dates in the active language", () => {
    const now = new Date(2026, 10, 24);
    expect(relativeDue(new Date(2026, 10, 27), now).text).toBe("Due in 3 days");
    expect(relativeDue(new Date(2026, 10, 23), now).text).toBe("Overdue by 1 day");
    function Due() {
      const t = useT();
      return <span>{relativeDue(new Date(2026, 10, 27), now, t).text}</span>;
    }
    render(
      <LocaleProvider locale="hi-IN">
        <Due />
      </LocaleProvider>
    );
    expect(screen.getByText("3 दिन में")).toBeInTheDocument();
  });
});
