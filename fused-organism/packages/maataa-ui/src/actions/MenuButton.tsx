/**
 * @maataa/ui/actions/MenuButton
 * APG menu button and the menus built on it: SplitButton, ShareMenu, FabMenu.
 * MenuPopup is shared with ContextMenu.
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

export interface MenuAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Extra text, e.g. a shortcut */
  hint?: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface MenuPopupProps {
  id: string;
  label: string;
  items: MenuAction[];
  onClose: (returnFocus: boolean) => void;
  style?: React.CSSProperties;
  /** Which item gets focus first @default 'first' */
  initialFocus?: "first" | "last";
}

/**
 * MenuPopup
 * role="menu" with roving focus: arrows, Home/End, type a letter to jump,
 * Enter/Space to choose, Escape or Tab to close.
 */
export function MenuPopup({
  id,
  label,
  items,
  onClose,
  style,
  initialFocus = "first",
}: MenuPopupProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
  const [cur, setCur] = useState(
    initialFocus === "first" ? (enabled[0] ?? 0) : (enabled[enabled.length - 1] ?? 0)
  );
  useEffect(() => {
    refs.current[cur]?.focus();
  }, [cur]);
  const move = (d: number) => {
    const p = enabled.indexOf(cur);
    setCur(enabled[(p + d + enabled.length) % enabled.length]!);
  };
  return (
    <ul
      id={id}
      role="menu"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") move(1);
        else if (e.key === "ArrowUp") move(-1);
        else if (e.key === "Home") setCur(enabled[0]!);
        else if (e.key === "End") setCur(enabled[enabled.length - 1]!);
        else if (e.key === "Escape") onClose(true);
        else if (e.key === "Tab") {
          onClose(false);
          return;
        } else if (e.key.length === 1 && /\S/.test(e.key)) {
          const k = e.key.toLowerCase();
          const order = [
            ...enabled.slice(enabled.indexOf(cur) + 1),
            ...enabled.slice(0, enabled.indexOf(cur) + 1),
          ];
          const hit = order.find((i) => items[i]!.label.toLowerCase().startsWith(k));
          if (hit !== undefined) setCur(hit);
        } else return;
        e.preventDefault();
      }}
      style={{
        position: "absolute",
        zIndex: 70,
        minWidth: 200,
        margin: 0,
        padding: 4,
        listStyle: "none",
        background: colorTokens.background.primary,
        border: `1px solid ${colorTokens.border.control}`,
        borderRadius: 10,
        boxShadow: colorTokens.shadow.lg,
        ...style,
      }}
    >
      {items.map((it, i) => (
        <li key={it.id} role="none">
          <button
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="menuitem"
            tabIndex={i === cur ? 0 : -1}
            aria-disabled={it.disabled || undefined}
            onClick={() => {
              if (it.disabled) return;
              onClose(true);
              it.onSelect();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              minHeight: 40,
              padding: "0 12px",
              border: 0,
              borderRadius: 6,
              background: "transparent",
              color: it.disabled
                ? colorTokens.text.disabled
                : it.danger
                  ? colorTokens.interactive.error
                  : colorTokens.text.primary,
              font: "inherit",
              textAlign: "left",
              cursor: it.disabled ? "not-allowed" : "pointer",
            }}
          >
            {it.icon && (
              <span aria-hidden="true" style={{ width: 20, textAlign: "center" }}>
                {it.icon}
              </span>
            )}
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.hint && (
              <span
                style={{
                  color: colorTokens.text.secondary,
                  fontSize: typographyTokens.fontSize.xs,
                }}
              >
                {it.hint}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Closes when clicking outside `ref` */
function useOutside(ref: React.RefObject<HTMLElement>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return undefined;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, close, ref]);
}

const baseBtn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 14px",
  border: `1px solid ${colorTokens.border.control}`,
  background: colorTokens.background.primary,
  color: colorTokens.text.primary,
  font: "inherit",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

/* ───────────────────────── MenuButton ───────────────────────── */

export interface MenuButtonProps {
  /** Visible button text */
  label: React.ReactNode;
  /** Accessible name when label is an icon */
  ariaLabel?: string;
  items: MenuAction[];
  /** Names the menu @default button text */
  menuLabel?: string;
  align?: "start" | "end";
  buttonStyle?: React.CSSProperties;
}

/**
 * MenuButton
 * Enter, Space or Down opens on the first item; Up opens on the last.
 */
export function MenuButton({
  label,
  ariaLabel,
  items,
  menuLabel,
  align = "start",
  buttonStyle,
}: MenuButtonProps) {
  const id = useId();
  const [open, setOpen] = useState<false | "first" | "last">(false);
  const btn = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const close = (rf: boolean) => {
    setOpen(false);
    if (rf) btn.current?.focus();
  };
  useOutside(wrap, !!open, () => setOpen(false));
  return (
    <div ref={wrap} style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={!!open}
        aria-controls={open ? id : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => (o ? false : "first"))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setOpen("first");
          else if (e.key === "ArrowUp") setOpen("last");
          else return;
          e.preventDefault();
        }}
        style={{ ...baseBtn, borderRadius: 8, ...buttonStyle }}
      >
        {label}
        <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <MenuPopup
          id={id}
          label={menuLabel ?? ariaLabel ?? (typeof label === "string" ? label : "Menu")}
          items={items}
          onClose={close}
          initialFocus={open}
          style={{ top: "calc(100% + 4px)", [align === "end" ? "right" : "left"]: 0 }}
        />
      )}
    </div>
  );
}

