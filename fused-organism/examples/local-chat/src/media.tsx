// Media studio: everything Maataa Workstation has made (pictures, music,
// sound effects, voices and video), the jobs still running, and a form to
// make something new or make a file again with changes.
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AssetGrid, AssetPreview, useT, type Asset } from "@maataa/ui";
import {
  cancelJob,
  deleteMedia,
  listJobs,
  listMedia,
  makeKindOf,
  mediaUrl,
  promptOf,
  startMake,
  type GenerationJob,
  type MakeKind,
  type MediaRecord,
} from "./nova";
import type { CompareSource } from "./compare";

type Filter = "all" | "image" | "audio" | "video";
const PAGE = 120;

const JOB_NAMES: Record<string, string> = {
  "image-generation": "Picture",
  "image-img2img": "Picture to picture",
  "image-edit": "Picture edit",
  "image-upscale": "Sharper picture",
  "audio-music": "Music",
  "audio-sfx": "Sound effect",
  "audio-voice": "Voice",
  "video-ai": "Video",
  "video-camera-moves": "Camera moves",
  "video-join": "Joined video",
};

const MAKE_NAMES: Record<MakeKind, string> = {
  image: "Picture",
  music: "Music",
  sfx: "Sound effect",
  voice: "Voice",
  video: "Video",
};

/** Reads a made picture into a data URL, for "Try other picture models". */
async function asDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** First-frame pictures for videos, made in the browser: the video is loaded
 *  muted, moved to half a second in (or its middle, if shorter), and drawn on
 *  a small canvas. A few at a time; a video that can't be read just keeps the
 *  film icon. Same-origin files only, so the canvas can be read back. */
function useVideoThumbs(urls: string[]): Record<string, string> {
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const tried = useRef(new Set<string>());
  useEffect(() => {
    let cancelled = false;
    const todo = urls.filter((u) => !tried.current.has(u));
    todo.forEach((u) => tried.current.add(u));
    const grab = (url: string) =>
      new Promise<string | null>((resolve) => {
        const v = document.createElement("video");
        let done = false;
        const finish = (out: string | null) => {
          if (done) return;
          done = true;
          v.removeAttribute("src");
          v.load();
          resolve(out);
        };
        const timer = window.setTimeout(() => finish(null), 15000);
        v.muted = true;
        v.preload = "metadata";
        v.playsInline = true;
        v.onloadedmetadata = () => {
          v.currentTime = Math.min(0.5, (v.duration || 1) / 2);
        };
        v.onseeked = () => {
          try {
            const w = 320;
            const h = Math.max(1, Math.round((w * (v.videoHeight || 180)) / (v.videoWidth || 320)));
            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            c.getContext("2d")?.drawImage(v, 0, 0, w, h);
            window.clearTimeout(timer);
            finish(c.toDataURL("image/jpeg", 0.7));
          } catch {
            window.clearTimeout(timer);
            finish(null);
          }
        };
        v.onerror = () => {
          window.clearTimeout(timer);
          finish(null);
        };
        v.src = url;
      });
    (async () => {
      const queue = [...todo];
      const worker = async () => {
        while (queue.length && !cancelled) {
          const url = queue.shift()!;
          const pic = await grab(url);
          if (pic && !cancelled) setThumbs((old) => ({ ...old, [url]: pic }));
        }
      };
      await Promise.all([worker(), worker(), worker()]);
    })();
    return () => {
      cancelled = true;
    };
  }, [urls.join("\n")]); // eslint-disable-line react-hooks/exhaustive-deps
  return thumbs;
}

