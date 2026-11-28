// Compare image models: one picture, one instruction, every chosen model at a
// few strengths, side by side. Runs through Maataa Workstation, one job at a
// time (image jobs are heavy, and Workstation runs one at a time anyway).
import { useEffect, useId, useRef, useState } from "react";
import { useT } from "@maataa/ui";
import {
  cancelJob,
  getJob,
  imageStatus,
  mediaUrl,
  startImageToImage,
  uploadPicture,
  type ImageStatus,
} from "./nova";

export interface CompareSource {
  /** The picture, as a data URL */
  image: string;
  /** What should change */
  prompt: string;
}

/** What each model's license allows, matched on its file name. */
export function licenseOf(model: string): { label: string; paid: boolean | "limited" } {
  const m = model.toLowerCase();
  const rules: [RegExp, string, boolean | "limited"][] = [
    [/qwen.?image.?2\.?1/, "Research only", false],
    [/qwen.?image.?edit/, "Apache 2.0", true],
    [/flux.?3.*klein/, "Free under $5M revenue", "limited"],
    [/flux.?2.*klein.*4b/, "Apache 2.0", true],
    [/flux|kontext/, "Non-commercial", false],
    [/hidream/, "MIT", true],
    [/fibo/, "Non-commercial", false],
    [/sd_?xl/, "Open RAIL++", true],
  ];
  const hit = rules.find(([re]) => re.test(m));
  return hit ? { label: hit[1], paid: hit[2] } : { label: "Check license", paid: false };
}

const STRENGTHS = [
  { value: 0.35, key: "light" },
  { value: 0.55, key: "medium" },
  { value: 0.75, key: "strong" },
] as const;

interface Cell {
  model: string;
  strength: number;
  status: "waiting" | "running" | "done" | "failed" | "cancelled";
  mediaId?: string;
  error?: string;
  progress?: string | null;
}

