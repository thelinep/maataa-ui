// Pre-production: the call sheets and shot lists Maataa Workstation has made,
// opened full size; call sheets can be edited, a shot list can start a new
// call sheet, and every dated call sheet lands on the shoot schedule.
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  CallSheetEditor,
  CallSheetPrintView,
  GanttTimeline,
  ScheduleConflictBadge,
  ShotList,
  fetchNovaOutputs,
  fromNovaCallSheet,
  fromNovaShotList,
  sceneRowsFromShotList,
  useT,
  type CallSheetDay,
  type GanttTask,
  type NovaCallSheet,
  type NovaOutput,
  type SceneRow,
} from "@maataa/ui";

/** A call sheet open for editing: one from Workstation, or a new one. */
interface Draft {
  id: string;
  /** The Workstation output it started from, if any */
  from?: string;
  production: string;
  day: CallSheetDay;
  scenes: SceneRow[];
  /** Cast, crew and notes from the Workstation call sheet, kept as they were */
  base?: NovaCallSheet;
  updatedAt: string;
}

const DRAFTS_KEY = "maataa-local-chat-callsheets";
const loadDrafts = (): Draft[] => {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFTS_KEY) ?? "[]") as Draft[];
  } catch {
    return [];
  }
};
const saveDrafts = (drafts: Draft[]) => {
  try {
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // Drafts just won't outlive the page.
  }
};

const DAY_WORDS: Record<SceneRow["dayNight"], string> = {
  D: "DAY",
  N: "NIGHT",
  M: "MORNING",
  E: "EVENING",
};

/** Back to the shape Workstation and the chat's ```callsheet block use. */
export function toNovaCallSheet(d: Pick<Draft, "production" | "day" | "scenes" | "base">): NovaCallSheet {
  const loc = d.base?.location;
  return {
    production: d.production || "TBC",
    shootDay: `Day ${d.day.shootDay}${d.day.of ? ` of ${d.day.of}` : ""}`,
    date: d.day.date || "TBC",
    generalCall: d.day.shootingCall || "TBC",
    location: {
      name: d.scenes.find((s) => s.location)?.location || loc?.name || "TBC",
      ...(loc?.address ? { address: loc.address } : {}),
      ...(loc?.parking ? { parking: loc.parking } : {}),
      nearestHospital: d.day.hospital || loc?.nearestHospital || "TBC",
    },
    ...(d.day.weather ? { weather: d.day.weather } : {}),
    schedule: d.scenes.map((s) => ({
      time: s.notes || "TBC",
      scene: s.scene,
      description: `${s.set} - ${DAY_WORDS[s.dayNight]}`,
      cast: s.cast
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    })),
    cast: d.base?.cast ?? [],
    crew: d.base?.crew ?? [],
    notes: d.base?.notes ?? [],
  };
}

