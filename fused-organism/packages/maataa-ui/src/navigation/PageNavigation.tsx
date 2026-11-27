/**
 * @maataa/ui/navigation/PageNavigation
 * StickyNavbar, HamburgerMenu, BottomNav, StepDots, AnchorNav, ScrollToTop,
 * LoadMoreButton and InfiniteList
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  /** Count shown as a badge (and read as "N new") */
  badge?: number;
}

const linkStyle = (current: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "0 12px",
  borderRadius: 8,
  color: current ? colorTokens.text.primary : colorTokens.text.secondary,
  fontWeight: current ? 600 : 500,
  textDecoration: current ? "underline" : "none",
  textUnderlineOffset: 6,
  textDecorationThickness: 2,
});

/* ───────────────────────── StickyNavbar ───────────────────────── */

export interface StickyNavbarProps {
  brand: React.ReactNode;
  links: NavLink[];
  /** href of the current page */
  currentHref?: string;
  /** Right-hand slot (sign in, user chip) */
  actions?: React.ReactNode;
  /** Frosted-glass background @default true */
  glass?: boolean;
  /** Names the nav landmark @default 'Main' */
  label?: string;
}

/**
 * StickyNavbar
 * A header that stays at the top while scrolling, with a frosted background
 * whose text contrast is kept by a mostly-opaque fill (and a solid fallback
 * when backdrop-filter is unsupported or transparency is reduced).
 */
export function StickyNavbar({
  brand,
  links,
  currentHref,
  actions,
  glass = true,
  label: labelProp,
}: StickyNavbarProps) {
  const t = useT();
  const label = labelProp ?? t("Main");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: spacingTokens.md,
        padding: `${spacingTokens.xs} ${spacingTokens.lg}`,
        background: glass ? "rgba(255, 250, 240, 0.88)" : colorTokens.background.primary,
        backdropFilter: glass ? "blur(14px) saturate(1.4)" : undefined,
        WebkitBackdropFilter: glass ? "blur(14px) saturate(1.4)" : undefined,
        borderBottom: `1px solid ${scrolled ? colorTokens.border.primary : "transparent"}`,
        boxShadow: scrolled ? colorTokens.shadow.sm : undefined,
      }}
    >
      <div style={{ fontWeight: 700 }}>{brand}</div>
      <nav aria-label={label} style={{ flex: 1 }}>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={l.href === currentHref ? "page" : undefined}
                style={linkStyle(l.href === currentHref)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {actions}
    </header>
  );
}

/* ───────────────────────── HamburgerMenu ───────────────────────── */

export interface HamburgerMenuProps {
  links: NavLink[];
  currentHref?: string;
  /** Names the nav landmark @default 'Main' */
  label?: string;
}

/**
 * HamburgerMenu
 * A disclosure: the button says "Menu" (with aria-expanded) and opens a link
 * list. Escape closes it and returns focus to the button.
 */
