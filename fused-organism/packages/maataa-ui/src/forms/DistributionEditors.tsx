/**
 * @maataa/ui/forms/DistributionEditors
 * Territory × rights matrix, release windows, and a delivery tracker
 */

import React from "react";
import { Button } from "../primitives/Button";
import { ScrollTable } from "../data/ScrollTable";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

/* ---------- Territory matrix ---------- */

export type RightsState = "available" | "negotiating" | "sold" | "excluded";
const rightsText: Record<RightsState, string> = {
  available: "Available",
  negotiating: "Negotiating",
  sold: "Sold",
  excluded: "Not offered",
};
const rightsMark: Record<RightsState, string> = {
  available: "○",
  negotiating: "◐",
  sold: "●",
  excluded: "–",
};

export interface TerritoryMatrixProps {
  territories: string[];
  /** e.g. ["Theatrical", "SVOD", "TV", "Airline"] */
  rights: string[];
  /** value[territory][right] */
  value: Record<string, Record<string, RightsState>>;
  onChange: (territory: string, right: string, state: RightsState) => void;
  /** Buyer names for sold cells */
  buyers?: Record<string, Record<string, string>>;
}

/**
 * TerritoryMatrix
 * A real table; each cell is a select named "India, SVOD". State is in
 * words and a mark, so print-outs and colour-blind readers get it too.
 */
