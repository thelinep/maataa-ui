/**
 * @maataa/ui/data/nova
 * Reads shot lists and call sheets made by Maataa Workstation (nova-console
 * in the brahmini repo) and turns them into props for ShotList,
 * CallSheetPrintView and CallSheetEditor.
 *
 * Accepted input, as an object or JSON text:
 * - a saved output from `GET /api/skill-outputs` (`{ skillId, data, … }`)
 * - the `.json` recipe file Maataa Library writes beside each `.md`
 *   (`{ nova: "skill-output", data, … }`)
 * - a skill run result (`{ kind: "callsheet" | "shotlist", data, markdown }`)
 * - the bare `data` object
 *
 * The workstation writes "TBC" for anything not in its source; it stays
 * "TBC" here so nobody mistakes a guess for a fact.
 */

import { englishT, msg, type TranslateFn } from "../i18n/LocaleProvider";
import type { CallContact, CallSheetPrintViewProps } from "./CallSheetPrintView";
import type { CallSheetDay, SceneRow } from "../forms/CallSheetEditor";

/** The call sheet shape the workstation's call sheet skill returns */
export interface NovaCallSheet {
  production: string;
  /** e.g. "Day 1 of 3" */
  shootDay?: string;
  date?: string;
  generalCall: string;
  location: { name: string; address?: string; parking?: string; nearestHospital?: string };
  weather?: string;
  schedule: { time: string; scene?: string; description: string; cast?: string[] }[];
  cast?: { name: string; role?: string; call?: string; notes?: string }[];
  crew?: { department?: string; name: string; call?: string }[];
  notes?: string[];
}

/** The shot list shape the workstation's shot list skill returns */
export interface NovaShotList {
  title: string;
  scenes: {
    scene: string;
    heading: string;
    shots: {
      shot: string;
      size: string;
      angle: string;
      movement: string;
      description: string;
      lens?: string;
      durationSec?: number | string;
      notes?: string;
    }[];
  }[];
}

export type NovaOutput =
  | {
      kind: "callsheet";
      data: NovaCallSheet;
      title?: string;
      model?: string;
      createdAt?: string;
      id?: string;
    }
  | {
      kind: "shotlist";
      data: NovaShotList;
      title?: string;
      model?: string;
      createdAt?: string;
      id?: string;
    };

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown) => (v == null ? "" : String(v).trim());

const NOT_NOVA = msg("This isn't a shot list or call sheet from Maataa Workstation.");
const MD_FILE = msg(
  "That's the Markdown copy. Open the .json file saved beside it in Maataa Library."
);

function looksLikeCallSheet(d: unknown): d is NovaCallSheet {
  return (
    isObj(d) && typeof d.generalCall === "string" && Array.isArray(d.schedule) && isObj(d.location)
  );
}
function looksLikeShotList(d: unknown): d is NovaShotList {
  return (
    isObj(d) && Array.isArray(d.scenes) && d.scenes.every((s) => isObj(s) && Array.isArray(s.shots))
  );
}

/**
 * readNovaOutput
 * Works out what a pasted or loaded workstation output is. Throws an Error
 * with a plain message (a catalog key, so `t(e.message)` translates it).
 */
export function readNovaOutput(input: unknown): NovaOutput {
  let value = input;
  if (typeof value === "string") {
    const text = value.trim();
    if (text.startsWith("#") || text.startsWith("---")) throw new Error(MD_FILE);
    try {
      value = JSON.parse(text);
    } catch {
      throw new Error(NOT_NOVA);
    }
  }
  if (!isObj(value)) throw new Error(NOT_NOVA);
  const meta = {
    title: str(value.title) || undefined,
    model: str(value.model) || undefined,
    createdAt: str(value.createdAt) || undefined,
    id: str(value.id ?? value.outputId) || undefined,
  };
  const data = isObj(value.data) ? value.data : value;
  if (looksLikeCallSheet(data))
    return { kind: "callsheet", data, ...meta, title: meta.title ?? str(data.production) };
  if (looksLikeShotList(data))
    return { kind: "shotlist", data, ...meta, title: meta.title ?? str(data.title) };
  throw new Error(NOT_NOVA);
}

/** "Day 2 of 5" → { day: 2, of: 5 }; Devanagari digits too */
function parseShootDay(s: string | undefined): { day: number; of?: number } {
  const digits = str(s).replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)));
  const n = digits.match(/\d+/g)?.map(Number) ?? [];
  return { day: n[0] ?? 1, ...(n[1] ? { of: n[1] } : {}) };
}

const isTbc = (s: string) => !s || /^tbc$/i.test(s);

/** The earliest "HH:MM" in a list, or undefined. */
function earliest(times: (string | undefined)[]): string | undefined {
  const ok = times.map(str).filter((t) => /^\d{1,2}:\d{2}$/.test(t));
  return ok.sort((a, b) => a.padStart(5, "0").localeCompare(b.padStart(5, "0")))[0];
}

