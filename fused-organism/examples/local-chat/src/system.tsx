// System: is everything behind the chat working? Workstation, the models in
// Ollama (and which are in memory), ComfyUI for pictures and video, the
// scheduler, free disk space, and what Workstation did recently.
import { useCallback, useEffect, useId, useState } from "react";
import { useT } from "@maataa/ui";
import {
  comfyAction,
  comfyLog,
  comfyStatus,
  diskInfo,
  health,
  loadModel,
  ollamaStatus,
  recentActivity,
  schedulerStatus,
  serviceStatus,
  unloadModel,
  type ComfyStatus,
  type DiskInfo,
  type Execution,
  type OllamaStatus,
} from "./ws-api";

type T = ReturnType<typeof useT>;
const gb = (bytes?: number | null) => (bytes ? `${(bytes / 1e9).toFixed(1)} GB` : "—");
const msg = (e: unknown, t: T) => t(e instanceof Error ? e.message : String(e));

/** Finds a yes/no "is it ready" answer in the varied status shapes Workstation returns. */
function readyOf(s: Record<string, unknown> | null): boolean | null {
  if (!s) return null;
  for (const key of ["reachable", "ready", "ok", "available"])
    if (typeof s[key] === "boolean") return s[key] as boolean;
  for (const v of Object.values(s))
    if (v && typeof v === "object") {
      const inner = readyOf(v as Record<string, unknown>);
      if (inner) return true;
    }
  return null;
}

