/**
 * @maataa/ui/navigation/TabVariants
 * VerticalTabs (side tab list) and SegmentedTabs (pill-style tab list):
 * both are full APG tabs with roving focus and automatic activation
 */

import React, { useId, useRef } from "react";
import { colorTokens, spacingTokens } from "../tokens";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  /** Small count after the label, e.g. unread */
  badge?: number;
  disabled?: boolean;
}

interface BaseTabsProps {
  /** Names the tab list */
  label: string;
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
}

function useTabs({ tabs, value, onChange }: BaseTabsProps, orientation: "horizontal" | "vertical") {
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const pos = enabled.indexOf(i);
    const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    let to: number | undefined;
    if (e.key === next) to = enabled[(pos + 1) % enabled.length];
    else if (e.key === prev) to = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") to = enabled[0];
    else if (e.key === "End") to = enabled[enabled.length - 1];
    if (to === undefined) return;
    e.preventDefault();
    onChange(tabs[to]!.id);
    refs.current[to]?.focus();
  };
  const tabProps = (t: TabItem, i: number) => ({
    ref: (el: HTMLButtonElement | null) => {
      refs.current[i] = el;
    },
    id: `${base}-tab-${t.id}`,
    role: "tab" as const,
    type: "button" as const,
    "aria-selected": t.id === value,
    "aria-controls": `${base}-panel-${t.id}`,
    tabIndex: t.id === value ? 0 : -1,
    disabled: t.disabled,
    onClick: () => onChange(t.id),
    onKeyDown: (e: React.KeyboardEvent) => onKeyDown(e, i),
  });
  const panel = tabs.find((t) => t.id === value);
  const panelEl = panel ? (
    <div
      role="tabpanel"
      id={`${base}-panel-${panel.id}`}
      aria-labelledby={`${base}-tab-${panel.id}`}
      tabIndex={0}
      style={{ flex: 1, minWidth: 0, padding: spacingTokens.md }}
    >
      {panel.content}
    </div>
  ) : null;
  return { tabProps, panelEl };
}

function Badge({ n }: { n?: number }) {
  if (n == null) return null;
  return (
    <span
      style={{
        marginLeft: 6,
        minWidth: 20,
        padding: "0 6px",
        borderRadius: 999,
        background: colorTokens.background.tertiary,
        color: colorTokens.text.primary,
        fontSize: 12,
        lineHeight: "20px",
        display: "inline-block",
        textAlign: "center",
      }}
    >
      {n}
    </span>
  );
}

export type VerticalTabsProps = BaseTabsProps;

/**
 * VerticalTabs
 * Tab list on the left (Up/Down arrows), panel on the right. Stacks on narrow
 * screens via flex-wrap.
 */
export function VerticalTabs(props: VerticalTabsProps) {
  const { tabProps, panelEl } = useTabs(props, "vertical");
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.md, alignItems: "flex-start" }}
    >
      <div
        role="tablist"
        aria-label={props.label}
        aria-orientation="vertical"
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 180,
          borderRight: `1px solid ${colorTokens.border.secondary}`,
        }}
      >
        {props.tabs.map((t, i) => {
          const on = t.id === props.value;
          return (
            <button
              key={t.id}
              {...tabProps(t, i)}
              style={{
                textAlign: "left",
                minHeight: 44,
                padding: "0 16px",
                border: 0,
                borderRight: `3px solid ${on ? colorTokens.interactive.primary : "transparent"}`,
                marginRight: -1,
                background: on ? colorTokens.background.tertiary : "transparent",
                color: t.disabled
                  ? colorTokens.text.disabled
                  : on
                    ? colorTokens.text.primary
                    : colorTokens.text.secondary,
                fontWeight: on ? 600 : 500,
                font: "inherit",
                cursor: t.disabled ? "not-allowed" : "pointer",
              }}
            >
              {t.label}
              <Badge n={t.badge} />
            </button>
          );
        })}
      </div>
      {panelEl}
    </div>
  );
}

export type SegmentedTabsProps = BaseTabsProps;

/**
 * SegmentedTabs
 * Tabs drawn as a pill switch (Left/Right arrows). Use for 2–5 views of the
 * same content; for choosing a value in a form, use SegmentedControl.
 */
export function SegmentedTabs(props: SegmentedTabsProps) {
  const { tabProps, panelEl } = useTabs(props, "horizontal");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      <div
        role="tablist"
        aria-label={props.label}
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          gap: 2,
          padding: 3,
          borderRadius: 10,
          background: colorTokens.background.tertiary,
          border: `1px solid ${colorTokens.border.control}`,
        }}
      >
        {props.tabs.map((t, i) => {
          const on = t.id === props.value;
          return (
            <button
              key={t.id}
              {...tabProps(t, i)}
              style={{
                minHeight: 38,
                padding: "0 16px",
                border: 0,
                borderRadius: 8,
                background: on ? colorTokens.background.primary : "transparent",
                boxShadow: on ? colorTokens.shadow.sm : undefined,
                color: t.disabled
                  ? colorTokens.text.disabled
                  : on
                    ? colorTokens.text.primary
                    : colorTokens.text.secondary,
                fontWeight: on ? 600 : 500,
                font: "inherit",
                cursor: t.disabled ? "not-allowed" : "pointer",
              }}
            >
              {t.label}
              <Badge n={t.badge} />
            </button>
          );
        })}
      </div>
      {panelEl}
    </div>
  );
}
