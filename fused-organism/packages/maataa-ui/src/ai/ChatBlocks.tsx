/**
 * @maataa/ui/ai/ChatBlocks
 * Richer replies than text. A model writes a fenced block such as ```chart,
 * ```choices, ```callsheet, ```shotlist, ```crew or ```date with JSON inside,
 * and the chat draws a real chart, tappable options or a MAATAA component.
 * Also finds artifacts (pages, documents, code to keep) and tasks in a reply.
 */

import React, { useId, useState } from "react";
import { useT } from "../i18n/LocaleProvider";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { CallSheetPrintView } from "../data/CallSheetPrintView";
import { ShotList } from "../data/ShotList";
import { CrewIdCard, type CrewPerson } from "../data/CrewIdCard";
import { IndianDate } from "../i18n/IndianDate";
import { GeoMap, type GeoMapPin } from "../maps/GeoMap";
import { fromNovaCallSheet, fromNovaShotList, readNovaOutput } from "../data/nova";
import { findFencedBlocks, type FencedBlock } from "./ChatMarkdown";

/** The block kinds a chat can draw, for the system prompt and for docs. */
export const CHAT_BLOCK_KINDS = [
  "chart",
  "choices",
  "callsheet",
  "shotlist",
  "crew",
  "date",
  "map",
  "location",
] as const;

/**
 * Teaches a model the block formats. Add it to the system prompt. Short on
 * purpose: small local models follow short instructions better.
 */
export const CHAT_BLOCKS_PROMPT = `You can answer with special fenced blocks that the app draws. Use them only when they help, with valid JSON inside:
\`\`\`chart
{"type":"bar","title":"…","labels":["Mon","Tue"],"series":[{"name":"Hours","values":[10,12]}]}
\`\`\`
(type is "bar" or "line")
\`\`\`choices
{"question":"Which day suits you?","options":["Monday","Tuesday"]}
\`\`\`
(the person taps one; their pick comes back as their next message)
\`\`\`callsheet
{"production":"…","shootDay":"Day 1 of 3","date":"2026-12-01","generalCall":"06:00","location":{"name":"…","address":"…","nearestHospital":"…"},"schedule":[{"time":"07:00","scene":"1","description":"INT. KITCHEN - DAY"}],"cast":[{"name":"…","role":"…","call":"06:30"}],"crew":[{"department":"Camera","name":"…","call":"06:00"}]}
\`\`\`
\`\`\`shotlist
{"title":"…","scenes":[{"scene":"1","heading":"INT. KITCHEN - DAY","shots":[{"shot":"1A","size":"WS","angle":"Eye level","movement":"Static","description":"…"}]}]}
\`\`\`
\`\`\`crew
{"production":"…","organisation":"…","person":{"id":"VFS-0001","name":"…","designation":"…","department":"Camera"}}
\`\`\`
\`\`\`date
{"date":"2026-12-01"}
\`\`\`
(shows the Vikram Samvat date)
\`\`\`map
{"title":"Recce, Old Delhi","places":[{"name":"Haveli","lat":28.6562,"lng":77.2301,"note":"Location"},{"name":"LNJP Hospital","lat":28.6386,"lng":77.2385,"note":"Nearest hospital"}]}
\`\`\`
(real coordinates only; never guess them)
For a page, document or code the person will keep, use a fenced block with a title, e.g. \`\`\`html title="Poster" or \`\`\`markdown title="Shoot plan". It opens as an artifact.
For a to-do list, use a checklist: "- [ ] task".
Use Markdown tables for tabular data.`;

/**
 * Teaches a model diagrams and maths. Add it when the app passes a Mermaid
 * renderer (renderBlock for ```mermaid) and `renderMath`.
 */
export const CHAT_DIAGRAM_PROMPT = `For a flowchart, timeline, sequence or org chart, use a \`\`\`mermaid block (Mermaid syntax).
For maths, use LaTeX: $…$ inline and $$…$$ on its own lines.`;

/**
 * Teaches a model to write Three.js 3D scenes. Add it when the app runs
 * ```threejs blocks (the local chat example does).
 */