/** Scene heading → set and day/night: "INT. KITCHEN - NIGHT" → { set: "INT. KITCHEN", dayNight: "N" } */
export function parseSceneHeading(heading: string): {
  set: string;
  dayNight: SceneRow["dayNight"];
} {
  const h = str(heading);
  const m = h.match(/^(.*?)\s*[-–—]\s*([^-–—]+)$/);
  const tail = (m?.[2] ?? "").trim();
  const when: [RegExp, SceneRow["dayNight"]][] = [
    [/\b(night)\b|रात/i, "N"],
    [/\b(morning|dawn)\b|सुबह|प्रातः/i, "M"],
    [/\b(evening|dusk)\b|शाम|संध्या/i, "E"],
    [/\b(day)\b|दिन/i, "D"],
  ];
  const hit = when.find(([re]) => re.test(tail));
  return hit ? { set: m![1]!.trim(), dayNight: hit[1] } : { set: h, dayNight: "D" };
}

/**
 * fromNovaCallSheet
 * Props for CallSheetPrintView. Schedule rows become scene rows, with the
 * time and description kept in the notes; cast notes stay with the role.
 */
export function fromNovaCallSheet(d: NovaCallSheet): CallSheetPrintViewProps {
  const { day: shootDay, of } = parseShootDay(d.shootDay);
  const loc = d.location ?? { name: "" };
  const crewCall = earliest((d.crew ?? []).map((c) => c.call)) ?? d.generalCall;
  const day: CallSheetDay = {
    shootDay,
    ...(of ? { of } : {}),
    date: str(d.date) || "TBC",
    crewCall,
    shootingCall: d.generalCall,
    ...(d.weather ? { weather: d.weather } : {}),
    hospital: str(loc.nearestHospital) || "TBC",
    basecamp: [
      loc.name,
      isTbc(str(loc.address)) ? "" : loc.address,
      isTbc(str(loc.parking)) ? "" : `P: ${loc.parking}`,
    ]
      .filter(Boolean)
      .join(", "),
  };
  const scenes: SceneRow[] = d.schedule.map((s, i) => {
    const { set, dayNight } = parseSceneHeading(s.description);
    return {
      id: `nova-${i}`,
      scene: str(s.scene),
      set,
      dayNight,
      pages: "",
      cast: (s.cast ?? []).filter(Boolean).join(", "),
      location: str(loc.name),
      notes: str(s.time),
    };
  });
  const cast: CallContact[] = (d.cast ?? []).map((c) => ({
    role: [str(c.role), str(c.notes)].filter(Boolean).join(" · "),
    name: str(c.name),
    ...(c.call ? { call: c.call } : {}),
  }));
  const crew: CallContact[] = (d.crew ?? []).map((c) => ({
    role: str(c.department),
    name: str(c.name),
    ...(c.call ? { call: c.call } : {}),
  }));
  return {
    production: str(d.production) || "TBC",
    day,
    scenes,
    cast,
    crew,
    notes: (d.notes ?? []).map(str).filter(Boolean).join("\n"),
  };
}

/** Shot list props for ShotList; durations become numbers (or undefined for "TBC"). */
export function fromNovaShotList(d: NovaShotList) {
  return {
    title: str(d.title) || "TBC",
    scenes: d.scenes.map((s) => ({
      scene: str(s.scene),
      heading: str(s.heading),
      shots: s.shots.map((shot) => {
        const sec = Number(shot.durationSec);
        return {
          shot: str(shot.shot),
          size: str(shot.size),
          angle: str(shot.angle),
          movement: str(shot.movement),
          description: str(shot.description),
          lens: str(shot.lens) || "TBC",
          ...(Number.isFinite(sec) && sec > 0 ? { durationSec: sec } : {}),
          ...(str(shot.notes) ? { notes: str(shot.notes) } : {}),
        };
      }),
    })),
  };
}

/**
 * sceneRowsFromShotList
 * Seeds a call sheet's scene table from a shot list: one row per scene,
 * with set and day/night from the heading and the shot count in the notes.
 */
export function sceneRowsFromShotList(
  d: NovaShotList,
  location = "",
  t: TranslateFn = englishT
): SceneRow[] {
  return d.scenes.map((s, i) => {
    const { set, dayNight } = parseSceneHeading(s.heading);
    return {
      id: `shots-${i}`,
      scene: str(s.scene),
      set,
      dayNight,
      pages: "",
      cast: "",
      location,
      notes: t("Shots: {count}", { count: s.shots.length }),
    };
  });
}

/**
 * fetchNovaOutputs
 * The workstation's saved shot lists and call sheets, newest first. The
 * workstation listens on 127.0.0.1:8787 and sends no CORS headers, so call
 * it through your dev server's proxy (see docs/NOVA-PREPRODUCTION.md) or
 * from the same origin. Other saved outputs are left out.
 */
export async function fetchNovaOutputs(
  base = "/nova",
  fetcher: typeof fetch = fetch
): Promise<NovaOutput[]> {
  const res = await fetcher(`${base.replace(/\/$/, "")}/api/skill-outputs`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(msg("Couldn't reach Maataa Workstation. Is it running?"));
  const list = (await res.json()) as unknown;
  if (!Array.isArray(list)) return [];
  const out: NovaOutput[] = [];
  for (const item of list) {
    try {
      out.push(readNovaOutput(item));
    } catch {
      /* not a shot list or call sheet */
    }
  }
  return out;
}
