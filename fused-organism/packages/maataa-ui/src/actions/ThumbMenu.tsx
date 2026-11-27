/**
 * @maataa/ui/actions/ThumbMenu
 * Quick actions within reach of one thumb: a floating button that opens an
 * arc of large buttons, a stack, or a bottom sheet, on the side of the hand
 * the person uses.
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { useT } from "../i18n/LocaleProvider";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import type { MenuAction } from "./MenuButton";

export type ThumbHand = "right" | "left";
export type ThumbMenuLayout = "auto" | "arc" | "stack" | "sheet";

export interface ThumbMenuProps {
  /** Name of the floating button, e.g. "Quick actions". */
  label: string;
  items: MenuAction[];
  /** Icon on the floating button. @default "☰" */
  icon?: React.ReactNode;
  /** Which hand. Leave unset to use (and remember) the person's choice; right by default. */
  hand?: ThumbHand;
  /** Called when the person switches hands from the menu. */
  onHandChange?: (hand: ThumbHand) => void;
  /** Add a "Switch to left/right hand" item. @default true */
  showHandSwitch?: boolean;
  /**
   * `arc`: up to 4 big round buttons in a quarter circle; `stack`: a column of
   * wide buttons; `sheet`: a bottom sheet grid for many actions.
   * `auto` picks by count (≤4 arc, ≤7 stack, more sheet). @default "auto"
   */
  layout?: ThumbMenuLayout;
  /** Fixed to the screen corner. @default true */
  fixed?: boolean;
  /** Short vibration when opening, where the device supports it. @default false */
  haptics?: boolean;
  /** localStorage key for the remembered hand. @default "maataa-thumb-hand" */
  storageKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ARC_RADIUS = 132;
const BUTTON = 56;

function readHand(key: string): ThumbHand | null {
  try {
    const v = window.localStorage.getItem(key);
    return v === "left" || v === "right" ? v : null;
  } catch {
    return null;
  }
}

/**
 * ThumbMenu
 * The floating button has `aria-haspopup="menu"`. The menu is `role="menu"`
 * with roving focus: arrow keys move, Home/End jump, a letter jumps to the
 * next item starting with it, Enter/Space choose, Escape closes and returns
 * focus. Every action shows its label; nothing is icon-only.
 *
 * @example
 * ```tsx
 * <ThumbMenu label="Quick actions" items={[
 *   { id: "call", label: "New call sheet", icon: "📄", onSelect: create },
 *   { id: "scan", label: "Scan receipt", icon: "📷", onSelect: scan },
 * ]} />
 * ```
 */
