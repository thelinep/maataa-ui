import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { ThumbMenu } from "./ThumbMenu";

const items = (fn = vi.fn()) => [
  { id: "new", label: "New call sheet", icon: "📄", onSelect: () => fn("new") },
  { id: "scan", label: "Scan receipt", icon: "📷", onSelect: () => fn("scan") },
  { id: "off", label: "Offline report", icon: "📡", onSelect: () => fn("off"), disabled: true },
];

beforeEach(() => window.localStorage.clear());

describe("ThumbMenu", () => {
  it("opens a labelled menu, moves with arrows, chooses with Enter and returns focus", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ThumbMenu label="Quick actions" items={items(fn)} fixed={false} />);
    const button = screen.getByRole("button", { name: "Quick actions" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("menu", { name: "Quick actions" });
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "New call sheet" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Scan receipt" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    // the disabled item is skipped, landing on the hand switch
    expect(screen.getByRole("menuitem", { name: "Switch to left hand" })).toHaveFocus();
    await user.keyboard("{Home}{ArrowDown}{Enter}");
    expect(fn).toHaveBeenCalledWith("scan");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("closes on Escape and jumps by first letter", async () => {
    const user = userEvent.setup();
    render(<ThumbMenu label="Quick actions" items={items()} fixed={false} />);
    screen.getByRole("button", { name: "Quick actions" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Switch to left hand" })).toHaveFocus();
    await user.keyboard("s");
    expect(screen.getByRole("menuitem", { name: "Scan receipt" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quick actions" })).toHaveFocus();
  });

  it("switches and remembers the hand", async () => {
    const user = userEvent.setup();
    const onHandChange = vi.fn();
    const { unmount } = render(
      <ThumbMenu label="Quick actions" items={items()} onHandChange={onHandChange} fixed={false} />
    );
    await user.click(screen.getByRole("button", { name: "Quick actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Switch to left hand" }));
    expect(onHandChange).toHaveBeenCalledWith("left");
    expect(window.localStorage.getItem("maataa-thumb-hand")).toBe("left");
    unmount();
    render(<ThumbMenu label="Quick actions" items={items()} fixed={false} />);
    await user.click(screen.getByRole("button", { name: "Quick actions" }));
    expect(screen.getByRole("menuitem", { name: "Switch to right hand" })).toBeInTheDocument();
  });

  it("uses a bottom sheet for many actions and closes on an outside tap", async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 9 }, (_, i) => ({
      id: String(i),
      label: `Action ${i + 1}`,
      onSelect: vi.fn(),
    }));
    render(
      <>
        <p>Outside</p>
        <ThumbMenu label="All actions" items={many} showHandSwitch={false} fixed={false} />
      </>
    );
    await user.click(screen.getByRole("button", { name: "All actions" }));
    expect(screen.getAllByRole("menuitem")).toHaveLength(9);
    expect(screen.getByRole("menu").style.position).toBe("fixed");
    await user.click(screen.getByText("Outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("is translated", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="hi-IN">
        <ThumbMenu label="त्वरित काम" items={items()} fixed={false} />
      </LocaleProvider>
    );
    await user.click(screen.getByRole("button", { name: "त्वरित काम" }));
    expect(screen.getByRole("menuitem", { name: "बाएँ हाथ के लिए बदलें" })).toBeInTheDocument();
  });
});