export function HamburgerMenu({ links, currentHref, label: labelProp }: HamburgerMenuProps) {
  const t = useT();
  const label = labelProp ?? t("Main");
  const id = useId();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (open) first.current?.focus();
  }, [open]);
  return (
    <nav
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          btn.current?.focus();
        }
      }}
      style={{ position: "relative" }}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        style={{
          minHeight: 44,
          minWidth: 44,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          border: `1px solid ${colorTokens.border.control}`,
          borderRadius: 8,
          background: colorTokens.background.primary,
          color: colorTokens.text.primary,
          font: "inherit",
          cursor: "pointer",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {open ? (
            <path
              d="M4 4l12 12M16 4L4 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
        {t("Menu")}
      </button>
      <ul
        id={id}
        hidden={!open}
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 60,
          minWidth: 220,
          listStyle: "none",
          margin: 0,
          padding: 6,
          background: colorTokens.background.primary,
          border: `1px solid ${colorTokens.border.control}`,
          borderRadius: 10,
          boxShadow: colorTokens.shadow.lg,
        }}
      >
        {links.map((l, i) => (
          <li key={l.href}>
            <a
              ref={i === 0 ? first : undefined}
              href={l.href}
              aria-current={l.href === currentHref ? "page" : undefined}
              onClick={() => setOpen(false)}
              style={{
                ...linkStyle(l.href === currentHref),
                display: "flex",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ───────────────────────── BottomNav ───────────────────────── */

export interface BottomNavProps {
  links: NavLink[];
  currentHref?: string;
  label?: string;
}

/**
 * BottomNav
 * Mobile tab bar of 3–5 links, each with an icon and a visible label.
 * Leaves room for the home indicator (safe-area inset).
 */
export function BottomNav({ links, currentHref, label: labelProp }: BottomNavProps) {
  const t = useT();
  const label = labelProp ?? t("Main");
  return (
    <nav
      aria-label={label}
      style={{
        position: "sticky",
        bottom: 0,
        background: colorTokens.background.primary,
        borderTop: `1px solid ${colorTokens.border.primary}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${links.length}, 1fr)`,
        }}
      >
        {links.map((l) => {
          const cur = l.href === currentHref;
          return (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={cur ? "page" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  minHeight: 56,
                  color: cur ? colorTokens.interactive.primary : colorTokens.text.secondary,
                  fontWeight: cur ? 700 : 500,
                  fontSize: typographyTokens.fontSize.xs,
                  textDecoration: "none",
                  position: "relative",
                  borderTop: `3px solid ${cur ? colorTokens.interactive.primary : "transparent"}`,
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1 }}>
                  {l.icon}
                </span>
                {l.label}
                {l.badge ? (
                  <>
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 4,
                        left: "calc(50% + 6px)",
                        minWidth: 18,
                        padding: "0 5px",
                        borderRadius: 999,
                        background: colorTokens.interactive.error,
                        color: colorTokens.text.inverse,
                        fontSize: 11,
                        lineHeight: "18px",
                      }}
                    >
                      {l.badge}
                    </span>
                    <VisuallyHidden>{t(", {badge} new", { badge: l.badge })}</VisuallyHidden>
                  </>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ───────────────────────── StepDots ───────────────────────── */

export interface StepDotsProps {
  /** Number of steps or slides */
  count: number;
  /** 0-based current index */
  current: number;
  /** Make dots buttons that jump to a step */
  onSelect?: (index: number) => void;
  /** What a step is called @default 'Step' */
  noun?: string;
}

/**
 * StepDots
 * Compact progress for carousels and short wizards. The position is always
 * given in words ("Step 2 of 5"); clickable dots are named "Go to step 3".
 */
export function StepDots({ count, current, onSelect, noun = "Step" }: StepDotsProps) {
  const dot = (i: number): React.CSSProperties => ({
    width: i === current ? 24 : 10,
    height: 10,
    borderRadius: 999,
    background:
      i === current
        ? colorTokens.interactive.primary
        : i < current
          ? colorTokens.interactive.secondary
          : colorTokens.border.control,
    display: "block",
    transition: "width 150ms",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm }}>
      {onSelect ? (
        <ul
          aria-label={`${noun}s`}
          style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 2 }}
        >
          {Array.from({ length: count }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-current={i === current ? "step" : undefined}
                onClick={() => onSelect(i)}
                style={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
              >
                <span aria-hidden="true" style={dot(i)} />
                <VisuallyHidden>
                  Go to {noun.toLowerCase()} {i + 1}
                </VisuallyHidden>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <span aria-hidden="true" style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: count }, (_, i) => (
            <span key={i} style={dot(i)} />
          ))}
        </span>
      )}
      <span style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}>
        {noun} {current + 1} of {count}
      </span>
    </div>
  );
}

/* ───────────────────────── AnchorNav ───────────────────────── */

export interface AnchorItem {
  /** id of the heading/section on the page */
  id: string;
  label: string;
}

export interface AnchorNavProps {
  items: AnchorItem[];
  /** @default 'On this page' */
  label?: string;
  /** Highlight the section in view @default true */
  trackActive?: boolean;
}

/**
 * AnchorNav
 * "On this page" jump links. Following a link moves focus to the target
 * section (it gets tabindex=-1), so keyboard and screen-reader users land there.
 */
export function AnchorNav({ items, label: labelProp, trackActive = true }: AnchorNavProps) {
  const t = useT();
  const label = labelProp ?? t("On this page");
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!trackActive || typeof IntersectionObserver === "undefined") return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items, trackActive]);
  return (
    <nav aria-label={label}>
      <h2
        style={{
          fontSize: typographyTokens.fontSize.sm,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: colorTokens.text.secondary,
          margin: `0 0 ${spacingTokens.xs}`,
        }}
      >
        {label}
      </h2>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          borderLeft: `2px solid ${colorTokens.border.secondary}`,
        }}
      >
        {items.map((i) => {
          const on = i.id === active;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={on ? "location" : undefined}
                onClick={(e) => {
                  const el = document.getElementById(i.id);
                  if (!el) return;
                  e.preventDefault();
                  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
                  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
                  el.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" });
                  el.focus({ preventScroll: true });
                  history.replaceState?.(null, "", `#${i.id}`);
                  setActive(i.id);
                }}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  marginLeft: -2,
                  borderLeft: `2px solid ${on ? colorTokens.interactive.primary : "transparent"}`,
                  color: on ? colorTokens.text.primary : colorTokens.text.secondary,
                  fontWeight: on ? 600 : 400,
                  textDecoration: "none",
                }}
              >
                {i.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ───────────────────────── ScrollToTop ───────────────────────── */

export interface ScrollToTopProps {
  /** Show after scrolling this far (px) @default 600 */
  threshold?: number;
  /** Element to focus after scrolling (e.g. the h1 or main) */
  focusTargetId?: string;
}

/**
 * ScrollToTop
 * Appears after scrolling down. Moves focus to the top of the page as well as
 * scrolling, so the next Tab starts from the top.
 */
export function ScrollToTop({ threshold = 600, focusTargetId }: ScrollToTopProps) {
  const t = useT();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  if (!shown) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        const el = focusTargetId
          ? document.getElementById(focusTargetId)
          : document.querySelector<HTMLElement>("main, h1");
        if (el) {
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      }}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 40,
        minHeight: 48,
        padding: "0 16px",
        borderRadius: 999,
        border: `1px solid ${colorTokens.border.control}`,
        background: colorTokens.background.primary,
        color: colorTokens.text.primary,
        boxShadow: colorTokens.shadow.md,
        font: "inherit",
        cursor: "pointer",
      }}
    >
      <span aria-hidden="true">↑ </span>
      {t("Back to top")}
    </button>
  );
}

/* ───────────────────────── LoadMoreButton ───────────────────────── */

export interface LoadMoreButtonProps {
  shown: number;
  total: number;
  onLoadMore: () => void;
  loading?: boolean;
  /** Plural noun @default 'items' */
  noun?: string;
}

/**
 * LoadMoreButton
 * Says how many are shown out of how many, and announces new totals.
 */
export function LoadMoreButton({
  shown,
  total,
  onLoadMore,
  loading,
  noun = "items",
}: LoadMoreButtonProps) {
  const done = shown >= total;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacingTokens.xs,
        padding: spacingTokens.md,
      }}
    >
      <span
        role="status"
        style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.sm }}
      >
        Showing {Math.min(shown, total)} of {total} {noun}
        {done ? ". That’s all." : ""}
      </span>
      {!done && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading}
          aria-busy={loading || undefined}
          style={{
            minHeight: 44,
            padding: "0 20px",
            borderRadius: 8,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            font: "inherit",
            cursor: loading ? "progress" : "pointer",
          }}
        >
          {loading ? "Loading…" : `Load more ${noun}`}
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── InfiniteList ───────────────────────── */