export const CHAT_3D_PROMPT = `For a 3D scene or model, write a \`\`\`threejs title="…" block of plain JavaScript (no imports, no files from the internet). Ready for you: THREE (with THREE.OrbitControls), scene, camera, renderer, controls, and soft lights. Add meshes to scene; units are metres, the ground is y = 0. For movement: onFrame((t, dt) => { … }) with t and dt in seconds. Example:
\`\`\`threejs title="Spinning cube"
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: "#c2640f" }));
cube.position.y = 0.5;
scene.add(cube);
onFrame((t) => { cube.rotation.y = t; });
\`\`\``;

/**
 * Teaches a model to ask for pictures, sound and video. Only add it when the
 * app can make them (e.g. through Maataa Workstation).
 */
export const CHAT_MEDIA_PROMPT = `You can have pictures, sound and short videos made on this computer. Write one block per item; the person sees it and it is made for them:
\`\`\`image
{"prompt":"golden hour over a Delhi rooftop, kites in the sky, cinematic","width":1024,"height":576}
\`\`\`
\`\`\`audio
{"kind":"music","prompt":"slow tabla and strings, hopeful","seconds":20}
\`\`\`
(kind is "music", "sfx" for sound effects, or "voice" with "text" to speak)
\`\`\`video
{"prompt":"slow push-in on a steaming chai glass, street sounds","seconds":4}
\`\`\`
Describe pictures and videos in English, in detail.`;

interface ChartData {
  type?: "bar" | "line";
  title?: string;
  labels: string[];
  series: { name?: string; values: number[] }[];
  unit?: string;
}

const PALETTE = [
  `var(--maataa-chart-single, ${colorTokens.interactive.primary})`,
  colorTokens.interactive.info,
  colorTokens.interactive.success,
  colorTokens.interactive.warning,
  colorTokens.interactive.error,
  colorTokens.interactive.primary,
];

function readJson<T>(code: string): T | null {
  try {
    return JSON.parse(code) as T;
  } catch {
    return null;
  }
}

function isChart(d: unknown): d is ChartData {
  const c = d as ChartData;
  return (
    !!c &&
    Array.isArray(c.labels) &&
    Array.isArray(c.series) &&
    c.series.length > 0 &&
    c.series.every(
      (s) => Array.isArray(s.values) && s.values.every((v) => typeof v === "number" && isFinite(v))
    )
  );
}

