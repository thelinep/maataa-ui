/**
 * @maataa/ui/data/SceneProgressTracker
 * Today's scenes: done, shooting, to go, with pages shot
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TrackedScene {
  id: string;
  scene: string;
  set: string;
  /** Eighths of a page */
  eighths: number;
  state: "todo" | "shooting" | "done" | "moved";
  takes?: number;
}

export interface SceneProgressTrackerProps {
  scenes: TrackedScene[];
  onChangeState?: (id: string, state: TrackedScene["state"]) => void;
  /** @default 'Today’s scenes' */
  title?: string;
}

const pages = (e: number) =>
  e < 8 ? (e ? `${e}/8` : "0") : `${Math.floor(e / 8)}${e % 8 ? ` ${e % 8}/8` : ""}`;
const stateText = {
  todo: "To shoot",
  shooting: "Shooting now",
  done: "Done",
  moved: "Moved to another day",
};

/**
 * SceneProgressTracker
 * A meter for pages shot (with the numbers in its text) and a list where
 * each scene's state is a labelled select.
 */
export function SceneProgressTracker({
  scenes,
  onChangeState,
  title = "Today’s scenes",
}: SceneProgressTrackerProps) {
  const total = scenes.filter((s) => s.state !== "moved").reduce((a, s) => a + s.eighths, 0);
  const done = scenes.filter((s) => s.state === "done").reduce((a, s) => a + s.eighths, 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <section
      aria-label={title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{title}</h3>
      <div>
        <div style={{ fontSize: typographyTokens.fontSize.sm, marginBottom: 4 }}>
          {pages(done)} of {pages(total)} pages shot ({pct}%)
        </div>
        <div
          role="meter"
          aria-label="Pages shot"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-valuetext={`${pages(done)} of ${pages(total)} pages, ${pct}%`}
          style={{ height: 10, background: colorTokens.background.tertiary, borderRadius: 5 }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: colorTokens.interactive.success,
              borderRadius: 5,
            }}
          />
        </div>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {scenes.map((s) => (
          <li
            key={s.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: spacingTokens.sm,
              padding: `${spacingTokens.xs} 0`,
              borderBottom: `1px solid ${colorTokens.border.primary}`,
              background: s.state === "moved" ? colorTokens.background.secondary : undefined,
            }}
          >
            <span>
              <strong style={{ textDecoration: s.state === "done" ? "line-through" : "none" }}>
                Sc. {s.scene}
              </strong>{" "}
              · {s.set}
              <span
                style={{
                  display: "block",
                  fontSize: typographyTokens.fontSize.xs,
                  color: colorTokens.text.secondary,
                }}
              >
                {pages(s.eighths)} pages{s.takes ? ` · ${s.takes} takes` : ""}
              </span>
            </span>
            {onChangeState ? (
              <select
                aria-label={`State of scene ${s.scene}`}
                value={s.state}
                onChange={(e) => onChangeState(s.id, e.target.value as TrackedScene["state"])}
                style={{
                  padding: 4,
                  border: `1px solid ${s.state === "shooting" ? colorTokens.interactive.primary : colorTokens.border.control}`,
                  borderRadius: 4,
                  font: "inherit",
                  background: colorTokens.background.primary,
                }}
              >
                {Object.entries(stateText).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            ) : (
              <span style={{ fontSize: typographyTokens.fontSize.sm }}>{stateText[s.state]}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
SceneProgressTracker.displayName = "SceneProgressTracker";
