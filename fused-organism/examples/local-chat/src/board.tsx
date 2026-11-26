// The Radheya board from Maataa Workstation: every card in its column, a
// timeline of when each card started and where it stands, and a card's
// details, notes and links.
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { GanttTimeline, PipelineBoard, useT, type GanttTask, type PipelineCard } from "@maataa/ui";
import {
  RADHEYA_COLUMNS,
  addCardLink,
  addCardNote,
  archiveTask,
  createCard,
  moveCard,
  radheyaView,
  updateCard,
  type RadheyaCard,
  type RadheyaColumn,
  type RadheyaView,
} from "./nova";
import { cancelCardRun, ollamaStatus, runCard } from "./ws-api";

const COLUMN_NAMES: Record<RadheyaColumn, string> = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  review: "Review",
  done: "Done",
  blocked: "Blocked",
};
const PROGRESS: Record<RadheyaColumn, number> = {
  backlog: 0,
  ready: 0.1,
  doing: 0.5,
  review: 0.8,
  done: 1,
  blocked: 0.5,
};

/** Workstation's rules come back in English; known ones are shown in the reader's language. */
function explain(e: unknown, t: ReturnType<typeof useT>): string {
  const text = e instanceof Error ? e.message : String(e);
  const wip = /^(\w+) already holds (\d+) card\(s\), its WIP limit/.exec(text);
  if (wip)
    return t("{column} already holds {count} cards, its limit. Finish or move one first.", {
      column: t(COLUMN_NAMES[wip[1] as RadheyaColumn] ?? wip[1]!),
      count: Number(wip[2]),
    });
  return t(text);
}

