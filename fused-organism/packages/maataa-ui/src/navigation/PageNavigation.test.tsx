import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  StickyNavbar,
  HamburgerMenu,
  BottomNav,
  StepDots,
  AnchorNav,
  ScrollToTop,
  LoadMoreButton,
  InfiniteList,
  type NavLink,
} from "./PageNavigation";

const links: NavLink[] = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/projects", label: "Projects", icon: "🎬", badge: 3 },
  { href: "/people", label: "People", icon: "👥" },
];

describe("StickyNavbar", () => {
  it("marks the current page", () => {
    render(<StickyNavbar brand="MAATAA" links={links} currentHref="/projects" />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
  });
});

describe("HamburgerMenu", () => {
  it("opens, focuses the first link and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<HamburgerMenu links={links} />);
    const btn = screen.getByRole("button", { name: "Menu" });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(btn).toHaveFocus();
    expect(screen.queryByRole("link", { name: "Home" })).toBeNull();
  });
});

describe("BottomNav", () => {
  it("names badges in words", () => {
    render(<BottomNav links={links} currentHref="/" />);
    expect(screen.getByRole("link", { name: "Projects, 3 new" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });
});

describe("StepDots", () => {
  it("gives the position in words and jumps", async () => {
    const onSelect = vi.fn();
    render(<StepDots count={4} current={1} onSelect={onSelect} noun="Slide" />);
    expect(screen.getByText("Slide 2 of 4")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "step"
    );
    await userEvent.click(screen.getByRole("button", { name: "Go to slide 4" }));
    expect(onSelect).toHaveBeenCalledWith(3);
  });
});

describe("AnchorNav", () => {
  it("moves focus to the target section", async () => {
    render(
      <>
        <AnchorNav items={[{ id: "cast", label: "Cast" }]} trackActive={false} />
        <h2 id="cast">Cast</h2>
      </>
    );
    await userEvent.click(screen.getByRole("link", { name: "Cast" }));
    expect(screen.getByRole("heading", { name: "Cast", level: 2 })).toHaveFocus();
  });
});

describe("ScrollToTop", () => {
  it("appears after scrolling and focuses the target", () => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    render(
      <>
        <h1 id="top">Page</h1>
        <ScrollToTop threshold={100} focusTargetId="top" />
      </>
    );
    expect(screen.queryByRole("button", { name: "↑ Back to top" })).toBeNull();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    fireEvent.click(screen.getByRole("button", { name: "Back to top" }));
    expect(screen.getByRole("heading", { name: "Page" })).toHaveFocus();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });
});

describe("LoadMoreButton / InfiniteList", () => {
  it("counts what is shown and loads more", async () => {
    const more = vi.fn();
    render(
      <InfiniteList
        label="Shots"
        items={["a", "b"]}
        total={5}
        getKey={(x) => x}
        renderItem={(x) => <span>{x}</span>}
        onLoadMore={more}
        noun="shots"
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Showing 2 of 5 shots");
    await userEvent.click(screen.getByRole("button", { name: "Load more shots" }));
    expect(more).toHaveBeenCalled();
  });

  it("says when everything is shown", () => {
    render(<LoadMoreButton shown={5} total={5} onLoadMore={() => {}} />);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 5 of 5 items. That’s all.");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
