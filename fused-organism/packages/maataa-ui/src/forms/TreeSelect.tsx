/**
 * @maataa/ui/forms/TreeSelect
 * Choose items from a hierarchy (departments → roles, territories → regions)
 * with native checkboxes; parents show "some selected" as a mixed state
 */

import React, { useEffect, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeSelectProps {
  legend: string;
  nodes: TreeNode[];
  /** Selected leaf values */
  value: string[];
  onChange: (value: string[]) => void;
  /** Values of nodes that start expanded */
  defaultExpanded?: string[];
  hint?: React.ReactNode;
}

/** All leaf values under a node (the node itself if it is a leaf) */
export function leavesOf(node: TreeNode): string[] {
  return node.children?.length ? node.children.flatMap(leavesOf) : [node.value];
}

function Box({
  checked,
  mixed,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  mixed: boolean;
  onChange: (on: boolean) => void;
  label: string;
  detail?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 36,
        cursor: "pointer",
      }}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 20, height: 20, accentColor: colorTokens.interactive.primary }}
      />
      {label}
      {detail && " "}
      {detail && (
        <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}>
          {detail}
        </span>
      )}
    </label>
  );
}

/**
 * TreeSelect
 * Each branch has a Show/Hide button (aria-expanded) and a checkbox that
 * selects or clears everything under it. The count chosen per branch is shown.
 */
export function TreeSelect({
  legend,
  nodes,
  value,
  onChange,
  defaultExpanded = [],
  hint,
}: TreeSelectProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultExpanded));
  const selected = new Set(value);

  const setMany = (vals: string[], on: boolean) => {
    const next = new Set(selected);
    vals.forEach((v) => (on ? next.add(v) : next.delete(v)));
    onChange([...next]);
  };

  const render = (list: TreeNode[], depth: number): React.ReactNode => (
    <ul style={{ listStyle: "none", margin: 0, paddingLeft: depth ? 28 : 0 }}>
      {list.map((n) => {
        const leaves = leavesOf(n);
        const count = leaves.filter((l) => selected.has(l)).length;
        const isBranch = !!n.children?.length;
        const expanded = open.has(n.value);
        return (
          <li key={n.value}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {isBranch ? (
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? "Hide" : "Show"} ${n.label}`}
                  onClick={() =>
                    setOpen((s) => {
                      const nx = new Set(s);
                      if (nx.has(n.value)) nx.delete(n.value);
                      else nx.add(n.value);
                      return nx;
                    })
                  }
                  style={{
                    width: 32,
                    height: 32,
                    border: 0,
                    background: "transparent",
                    color: colorTokens.text.secondary,
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      transform: expanded ? "rotate(90deg)" : undefined,
                    }}
                  >
                    ▸
                  </span>
                </button>
              ) : (
                <span style={{ width: 32 }} />
              )}
              <Box
                label={n.label}
                checked={count === leaves.length}
                mixed={count > 0 && count < leaves.length}
                onChange={(on) => setMany(leaves, on)}
                detail={isBranch ? `${count} of ${leaves.length}` : undefined}
              />
            </div>
            {isBranch && expanded && render(n.children!, depth + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
      <legend style={{ fontWeight: 500, padding: 0, marginBottom: spacingTokens.xs }}>
        {legend}
      </legend>
      {hint && (
        <div
          style={{
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.xs,
            marginBottom: spacingTokens.xs,
          }}
        >
          {hint}
        </div>
      )}
      {render(nodes, 0)}
      <div
        style={{
          marginTop: spacingTokens.xs,
          fontSize: typographyTokens.fontSize.sm,
          color: colorTokens.text.secondary,
        }}
      >
        {value.length} selected
      </div>
    </fieldset>
  );
}
