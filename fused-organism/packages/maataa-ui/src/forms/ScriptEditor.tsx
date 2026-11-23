/**
 * @maataa/ui/forms/ScriptEditor
 * Screenplay editor: elements (scene heading, action, character, dialogue…)
 * with a format toolbar, scene navigator and character tracker
 */

import { useT, msg } from "../i18n/LocaleProvider";
import React, { useEffect, useId, useLayoutEffect, useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type ScriptElementType =
  "scene" | "action" | "character" | "parenthetical" | "dialogue" | "transition";

export interface ScriptElement {
  id: string;
  type: ScriptElementType;
  text: string;
}

export const elementLabels: Record<ScriptElementType, { label: string; key: string }> = {
  scene: { label: msg("Scene heading"), key: "1" },
  action: { label: msg("Action"), key: "2" },
  character: { label: msg("Character"), key: "3" },
  parenthetical: { label: msg("Parenthetical"), key: "4" },
  dialogue: { label: msg("Dialogue"), key: "5" },
  transition: { label: msg("Transition"), key: "6" },
};

const order: ScriptElementType[] = [
  "scene",
  "action",
  "character",
  "parenthetical",
  "dialogue",
  "transition",
];

/** What usually follows a given element when you press Enter */
export const nextElementType: Record<ScriptElementType, ScriptElementType> = {
  scene: "action",
  action: "action",
  character: "dialogue",
  parenthetical: "dialogue",
  dialogue: "character",
  transition: "scene",
};

const layout: Record<ScriptElementType, React.CSSProperties> = {
  scene: { textTransform: "uppercase", fontWeight: 700, marginTop: 18 },
  action: {},
  character: { textTransform: "uppercase", marginLeft: "38%", marginTop: 12 },
  parenthetical: { marginLeft: "30%", marginRight: "28%" },
  dialogue: { marginLeft: "20%", marginRight: "18%" },
  transition: { textTransform: "uppercase", textAlign: "right", marginTop: 12 },
};

/* ---------- Toolbar ---------- */

export interface FormatToolbarProps {
  current: ScriptElementType | undefined;
  onChange: (t: ScriptElementType) => void;
}

/**
 * FormatToolbar
 * A toolbar of toggle buttons (aria-pressed) for the focused element's
 * type. Shortcuts: Ctrl/⌘+1–6, and Tab cycles inside the editor.
 */
export function FormatToolbar({ current, onChange }: FormatToolbarProps) {
  const t = useT();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div
      role="toolbar"
      aria-label={t("Element type")}
      onKeyDown={(e) => {
        const i = refs.current.findIndex((b) => b === document.activeElement);
        if (i < 0) return;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          refs.current[
            (i + (e.key === "ArrowRight" ? 1 : -1) + order.length) % order.length
          ]?.focus();
        }
      }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        padding: 4,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 8,
        background: colorTokens.background.secondary,
      }}
    >
      {order.map((type, i) => (
        <button
          key={type}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          tabIndex={(current ?? "scene") === type ? 0 : -1}
          aria-pressed={current === type}
          aria-keyshortcuts={`Control+${elementLabels[type].key}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange(type)}
          style={{
            minHeight: 32,
            padding: "0 10px",
            border: `1px solid ${current === type ? colorTokens.interactive.primary : colorTokens.border.control}`,
            borderRadius: 6,
            background:
              current === type ? colorTokens.interactive.primary : colorTokens.background.primary,
            color: current === type ? colorTokens.text.inverse : colorTokens.text.primary,
            cursor: "pointer",
            font: "inherit",
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {t(elementLabels[type].label)}
        </button>
      ))}
    </div>
  );
}
FormatToolbar.displayName = "FormatToolbar";

/* ---------- Editor ---------- */

export interface ScriptEditorProps {
  title: string;
  elements: ScriptElement[];
  onChange: (els: ScriptElement[]) => void;
  /** Id of the element to focus (e.g. from the scene navigator) */
  focusId?: string;
  onFocusChange?: (id: string, type: ScriptElementType) => void;
  newId?: () => string;
}

/**
 * ScriptEditor
 * One labelled text field per element ("Scene heading, line 4"), laid out
 * in screenplay format in Courier. Enter adds the logical next element;
 * Backspace on an empty element removes it; Tab cycles the element type.
 */
export function ScriptEditor({
  title,
  elements,
  onChange,
  focusId,
  onFocusChange,
  newId = () => Math.random().toString(36).slice(2, 9),
}: ScriptEditorProps) {
  const t = useT();
  const id = useId();
  const refs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const pending = useRef<string | null>(null);
  useEffect(() => {
    const target = pending.current ?? focusId;
    if (target) refs.current[target]?.focus();
    pending.current = null;
  }, [elements, focusId]);
  // Grow each field to fit its wrapped text (no clipped lines at any width)
  const fit = (n: HTMLTextAreaElement | null) => {
    if (!n) return;
    n.style.height = "auto";
    n.style.height = `${n.scrollHeight}px`;
  };
  useLayoutEffect(() => {
    Object.values(refs.current).forEach(fit);
  });
  useEffect(() => {
    const onResize = () => Object.values(refs.current).forEach(fit);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const setType = (eid: string, type: ScriptElementType) =>
    onChange(elements.map((x) => (x.id === eid ? { ...x, type } : x)));
  return (
    <section
      aria-label={t("Script: {title}", { title })}
      style={{
        background: "#fff",
        color: "#111",
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: 6,
        padding: `${spacingTokens.lg} ${spacingTokens.xl}`,
        fontFamily: "'Courier Prime', 'Courier New', Courier, monospace",
        fontSize: 15,
        lineHeight: 1.4,
        maxWidth: 760,
      }}
    >
      {elements.map((el, i) => (
        <div key={el.id} style={layout[el.type]}>
          <textarea
            ref={(n) => {
              refs.current[el.id] = n;
            }}
            id={`${id}-${el.id}`}
            aria-label={t("{value}, line {value2}", {
              value: elementLabels[el.type].label,
              value2: i + 1,
            })}
            value={t(el.text)}
            rows={1}
            onFocus={() => onFocusChange?.(el.id, el.type)}
            onChange={(e) =>
              onChange(
                elements.map((x) =>
                  x.id === el.id ? { ...x, text: e.target.value.replace(/\n/g, " ") } : x
                )
              )
            }
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && /^[1-6]$/.test(e.key)) {
                e.preventDefault();
                setType(el.id, order[Number(e.key) - 1]);
                onFocusChange?.(el.id, order[Number(e.key) - 1]);
              } else if (
                e.key === "Tab" &&
                !e.ctrlKey &&
                !e.altKey &&
                !e.metaKey &&
                el.text === ""
              ) {
                e.preventDefault();
                const t =
                  order[
                    (order.indexOf(el.type) + (e.shiftKey ? -1 : 1) + order.length) % order.length
                  ];
                setType(el.id, t);
                onFocusChange?.(el.id, t);
              } else if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const n: ScriptElement = { id: newId(), type: nextElementType[el.type], text: "" };
                pending.current = n.id;
                onChange([...elements.slice(0, i + 1), n, ...elements.slice(i + 1)]);
              } else if (e.key === "Backspace" && el.text === "" && elements.length > 1) {
                e.preventDefault();
                pending.current = elements[Math.max(0, i - 1)].id;
                onChange(elements.filter((x) => x.id !== el.id));
              }
            }}
            style={{
              display: "block",
              width: "100%",
              border: "none",
              outlineOffset: 2,
              resize: "none",
              background: "transparent",
              color: "inherit",
              font: "inherit",
              textTransform: "inherit",
              textAlign: "inherit",
              fontWeight: "inherit",
              padding: 0,
              minHeight: 24,
              overflow: "hidden",
            }}
          />
        </div>
      ))}
    </section>
  );
}
ScriptEditor.displayName = "ScriptEditor";

/* ---------- Scene navigator ---------- */

export interface SceneNavigatorProps {
  elements: ScriptElement[];
  onGo: (elementId: string) => void;
  currentId?: string;
}

/** Scenes in a script: heading, number and page-ish length; current scene marked. */
export function scenesOf(
  elements: ScriptElement[]
): { id: string; number: number; heading: string; lines: number }[] {
  const out: { id: string; number: number; heading: string; lines: number }[] = [];
  for (const el of elements) {
    if (el.type === "scene")
      out.push({
        id: el.id,
        number: out.length + 1,
        heading: el.text || "Untitled scene",
        lines: 0,
      });
    else if (out.length) out[out.length - 1].lines += 1;
  }
  return out;
}

/** SceneNavigator: a nav list of scene headings; activating one moves focus there. */
export function SceneNavigator({ elements, onGo, currentId }: SceneNavigatorProps) {
  const t = useT();
  const scenes = scenesOf(elements);
  const cur = (() => {
    const i = elements.findIndex((e) => e.id === currentId);
    for (let k = i; k >= 0; k--) if (elements[k].type === "scene") return elements[k].id;
    return undefined;
  })();
  return (
    <nav aria-label={t("Scenes")}>
      <h3 style={{ margin: `0 0 ${spacingTokens.xs}`, fontSize: typographyTokens.fontSize.md }}>
        {t("Scenes ({count})", { count: scenes.length })}
      </h3>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {scenes.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              aria-current={cur === s.id ? "location" : undefined}
              onClick={() => onGo(s.id)}
              style={{
                display: "flex",
                gap: 6,
                width: "100%",
                textAlign: "left",
                padding: "4px 6px",
                border: "none",
                borderLeft: `3px solid ${cur === s.id ? colorTokens.interactive.primary : "transparent"}`,
                background: cur === s.id ? colorTokens.background.tertiary : "transparent",
                cursor: "pointer",
                font: "inherit",
                fontSize: typographyTokens.fontSize.sm,
                color: colorTokens.text.primary,
              }}
            >
              <span
                style={{
                  fontVariantNumeric: "tabular-nums",
                  color: colorTokens.text.secondary,
                  minWidth: 22,
                }}
              >
                {s.number}
              </span>
              <span style={{ textTransform: "uppercase" }}>{t(s.heading)}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
SceneNavigator.displayName = "SceneNavigator";

/* ---------- Character tracker ---------- */

/** Characters with dialogue counts and the scenes they speak in. */
export function charactersOf(
  elements: ScriptElement[]
): { name: string; lines: number; scenes: number[] }[] {
  const map = new Map<string, { lines: number; scenes: Set<number> }>();
  let scene = 0;
  for (const el of elements) {
    if (el.type === "scene") scene += 1;
    if (el.type === "character" && el.text.trim()) {
      const name = el.text
        .trim()
        .toUpperCase()
        .replace(/\s*\((V\.O\.|O\.S\.|CONT'D|CONT’D)\)\s*$/i, "");
      const c = map.get(name) ?? { lines: 0, scenes: new Set<number>() };
      c.lines += 1;
      if (scene) c.scenes.add(scene);
      map.set(name, c);
    }
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, lines: v.lines, scenes: Array.from(v.scenes) }))
    .sort((a, b) => b.lines - a.lines);
}

/** CharacterTracker: speaking parts, most lines first, with scene numbers. */
export function CharacterTracker({ elements }: { elements: ScriptElement[] }) {
  const t = useT();
  const chars = charactersOf(elements);
  return (
    <section aria-label={t("Characters")}>
      <h3 style={{ margin: `0 0 ${spacingTokens.xs}`, fontSize: typographyTokens.fontSize.md }}>
        {t("Characters ({count})", { count: chars.length })}
      </h3>
      {chars.length === 0 ? (
        <p
          style={{
            margin: 0,
            color: colorTokens.text.secondary,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {t("No speaking characters yet.")}
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {chars.map((c) => (
            <li
              key={c.name}
              style={{
                padding: "4px 0",
                borderBottom: `1px solid ${colorTokens.border.primary}`,
                fontSize: typographyTokens.fontSize.sm,
              }}
            >
              <strong>{c.name}</strong>{" "}
              {t.plural(c.lines, "· {count} speech", "· {count} speeches")}
              <span
                style={{
                  display: "block",
                  color: colorTokens.text.secondary,
                  fontSize: typographyTokens.fontSize.xs,
                }}
              >
                {c.scenes.length ? `Scenes ${c.scenes.join(", ")}` : "Before the first scene"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
CharacterTracker.displayName = "CharacterTracker";
