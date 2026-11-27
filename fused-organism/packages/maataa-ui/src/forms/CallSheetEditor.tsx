/**
 * @maataa/ui/forms/CallSheetEditor
 * Build a call sheet: day details plus one row per scene
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface SceneRow {
  id: string;
  scene: string;
  /** e.g. "INT. KITCHEN" */
  set: string;
  dayNight: "D" | "N" | "M" | "E";
  /** Page count in eighths, e.g. "1 3/8" */
  pages: string;
  /** Cast ids or names, comma-separated */
  cast: string;
  location: string;
  notes?: string;
}

export interface CallSheetDay {
  shootDay: number;
  of?: number;
  date: string;
  crewCall: string;
  shootingCall: string;
  sunrise?: string;
  sunset?: string;
  weather?: string;
  hospital?: string;
  basecamp?: string;
}

export interface CallSheetEditorProps {
  day: CallSheetDay;
  onDayChange: (d: CallSheetDay) => void;
  scenes: SceneRow[];
  onScenesChange: (rows: SceneRow[]) => void;
  newId?: () => string;
  readOnly?: boolean;
}

const dnLabel = { D: "Day", N: "Night", M: "Morning", E: "Evening" };

/**
 * CallSheetEditor
 * Day details as labelled fields; scenes as a table where each input is
 * named by scene ("Set for scene 12"). Rows move up and down with buttons,
 * not only drag. The nearest hospital is a required field.
 */
