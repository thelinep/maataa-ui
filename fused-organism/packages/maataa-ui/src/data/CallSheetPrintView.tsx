/**
 * @maataa/ui/data/CallSheetPrintView
 * Print-ready call sheet (A4), black on white, with real headings and tables
 */

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

const dn = { D: "Day", N: "Night", M: "Morning", E: "Evening" };

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
  const people = (title: string, list: CallContact[]) =>
    list.length > 0 && (
      <>
        <h2>{title}</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Name</th>
              <th scope="col">Call</th>
              <th scope="col">Phone</th>
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
      aria-label={`${production} call sheet, day ${day.shootDay}`}
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
            Call sheet · Day {day.shootDay}
            {day.of ? ` of ${day.of}` : ""} · {day.date}
            {version ? ` · v${version}` : ""}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "11pt" }}>
          <div>
            <strong>Crew call {day.crewCall}</strong>
          </div>
          <div>Shooting call {day.shootingCall}</div>
          {(day.sunrise || day.sunset) && (
            <div>
              Sunrise {day.sunrise ?? "—"} · Sunset {day.sunset ?? "—"}
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
        <strong>Nearest hospital:</strong> {day.hospital ?? "Not listed"}
        {day.basecamp ? (
          <>
            {" "}
            · <strong>Basecamp:</strong> {day.basecamp}
          </>
        ) : null}
      </p>
      <h2>Scenes</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Sc.</th>
            <th scope="col">Set</th>
            <th scope="col">D/N</th>
            <th scope="col">Pages</th>
            <th scope="col">Cast</th>
            <th scope="col">Location</th>
          </tr>
        </thead>
        <tbody>
          {scenes.map((s) => (
            <tr key={s.id}>
              <th scope="row">{s.scene}</th>
              <td>{s.set}</td>
              <td>{dn[s.dayNight]}</td>
              <td>{s.pages}</td>
              <td>{s.cast}</td>
              <td>{s.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {people("Cast", cast)}
      {people("Crew", crew)}
      {notes && (
        <>
          <h2>Notes</h2>
          <p style={{ margin: 0, fontSize: "10.5pt", whiteSpace: "pre-line" }}>{notes}</p>
        </>
      )}
    </article>
  );
}
CallSheetPrintView.displayName = "CallSheetPrintView";