export function TerritoryMatrix({
  territories,
  rights,
  value,
  onChange,
  buyers = {},
}: TerritoryMatrixProps) {
  const td: React.CSSProperties = {
    padding: 3,
    border: `1px solid ${colorTokens.border.primary}`,
    fontSize: typographyTokens.fontSize.sm,
    textAlign: "center",
  };
  const sold = territories.reduce(
    (n, t) => n + rights.filter((r) => value[t]?.[r] === "sold").length,
    0
  );
  return (
    <ScrollTable label="Territory rights">
      <table style={{ borderCollapse: "collapse", minWidth: 160 + rights.length * 130 }}>
        <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
          Territory rights · {sold} of {territories.length * rights.length} sold
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ ...td, textAlign: "left" }}>
              Territory
            </th>
            {rights.map((r) => (
              <th key={r} scope="col" style={td}>
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {territories.map((t) => (
            <tr key={t}>
              <th scope="row" style={{ ...td, textAlign: "left" }}>
                {t}
              </th>
              {rights.map((r) => {
                const s = value[t]?.[r] ?? "available";
                return (
                  <td
                    key={r}
                    style={{
                      ...td,
                      background: s === "sold" ? colorTokens.background.tertiary : undefined,
                    }}
                  >
                    <select
                      aria-label={`${t}, ${r}`}
                      value={s}
                      onChange={(e) => onChange(t, r, e.target.value as RightsState)}
                      style={{
                        padding: 2,
                        border: `1px solid ${colorTokens.border.control}`,
                        borderRadius: 4,
                        font: "inherit",
                        fontSize: typographyTokens.fontSize.xs,
                        background: colorTokens.background.primary,
                      }}
                    >
                      {(Object.keys(rightsText) as RightsState[]).map((k) => (
                        <option key={k} value={k}>
                          {rightsMark[k]} {rightsText[k]}
                        </option>
                      ))}
                    </select>
                    {s === "sold" && buyers[t]?.[r] && (
                      <div
                        style={{
                          fontSize: typographyTokens.fontSize.xs,
                          color: colorTokens.text.secondary,
                        }}
                      >
                        {buyers[t][r]}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
TerritoryMatrix.displayName = "TerritoryMatrix";

/* ---------- Release windows ---------- */

export interface ReleaseWindow {
  id: string;
  /** e.g. "Theatrical", "SVOD – Netflix" */
  platform: string;
  territory: string;
  start: string;
  end: string;
  exclusive: boolean;
}

/** Exclusive windows in the same territory that overlap */
export function windowConflicts(windows: ReleaseWindow[]): [string, string][] {
  const out: [string, string][] = [];
  for (let i = 0; i < windows.length; i++)
    for (let j = i + 1; j < windows.length; j++) {
      const a = windows[i];
      const b = windows[j];
      if (a.territory !== b.territory || !(a.exclusive || b.exclusive) || !a.start || !b.start)
        continue;
      const aEnd = a.end || "9999-12-31";
      const bEnd = b.end || "9999-12-31";
      if (a.start <= bEnd && b.start <= aEnd) out.push([a.id, b.id]);
    }
  return out;
}

export interface WindowEditorProps {
  windows: ReleaseWindow[];
  onChange: (w: ReleaseWindow[]) => void;
  territories: string[];
  newId?: () => string;
}

/**
 * WindowEditor
 * One row per window with labelled fields. Overlapping exclusive windows
 * in the same territory are listed in an alert with both names.
 */
export function WindowEditor({
  windows,
  onChange,
  territories,
  newId = () => Math.random().toString(36).slice(2, 9),
}: WindowEditorProps) {
  const upd = (id: string, p: Partial<ReleaseWindow>) =>
    onChange(windows.map((w) => (w.id === id ? { ...w, ...p } : w)));
  const conflicts = windowConflicts(windows);
  const name = (id: string) => {
    const w = windows.find((x) => x.id === id);
    return w ? `${w.platform || "Untitled"} (${w.territory})` : id;
  };
  const inp: React.CSSProperties = {
    padding: 4,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    font: "inherit",
    background: colorTokens.background.primary,
    width: "100%",
    boxSizing: "border-box",
  };
  const td: React.CSSProperties = {
    padding: 3,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
      {conflicts.length > 0 && (
        <div
          role="alert"
          style={{
            border: `1px solid ${colorTokens.interactive.error}`,
            borderRadius: 6,
            padding: spacingTokens.sm,
            color: colorTokens.interactive.error,
          }}
        >
          <strong>Exclusive windows overlap:</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: spacingTokens.lg }}>
            {conflicts.map(([a, b]) => (
              <li key={a + b}>
                {name(a)} and {name(b)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ScrollTable label="Release windows">
        <table style={{ width: "100%", minWidth: 680, borderCollapse: "collapse" }}>
          <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
            Release windows
          </caption>
          <thead>
            <tr
              style={{
                textAlign: "left",
                fontSize: typographyTokens.fontSize.xs,
                color: colorTokens.text.secondary,
              }}
            >
              <th scope="col" style={td}>
                Platform
              </th>
              <th scope="col" style={td}>
                Territory
              </th>
              <th scope="col" style={td}>
                From
              </th>
              <th scope="col" style={td}>
                Until
              </th>
              <th scope="col" style={td}>
                Exclusive
              </th>
              <th scope="col" style={td}>
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  Remove
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {windows.map((w, i) => {
              const n = w.platform || `window ${i + 1}`;
              const bad = conflicts.some(([a, b]) => a === w.id || b === w.id);
              return (
                <tr key={w.id} style={{ background: bad ? "#FBEDEA" : undefined }}>
                  <td style={td}>
                    <input
                      aria-label={`Platform, row ${i + 1}`}
                      value={w.platform}
                      onChange={(e) => upd(w.id, { platform: e.target.value })}
                      style={inp}
                    />
                  </td>
                  <td style={td}>
                    <select
                      aria-label={`Territory for ${n}`}
                      value={w.territory}
                      onChange={(e) => upd(w.id, { territory: e.target.value })}
                      style={inp}
                    >
                      {territories.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td style={td}>
                    <input
                      type="date"
                      aria-label={`Start of ${n}`}
                      value={w.start}
                      onChange={(e) => upd(w.id, { start: e.target.value })}
                      style={inp}
                    />
                  </td>
                  <td style={td}>
                    <input
                      type="date"
                      aria-label={`End of ${n}`}
                      value={w.end}
                      onChange={(e) => upd(w.id, { end: e.target.value })}
                      style={inp}
                    />
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      aria-label={`${n} is exclusive`}
                      checked={w.exclusive}
                      onChange={(e) => upd(w.id, { exclusive: e.target.checked })}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: colorTokens.interactive.primary,
                      }}
                    />
                  </td>
                  <td style={td}>
                    <button
                      type="button"
                      aria-label={`Remove ${n}`}
                      onClick={() => onChange(windows.filter((x) => x.id !== w.id))}
                      style={{ minWidth: 30, minHeight: 30, cursor: "pointer" }}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>
      <div>
        <Button
          variant="secondary"
          onClick={() =>
            onChange([
              ...windows,
              {
                id: newId(),
                platform: "",
                territory: territories[0] ?? "",
                start: "",
                end: "",
                exclusive: false,
              },
            ])
          }
        >
          Add window
        </Button>
      </div>
    </div>
  );
}
WindowEditor.displayName = "WindowEditor";
