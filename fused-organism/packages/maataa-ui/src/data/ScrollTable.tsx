/**
 * @maataa/ui/data/ScrollTable
 * Wrapper that lets a wide table scroll sideways, by keyboard too
 */

import React from "react";
import { colorTokens } from "../tokens";

export interface ScrollTableProps {
  /** Names the scroll region, usually the table caption */
  label: string;
  children: React.ReactNode;
}

/**
 * ScrollTable
 * A focusable, named region (WCAG 2.1.1 / axe scrollable-region-focusable)
 * so keyboard users can scroll a table that is wider than its container.
 */
export function ScrollTable({ label, children }: ScrollTableProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      style={{
        overflowX: "auto",
        maxWidth: "100%",
        outlineOffset: 2,
        borderRadius: 4,
        scrollbarColor: `${colorTokens.border.control} transparent`,
      }}
    >
      {children}
    </div>
  );
}
ScrollTable.displayName = "ScrollTable";
