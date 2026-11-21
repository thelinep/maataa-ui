/**
 * @maataa/ui/data/JsonExplorer
 * Data explorer page piece: an APG tree view of JSON with search, copy
 * path and expand/collapse all
 */

import React, { useMemo, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

interface Node {
  path: string;
  key: string;
  value: Json;
  depth: number;
  kids: Node[];
}

function build(v: Json, key: string, path: string, depth: number): Node {
  const kids: Node[] =
    v && typeof v === "object"
      ? Array.isArray(v)
        ? v.map((x, i) => build(x, String(i), `${path}[${i}]`, depth + 1))
        : Object.entries(v).map(([k, x]) =>
            build(
              x,
              k,
              /^[A-Za-z_$][\w$]*$/.test(k) ? `${path}.${k}` : `${path}[${JSON.stringify(k)}]`,
              depth + 1
            )
          )
      : [];
  return { path, key, value: v, depth, kids };
}

const typeWord = (v: Json) =>
  v === null
    ? "null"
    : Array.isArray(v)
      ? `array, ${v.length} items`
      : typeof v === "object"
        ? `object, ${Object.keys(v).length} keys`
        : typeof v;

function preview(v: Json): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return `[${v.length}]`;
  if (typeof v === "object") return `{${Object.keys(v).length}}`;
  if (typeof v === "string") return JSON.stringify(v.length > 60 ? `${v.slice(0, 57)}…` : v);
  return String(v);
}

export interface JsonExplorerProps {
  data: Json;
  label?: string;
  /** Depth expanded at start @default 1 */
  initialDepth?: number;
}

/**
 * JsonExplorer
 * role=tree with roving focus: Up/Down move, Right expands/enters, Left
 * collapses/goes to parent, Home/End, * expands siblings, C copies the
 * path. Each item reads
 * its key, type and value. Search filters to matching paths.
 */