/** A small bar or line chart with its numbers available as a table. */
export function ChatChart({ data }: { data: ChartData }) {
  const t = useT();
  const titleId = useId();
  const W = 440;
  const H = 220;
  const pad = { l: 40, r: 8, t: 12, b: 30 };
  const all = data.series.flatMap((s) => s.values);
  const max = Math.max(0, ...all);
  const min = Math.min(0, ...all);
  const span = max - min || 1;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - (v - min) / span);
  const n = data.labels.length || 1;
  const bandW = (W - pad.l - pad.r) / n;
  const ticks = [min, min + span / 2, max];
  const fmt = (v: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(v);
  const type = data.type === "line" ? "line" : "bar";
  const groupW = bandW * 0.7;
  const barW = groupW / data.series.length;
  return (
    <figure style={{ margin: 0, display: "grid", gap: 4, minWidth: 0 }}>
      {data.title && (
        <figcaption
          id={titleId}
          style={{ fontWeight: 600, fontSize: typographyTokens.fontSize.sm }}
        >
          {data.title}
        </figcaption>
      )}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={data.title ? titleId : undefined}
        aria-label={data.title ? undefined : t("Chart")}
        style={{ width: "100%", height: "auto", maxWidth: W }}
      >
        {ticks.map((v, i) => (
          <g key={i}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(v)}
              y2={y(v)}
              stroke={colorTokens.border.secondary}
              strokeWidth={1}
            />
            <text
              x={pad.l - 6}
              y={y(v) + 4}
              textAnchor="end"
              fontSize={13}
              fill={colorTokens.text.secondary}
            >
              {fmt(v)}
            </text>
          </g>
        ))}
        {data.labels.map((l, i) => (
          <text
            key={i}
            x={pad.l + bandW * (i + 0.5)}
            y={H - pad.b + 16}
            textAnchor="middle"
            fontSize={13}
            fill={colorTokens.text.secondary}
          >
            {l.length > 10 ? `${l.slice(0, 9)}…` : l}
          </text>
        ))}
        {data.series.map((s, si) => {
          const color = PALETTE[si % PALETTE.length];
          if (type === "line") {
            const pts = s.values.map((v, i) => `${pad.l + bandW * (i + 0.5)},${y(v)}`).join(" ");
            return (
              <g key={si}>
                <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} />
                {s.values.map((v, i) => (
                  <circle key={i} cx={pad.l + bandW * (i + 0.5)} cy={y(v)} r={3.5} fill={color} />
                ))}
              </g>
            );
          }
          return (
            <g key={si}>
              {s.values.map((v, i) => {
                const x = pad.l + bandW * i + (bandW - groupW) / 2 + barW * si;
                const top = Math.min(y(v), y(0));
                return (
                  <rect
                    key={i}
                    x={x}
                    y={top}
                    width={Math.max(1, barW - 2)}
                    height={Math.max(1, Math.abs(y(v) - y(0)))}
                    rx={2}
                    fill={color}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      {data.series.length > 1 && (
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacingTokens.sm,
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: typographyTokens.fontSize.xs,
          }}
        >
          {data.series.map((s, si) => (
            <li key={si} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: PALETTE[si % PALETTE.length],
                }}
              />
              {s.name ?? t("Series {n}", { n: si + 1 })}
            </li>
          ))}
        </ul>
      )}
      <details>
        <summary
          className="mc-t"
          style={{
            cursor: "pointer",
            fontSize: typographyTokens.fontSize.xs,
            color: colorTokens.text.secondary,
            minHeight: 24,
          }}
        >
          {t("Show the numbers")}
        </summary>
        <table style={{ borderCollapse: "collapse", fontSize: typographyTokens.fontSize.xs }}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: "left", padding: "2px 6px" }} />
              {data.series.map((s, si) => (
                <th key={si} scope="col" style={{ textAlign: "right", padding: "2px 6px" }}>
                  {s.name ?? t("Series {n}", { n: si + 1 })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.labels.map((l, i) => (
              <tr key={i}>
                <th scope="row" style={{ textAlign: "left", padding: "2px 6px", fontWeight: 400 }}>
                  {l}
                </th>
                {data.series.map((s, si) => (
                  <td key={si} style={{ textAlign: "right", padding: "2px 6px" }}>
                    {s.values[i] !== undefined ? fmt(s.values[i]!) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** Options the person taps to answer. Each pick is sent as their message. */
export function ChatChoices({
  question,
  options,
  onChoose,
  disabled,
}: {
  question?: string;
  options: string[];
  onChoose?: (option: string) => void;
  disabled?: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={question ? id : undefined}
      style={{ display: "grid", gap: spacingTokens.xs }}
    >
      {question && (
        <p id={id} style={{ margin: 0, fontWeight: 600 }}>
          {question}
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.xs }}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className="mc-t"
            disabled={disabled || !onChoose || picked !== null}
            aria-pressed={picked === o}
            onClick={() => {
              setPicked(o);
              onChoose?.(o);
            }}
            style={{
              minHeight: 36,
              padding: `0 ${spacingTokens.md}`,
              borderRadius: 999,
              border: `1px solid ${colorTokens.interactive.primary}`,
              background:
                picked === o ? colorTokens.interactive.primary : colorTokens.background.primary,
              color: picked === o ? colorTokens.text.inverse : colorTokens.text.primary,
              font: "inherit",
              cursor: disabled || picked !== null ? "default" : "pointer",
              opacity: picked !== null && picked !== o ? 0.6 : 1,
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

interface MapPlace {
  name: string;
  lat: number;
  lng: number;
  note?: string;
}

function readPlaces(data: Record<string, unknown>): MapPlace[] {
  const isPlace = (p: unknown): p is MapPlace => {
    const x = p as MapPlace;
    return (
      !!x &&
      typeof x.name === "string" &&
      typeof x.lat === "number" &&
      typeof x.lng === "number" &&
      Math.abs(x.lat) <= 90 &&
      Math.abs(x.lng) <= 180
    );
  };
  // ```location {"name","lat","lng","address","points":[{"label","lat","lng"}]}
  if (typeof data.name === "string" && typeof data.lat === "number") {
    const main = {
      name: data.name,
      lat: data.lat as number,
      lng: data.lng as number,
      note: data.address as string | undefined,
    };
    const points = Array.isArray(data.points)
      ? (data.points as Record<string, unknown>[]).map((p) => ({
          ...p,
          name: String(p.name ?? p.label ?? ""),
        }))
      : [];
    return [main, ...points].filter(isPlace);
  }
  return Array.isArray(data.places) ? (data.places as unknown[]).filter(isPlace) : [];
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown) =>
  typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";

/** Shot size and camera move named in a shot's own words ("Close-up on…", "the camera pans…"). */
function shotWords(words: string): { size: string; movement: string } {
  const w = words.toLowerCase();
  const size = /extreme close|ecu\b/.test(w)
    ? "ECU"
    : /close[- ]?up|\bcu\b/.test(w)
      ? "CU"
      : /medium|\bms\b|\bmcu\b/.test(w)
        ? "MS"
        : /wide|establish|\bws\b|long shot|\bls\b/.test(w)
          ? "WS"
          : "—";
  const movement = /\bpan/.test(w)
    ? "Pan"
    : /\btilt/.test(w)
      ? "Tilt"
      : /track|dolly|follow/.test(w)
        ? "Track"
        : /push in|zoom in/.test(w)
          ? "Push in"
          : "Static";
  return { size, movement };
}

/**
 * Small local models often send a shot list as a flat list of shots, or as "scenes" that are
 * really shots with no "shots" inside. This turns those into the shape ShotList draws, keeping
 * every word the model wrote. A list that already has shots is returned unchanged.
 */
export function repairShotList(data: Record<string, unknown>): Record<string, unknown> {
  const scenes = Array.isArray(data.scenes) ? data.scenes : null;
  const flat = Array.isArray(data.shots) ? data.shots : null;
  if (scenes && scenes.every((sc) => isRecord(sc) && Array.isArray(sc.shots))) return data;
  const items = (scenes ?? flat ?? []).filter(isRecord);
  if (!items.length) return data;
  const sceneHeading = /^(INT|EXT|INT\.?\/EXT)\b/i;
  const first = items[0]!;
  const headingItem = [text(first.title), text(first.heading)].find((h) => sceneHeading.test(h));
  const rows = (headingItem ? items.slice(1) : items).map((it) => {
    const words = [text(it.title), text(it.heading), text(it.description)].filter(Boolean);
    const description = [...new Set(words)].join(" — ") || "—";
    const guess = shotWords(description);
    return {
      shot: text(it.shot),
      size: text(it.size) || guess.size,
      angle: text(it.angle) || "—",
      movement: text(it.movement) || guess.movement,
      description,
    };
  });
  const heading = headingItem ?? (text(data.heading) || "—");
  // The heading item's other line describes the opening picture: keep it as the first shot.
  const opening = headingItem
    ? [text(first.title), text(first.heading)].find((h) => h && h !== headingItem)
    : undefined;
  if (opening) rows.unshift({ shot: "", ...shotWords(opening), angle: "—", description: opening });
  const shots = rows.map((r, i) => ({
    ...r,
    shot: r.shot || `1${String.fromCharCode(65 + (i % 26))}`,
  }));
  return { ...data, scenes: [{ scene: text(data.scene) || "1", heading, shots }] };
}

/** Places on a map, with links to open each in OpenStreetMap. Draws offline. */
export function ChatMap({ title, places }: { title?: string; places: MapPlace[] }) {
  const t = useT();
  const lats = places.map((p) => p.lat);
  const lngs = places.map((p) => p.lng);
  const padLat = Math.max(0.004, (Math.max(...lats) - Math.min(...lats)) * 0.25);
  const padLng = Math.max(0.006, (Math.max(...lngs) - Math.min(...lngs)) * 0.25);
  const bounds = {
    minLat: Math.min(...lats) - padLat,
    maxLat: Math.max(...lats) + padLat,
    minLng: Math.min(...lngs) - padLng,
    maxLng: Math.max(...lngs) + padLng,
  };
  const pins: GeoMapPin[] = places.map((p, i) => ({
    id: String(i),
    label: p.name,
    lat: p.lat,
    lng: p.lng,
    status: i === 0 ? "active" : "default",
  }));
  const osm = (p: MapPlace) =>
    `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=17/${p.lat}/${p.lng}`;
  return (
    <figure style={{ margin: 0, display: "grid", gap: spacingTokens.xs, minWidth: 0 }}>
      <figcaption style={{ fontWeight: 600, fontSize: typographyTokens.fontSize.sm }}>
        {title ?? t("Map")}
      </figcaption>
      <div style={scroller} tabIndex={0} role="region" aria-label={title ?? t("Map")}>
        <GeoMap pins={pins} bounds={bounds} width={440} height={260} />
      </div>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: typographyTokens.fontSize.sm }}>
        {places.map((p, i) => (
          <li key={i}>
            <a
              href={osm(p)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colorTokens.interactive.primary }}
            >
              {p.name}
            </a>
            {p.note ? ` · ${p.note}` : ""}
            <span style={{ color: colorTokens.text.secondary }}>
              {" "}
              ({p.lat.toFixed(4)}, {p.lng.toFixed(4)}) ·{" "}
            </span>
            <a
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(p.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("Find {name} by name", { name: p.name })}
              style={{ color: colorTokens.interactive.primary }}
            >
              {t("find by name")}
            </a>
          </li>
        ))}
      </ol>
      <p
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        {t("The AI placed these pins and can get places wrong. Check by name before you go.")}
      </p>
    </figure>
  );
}

function Pending({ label }: { label: string }) {
  return (
    <p
      style={{
        margin: 0,
        padding: spacingTokens.sm,
        borderRadius: radiusTokens.md,
        background: colorTokens.background.tertiary,
        color: colorTokens.text.secondary,
      }}
    >
      {label}
    </p>
  );
}

function Problem({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: 0,
        padding: spacingTokens.sm,
        borderRadius: radiusTokens.md,
        border: `1px dashed ${colorTokens.border.control}`,
        color: colorTokens.text.secondary,
      }}
    >
      {text}
    </p>
  );
}

const scroller: React.CSSProperties = { overflowX: "auto", maxWidth: "100%" };

/** Error boundary so one bad block never blanks the whole reply. */
class BlockBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export interface ChatBlockOptions {
  /** Sends a picked option as the person's next message. */
  onChoose?: (text: string) => void;
  /** Whether options can be picked right now (e.g. false while a reply streams). */
  canChoose?: boolean;
}

/**
 * Draws one fenced block if it's a kind the chat knows; otherwise returns
 * undefined so it shows as code. Pass it to ChatMarkdown's `renderBlock`.
 */
export function renderChatBlock(
  block: FencedBlock,
  options: ChatBlockOptions = {}
): React.ReactNode | undefined {
  if (!(CHAT_BLOCK_KINDS as readonly string[]).includes(block.lang)) return undefined;
  return <ChatBlock block={block} options={options} />;
}

function ChatBlock({ block, options }: { block: FencedBlock; options: ChatBlockOptions }) {
  const t = useT();
  const names: Record<string, string> = {
    chart: t("chart"),
    choices: t("options"),
    callsheet: t("call sheet"),
    shotlist: t("shot list"),
    crew: t("crew card"),
    date: t("date"),
    map: t("map"),
    location: t("map"),
  };
  const name = names[block.lang] ?? block.lang;
  if (!block.closed) return <Pending label={t("Preparing the {name}…", { name })} />;
  const data = readJson<Record<string, unknown>>(block.code);
  const bad = <Problem text={t("The model sent a {name} that couldn’t be read.", { name })} />;
  if (!data) return bad;
  let body: React.ReactNode = null;
  if (block.lang === "chart") {
    if (!isChart(data)) return bad;
    body = <ChatChart data={data} />;
  } else if (block.lang === "choices") {
    const opts = Array.isArray(data.options) ? data.options.map(String).filter(Boolean) : [];
    if (!opts.length) return bad;
    body = (
      <ChatChoices
        question={typeof data.question === "string" ? data.question : undefined}
        options={opts}
        onChoose={options.onChoose}
        disabled={options.canChoose === false}
      />
    );
  } else if (block.lang === "callsheet" || block.lang === "shotlist") {
    try {
      const out = readNovaOutput(block.lang === "shotlist" ? repairShotList(data) : data);
      body = (
        <div style={scroller} tabIndex={0} role="region" aria-label={name}>
          <div style={{ minWidth: 560 }}>
            {out.kind === "callsheet" ? (
              <CallSheetPrintView {...fromNovaCallSheet(out.data)} />
            ) : (
              <ShotList {...fromNovaShotList(out.data)} />
            )}
          </div>
        </div>
      );
    } catch {
      return bad;
    }
  } else if (block.lang === "crew") {
    const person = data.person as CrewPerson | undefined;
    if (!person || typeof person.name !== "string") return bad;
    body = (
      <div style={scroller} tabIndex={0} role="region" aria-label={name}>
        <CrewIdCard
          person={{
            id: String(person.id ?? "—"),
            name: person.name,
            designation: String(person.designation ?? ""),
            department: String(person.department ?? ""),
          }}
          production={String(data.production ?? "")}
          organisation={String(data.organisation ?? "")}
          side="front"
        />
      </div>
    );
  } else if (block.lang === "map" || block.lang === "location") {
    const places = readPlaces(data);
    if (!places.length) return bad;
    body = (
      <ChatMap title={typeof data.title === "string" ? data.title : undefined} places={places} />
    );
  } else if (block.lang === "date") {
    const when = new Date(String(data.date ?? ""));
    if (isNaN(when.getTime())) return bad;
    body = <IndianDate date={when} showGregorian />;
  }
  return <BlockBoundary fallback={bad}>{body}</BlockBoundary>;
}

/** Something worth keeping from a reply: a page, document, picture or code. */
export interface ChatArtifact {
  title: string;
  /** "html", "svg", "markdown", or a programming language */
  type: string;
  content: string;
}

/** Runnable artifacts: web pages, pictures and Three.js 3D scenes. */
const PAGE_TYPES = ["html", "svg", "threejs"];
const DOC_TYPES = ["markdown", "md"];

/**
 * The artifacts in a reply: every ```html and ```svg block, and any other
 * block given a title (```markdown title="Shoot plan"). Long code (40+ lines)
 * counts too. Unfinished blocks are skipped.
 */
export function findArtifacts(reply: string): ChatArtifact[] {
  return findFencedBlocks(reply)
    .filter((b) => b.closed && !(CHAT_BLOCK_KINDS as readonly string[]).includes(b.lang))
    .filter((b) => PAGE_TYPES.includes(b.lang) || !!b.meta.title || b.code.split("\n").length >= 40)
    .map((b, i) => ({
      title:
        b.meta.title ||
        (b.lang === "html" ? /<title>([^<]+)<\/title>/i.exec(b.code)?.[1]?.trim() : undefined) ||
        `${b.lang || "text"} ${i + 1}`,
      type: DOC_TYPES.includes(b.lang) ? "markdown" : b.lang || "text",
      content: b.code,
    }));
}

/** The unchecked and checked items of every checklist ("- [ ] …") in a reply. */
export function findTasks(reply: string): { title: string; done: boolean }[] {
  const out: { title: string; done: boolean }[] = [];
  let inFence = false;
  for (const line of reply.split("\n")) {
    if (/^\s*(`{3,}|~{3,})/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^\s*[-*+]\s+\[([ xX])\]\s+(.+?)\s*$/.exec(line);
    if (m) out.push({ title: m[2]!.replace(/\*\*/g, ""), done: m[1] !== " " });
  }
  return out;
}