const newDraftId = () => `cs_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const isoDay = (s: string) => (/^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null);

export function PreProduction({
  onKeep,
  onNewWithSkill,
}: {
  onKeep: (title: string, markdown: string) => void;
  onNewWithSkill: () => void;
}) {
  const t = useT();
  const h = useId();
  const [outputs, setOutputs] = useState<NovaOutput[] | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>(loadDrafts);
  const [tab, setTab] = useState<"papers" | "schedule">("papers");
  const [open, setOpen] = useState<{ kind: "output"; index: number } | { kind: "draft"; id: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    try {
      setOutputs(await fetchNovaOutputs("/nova"));
      setError(null);
    } catch (e) {
      setError(t(e instanceof Error ? e.message : String(e)));
      setOutputs((o) => o ?? []);
    }
  }, [t]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => saveDrafts(drafts), [drafts]);

  const upsertDraft = (d: Draft) =>
    setDrafts((list) => [
      { ...d, updatedAt: new Date().toISOString() },
      ...list.filter((x) => x.id !== d.id),
    ]);

  const editOutput = (o: NovaOutput) => {
    if (o.kind !== "callsheet") return;
    const existing = drafts.find((d) => d.from && d.from === o.id);
    if (existing) {
      setOpen({ kind: "draft", id: existing.id });
      return;
    }
    const p = fromNovaCallSheet(o.data);
    const draft: Draft = {
      id: newDraftId(),
      from: o.id,
      production: p.production,
      day: p.day,
      scenes: p.scenes,
      base: o.data,
      updatedAt: new Date().toISOString(),
    };
    upsertDraft(draft);
    setOpen({ kind: "draft", id: draft.id });
  };
  const startFromShots = (o: NovaOutput) => {
    if (o.kind !== "shotlist") return;
    const draft: Draft = {
      id: newDraftId(),
      production: o.title ?? o.data.title,
      day: { shootDay: 1, date: "TBC", crewCall: "TBC", shootingCall: "TBC" },
      scenes: sceneRowsFromShotList(o.data, "", t),
      updatedAt: new Date().toISOString(),
    };
    upsertDraft(draft);
    setOpen({ kind: "draft", id: draft.id });
    setStatus(t("New call sheet started from {title}.", { title: draft.production }));
  };

  const when = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(document.documentElement.lang || "en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

  // ---- the shoot schedule: every dated call sheet ----------------------
  const sheets = useMemo(() => {
    const fromDrafts = drafts.map((d) => ({ key: d.id, sheet: toNovaCallSheet(d), draft: true }));
    const edited = new Set(drafts.map((d) => d.from).filter(Boolean));
    const fromWorkstation = (outputs ?? [])
      .filter((o): o is Extract<NovaOutput, { kind: "callsheet" }> => o.kind === "callsheet")
      .filter((o) => !edited.has(o.id))
      .map((o, i) => ({ key: o.id ?? `o${i}`, sheet: o.data, draft: false }));
    return [...fromDrafts, ...fromWorkstation];
  }, [drafts, outputs]);
  const dated = sheets.filter((s) => isoDay(s.sheet.date ?? ""));
  const undated = sheets.filter((s) => !isoDay(s.sheet.date ?? ""));
  const byDay = new Map<string, typeof dated>();
  for (const s of dated) {
    const day = isoDay(s.sheet.date!)!;
    byDay.set(day, [...(byDay.get(day) ?? []), s]);
  }
  const days = [...byDay.keys()].sort();
  const conflictsFor = (day: string) => {
    const list = byDay.get(day) ?? [];
    const out: { id: string; description: string }[] = [];
    if (list.length > 1)
      out.push({
        id: `${day}-many`,
        description: t("{count} call sheets on this day: {names}", {
          count: list.length,
          names: list.map((s) => s.sheet.production).join(", "),
        }),
      });
    const seen = new Map<string, string>();
    for (const s of list)
      for (const c of s.sheet.cast ?? []) {
        const name = c.name.trim();
        if (!name || /^tbc$/i.test(name)) continue;
        const other = seen.get(name);
        if (other && other !== s.sheet.production)
          out.push({
            id: `${day}-${name}`,
            description: t("{name} is called for both {a} and {b}", {
              name,
              a: other,
              b: s.sheet.production,
            }),
          });
        seen.set(name, s.sheet.production);
      }
    return out;
  };
  const gantt: GanttTask[] = dated.map((s) => {
    const start = new Date(`${isoDay(s.sheet.date!)}T00:00:00`);
    return {
      id: s.key,
      name: `${s.sheet.production} · ${s.sheet.shootDay ?? ""}`.trim(),
      start,
      end: new Date(start.getTime() + 86_400_000),
      phase: s.sheet.production,
      ...(conflictsFor(isoDay(s.sheet.date!)!).length ? { conflict: t("Clash on this day") } : {}),
    };
  });

  // ---- what is open ------------------------------------------------------
  const openOutput = open?.kind === "output" ? (outputs?.[open.index] ?? null) : null;
  const openDraft = open?.kind === "draft" ? (drafts.find((d) => d.id === open.id) ?? null) : null;

  return (
    <section className="studio" aria-labelledby={h}>
      <div className="studio-head">
        <h2 id={h}>{t("Pre-production")}</h2>
        <div role="tablist" aria-label={t("Pre-production view")} className="inline">
          <button
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === "papers"}
            onClick={() => setTab("papers")}
          >
            {t("Call sheets and shot lists")}
          </button>
          <button
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === "schedule"}
            onClick={() => setTab("schedule")}
          >
            {t("Shoot schedule")}
          </button>
        </div>
        <button type="button" onClick={() => void refresh()}>
          {t("Refresh")}
        </button>
      </div>
      <p aria-live="polite" className="muted small studio-status">
        {status}
      </p>
      {error && (
        <p role="alert" className="tone-error">
          {error}
        </p>
      )}

      {tab === "papers" ? (
        <div className="studio-split preprod">
          <nav className="studio-card stack" aria-label={t("Call sheets and shot lists")}>
            <button type="button" className="primary" onClick={onNewWithSkill}>
              ＋ {t("Make one with a Workstation skill")}
            </button>
            {drafts.length > 0 && (
              <>
                <h3 className="side-h">{t("Your call sheets")}</h3>
                <ul className="plain-list">
                  {drafts.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        className="row-button"
                        aria-current={open?.kind === "draft" && open.id === d.id ? "true" : undefined}
                        onClick={() => setOpen({ kind: "draft", id: d.id })}
                      >
                        <span className="row-title">{d.production}</span>
                        <span className="muted small">
                          {t("Day {n}", { n: d.day.shootDay })} · {d.day.date}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h3 className="side-h">{t("From Workstation")}</h3>
            {outputs === null ? (
              <p className="muted small">{t("Loading…")}</p>
            ) : !outputs.length ? (
              <p className="muted small">{t("None yet. Ask in the chat, or use a skill.")}</p>
            ) : (
              <ul className="plain-list">
                {outputs.map((o, i) => (
                  <li key={o.id ?? i}>
                    <button
                      type="button"
                      className="row-button"
                      aria-current={open?.kind === "output" && open.index === i ? "true" : undefined}
                      onClick={() => setOpen({ kind: "output", index: i })}
                    >
                      <span className="row-title">
                        <span aria-hidden="true">{o.kind === "callsheet" ? "📋 " : "🎬 "}</span>
                        {o.title}
                      </span>
                      <span className="muted small">
                        {o.kind === "callsheet" ? t("Call sheet") : t("Shot list")} · {when(o.createdAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          <div className="studio-card stack" style={{ minWidth: 0 }}>
            {openDraft ? (
              <DraftEditor
                key={openDraft.id}
                draft={openDraft}
                onChange={upsertDraft}
                onKeep={() => {
                  const sheet = toNovaCallSheet(openDraft);
                  onKeep(
                    t("Call sheet: {name}", { name: openDraft.production }),
                    "```callsheet\n" + JSON.stringify(sheet, null, 2) + "\n```\n",
                  );
                }}
                onDelete={() => {
                  setDrafts((list) => list.filter((d) => d.id !== openDraft.id));
                  setOpen(null);
                  setStatus(t("Deleted."));
                }}
              />
            ) : openOutput ? (
              <>
                <div className="inline">
                  {openOutput.kind === "callsheet" ? (
                    <button type="button" className="primary" onClick={() => editOutput(openOutput)}>
                      {t("Edit this call sheet")}
                    </button>
                  ) : (
                    <button type="button" className="primary" onClick={() => startFromShots(openOutput)}>
                      {t("Start a call sheet from these scenes")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      onKeep(
                        openOutput.title ?? t("Untitled"),
                        "```" + openOutput.kind + "\n" + JSON.stringify(openOutput.data, null, 2) + "\n```\n",
                      )
                    }
                  >
                    {t("Keep as artifact")}
                  </button>
                </div>
                <div className="studio-scroll" tabIndex={0} role="region" aria-label={openOutput.title ?? ""}>
                  <div style={{ minWidth: 560 }}>
                    {openOutput.kind === "callsheet" ? (
                      <CallSheetPrintView {...fromNovaCallSheet(openOutput.data)} />
                    ) : (
                      <ShotList {...fromNovaShotList(openOutput.data)} />
                    )}
                  </div>
                </div>
                {openOutput.model && (
                  <p className="muted small">
                    {t("Drafted by the local model {model}. Check every TBC before sending.", {
                      model: openOutput.model,
                    })}
                  </p>
                )}
              </>
            ) : (
              <p className="muted">{t("Choose a call sheet or shot list on the left.")}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="stack">
          {gantt.length ? (
            <GanttTimeline tasks={gantt} caption={t("Shoot days from your call sheets")} />
          ) : (
            <p className="muted">
              {t("No call sheet has a date yet. Give one a date (as 2026-12-01) to see it here.")}
            </p>
          )}
          {days.length > 0 && (
            <ul className="plain-list day-list">
              {days.map((day) => (
                <li key={day} className="studio-card">
                  <div className="inline">
                    <strong>
                      {new Date(`${day}T00:00:00`).toLocaleDateString(
                        document.documentElement.lang || "en-IN",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </strong>
                    <ScheduleConflictBadge conflicts={conflictsFor(day)} subject={day} />
                  </div>
                  <ul className="plain-list">
                    {byDay.get(day)!.map((s) => (
                      <li key={s.key} className="small">
                        {s.sheet.production} · {s.sheet.shootDay} ·{" "}
                        {t("Call {time}", { time: s.sheet.generalCall })} · {s.sheet.location.name}
                        {s.draft && <span className="muted"> · {t("your edit")}</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          {undated.length > 0 && (
            <p className="muted small">
              {t("Without a date: {names}", { names: undated.map((s) => s.sheet.production).join(", ") })}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function DraftEditor({
  draft,
  onChange,
  onKeep,
  onDelete,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onKeep: () => void;
  onDelete: () => void;
}) {
  const t = useT();
  const prodId = useId();
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <div className="inline">
        <div role="group" aria-label={t("Call sheet view")} className="inline">
          <button
            type="button"
            className="chip"
            aria-pressed={mode === "edit"}
            onClick={() => setMode("edit")}
          >
            {t("Edit")}
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={mode === "view"}
            onClick={() => setMode("view")}
          >
            {t("Preview")}
          </button>
        </div>
        <button type="button" className="primary" onClick={onKeep}>
          {t("Keep as artifact")}
        </button>
        {confirm ? (
          <>
            <button type="button" className="danger" onClick={onDelete}>
              {t("Yes, delete it")}
            </button>
            <button type="button" onClick={() => setConfirm(false)}>
              {t("Keep it")}
            </button>
          </>
        ) : (
          <button type="button" className="danger" onClick={() => setConfirm(true)}>
            {t("Delete")}
          </button>
        )}
      </div>
      <p className="muted small">{t("Saved in this browser as you type.")}</p>
      {mode === "edit" ? (
        <>
          <div className="field">
            <label htmlFor={prodId}>{t("Production")}</label>
            <input
              id={prodId}
              value={draft.production}
              onChange={(e) => onChange({ ...draft, production: e.target.value })}
            />
          </div>
          <CallSheetEditor
            day={draft.day}
            onDayChange={(day) => onChange({ ...draft, day })}
            scenes={draft.scenes}
            onScenesChange={(scenes) => onChange({ ...draft, scenes })}
          />
        </>
      ) : (
        <div className="studio-scroll" tabIndex={0} role="region" aria-label={draft.production}>
          <div style={{ minWidth: 560 }}>
            <CallSheetPrintView {...fromNovaCallSheet(toNovaCallSheet(draft))} />
          </div>
        </div>
      )}
    </>
  );
}