export function SystemStatus() {
  const t = useT();
  const h = useId();
  const [ok, setOk] = useState<boolean | null>(null);
  const [dataDir, setDataDir] = useState<string | null>(null);
  const [ollama, setOllama] = useState<OllamaStatus | null>(null);
  const [comfy, setComfy] = useState<ComfyStatus | null>(null);
  const [services, setServices] = useState<Record<string, boolean | null>>({});
  const [sched, setSched] = useState<Awaited<ReturnType<typeof schedulerStatus>> | null>(null);
  const [disk, setDisk] = useState<DiskInfo | "unsupported" | null>(null);
  const [appSpace, setAppSpace] = useState<{ usage?: number; quota?: number } | null>(null);
  const [activity, setActivity] = useState<Execution[]>([]);
  const [log, setLog] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    const tryIt = async <R,>(p: Promise<R>) =>
      p.then(
        (v) => v,
        () => null,
      );
    const [hh, o, c, sc, a, i, au, v] = await Promise.all([
      tryIt(health()),
      tryIt(ollamaStatus()),
      tryIt(comfyStatus()),
      tryIt(schedulerStatus()),
      tryIt(recentActivity()),
      tryIt(serviceStatus("/images/status")),
      tryIt(serviceStatus("/audio/status")),
      tryIt(serviceStatus("/video/status")),
    ]);
    setOk(hh?.ok ?? false);
    setDataDir(hh?.dataDir ?? null);
    setOllama(o);
    setComfy(c);
    setSched(sc);
    setActivity(a?.rows ?? []);
    setServices({ pictures: readyOf(i), sound: readyOf(au), video: readyOf(v) });
    try {
      setDisk(await diskInfo());
    } catch {
      setDisk("unsupported");
    }
    try {
      const est = await navigator.storage?.estimate?.();
      setAppSpace(est ?? null);
    } catch {
      setAppSpace(null);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const act = async (label: string, work: () => Promise<unknown>, done: string) => {
    setBusy(label);
    setError(null);
    try {
      await work();
      setStatus(done);
      await refresh();
    } catch (e) {
      setError(msg(e, t));
    } finally {
      setBusy(null);
    }
  };
  const dot = (v: boolean | null | undefined) => (
    <span className={`dot ${v ? "ok" : v === false ? "error" : ""}`} aria-hidden="true" />
  );
  const yesNo = (v: boolean | null | undefined) =>
    v ? t("Working") : v === false ? t("Not reachable") : t("Unknown");
  const loaded = new Map((ollama?.loaded ?? []).map((m) => [m.name, m]));
  const comfyUp = comfy ? comfy.running || comfy.state === "ready" || comfy.state === "external" : null;
  const time = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleString(document.documentElement.lang || "en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : "—";

  return (
    <section className="studio" aria-labelledby={h}>
      <div className="studio-head">
        <h2 id={h}>{t("System")}</h2>
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

      <div className="tile-grid">
        <div className="studio-card stack">
          <h3>
            {dot(ok)} {t("Maataa Workstation")}
          </h3>
          <p className="small">{yesNo(ok)}</p>
          {dataDir && <p className="muted small break">{dataDir}</p>}
        </div>
        <div className="studio-card stack">
          <h3>
            {dot(ollama?.reachable)} {t("Ollama (chat models)")}
          </h3>
          <p className="small">
            {ollama?.reachable
              ? t("{count} models, {loaded} in memory", {
                  count: ollama.models.length,
                  loaded: ollama.runningModelNames.length,
                })
              : yesNo(ollama ? false : null)}
          </p>
        </div>
        <div className="studio-card stack">
          <h3>
            {dot(comfyUp)} {t("ComfyUI (pictures and video)")}
          </h3>
          <p className="small">{comfy ? t(comfy.state) : t("Unknown")}</p>
          {comfy?.lastError && <p className="tone-error small">{comfy.lastError}</p>}
        </div>
        <div className="studio-card stack">
          <h3>{t("Free disk space")}</h3>
          {disk && disk !== "unsupported" ? (
            <>
              <p className="big-number">{gb(disk.freeBytes)}</p>
              <meter
                min={0}
                max={disk.totalBytes}
                value={disk.totalBytes - disk.freeBytes}
                low={disk.totalBytes * 0.7}
                high={disk.totalBytes * 0.9}
                optimum={0}
                aria-label={t("Disk used")}
              />
              <p className="muted small">{t("of {total}", { total: gb(disk.totalBytes) })}</p>
            </>
          ) : (
            <p className="muted small">
              {disk === "unsupported"
                ? t("Needs the Workstation update in Claude outputs to show this.")
                : t("Loading…")}
            </p>
          )}
          {appSpace?.usage !== undefined && (
            <p className="muted small">
              {t("This chat app keeps {size} in the browser.", {
                size: `${((appSpace.usage ?? 0) / 1e6).toFixed(1)} MB`,
              })}
            </p>
          )}
        </div>
      </div>

      <div className="studio-card stack">
        <h3>{t("Making pictures, sound and video")}</h3>
        <ul className="plain-list inline">
          {(
            [
              ["pictures", t("Pictures")],
              ["sound", t("Sound")],
              ["video", t("Video")],
            ] as const
          ).map(([k, label]) => (
            <li key={k} className="inline small">
              {dot(services[k])} {label}: {yesNo(services[k])}
            </li>
          ))}
        </ul>
        <div className="inline">
          {comfyUp ? (
            <>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void act("restart", () => comfyAction("restart"), t("ComfyUI restarting."))}
              >
                {t("Restart ComfyUI")}
              </button>
              <button
                type="button"
                className="danger"
                disabled={busy !== null}
                onClick={() => void act("stop", () => comfyAction("stop"), t("ComfyUI stopped."))}
              >
                {t("Stop ComfyUI")}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="primary"
              disabled={busy !== null || comfy?.installed === false}
              onClick={() => void act("start", () => comfyAction("start"), t("ComfyUI starting."))}
            >
              {t("Start ComfyUI")}
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              log === null
                ? void comfyLog().then(
                    (r) => setLog(Array.isArray(r.log) ? r.log.join("\n") : r.log),
                    (e) => setError(msg(e, t)),
                  )
                : setLog(null)
            }
            aria-expanded={log !== null}
          >
            {log === null ? t("Show ComfyUI log") : t("Hide ComfyUI log")}
          </button>
        </div>
        {comfy?.installed === false && (
          <p className="muted small">{t("ComfyUI isn’t installed. Install it from Workstation.")}</p>
        )}
        {log !== null && (
          <pre className="code-box log-box" tabIndex={0} aria-label={t("ComfyUI log")}>
            {log || t("The log is empty.")}
          </pre>
        )}
      </div>

      <div className="studio-card stack">
        <h3>{t("Chat models")}</h3>
        <p className="muted small">
          {t("A model in memory answers at once but uses RAM. This Mac has room for one or two at a time.")}
        </p>
        {!ollama?.models.length ? (
          <p className="muted small">
            {ollama?.reachable === false ? t("Ollama isn’t reachable.") : t("No models found.")}
          </p>
        ) : (
          <div className="studio-scroll">
            <table className="plain-table">
              <caption className="visually-hidden">{t("Chat models")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("Model")}</th>
                  <th scope="col">{t("Size")}</th>
                  <th scope="col">{t("Parameters")}</th>
                  <th scope="col">{t("In memory")}</th>
                  <th scope="col">
                    <span className="visually-hidden">{t("Actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ollama.models.map((m) => {
                  const inMem = ollama.runningModelNames.includes(m.name);
                  const l = loaded.get(m.name);
                  return (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td>{gb(m.size)}</td>
                      <td>
                        {m.details?.parameter_size ?? "—"}
                        {m.details?.quantization_level ? ` · ${m.details.quantization_level}` : ""}
                      </td>
                      <td>
                        {inMem ? (l?.size ? t("Yes, {size}", { size: gb(l.size) }) : t("Yes")) : t("No")}
                      </td>
                      <td>
                        {inMem ? (
                          <button
                            type="button"
                            className="small-btn"
                            disabled={busy !== null}
                            aria-label={t("Free the memory used by {name}", { name: m.name })}
                            onClick={() =>
                              void act(
                                m.name,
                                () => unloadModel(m.name),
                                t("{name} freed from memory.", { name: m.name }),
                              )
                            }
                          >
                            {t("Free memory")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="small-btn"
                            disabled={busy !== null}
                            aria-label={t("Load {name} into memory", { name: m.name })}
                            onClick={() =>
                              void act(
                                m.name,
                                () => loadModel(m.name),
                                t("{name} is in memory.", { name: m.name }),
                              )
                            }
                          >
                            {busy === m.name ? t("Loading…") : t("Load")}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="studio-card stack">
        <h3>
          {dot(sched?.running)} {t("Scheduler")}
        </h3>
        <p className="small">
          {sched
            ? t("{count} automations on a schedule. Next run: {when}.", {
                count: sched.enabledScheduleCount ?? 0,
                when: time(sched.nextDueAt),
              })
            : t("Unknown")}
        </p>
      </div>

      <div className="studio-card stack">
        <h3>{t("Recent activity")}</h3>
        {!activity.length ? (
          <p className="muted small">{t("Nothing yet.")}</p>
        ) : (
          <ol className="plain-list activity-list">
            {activity.map((x) => (
              <li key={x.id} className="small">
                <span
                  className={`dot ${x.status === "success" || x.status === "approved" ? "ok" : x.status === "failed" || x.status === "error" ? "error" : x.status === "running" ? "busy" : ""}`}
                  aria-hidden="true"
                />{" "}
                <span className="muted">{time(x.startedAt)}</span> · {x.label}
                {x.detail ? <span className="muted"> · {x.detail.slice(0, 140)}</span> : null}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