export function MediaStudio({ onCompare }: { onCompare: (source: CompareSource) => void }) {
  const t = useT();
  const ids = { kind: useId(), prompt: useId(), seconds: useId(), mine: useId() };
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [media, setMedia] = useState<MediaRecord[] | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [onlyMade, setOnlyMade] = useState(true);
  const [shown, setShown] = useState(PAGE);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [kind, setKind] = useState<MakeKind>("image");
  const [prompt, setPrompt] = useState("");
  const [seconds, setSeconds] = useState(8);
  const [starting, setStarting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [m, j] = await Promise.all([listMedia(), listJobs()]);
      setMedia(m);
      setJobs(j);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setMedia((m) => m ?? []);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const running = jobs.filter((j) => j.status === "running");
  const failed = jobs
    .filter((j) => j.status === "failed" && Date.now() - Date.parse(j.createdAt) < 86_400_000)
    .slice(0, 5);
  // While something is being made, check every few seconds.
  useEffect(() => {
    if (!running.length) return;
    const timer = window.setInterval(() => void refresh(), 3000);
    return () => window.clearInterval(timer);
  }, [running.length, refresh]);
  // Tell screen-reader users when a job finishes.
  const lastRunning = useRef<string[]>([]);
  useEffect(() => {
    const now = running.map((j) => j.id);
    const finished = lastRunning.current.filter((id) => !now.includes(id));
    if (finished.length) {
      const j = jobs.find((x) => x.id === finished[0]);
      if (j?.status === "done") setStatus(t("Finished: {name}", { name: t(JOB_NAMES[j.type] ?? "Media") }));
      if (j?.status === "failed")
        setStatus(t("Couldn’t finish: {name}", { name: t(JOB_NAMES[j.type] ?? "Media") }));
    }
    lastRunning.current = now;
  }, [jobs, running, t]);

  const list = useMemo(
    () =>
      (media ?? []).filter(
        (m) => (filter === "all" || m.kind === filter) && (!onlyMade || m.source !== "upload"),
      ),
    [media, filter, onlyMade],
  );
  const videoUrls = useMemo(
    () => list.slice(0, shown).filter((m) => m.kind === "video").map((m) => mediaUrl(m.id)),
    [list, shown],
  );
  const videoThumbs = useVideoThumbs(videoUrls);
  const assets: Asset[] = list.slice(0, shown).map((m) => {
    const words = promptOf(m);
    return {
      id: m.id,
      name: words ? words.slice(0, 60) : m.originalName,
      kind: m.kind,
      url: mediaUrl(m.id),
      thumbnailUrl: m.kind === "image" ? mediaUrl(m.id) : m.kind === "video" ? videoThumbs[mediaUrl(m.id)] : undefined,
      alt: m.kind === "image" ? words || m.originalName : undefined,
      size: m.bytes,
    };
  });
  const open = media?.find((m) => m.id === openId) ?? null;

  const make = async () => {
    if (!prompt.trim()) return;
    setStarting(true);
    setError(null);
    try {
      await startMake(kind, prompt.trim(), kind === "image" || kind === "voice" ? undefined : seconds);
      setStatus(t("Started: {name}", { name: t(MAKE_NAMES[kind]) }));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStarting(false);
    }
  };
  const makeAgain = (m: MediaRecord) => {
    setKind(makeKindOf(m, jobs));
    setPrompt(promptOf(m));
    const s = Number(m.provenance?.seconds);
    if (Number.isFinite(s) && s > 0) setSeconds(s);
    promptRef.current?.focus();
    promptRef.current?.scrollIntoView({ block: "center" });
  };
  const remove = async (m: MediaRecord) => {
    try {
      await deleteMedia(m.id);
      setOpenId(null);
      setConfirmDelete(false);
      setStatus(t("Deleted."));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };
  const when = (iso: string) =>
    new Date(iso).toLocaleString(document.documentElement.lang || "en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });

  const filters: [Filter, string][] = [
    ["all", t("All")],
    ["image", t("Pictures")],
    ["audio", t("Sound")],
    ["video", t("Video")],
  ];

  return (
    <section className="studio" aria-labelledby={`${ids.kind}-h`}>
      <div className="studio-head">
        <h2 id={`${ids.kind}-h`}>{t("Media studio")}</h2>
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

      <form
        className="studio-card stack"
        onSubmit={(e) => {
          e.preventDefault();
          void make();
        }}
      >
        <h3>{t("Make something new")}</h3>
        <div className="grid2">
          <div className="field">
            <label htmlFor={ids.kind}>{t("What to make")}</label>
            <select id={ids.kind} value={kind} onChange={(e) => setKind(e.target.value as MakeKind)}>
              {(Object.keys(MAKE_NAMES) as MakeKind[]).map((k) => (
                <option key={k} value={k}>
                  {t(MAKE_NAMES[k])}
                </option>
              ))}
            </select>
          </div>
          {kind !== "image" && kind !== "voice" && (
            <div className="field">
              <label htmlFor={ids.seconds}>{t("Length in seconds")}</label>
              <input
                id={ids.seconds}
                type="number"
                min={1}
                max={kind === "video" ? 10 : 120}
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value) || 1)}
              />
            </div>
          )}
        </div>
        <div className="field">
          <label htmlFor={ids.prompt}>{kind === "voice" ? t("Words to speak") : t("Describe it")}</label>
          <textarea
            id={ids.prompt}
            ref={promptRef}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="primary" disabled={!prompt.trim() || starting}>
            {starting ? t("Starting…") : t("Make it")}
          </button>
        </div>
      </form>

      {(running.length > 0 || failed.length > 0) && (
        <div className="studio-card stack">
          <h3>{t("Being made")}</h3>
          <ul className="plain-list job-list">
            {running.map((j) => (
              <li key={j.id} className="job">
                <span className="dot busy" aria-hidden="true" />
                <span className="job-text">
                  <strong>{t(JOB_NAMES[j.type] ?? "Media")}</strong>
                  {typeof j.settings?.prompt === "string" && <span> · {j.settings.prompt.slice(0, 80)}</span>}
                  <span className="muted small"> · {j.progress || t("Waiting to start…")}</span>
                </span>
                <button
                  type="button"
                  className="small-btn"
                  onClick={() => void cancelJob(j.id).then(refresh, (e: Error) => setError(e.message))}
                >
                  {t("Stop")}
                </button>
              </li>
            ))}
            {failed.map((j) => (
              <li key={j.id} className="job">
                <span className="dot error" aria-hidden="true" />
                <span className="job-text">
                  <strong>{t(JOB_NAMES[j.type] ?? "Media")}</strong>
                  <span className="tone-error"> · {j.error || t("Failed")}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="studio-split">
        <div className="stack" style={{ minWidth: 0 }}>
          <div className="inline">
            <div role="group" aria-label={t("Show")} className="inline">
              {filters.map(([f, label]) => (
                <button
                  key={f}
                  type="button"
                  className="chip"
                  aria-pressed={filter === f}
                  onClick={() => {
                    setFilter(f);
                    setShown(PAGE);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="inline small" htmlFor={ids.mine}>
              <input
                id={ids.mine}
                type="checkbox"
                checked={onlyMade}
                onChange={(e) => setOnlyMade(e.target.checked)}
              />
              {t("Only things Workstation made")}
            </label>
          </div>
          {media === null ? (
            <p className="muted">{t("Loading…")}</p>
          ) : !list.length ? (
            <p className="muted">{t("Nothing here yet. Make something above, or ask for it in the chat.")}</p>
          ) : (
            <>
              <AssetGrid
                assets={assets}
                label={t("Made files")}
                onOpen={(a) => {
                  setOpenId(a.id);
                  setConfirmDelete(false);
                }}
              />
              {list.length > shown && (
                <button type="button" onClick={() => setShown((n) => n + PAGE)}>
                  {t("Show more ({count} left)", { count: list.length - shown })}
                </button>
              )}
            </>
          )}
        </div>

        {open && (
          <aside className="studio-card stack studio-detail" aria-label={t("Selected file")}>
            <AssetPreview
              asset={{
                id: open.id,
                name: open.originalName,
                kind: open.kind,
                url: mediaUrl(open.id),
                thumbnailUrl: open.kind === "video" ? videoThumbs[mediaUrl(open.id)] : undefined,
                alt: open.kind === "image" ? promptOf(open) || open.originalName : undefined,
                size: open.bytes,
                meta: when(open.createdAt),
              }}
            />
            {promptOf(open) && (
              <p className="media-prompt">
                <span className="muted small">{t("Made from")}: </span>
                {promptOf(open)}
              </p>
            )}
            {typeof open.provenance?.checkpoint === "string" && (
              <p className="muted small">
                {t("Model")}: {open.provenance.checkpoint}
              </p>
            )}
            <div className="inline">
              <a className="file-button" href={mediaUrl(open.id)} download={open.originalName}>
                {t("Download")}
              </a>
              {open.source !== "upload" && (
                <button type="button" onClick={() => makeAgain(open)}>
                  {t("Make again with changes")}
                </button>
              )}
              {open.kind === "image" && (
                <button
                  type="button"
                  onClick={() =>
                    void asDataUrl(mediaUrl(open.id)).then(
                      (image) => onCompare({ image, prompt: promptOf(open) }),
                      (e: Error) => setError(e.message),
                    )
                  }
                >
                  {t("Try other picture models")}
                </button>
              )}
              {confirmDelete ? (
                <>
                  <button type="button" className="danger" onClick={() => void remove(open)}>
                    {t("Yes, delete it")}
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)}>
                    {t("Keep it")}
                  </button>
                </>
              ) : (
                <button type="button" className="danger" onClick={() => setConfirmDelete(true)}>
                  {t("Delete")}
                </button>
              )}
              <button type="button" className="ghost" onClick={() => setOpenId(null)}>
                {t("Close")}
              </button>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