export function CallSheetEditor({
  day,
  onDayChange,
  scenes,
  onScenesChange,
  newId = () => Math.random().toString(36).slice(2, 9),
  readOnly,
}: CallSheetEditorProps) {
  const t = useT();
  const setDay = (k: keyof CallSheetDay, v: string) =>
    onDayChange({ ...day, [k]: k === "shootDay" || k === "of" ? Number(v) || 0 : v });
  const upd = (id: string, patch: Partial<SceneRow>) =>
    onScenesChange(scenes.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= scenes.length) return;
    const next = [...scenes];
    [next[i], next[j]] = [next[j], next[i]];
    onScenesChange(next);
  };
  const inp: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "6px 8px",
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    font: "inherit",
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
  };
  const field = (k: keyof CallSheetDay, label: string, type = "text", required = false) => (
    <label
      key={k}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        fontSize: typographyTokens.fontSize.sm,
        fontWeight: 500,
      }}
    >
      <span>
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: colorTokens.interactive.error }}>
            {" *"}
          </span>
        )}
      </span>
      <input
        type={type}
        value={day[k] ?? ""}
        readOnly={readOnly}
        required={required}
        onChange={(e) => setDay(k, e.target.value)}
        style={{ ...inp, fontWeight: 400 }}
      />
    </label>
  );
  const td: React.CSSProperties = {
    padding: 3,
    borderBottom: `1px solid ${colorTokens.border.primary}`,
    verticalAlign: "top",
  };
  const totalEighths = scenes.reduce((sum, s) => {
    const m = s.pages.trim().match(/^(\d+)?\s*(?:(\d)\/8)?$/);
    return sum + (m ? Number(m[1] ?? 0) * 8 + Number(m[2] ?? 0) : 0);
  }, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.lg }}>
      <fieldset
        style={{
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 8,
          padding: spacingTokens.md,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: spacingTokens.sm,
        }}
      >
        <legend style={{ fontWeight: 700, padding: `0 ${spacingTokens.xs}` }}>
          {day.of
            ? t("Day {shootDay} of {total}", { shootDay: day.shootDay, total: day.of })
            : t("Day {shootDay}", { shootDay: day.shootDay })}
        </legend>
        {field("date", "Date", "date", true)}
        {field("crewCall", "Crew call", "time", true)}
        {field("shootingCall", "Shooting call", "time", true)}
        {field("sunrise", "Sunrise", "time")}
        {field("sunset", "Sunset", "time")}
        {field("weather", "Weather")}
        {field("basecamp", "Basecamp")}
        {field("hospital", "Nearest hospital", "text", true)}
      </fieldset>
      <div role="region" aria-label={t("Scenes")} tabIndex={0} style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse" }}>
          <caption style={{ textAlign: "left", fontWeight: 700, marginBottom: spacingTokens.xs }}>
            {t("Scenes · {scenes}, {pages} pages", {
              scenes: t.plural(scenes.length, "{count} scene", "{count} scenes"),
              pages: `${Math.floor(totalEighths / 8)}${totalEighths % 8 ? ` ${totalEighths % 8}/8` : ""}`,
            })}
          </caption>
          <thead>
            <tr
              style={{
                textAlign: "left",
                fontSize: typographyTokens.fontSize.xs,
                color: colorTokens.text.secondary,
              }}
            >
              <th scope="col" style={{ ...td, width: 60 }}>
                {t("Scene")}
              </th>
              <th scope="col" style={td}>
                {t("Set")}
              </th>
              <th scope="col" style={{ ...td, width: 90 }}>
                D/N
              </th>
              <th scope="col" style={{ ...td, width: 70 }}>
                {t("Pages")}
              </th>
              <th scope="col" style={td}>
                {t("Cast")}
              </th>
              <th scope="col" style={td}>
                {t("Location")}
              </th>
              {!readOnly && (
                <th scope="col" style={{ ...td, width: 110 }}>
                  <span
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      clip: "rect(0 0 0 0)",
                    }}
                  >
                    {t("Order and remove")}
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {scenes.map((s, i) => {
              const n = s.scene || `row ${i + 1}`;
              return (
                <tr key={s.id}>
                  <td style={td}>
                    <input
                      aria-label={t("Scene number, row {value}", { value: i + 1 })}
                      value={s.scene}
                      readOnly={readOnly}
                      onChange={(e) => upd(s.id, { scene: e.target.value })}
                      style={inp}
                    />
                  </td>
                  <td style={td}>
                    <input
                      aria-label={t("Set for scene {n}", { n })}
                      value={s.set}
                      readOnly={readOnly}
                      onChange={(e) => upd(s.id, { set: e.target.value })}
                      style={inp}
                    />
                  </td>
                  <td style={td}>
                    <select
                      aria-label={t("Time of day for scene {n}", { n })}
                      value={s.dayNight}
                      disabled={readOnly}
                      onChange={(e) =>
                        upd(s.id, { dayNight: e.target.value as SceneRow["dayNight"] })
                      }
                      style={inp}
                    >
                      {Object.entries(dnLabel).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={td}>
                    <input
                      aria-label={t("Pages for scene {n}", { n })}
                      value={s.pages}
                      readOnly={readOnly}
                      onChange={(e) => upd(s.id, { pages: e.target.value })}
                      placeholder="1 3/8"
                      style={inp}
                    />
                  </td>
                  <td style={td}>
                    <input
                      aria-label={t("Cast for scene {n}", { n })}
                      value={s.cast}
                      readOnly={readOnly}
                      onChange={(e) => upd(s.id, { cast: e.target.value })}
                      style={inp}
                    />
                  </td>
                  <td style={td}>
                    <input
                      aria-label={t("Location for scene {n}", { n })}
                      value={s.location}
                      readOnly={readOnly}
                      onChange={(e) => upd(s.id, { location: e.target.value })}
                      style={inp}
                    />
                  </td>
                  {!readOnly && (
                    <td style={{ ...td, whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        aria-label={t("Move scene {n} up", { n })}
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        style={{ minWidth: 30, minHeight: 30, cursor: "pointer" }}
                      >
                        <span aria-hidden="true">↑</span>
                      </button>
                      <button
                        type="button"
                        aria-label={t("Move scene {n} down", { n })}
                        disabled={i === scenes.length - 1}
                        onClick={() => move(i, 1)}
                        style={{ minWidth: 30, minHeight: 30, cursor: "pointer" }}
                      >
                        <span aria-hidden="true">↓</span>
                      </button>
                      <button
                        type="button"
                        aria-label={t("Remove scene {n}", { n })}
                        onClick={() => onScenesChange(scenes.filter((x) => x.id !== s.id))}
                        style={{ minWidth: 30, minHeight: 30, cursor: "pointer" }}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <div>
          <Button
            variant="secondary"
            onClick={() =>
              onScenesChange([
                ...scenes,
                {
                  id: newId(),
                  scene: "",
                  set: "",
                  dayNight: "D",
                  pages: "",
                  cast: "",
                  location: "",
                },
              ])
            }
          >
            {t("Add scene")}
          </Button>
        </div>
      )}
    </div>
  );
}
CallSheetEditor.displayName = "CallSheetEditor";
