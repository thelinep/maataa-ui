/**
 * @maataa/ui/actions/ContextMenu
 * Right-click menu for an area, also opened with Shift+F10 or the Menu key,
 * with an optional visible "More actions" button so it is never hidden-only
 */

import React, { useId, useRef, useState } from "react";
import { colorTokens } from "../tokens";
import { MenuPopup, type MenuAction } from "./MenuButton";

export interface ContextMenuProps {
  /** Names the menu, e.g. "Actions for Scene 12" */
  label: string;
  items: MenuAction[];
  children: React.ReactNode;
  /** Also render a visible button that opens the same menu @default true */
  showButton?: boolean;
  style?: React.CSSProperties;
}

/**
 * ContextMenu
 * The wrapped content must contain something focusable (or is made focusable)
 * so the keyboard shortcut works. Focus returns to where it was on close.
 */
export function ContextMenu({
  label,
  items,
  children,
  showButton = true,
  style,
}: ContextMenuProps) {
  const id = useId();
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const openAt = (x: number, y: number) => {
    returnTo.current = document.activeElement as HTMLElement | null;
    setAt({ x, y });
  };

  return (
    <div
      ref={box}
      tabIndex={-1}
      onContextMenu={(e) => {
        e.preventDefault();
        const r = box.current!.getBoundingClientRect();
        openAt(e.clientX - r.left, e.clientY - r.top);
      }}
      onKeyDown={(e) => {
        if ((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu") {
          e.preventDefault();
          const r = box.current!.getBoundingClientRect();
          const t = (e.target as HTMLElement).getBoundingClientRect();
          openAt(t.left - r.left + 8, t.bottom - r.top + 4);
        }
      }}
      style={{ position: "relative", outline: "none", ...style }}
    >
      {children}
      {showButton && (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={!!at}
          aria-controls={at ? id : undefined}
          aria-label={`More actions: ${label}`}
          onClick={(e) => {
            const r = box.current!.getBoundingClientRect();
            const b = e.currentTarget.getBoundingClientRect();
            openAt(b.right - r.left - 200, b.bottom - r.top + 4);
          }}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 36,
            height: 36,
            border: `1px solid ${colorTokens.border.control}`,
            borderRadius: 8,
            background: colorTokens.background.primary,
            color: colorTokens.text.primary,
            cursor: "pointer",
            font: "inherit",
          }}
        >
          <span aria-hidden="true">⋯</span>
        </button>
      )}
      {at && (
        <MenuPopup
          id={id}
          label={label}
          items={items}
          onClose={(rf) => {
            setAt(null);
            if (rf) (returnTo.current ?? box.current)?.focus();
          }}
          style={{ left: Math.max(0, at.x), top: at.y }}
        />
      )}
    </div>
  );
}