export function JsonExplorer({ data, label = "Data", initialDepth = 1 }: JsonExplorerProps) {
  const root = useMemo(() => build(data, "root", "$", 0), [data]);
  const [open, setOpen] = useState<Set<string>>(() => {
    const s = new Set<string>();
    const walk = (n: Node) => {
      if (n.depth < initialDepth && n.kids.length) s.add(n.path);
      n.kids.forEach(walk);
    };
    walk(root);
    return s;
  });
  const [focus, setFocus] = useState(root.path);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const refs = useRef<Record<string, HTMLLIElement | null>>({});

  const matches = useMemo(() => {
    if (!q.trim()) return null;
    const hits = new Set<string>();
    const walk = (n: Node, anc: string[]) => {
      const hit =
        n.key.toLowerCase().includes(q.toLowerCase()) ||
        (typeof n.value !== "object" && String(n.value).toLowerCase().includes(q.toLowerCase()));
      if (hit) [...anc, n.path].forEach((p) => hits.add(p));
      n.kids.forEach((k) => walk(k, [...anc, n.path]));
    };
    walk(root, []);
    return hits;
  }, [q, root]);

  const visible: Node[] = [];
  const parent: Record<string, string> = {};
  const walk = (n: Node) => {
    if (matches && !matches.has(n.path)) return;
    visible.push(n);
    if (n.kids.length && (open.has(n.path) || matches))
      n.kids.forEach((k) => ((parent[k.path] = n.path), walk(k)));
  };
  walk(root);

  const move = (p: string) => {
    setFocus(p);
    refs.current[p]?.focus();
  };
  const toggle = (p: string, to?: boolean) =>
    setOpen((s) => {
      const nx = new Set(s);
      if (to ?? !nx.has(p)) nx.add(p);
      else nx.delete(p);
      return nx;
    });
  const all = (on: boolean) => {
    const s = new Set<string>();
    if (on) {
      const w = (n: Node) => {
        if (n.kids.length) s.add(n.path);
        n.kids.forEach(w);
      };
      w(root);
    }
    setOpen(s);
  };

  const onKey = (e: React.KeyboardEvent, n: Node) => {
    const idx = visible.findIndex((x) => x.path === n.path);
    const expanded = open.has(n.path) || !!matches;
    if (e.key === "ArrowDown") visible[idx + 1] && move(visible[idx + 1]!.path);
    else if (e.key === "ArrowUp") visible[idx - 1] && move(visible[idx - 1]!.path);
    else if (e.key === "Home") move(visible[0]!.path);
    else if (e.key === "End") move(visible[visible.length - 1]!.path);
    else if (e.key === "ArrowRight") {
      if (n.kids.length && !expanded) toggle(n.path, true);
      else if (n.kids.length) move(n.kids[0]!.path);
    } else if (e.key === "ArrowLeft") {
      if (n.kids.length && expanded && !matches) toggle(n.path, false);
      else if (parent[n.path]) move(parent[n.path]!);
    } else if (e.key === "*") {
      const p = parent[n.path];
      const sibs = p ? visible.find((x) => x.path === p)!.kids : [root];
      setOpen((s) => new Set([...s, ...sibs.filter((x) => x.kids.length).map((x) => x.path)]));
    } else if (e.key === "Enter" && n.kids.length) toggle(n.path);
    else if (e.key === "c" || e.key === "C") copy(n.path);
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  const copy = (p: string) => {
    if (navigator.clipboard?.writeText)
      navigator.clipboard.writeText(p).then(
        () => setMsg(`Copied path ${p}`),
        () => setMsg(`Path is ${p}`)
      );
    else setMsg(`Path is ${p}`);
  };

  const render = (n: Node): React.ReactNode => {
    if (matches && !matches.has(n.path)) return null;
    const expanded = open.has(n.path) || !!matches;
    const isBranch = n.kids.length > 0;
    const valueColor =
      typeof n.value === "string"
        ? colorTokens.interactive.success
        : typeof n.value === "number"
          ? colorTokens.interactive.info
          : typeof n.value === "boolean"
            ? colorTokens.interactive.error
            : colorTokens.text.secondary;
    return (
      <li
        key={n.path}
        ref={(el) => {
          refs.current[n.path] = el;
        }}
        role="treeitem"
        aria-expanded={isBranch ? expanded : undefined}
        aria-selected={n.path === focus}
        aria-label={`${n.key}: ${isBranch ? typeWord(n.value) : `${typeWord(n.value)}, ${preview(n.value)}`}`}
        tabIndex={n.path === focus ? 0 : -1}
        onKeyDown={(e) => onKey(e, n)}
        onFocus={(e) => {
          e.stopPropagation();
          setFocus(n.path);
        }}
        style={{ listStyle: "none", outlineOffset: -2 }}
      >
        <div
          onClick={() => {
            move(n.path);
            if (isBranch) toggle(n.path);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            minHeight: 28,
            paddingLeft: n.depth * 18,
            cursor: isBranch ? "pointer" : "default",
            background: n.path === focus ? colorTokens.background.tertiary : undefined,
            borderRadius: 4,
          }}
        >
          <span aria-hidden="true" style={{ width: 14, color: colorTokens.text.tertiary }}>
            {isBranch ? (expanded ? "▾" : "▸") : ""}
          </span>
          <span style={{ fontWeight: 600 }}>{n.key}</span>
          <span style={{ color: colorTokens.text.tertiary }}>:</span>
          <span style={{ color: valueColor }}>{preview(n.value)}</span>
          {n.path === focus && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                copy(n.path);
              }}
              style={{
                marginLeft: "auto",
                minHeight: 24,
                padding: "0 8px",
                border: `1px solid ${colorTokens.border.control}`,
                borderRadius: 4,
                background: colorTokens.background.primary,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Copy path
            </button>
          )}
        </div>
        {isBranch && expanded && (
          <ul role="group" style={{ margin: 0, padding: 0 }}>
            {n.kids.map(render)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <section
      aria-label={label}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div
        style={{ display: "flex", gap: spacingTokens.sm, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: typographyTokens.fontSize.sm,
            flex: 1,
            minWidth: 200,
          }}
        >
          Filter keys and values
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              minHeight: 40,
              padding: "0 10px",
              border: `2px solid ${colorTokens.border.control}`,
              borderRadius: 6,
              font: "inherit",
              background: colorTokens.background.primary,
              color: colorTokens.text.primary,
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => all(true)}
          style={{
            minHeight: 40,
            padding: "0 12px",
            borderRadius: 6,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={() => all(false)}
          style={{
            minHeight: 40,
            padding: "0 12px",
            borderRadius: 6,
            border: `1px solid ${colorTokens.border.control}`,
            background: colorTokens.background.primary,
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Collapse all
        </button>
      </div>
      <div style={{ fontSize: 12, color: colorTokens.text.secondary }}>
        Path: <code>{focus}</code> · Right or Enter opens, Left closes, C copies the path.
      </div>
      <ul
        role="tree"
        aria-label={label}
        style={{
          margin: 0,
          padding: 8,
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          background: colorTokens.background.primary,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          maxHeight: 420,
          overflow: "auto",
        }}
      >
        {render(root)}
      </ul>
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </section>
  );
}