export interface InfiniteListProps<T> {
  label: string;
  items: T[];
  total: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T) => string;
  onLoadMore: () => void;
  loading?: boolean;
  noun?: string;
}

/**
 * InfiniteList
 * Loads more automatically when the end comes into view, but always keeps a
 * real "Load more" button and a count (WCAG: footer content stays reachable,
 * keyboard users stay in control). Focus is not moved when items arrive.
 */
export function InfiniteList<T>({
  label,
  items,
  total,
  renderItem,
  getKey,
  onLoadMore,
  loading,
  noun,
}: InfiniteListProps<T>) {
  const sentinel = useRef<HTMLDivElement>(null);
  const cb = useRef(onLoadMore);
  cb.current = onLoadMore;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const obs = new IntersectionObserver((e) => {
      if (e[0]?.isIntersecting && !loading && items.length < total) cb.current();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, items.length, total]);
  return (
    <section aria-label={label}>
      <ul aria-busy={loading || undefined} style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((it, i) => (
          <li key={getKey(it)} aria-posinset={i + 1} aria-setsize={total}>
            {renderItem(it, i)}
          </li>
        ))}
      </ul>
      <div ref={sentinel} aria-hidden="true" style={{ height: 1 }} />
      <LoadMoreButton
        shown={items.length}
        total={total}
        onLoadMore={onLoadMore}
        loading={loading}
        noun={noun}
      />
    </section>
  );
}