export function ThumbMenu({
  label,
  items,
  icon = "☰",
  hand: handProp,
  onHandChange,
  showHandSwitch = true,
  layout = "auto",
  fixed = true,
  haptics = false,
  storageKey = "maataa-thumb-hand",
  className,
  style,
}: ThumbMenuProps) {
  const t = useT();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [storedHand, setStoredHand] = useState<ThumbHand>("right");
  const [cur, setCur] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const saved = readHand(storageKey);
    if (saved) setStoredHand(saved);
  }, [storageKey]);

  const hand = handProp ?? storedHand;
  const switchHand = () => {
    const next: ThumbHand = hand === "right" ? "left" : "right";
    if (handProp === undefined) setStoredHand(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Not remembered, still applied.
    }
    onHandChange?.(next);
  };

  const all: MenuAction[] = showHandSwitch
    ? [
        ...items,
        {
          id: "__hand",
          label: hand === "right" ? t("Switch to left hand") : t("Switch to right hand"),
          icon: "✋",
          onSelect: switchHand,
        },
      ]
    : items;
  const shape: Exclude<ThumbMenuLayout, "auto"> =
    layout !== "auto" ? layout : all.length <= 4 ? "arc" : all.length <= 7 ? "stack" : "sheet";
  const enabled = all.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  };
  const openAt = (which: "first" | "last") => {
    setCur(which === "first" ? (enabled[0] ?? 0) : (enabled[enabled.length - 1] ?? 0));
    setOpen(true);
    if (haptics && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore devices that refuse.
      }
    }
  };

  useEffect(() => {
    if (open) refs.current[cur]?.focus();
  }, [open, cur]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const move = (d: number) => {
    const p = enabled.indexOf(cur);
    setCur(enabled[(p + d + enabled.length) % enabled.length]!);
  };
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") move(1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(-1);
    else if (e.key === "Home") setCur(enabled[0]!);
    else if (e.key === "End") setCur(enabled[enabled.length - 1]!);
    else if (e.key === "Escape") close(true);
    else if (e.key === "Tab") {
      close(false);
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase();
      const p = enabled.indexOf(cur);
      const order = [...enabled.slice(p + 1), ...enabled.slice(0, p + 1)];
      const hit = order.find((i) => all[i]!.label.toLowerCase().startsWith(k));
      if (hit !== undefined) setCur(hit);
    } else return;
    e.preventDefault();
  };

  const side = hand === "right" ? "right" : "left";
  const choose = (item: MenuAction) => {
    if (item.disabled) return;
    close(true);
    item.onSelect();
  };

  const itemColor = (it: MenuAction) =>
    it.disabled
      ? colorTokens.text.disabled
      : it.danger
        ? colorTokens.interactive.error
        : colorTokens.text.primary;

  const itemButton = (
    it: MenuAction,
    i: number,
    extra: React.CSSProperties,
    inner: React.ReactNode
  ) => (
    <li key={it.id} role="none" style={{ listStyle: "none" }}>
      <button
        ref={(el) => {
          refs.current[i] = el;
        }}
        type="button"
        role="menuitem"
        tabIndex={i === cur ? 0 : -1}
        aria-disabled={it.disabled || undefined}
        onClick={() => choose(it)}
        onFocus={() => setCur(i)}
        style={{
          border: `1px solid ${colorTokens.border.control}`,
          background: colorTokens.background.primary,
          color: itemColor(it),
          font: "inherit",
          cursor: it.disabled ? "not-allowed" : "pointer",
          boxShadow: colorTokens.shadow.md,
          ...extra,
        }}
      >
        {inner}
      </button>
    </li>
  );

  let menu: React.ReactNode = null;
  if (open) {
    const common = {
      id: menuId,
      role: "menu" as const,
      "aria-label": label,
      onKeyDown: onMenuKey,
      className: "maataa-thumb-menu",
    };
    if (shape === "arc") {
      const n = all.length;
      menu = (
        <ul {...common} style={{ margin: 0, padding: 0 }}>
          {all.map((it, i) => {
            // Spread from beside the button (0°) to straight above it (90°).
            const angle = n === 1 ? Math.PI / 4 : (i / (n - 1)) * (Math.PI / 2);
            const dx = Math.cos(angle) * ARC_RADIUS;
            const dy = Math.sin(angle) * ARC_RADIUS;
            return itemButton(
              it,
              i,
              {
                position: "absolute",
                bottom: dy,
                [side]: dx,
                width: BUTTON,
                height: BUTTON,
                borderRadius: radiusTokens.full,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              },
              <>
                <span aria-hidden="true">{it.icon ?? it.label.slice(0, 1)}</span>
                <span
                  style={{
                    position: "absolute",
                    top: "100%",
                    marginTop: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    fontSize: typographyTokens.fontSize.xs,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: radiusTokens.md,
                    background: colorTokens.background.primary,
                    color: itemColor(it),
                    border: `1px solid ${colorTokens.border.secondary}`,
                  }}
                >
                  {it.label}
                </span>
              </>
            );
          })}
        </ul>
      );
    } else if (shape === "stack") {
      menu = (
        <ul
          {...common}
          style={{
            position: "absolute",
            bottom: BUTTON + 12,
            [side]: 0,
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: hand === "right" ? "flex-end" : "flex-start",
            gap: spacingTokens.sm,
          }}
        >
          {all.map((it, i) =>
            itemButton(
              it,
              i,
              {
                minHeight: 48,
                padding: `0 ${spacingTokens.md}`,
                borderRadius: radiusTokens.full,
                display: "inline-flex",
                alignItems: "center",
                gap: spacingTokens.sm,
                fontWeight: 600,
                flexDirection: hand === "right" ? "row-reverse" : "row",
                whiteSpace: "nowrap",
              },
              <>
                <span aria-hidden="true" style={{ fontSize: 20 }}>
                  {it.icon}
                </span>
                <span>{it.label}</span>
                {it.hint && (
                  <span
                    style={{ fontWeight: 400, color: colorTokens.text.secondary, fontSize: 12 }}
                  >
                    {it.hint}
                  </span>
                )}
              </>
            )
          )}
        </ul>
      );
    } else {
      menu = (
        <>
          <div
            aria-hidden="true"
            onClick={() => close(true)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)" }}
          />
          <ul
            {...common}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              margin: 0,
              padding: `${spacingTokens.md} ${spacingTokens.md} calc(${BUTTON + 36}px + env(safe-area-inset-bottom, 0px))`,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: spacingTokens.sm,
              background: colorTokens.background.secondary,
              borderTop: `1px solid ${colorTokens.border.primary}`,
              borderRadius: `${radiusTokens.xl} ${radiusTokens.xl} 0 0`,
              boxShadow: colorTokens.shadow.xl,
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {all.map((it, i) =>
              itemButton(
                it,
                i,
                {
                  width: "100%",
                  minHeight: 64,
                  padding: spacingTokens.sm,
                  borderRadius: radiusTokens.lg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  fontWeight: 600,
                  boxShadow: "none",
                },
                <>
                  <span aria-hidden="true" style={{ fontSize: 22 }}>
                    {it.icon}
                  </span>
                  <span>{it.label}</span>
                </>
              )
            )}
          </ul>
        </>
      );
    }
  }

  return (
    <div
      ref={wrap}
      className={className}
      style={{
        position: fixed ? "fixed" : "relative",
        bottom: fixed ? "calc(24px + env(safe-area-inset-bottom, 0px))" : undefined,
        [side]: fixed ? 24 : undefined,
        width: BUTTON,
        height: BUTTON,
        zIndex: 60,
        ...style,
      }}
    >
      <style>{`@media (prefers-reduced-motion: no-preference){.maataa-thumb-menu li{animation:maataa-thumb-in 120ms ease-out both}}@keyframes maataa-thumb-in{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}`}</style>
      {menu}
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        onClick={() => (open ? close(false) : openAt("first"))}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") openAt("last");
          else if (e.key === "ArrowDown") openAt("first");
          else return;
          e.preventDefault();
        }}
        style={{
          position: "relative",
          zIndex: 1,
          width: BUTTON,
          height: BUTTON,
          borderRadius: radiusTokens.full,
          border: 0,
          background: colorTokens.interactive.primary,
          color: colorTokens.text.inverse,
          boxShadow: colorTokens.shadow.lg,
          fontSize: 24,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          aria-hidden="true"
          style={{ transform: open ? "rotate(90deg)" : undefined, transition: "transform 150ms" }}
        >
          {open ? "✕" : icon}
        </span>
      </button>
    </div>
  );
}

ThumbMenu.displayName = "ThumbMenu";