/* ───────────────────────── SplitButton ───────────────────────── */

export interface SplitButtonProps {
  /** The default action */
  label: string;
  onClick: () => void;
  /** Other actions in the menu */
  items: MenuAction[];
  /** Names the arrow button @default `More ${label} options` */
  moreLabel?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/**
 * SplitButton
 * Two real buttons: the main action, and a menu button named e.g. "More save
 * options". Both are in the tab order.
 */
export function SplitButton({
  label,
  onClick,
  items,
  moreLabel,
  variant = "primary",
  disabled,
}: SplitButtonProps) {
  const primary = variant === "primary";
  const look: React.CSSProperties = primary
    ? {
        background: colorTokens.interactive.primary,
        color: colorTokens.text.inverse,
        border: `1px solid ${colorTokens.interactive.primary}`,
      }
    : {};
  return (
    <div role="group" aria-label={label} style={{ display: "inline-flex" }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          ...baseBtn,
          ...look,
          borderRadius: "8px 0 0 8px",
          fontWeight: 600,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
      </button>
      <MenuButton
        label={
          <VisuallyHidden>{moreLabel ?? `More ${label.toLowerCase()} options`}</VisuallyHidden>
        }
        items={items}
        menuLabel={moreLabel ?? `More ${label.toLowerCase()} options`}
        align="end"
        buttonStyle={{
          ...look,
          borderRadius: "0 8px 8px 0",
          borderLeft: `1px solid ${primary ? colorTokens.background.primary : colorTokens.border.control}`,
          padding: "0 10px",
          gap: 0,
        }}
      />
    </div>
  );
}

/* ───────────────────────── ShareMenu ───────────────────────── */

export interface ShareMenuProps {
  url: string;
  title: string;
  text?: string;
  /** Extra targets, e.g. WhatsApp or email links */
  targets?: {
    id: string;
    label: string;
    href: (url: string, title: string) => string;
    icon?: React.ReactNode;
  }[];
  label?: string;
}

export const defaultShareTargets: NonNullable<ShareMenuProps["targets"]> = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    id: "email",
    label: "Email",
    href: (u, t) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`,
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: (u, t) =>
      `https://x.com/intent/post?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
  },
];

/**
 * ShareMenu
 * Uses the device's share sheet when it exists; otherwise a menu of Copy link
 * and share targets. The outcome is announced.
 */
export function ShareMenu({
  url,
  title,
  text,
  targets = defaultShareTargets,
  label = "Share",
}: ShareMenuProps) {
  const [msg, setMsg] = useState("");
  const items: MenuAction[] = [
    ...(typeof navigator !== "undefined" && "share" in navigator
      ? [
          {
            id: "native",
            label: "Share with an app…",
            onSelect: () => {
              navigator.share({ url, title, text }).catch(() => undefined);
            },
          },
        ]
      : []),
    {
      id: "copy",
      label: "Copy link",
      onSelect: () => {
        const done = () => setMsg("Link copied.");
        const failed = () => setMsg(`Couldn’t copy. The link is ${url}`);
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, failed);
        else failed();
      },
    },
    ...targets.map((t) => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      onSelect: () => {
        window.open(t.href(url, title), "_blank", "noopener,noreferrer");
        setMsg(`Opened ${t.label} in a new tab.`);
      },
    })),
  ];
  return (
    <>
      <MenuButton label={label} items={items} menuLabel={`${label} ${title}`} />
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </>
  );
}

/* ───────────────────────── FabMenu ───────────────────────── */

export interface FabMenuProps {
  /** Name of the button, e.g. "Create" */
  label: string;
  items: MenuAction[];
  icon?: React.ReactNode;
  position?: "bottom-right" | "bottom-left";
  /** Fixed to the viewport @default true */
  fixed?: boolean;
}

/**
 * FabMenu
 * A floating action button that opens a menu of quick actions (opens
 * upwards). The visible label is kept on wide screens.
 */
export function FabMenu({
  label,
  items,
  icon = "+",
  position = "bottom-right",
  fixed = true,
}: FabMenuProps) {
  const id = useId();
  const [open, setOpen] = useState<false | "first" | "last">(false);
  const btn = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useOutside(wrap, !!open, () => setOpen(false));
  const side = position === "bottom-right" ? "right" : "left";
  return (
    <div
      ref={wrap}
      style={{
        position: fixed ? "fixed" : "relative",
        bottom: fixed ? 24 : undefined,
        [side]: fixed ? 24 : undefined,
        zIndex: 60,
      }}
    >
      {open && (
        <MenuPopup
          id={id}
          label={label}
          items={items}
          initialFocus={open}
          onClose={(rf) => {
            setOpen(false);
            if (rf) btn.current?.focus();
          }}
          style={{ bottom: "calc(100% + 10px)", [side]: 0 }}
        />
      )}
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={!!open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => (o ? false : "first"))}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") setOpen("last");
          else if (e.key === "ArrowDown") setOpen("first");
          else return;
          e.preventDefault();
        }}
        style={{
          minHeight: 56,
          minWidth: 56,
          padding: "0 20px 0 16px",
          borderRadius: 999,
          border: 0,
          background: colorTokens.interactive.primary,
          color: colorTokens.text.inverse,
          boxShadow: colorTokens.shadow.lg,
          font: "inherit",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: spacingTokens.xs,
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: 26,
            lineHeight: 1,
            transform: open ? "rotate(45deg)" : undefined,
            transition: "transform 150ms",
          }}
        >
          {icon}
        </span>
        {label}
      </button>
    </div>
  );
}