export function TaskBoard({ projectName }: { projectName: string }) {
  const t = useT();
  const ids = {
    h: useId(),
    title: useId(),
    body: useId(),
    column: useId(),
    mine: useId(),
    eTitle: useId(),
    eBody: useId(),
    eLabels: useId(),
    note: useId(),
    link: useId(),
  };
  const [view, setView] = useState<RadheyaView | null>(null);
  const [tab, setTab] = useState<"board" | "timeline">("board");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [onlyChat, setOnlyChat] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [column, setColumn] = useState<RadheyaColumn>("backlog");
  const [openId, setOpenId] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);
  useEffect(() => {
    void ollamaStatus().then(
      (s) => setModels(s.models.map((m) => m.name)),
      () => setModels([]),
    );
  }, []);

  const refresh = useCallback(async () => {
    try {
      setView(await radheyaView());
      setError(null);
    } catch (e) {
      setError(explain(e, t));
    }
  }, [t]);
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const cards = useMemo(
    () => (view?.cards ?? []).filter((c) => !onlyChat || c.labels.includes("maataa-chat")),
    [view, onlyChat],
  );
  const running = new Set((view?.running ?? []).map((r) => r.cardId));
  const open = view?.cards.find((c) => c.id === openId) ?? null;

  const act = async (work: () => Promise<unknown>, done?: string) => {
    setError(null);
    try {
      await work();
      if (done) setStatus(done);
      await refresh();
      return true;
    } catch (e) {
      setError(explain(e, t));
      return false;
    }
  };

  const stages = RADHEYA_COLUMNS.map((c) => ({ id: c, label: t(COLUMN_NAMES[c]) }));
  const boardCards: PipelineCard[] = cards.map((c) => ({
    id: c.id,
    title: c.title,
    stage: c.column,
    subtitle: [
      running.has(c.id) ? t("Running now") : "",
      c.assignee && c.assignee.kind !== "human"
        ? t("For: {who}", { who: c.assignee.model || c.assignee.kind })
        : "",
      c.labels.filter((l) => l !== "maataa-chat").join(", "),
    ]
      .filter(Boolean)
      .join(" · "),
  }));

  const today = new Date();
  const timeline: GanttTask[] = cards.map((c) => {
    const start = new Date(c.createdAt);
    const end = c.column === "done" ? new Date(c.updatedAt) : today;
    return {
      id: c.id,
      name: c.title,
      start,
      end: end > start ? end : new Date(start.getTime() + 86_400_000),
      progress: PROGRESS[c.column],
      phase: t(COLUMN_NAMES[c.column]),
      ...(c.column === "blocked" ? { conflict: t("Blocked") } : {}),
    };
  });

  return (
    <section className="studio" aria-labelledby={ids.h}>
      <div className="studio-head">
        <h2 id={ids.h}>{t("Radheya task board")}</h2>
        <div role="tablist" aria-label={t("Board view")} className="inline">
          {(["board", "timeline"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              className="tab"
              aria-selected={tab === v}
              onClick={() => setTab(v)}
            >
              {v === "board" ? t("Board") : t("Timeline")}
            </button>
          ))}
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

      <form
        className="studio-card inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          void act(
            () =>
              createCard({
                title: title.trim(),
                body: body.trim() || `From MAATAA local chat · ${projectName}`,
                column,
                labels: ["maataa-chat", projectName],
              }),
            t("Card added: {title}", { title: title.trim() }),
          ).then((ok) => {
            if (ok) {
              setTitle("");
              setBody("");
            }
          });
        }}
      >
        <div className="field" style={{ flex: "2 1 220px" }}>
          <label htmlFor={ids.title}>{t("New card")}</label>
          <input id={ids.title} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field" style={{ flex: "3 1 260px" }}>
          <label htmlFor={ids.body}>{t("Details (optional)")}</label>
          <input id={ids.body} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={ids.column}>{t("Column")}</label>
          <select id={ids.column} value={column} onChange={(e) => setColumn(e.target.value as RadheyaColumn)}>
            {RADHEYA_COLUMNS.filter((c) => c !== "done").map((c) => (
              <option key={c} value={c}>
                {t(COLUMN_NAMES[c])}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="primary" disabled={!title.trim()} style={{ alignSelf: "end" }}>
          {t("Add")}
        </button>
      </form>

      <label className="inline small" htmlFor={ids.mine}>
        <input
          id={ids.mine}
          type="checkbox"
          checked={onlyChat}
          onChange={(e) => setOnlyChat(e.target.checked)}
        />
        {t("Only cards from this chat app")}
      </label>

      {view === null ? (
        <p className="muted">{t("Loading…")}</p>
      ) : tab === "board" ? (
        <>
          <p className="muted small">
            {t(
              "A card reaches Done from Review, and only with a link or other evidence attached. Open a card to add one.",
            )}
          </p>
          <PipelineBoard
            label={t("Cards by column")}
            stages={stages}
            cards={boardCards}
            onMove={(id, to) => void act(() => moveCard(id, to))}
            onOpen={(c) => setOpenId(c.id)}
          />
        </>
      ) : timeline.length ? (
        <GanttTimeline
          tasks={timeline}
          caption={t("When each card started, and where it stands")}
          today={today}
        />
      ) : (
        <p className="muted">{t("No cards yet.")}</p>
      )}

      {open && (
        <CardDetail
          key={open.id}
          card={open}
          running={running.has(open.id)}
          models={models}
          ids={ids}
          onClose={() => setOpenId(null)}
          act={act}
        />
      )}
    </section>
  );
}

function CardDetail({
  card,
  running,
  models,
  ids,
  onClose,
  act,
}: {
  card: RadheyaCard;
  running: boolean;
  models: string[];
  ids: Record<"eTitle" | "eBody" | "eLabels" | "note" | "link", string>;
  onClose: () => void;
  act: (work: () => Promise<unknown>, done?: string) => Promise<boolean>;
}) {
  const t = useT();
  const [title, setTitle] = useState(card.title);
  const [body, setBody] = useState(card.body);
  const [labels, setLabels] = useState(card.labels.join(", "));
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const runIds = { kind: useId(), model: useId(), url: useId(), query: useId() };
  const [runKind, setRunKind] = useState<"local" | "browser">(
    card.assignee?.kind === "browser" ? "browser" : "local",
  );
  const [runModel, setRunModel] = useState(card.assignee?.model ?? "");
  const [runUrl, setRunUrl] = useState("");
  const [runQuery, setRunQuery] = useState("");
  const canRun = !["done", "blocked", "backlog"].includes(card.column);
  const headRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headRef.current?.scrollIntoView({ block: "start" });
    headRef.current?.focus();
  }, []);
  const changed = title !== card.title || body !== card.body || labels !== card.labels.join(", ");

  return (
    <div className="studio-card stack" role="region" aria-label={t("Card: {title}", { title: card.title })}>
      <div className="studio-head">
        <h3 ref={headRef} tabIndex={-1}>
          {card.title}
        </h3>
        <span className="muted small">
          {t(COLUMN_NAMES[card.column])}
          {running ? ` · ${t("Running now")}` : ""}
        </span>
        <button type="button" className="ghost" onClick={onClose}>
          {t("Close")}
        </button>
      </div>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          void act(
            () =>
              updateCard(card.id, {
                title: title.trim(),
                body,
                labels: labels
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }),
            t("Saved."),
          );
        }}
      >
        <div className="field">
          <label htmlFor={ids.eTitle}>{t("Title")}</label>
          <input id={ids.eTitle} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={ids.eBody}>{t("Details")}</label>
          <textarea id={ids.eBody} rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={ids.eLabels}>{t("Labels, separated by commas")}</label>
          <input id={ids.eLabels} value={labels} onChange={(e) => setLabels(e.target.value)} />
        </div>
        <div>
          <button type="submit" className="primary" disabled={!changed || !title.trim()}>
            {t("Save")}
          </button>
        </div>
      </form>

      <h4>{t("Let Radheya work on it")}</h4>
      {running ? (
        <div className="inline">
          <span>{t("A run is working on this card. Its answer will appear in the notes.")}</span>
          <button
            type="button"
            className="danger"
            onClick={() => void act(() => cancelCardRun(card.id), t("Run stopped."))}
          >
            {t("Stop the run")}
          </button>
        </div>
      ) : !canRun ? (
        <p className="muted small">{t("Move the card to Ready or Doing to run it.")}</p>
      ) : (
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            void act(
              () =>
                runCard(card.id, {
                  kind: runKind,
                  ...(runKind === "local" && runModel ? { model: runModel } : {}),
                  ...(runKind === "browser" && runUrl.trim() ? { url: runUrl.trim() } : {}),
                  ...(runKind === "browser" && runQuery.trim() ? { query: runQuery.trim() } : {}),
                }),
              t("Run started."),
            );
          }}
        >
          <div className="inline">
            <div className="field">
              <label htmlFor={runIds.kind}>{t("Who works on it")}</label>
              <select
                id={runIds.kind}
                value={runKind}
                onChange={(e) => setRunKind(e.target.value as "local" | "browser")}
              >
                <option value="local">{t("A model on this computer")}</option>
                <option value="browser">{t("The browser (reads a web page)")}</option>
              </select>
            </div>
            {runKind === "local" ? (
              <div className="field">
                <label htmlFor={runIds.model}>{t("Model")}</label>
                <select id={runIds.model} value={runModel} onChange={(e) => setRunModel(e.target.value)}>
                  <option value="">{t("Workstation’s choice")}</option>
                  {models.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="field">
                  <label htmlFor={runIds.url}>{t("Page to open (optional)")}</label>
                  <input
                    id={runIds.url}
                    type="url"
                    value={runUrl}
                    onChange={(e) => setRunUrl(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor={runIds.query}>{t("Or search for")}</label>
                  <input id={runIds.query} value={runQuery} onChange={(e) => setRunQuery(e.target.value)} />
                </div>
              </>
            )}
          </div>
          <div>
            <button type="submit">{t("Start a run")}</button>
          </div>
        </form>
      )}

      <h4>{t("Notes")}</h4>
      {card.notes?.length ? (
        <ul className="plain-list note-list">
          {card.notes.map((n, i) => (
            <li key={n.id ?? i}>
              <span className="muted small">{n.by && n.by !== "human" ? `${n.by} · ` : ""}</span>
              {n.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">{t("No notes yet.")}</p>
      )}
      <form
        className="inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (note.trim()) void act(() => addCardNote(card.id, note.trim())).then((ok) => ok && setNote(""));
        }}
      >
        <label htmlFor={ids.note} className="visually-hidden">
          {t("New note")}
        </label>
        <input
          id={ids.note}
          value={note}
          placeholder={t("New note")}
          onChange={(e) => setNote(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" disabled={!note.trim()}>
          {t("Add")}
        </button>
      </form>

      <h4>{t("Evidence")}</h4>
      {card.evidence?.length ? (
        <ul className="plain-list note-list">
          {card.evidence.map((ev, i) => (
            <li key={ev.id ?? i}>
              {ev.url ? (
                <a href={ev.url} target="_blank" rel="noreferrer">
                  {ev.label || ev.url}
                </a>
              ) : (
                ev.label || ev.kind
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">{t("No evidence yet.")}</p>
      )}
      <form
        className="inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (link.trim()) void act(() => addCardLink(card.id, link.trim())).then((ok) => ok && setLink(""));
        }}
      >
        <label htmlFor={ids.link} className="visually-hidden">
          {t("Link to the finished work")}
        </label>
        <input
          id={ids.link}
          type="url"
          value={link}
          placeholder={t("Link to the finished work")}
          onChange={(e) => setLink(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" disabled={!link.trim()}>
          {t("Add link")}
        </button>
      </form>

      <div className="inline">
        {card.column === "review" && (
          <button
            type="button"
            className="primary"
            onClick={() => void act(() => moveCard(card.id, "done"), t("Moved to Done."))}
          >
            {t("Mark done")}
          </button>
        )}
        {confirmArchive ? (
          <>
            <button
              type="button"
              className="danger"
              onClick={() =>
                void act(() => archiveTask(card.id), t("Card archived.")).then((ok) => ok && onClose())
              }
            >
              {t("Yes, archive it")}
            </button>
            <button type="button" onClick={() => setConfirmArchive(false)}>
              {t("Keep it")}
            </button>
          </>
        ) : (
          <button type="button" className="danger" onClick={() => setConfirmArchive(true)}>
            {t("Archive")}
          </button>
        )}
      </div>
    </div>
  );
}
