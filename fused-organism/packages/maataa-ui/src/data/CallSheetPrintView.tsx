/**
 * @maataa/ui/data/CallSheetPrintView
 * Print-ready call sheet (A4), black on white, with real headings and tables
 */

import { msg, useT } from "../i18n/LocaleProvider";
import React from "react";
import type { CallSheetDay, SceneRow } from "../forms/CallSheetEditor";

export interface CallContact {
  role: string;
  name: string;
  phone?: string;
  call?: string;
}

export interface CallSheetPrintViewProps {
  production: string;
  day: CallSheetDay;
  scenes: SceneRow[];
  cast?: CallContact[];
  crew?: CallContact[];
  notes?: string;
  version?: number;
}

const css = `@media print { @page { size: A4; margin: 12mm } .cs-print { box-shadow: none !important } }
.cs-print table { width: 100%; border-collapse: collapse; margin: 6px 0 12px }
.cs-print th, .cs-print td { border: 1px solid #000; padding: 3px 5px; text-align: left; vertical-align: top; font-size: 10.5pt }
.cs-print thead th { background: #eee }
.cs-print h1 { font-size: 18pt; margin: 0 } .cs-print h2 { font-size: 12pt; margin: 10px 0 2px; text-transform: uppercase; letter-spacing: .04em }`;

const dn = { D: msg("Day"), N: msg("Night"), M: msg("Morning"), E: msg("Evening") };

/**
 * CallSheetPrintView
 * Uses serif-free 10.5 pt text and real tables so it prints and reads
 * well; nothing relies on colour. Hospital and safety info sit at the top.
 */
export function CallSheetPrintView({
  production,
  day,
  scenes,
  cast = [],
  crew = [],
  notes,
  version,
}: CallSheetPrintViewProps) {
  const t = useT();
  const withNotes = scenes.some((s) => s.notes);
  const people = (title: string, list: CallContact[]) =>
    list.length > 0 && (
      <>
        <h2>{title}</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">{t("Role")}</th>
              <th scope="col">{t("Name")}</th>
              <th scope="col">{t("Call")}</th>
              <th scope="col">{t("Phone")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.role + c.name}>
                <td>{c.role}</td>
                <th scope="row">{c.name}</th>
                <td>{c.call ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  return (
    <article
      className="cs-print"
      aria-label={t("{production} call sheet, day {shootDay}", {
        production,
        shootDay: day.shootDay,
      })}
      style={{
        background: "#fff",
        color: "#000",
        fontFamily: "Helvetica, Arial, sans-serif",
        padding: 24,
        maxWidth: 794,
        boxShadow: "0 1px 4px rgba(0,0,0,.15)",
      }}
    >
      <style>{css}</style>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "2px solid #000",
          paddingBottom: 6,
        }}
      >
        <div>
          <h1>{production}</h1>
          <div>
            {[
              t("Call sheet"),
              day.of
                ? t("Day {shootDay} of {total}", { shootDay: day.shootDay, total: day.of })
                : t("Day {shootDay}", { shootDay: day.shootDay }),
              day.date,
              version ? `v${version}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "11pt" }}>
          <div>
            <strong>{t("Crew call {crewCall}", { crewCall: day.crewCall })}</strong>
          </div>
          <div>{t("Shooting call {shootingCall}", { shootingCall: day.shootingCall })}</div>
          {(day.sunrise || day.sunset) && (
            <div>
              {t("Sunrise {value} · Sunset {value2}", {
                value: day.sunrise ?? "—",
                value2: day.sunset ?? "—",
              })}
            </div>
          )}
          {day.weather && <div>{day.weather}</div>}
        </div>
      </header>
      <p
        style={{
          border: "1px solid #000",
          padding: "4px 6px",
          margin: "8px 0",
          fontSize: "10.5pt",
        }}
      >
        <strong>{t("Nearest hospital:")}</strong> {day.hospital ?? "Not listed"}
        {day.basecamp ? (
          <>
            {" "}
            · <strong>{t("Basecamp:")}</strong> {day.basecamp}
          </>
        ) : null}
      </p>
      <h2>{t("Scenes")}</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">{t("Sc.")}</th>
            <th scope="col">{t("Set")}</th>
            <th scope="col">D/N</th>
            <th scope="col">{t("Pages")}</th>
            <th scope="col">{t("Cast")}</th>
            <th scope="col">{t("Location")}</th>
            {withNotes && <th scope="col">{t("Notes")}</th>}
          </tr>
        </thead>
        <tbody>
          {scenes.map((s) => (
            <tr key={s.id}>
              <th scope="row">{s.scene}</th>
              <td>{s.set}</td>
              <td>{t(dn[s.dayNight])}</td>
              <td>{s.pages}</td>
              <td>{s.cast}</td>
              <td>{s.location}</td>
              {withNotes && <td>{s.notes}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {people("Cast", cast)}
      {people("Crew", crew)}
      {notes && (
        <>
          <h2>{t("Notes")}</h2>
          <p style={{ margin: 0, fontSize: "10.5pt", whiteSpace: "pre-line" }}>{notes}</p>
        </>
      )}
    </article>
  );
}
CallSheetPrintView.displayName = "CallSheetPrintView";
