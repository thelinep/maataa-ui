// Reply blocks that need more than the library draws by itself: Mermaid
// diagrams, LaTeX maths (KaTeX), live HTML previews, and pictures, sound and
// video made through Maataa Workstation. Mermaid and KaTeX load only when a
// reply first needs them.
import { useEffect, useId, useRef, useState } from "react";
import { CodeBlock, useT, type FencedBlock } from "@maataa/ui";
import { cancelJob, getJob, mediaUrl, startMedia, type MediaKind } from "./nova";
import { hashText, now, put, type MediaRecord } from "./store";

// ---- maths ----------------------------------------------------------------

type Katex = typeof import("katex").default;
let katexPromise: Promise<Katex> | null = null;
const loadKatex = () =>
  (katexPromise ??= Promise.all([import("katex"), import("katex/dist/katex.min.css")]).then(
    ([m]) => m.default,
  ));

/** LaTeX drawn with KaTeX. Shows the LaTeX itself until KaTeX has loaded. */
export function TeX({ tex, display }: { tex: string; display: boolean }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void loadKatex().then((katex) => {
      if (!live) return;
      // trust:false keeps \href, \includegraphics and friends switched off.
      setHtml(
        katex.renderToString(tex, {
          displayMode: display,
          throwOnError: false,
          trust: false,
          strict: "ignore",
          output: "htmlAndMathml",
        }),
      );
    });
    return () => {
      live = false;
    };
  }, [tex, display]);
  if (html === null) return <code>{tex}</code>;
  const Tag = display ? "div" : "span";
  return <Tag className={display ? "tex-block" : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const renderMath = (tex: string, display: boolean) => <TeX tex={tex} display={display} />;

// ---- diagrams -------------------------------------------------------------

type Mermaid = typeof import("mermaid").default;
let mermaidPromise: Promise<Mermaid> | null = null;
let mermaidTheme = "";
const loadMermaid = (dark: boolean) =>
  (mermaidPromise ??= import("mermaid").then((m) => m.default)).then((mermaid) => {
    const theme = dark ? "dark" : "neutral";
    if (theme !== mermaidTheme) {
      // strict: no scripts or click handlers in diagrams; labels are sanitised.
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme });
      mermaidTheme = theme;
    }
    return mermaid;
  });

const isDark = () => document.documentElement.getAttribute("data-maataa-theme") === "dark";

/**
 * A Mermaid diagram. The drawn SVG is shown in a frame with no scripts, so
 * even a strange diagram can't touch the app.
 */
export function MermaidDiagram({ code, closed }: { code: string; closed: boolean }) {
  const t = useT();
  const id = `mmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<{ markup: string; w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!closed) return;
    let live = true;
    void loadMermaid(isDark())
      .then((mermaid) => mermaid.render(id, code))
      .then(({ svg: markup }) => {
        if (!live) return;
        const box = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/.exec(markup);
        setSvg({ markup, w: box ? Number(box[1]) : 600, h: box ? Number(box[2]) : 300 });
        setError(null);
      })
      .catch((e: Error) => live && setError(e.message || String(e)))
      .finally(() => document.getElementById(`d${id}`)?.remove());
    return () => {
      live = false;
    };
  }, [code, closed, id]);

  if (!closed) return <p className="block-note">{t("Drawing the diagram…")}</p>;
  if (error)
    return (
      <div className="stack">
        <p className="block-note">
          {t("The diagram couldn’t be drawn: {message}", { message: error.split("\n")[0]! })}
        </p>
        <CodeBlock code={code} lang="mermaid" />
      </div>
    );
  if (!svg) return <p className="block-note">{t("Drawing the diagram…")}</p>;
  const height = Math.min(640, Math.max(80, Math.round(svg.h * Math.min(1, 640 / svg.w)) + 8));
  const page = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:${isDark() ? "#111" : "#fff"}}svg{display:block;max-width:100%;height:auto;margin:0 auto}</style></head><body>${svg.markup}</body></html>`;
  return (
    <figure className="diagram">
      <iframe title={t("Diagram")} sandbox="" srcDoc={page} style={{ height }} />
      <details>
        <summary>{t("Diagram code")}</summary>
        <CodeBlock code={code} lang="mermaid" />
      </details>
    </figure>
  );
}

// ---- live HTML ------------------------------------------------------------

/**
 * A page or picture from a reply, running live in a sealed frame, with a
 * button to open it in the artifact panel.
 */
export function LivePreview({
  block,
  title,
  onOpen,
}: {
  block: FencedBlock;
  title: string;
  onOpen?: () => void;
}) {
  const t = useT();
  if (!block.closed)
    return (
      <div className="artifact-card">
        <span className="artifact-icon" aria-hidden="true">
          ◧
        </span>
        <span className="artifact-card-text">
          <strong>{title}</strong>
          <span className="muted small">{t("Writing…")}</span>
        </span>
      </div>
    );
  const page =
    block.lang === "svg"
      ? `<!doctype html><html><body style="margin:0;display:grid;place-items:center;min-height:100vh">${block.code}</body></html>`
      : block.code;
  return (
    <figure className="live">
      <div className="live-bar">
        <span className="artifact-icon" aria-hidden="true">
          ◧
        </span>
        <strong className="live-title">{title}</strong>
        <span className="muted small">{block.lang === "svg" ? "svg" : t("live page")}</span>
        {onOpen && (
          <button type="button" onClick={onOpen}>
            {t("Open")}
          </button>
        )}
      </div>
      <iframe
        title={title}
        srcDoc={page}
        sandbox={block.lang === "html" ? "allow-scripts allow-modals" : ""}
        referrerPolicy="no-referrer"
      />
    </figure>
  );
}