const short = (model: string) => model.replace(/\.(safetensors|ckpt|gguf)$/i, "");
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ComparePanel({
  source,
  nova,
}: {
  source: CompareSource | null;
  nova: "unknown" | "on" | "off";
}) {
  const t = useT();
  const ids = { prompt: useId(), models: useId(), strengths: useId() };
  const [status, setStatus] = useState<ImageStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(source?.prompt ?? "");
  const [models, setModels] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<number[]>(STRENGTHS.map((s) => s.value));
  const [cells, setCells] = useState<Cell[]>([]);
  const [running, setRunning] = useState(false);
  const stop = useRef(false);
  const currentJob = useRef<string | null>(null);

  useEffect(() => setPrompt(source?.prompt ?? ""), [source]);
  useEffect(() => {
    if (nova !== "on") return;
    let live = true;
    imageStatus()
      .then((s) => {
        if (!live) return;
        setStatus(s);
        setModels((m) => (m.length ? m : s.checkpoints.slice(0, 3)));
      })
      .catch((e: Error) => live && setStatusError(e.message));
    return () => {
      live = false;
    };
  }, [nova]);

  if (!source)
    return (
      <p className="muted pad">
        {t(
          "Attach a picture in the chat and write what should change, then press “Compare image models” under the reply, or type /compare.",
        )}
      </p>
    );
  if (nova !== "on")
    return (
      <p className="block-note pad">
        {t("Maataa Workstation makes the pictures. Start it (port 8787), then come back here.")}
      </p>
    );

  const strengthName = (v: number) => {
    const s = STRENGTHS.find((x) => x.value === v);
    return s?.key === "light" ? t("light") : s?.key === "medium" ? t("medium") : t("strong");
  };

  const run = async () => {
    stop.current = false;
    setRunning(true);
    const plan: Cell[] = models.flatMap((model) =>
      strengths.map((strength) => ({ model, strength, status: "waiting" as const })),
    );
    setCells(plan);
    const update = (i: number, patch: Partial<Cell>) =>
      setCells((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
    let mediaId: string;
    try {
      mediaId = await uploadPicture(source.image, "compare-source.png");
    } catch (e) {
      setCells(plan.map((c) => ({ ...c, status: "failed", error: (e as Error).message })));
      setRunning(false);
      return;
    }
    // Same seed for every cell, so only the model and the strength differ.
    const seed = Math.floor(Math.random() * 2 ** 31);
    for (let i = 0; i < plan.length; i++) {
      if (stop.current) {
        update(i, { status: "cancelled" });
        continue;
      }
      const cell = plan[i]!;
      update(i, { status: "running" });
      try {
        const job = await startImageToImage({
          mediaId,
          prompt,
          checkpoint: cell.model,
          strength: cell.strength,
          seed,
        });
        currentJob.current = job.id;
        for (;;) {
          await wait(1500);
          const j = await getJob(job.id);
          if (j.status === "running") {
            update(i, { progress: j.progress ?? null });
            continue;
          }
          update(i, {
            status: j.status,
            mediaId: j.mediaIds?.[0],
            error: j.error ?? undefined,
          });
          break;
        }
      } catch (e) {
        update(i, { status: "failed", error: (e as Error).message });
      }
      currentJob.current = null;
    }
    setRunning(false);
  };

  const cancel = () => {
    stop.current = true;
    if (currentJob.current) void cancelJob(currentJob.current).catch(() => undefined);
  };

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const checkpoints = status?.checkpoints ?? [];
  const done = cells.filter((c) => c.status !== "waiting" && c.status !== "running").length;

  return (
    <div className="pad stack compare">
      <div className="compare-head">
        <img src={source.image} alt={t("Original picture")} className="compare-original" />
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor={ids.prompt}>{t("What should change")}</label>
          <textarea
            id={ids.prompt}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={running}
          />
        </div>
      </div>

      {statusError || (status && !status.reachable) ? (
        <p className="block-note">
          {statusError ?? status?.error ?? t("ComfyUI isn’t running in Maataa Workstation.")}
        </p>
      ) : !status ? (
        <p className="muted">{t("Asking Maataa Workstation which models it has…")}</p>
      ) : !checkpoints.length ? (
        <p className="block-note">{t("Maataa Workstation has no image models installed yet.")}</p>
      ) : (
        <>
          <fieldset className="stack" disabled={running}>
            <legend id={ids.models}>{t("Models")}</legend>
            {checkpoints.map((m) => {
              const lic = licenseOf(m);
              return (
                <label key={m} className="inline">
                  <input
                    type="checkbox"
                    checked={models.includes(m)}
                    onChange={() => setModels((l) => toggle(l, m))}
                  />
                  <span style={{ overflowWrap: "anywhere" }}>{short(m)}</span>
                  <span
                    className={`lic ${lic.paid === true ? "lic-ok" : lic.paid === "limited" ? "lic-limited" : "lic-no"}`}
                  >
                    {t(lic.label)}
                  </span>
                </label>
              );
            })}
          </fieldset>
          <fieldset className="inline" disabled={running}>
            <legend id={ids.strengths}>{t("How much to change")}</legend>
            {STRENGTHS.map((s) => (
              <label key={s.value} className="inline">
                <input
                  type="checkbox"
                  checked={strengths.includes(s.value)}
                  onChange={() => setStrengths((l) => toggle(l, s.value).sort())}
                />
                {strengthName(s.value)} ({s.value})
              </label>
            ))}
          </fieldset>
          <div className="inline">
            {running ? (
              <button type="button" onClick={cancel}>
                {t("Stop")}
              </button>
            ) : (
              <button
                type="button"
                className="primary"
                disabled={!prompt.trim() || !models.length || !strengths.length}
                onClick={() => void run()}
              >
                {t.plural(models.length * strengths.length, "Make {count} picture", "Make {count} pictures")}
              </button>
            )}
            {cells.length > 0 && (
              <span role="status" className="small muted">
                {t("{done} of {total} done", { done, total: cells.length })}
              </span>
            )}
          </div>
        </>
      )}

      {cells.length > 0 && (
        <div
          className="compare-grid"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, strengths.length)}, minmax(0, 1fr))` }}
        >
          {cells.map((c, i) => {
            const lic = licenseOf(c.model);
            return (
              <figure key={i} className="compare-cell">
                {c.status === "done" && c.mediaId ? (
                  <a href={mediaUrl(c.mediaId)} target="_blank" rel="noreferrer">
                    <img
                      src={mediaUrl(c.mediaId)}
                      alt={`${short(c.model)}, ${strengthName(c.strength)}: ${prompt}`}
                    />
                  </a>
                ) : (
                  <div className="compare-wait">
                    {c.status === "running"
                      ? c.progress || t("Making…")
                      : c.status === "waiting"
                        ? t("Waiting")
                        : c.status === "cancelled"
                          ? t("Stopped")
                          : c.error || t("Failed")}
                  </div>
                )}
                <figcaption>
                  <strong>{short(c.model)}</strong> · {strengthName(c.strength)}
                  <span
                    className={`lic ${lic.paid === true ? "lic-ok" : lic.paid === "limited" ? "lic-limited" : "lic-no"}`}
                  >
                    {t(lic.label)}
                  </span>
                  {c.status === "done" && c.mediaId && (
                    <a href={mediaUrl(c.mediaId)} download className="small">
                      {t("Download")}
                    </a>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}