// ---- pictures, sound and video -------------------------------------------

const MEDIA_KINDS: MediaKind[] = ["image", "audio", "video"];
export const isMediaBlock = (lang: string): lang is MediaKind => (MEDIA_KINDS as string[]).includes(lang);

function readJson(code: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(code) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * A picture, sound or video the model asked for. Made by Maataa Workstation
 * when the person presses Make (or straight away, if they chose that). The
 * result is remembered, so it shows again when the chat is reopened.
 */
export function MediaBlock({
  block,
  nova,
  saved,
  autoStart,
  onSaved,
}: {
  block: FencedBlock & { lang: MediaKind };
  nova: "unknown" | "on" | "off";
  saved: MediaRecord | undefined;
  autoStart: boolean;
  onSaved: (record: MediaRecord) => void;
}) {
  const t = useT();
  const kind = block.lang;
  const data = block.closed ? readJson(block.code) : null;
  const key = hashText(`${kind}:${block.code}`);
  const [record, setRecord] = useState<MediaRecord | undefined>(saved);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const names: Record<MediaKind, string> = {
    image: t("picture"),
    audio: data?.kind === "voice" ? t("voice") : data?.kind === "sfx" ? t("sound effect") : t("music"),
    video: t("video"),
  };
  const name = names[kind];
  const describe = String(data?.prompt ?? data?.text ?? "");

  const save = (r: MediaRecord) => {
    if (r.status !== "running") started.current = false;
    setRecord(r);
    onSaved(r);
    void put("media", r);
  };

  const start = async () => {
    if (!data || started.current) return;
    started.current = true;
    setError(null);
    try {
      const job = await startMedia(kind, data);
      save({ id: key, jobId: job.id, status: "running", mediaIds: [], updatedAt: now() });
    } catch (e) {
      started.current = false;
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    if (autoStart && nova === "on" && data && !record && !started.current) void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, nova, !!data, !!record]);

  // Follow a running job until it finishes.
  useEffect(() => {
    if (!record || record.status !== "running" || nova !== "on") return;
    let live = true;
    const tick = async () => {
      try {
        const job = await getJob(record.jobId);
        if (!live) return;
        setProgress(job.progress ?? null);
        if (job.status !== "running")
          save({
            ...record,
            status: job.status,
            mediaIds: job.mediaIds ?? [],
            error: job.error ?? undefined,
            updatedAt: now(),
          });
      } catch (e) {
        if (live) setProgress((e as Error).message);
      }
    };
    void tick();
    const timer = window.setInterval(() => void tick(), 2000);
    return () => {
      live = false;
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.jobId, record?.status, nova]);

  if (!block.closed) return <p className="block-note">{t("Preparing the {name}…", { name })}</p>;
  if (!data || !describe.trim())
    return <p className="block-note">{t("The model sent a {name} that couldn’t be read.", { name })}</p>;

  const head = (
    <p className="media-prompt">
      <span aria-hidden="true">{kind === "image" ? "🖼" : kind === "audio" ? "🎵" : "🎬"} </span>
      <strong>{name}</strong> · {describe}
    </p>
  );

  if (record?.status === "done" && record.mediaIds.length)
    return (
      <figure className="media">
        {head}
        {record.mediaIds.map((id) => (
          <div key={id} className="media-item">
            {kind === "image" ? (
              <img src={mediaUrl(id)} alt={describe} />
            ) : kind === "audio" ? (
              <audio controls src={mediaUrl(id)} aria-label={describe} />
            ) : (
              <video controls src={mediaUrl(id)} aria-label={describe} />
            )}
            <a href={mediaUrl(id)} download className="small">
              {t("Download")}
            </a>
          </div>
        ))}
      </figure>
    );

  return (
    <div className="media">
      {head}
      {record?.status === "running" ? (
        <div className="inline">
          <span role="status" className="small">
            {progress || t("Making the {name}…", { name })}
          </span>
          <button type="button" onClick={() => void cancelJob(record.jobId).catch(() => undefined)}>
            {t("Cancel")}
          </button>
        </div>
      ) : nova !== "on" ? (
        <p className="block-note">
          {t(
            "Maataa Workstation makes pictures, sound and video. Start it (port 8787), then come back here.",
          )}
        </p>
      ) : (
        <div className="inline">
          <button type="button" className="primary" onClick={() => void start()}>
            {t("Make the {name}", { name })}
          </button>
          {(record?.status === "failed" || record?.status === "cancelled" || error) && (
            <span role="status" className="small tone-error">
              {error ?? record?.error ?? t("Cancelled.")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
