// The side panel: artifacts, tasks and the project's own settings.
import { useEffect, useId, useState } from "react";
import { ChatMarkdown, CodeBlock, renderChatBlock, useT } from "@maataa/ui";
import type { Artifact, Project, ProjectFile, Task } from "./store";
import { RUNNABLE, sandboxFor, usePage } from "./rich";

const EXT: Record<string, string> = {
  html: "html",
  svg: "svg",
  markdown: "md",
  tsx: "tsx",
  ts: "ts",
  jsx: "jsx",
  js: "js",
  json: "json",
  python: "py",
  py: "py",
  css: "css",
  sh: "sh",
  csv: "csv",
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "") || "artifact";

function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ArtifactsPanel({
  artifacts,
  openId,
  onOpen,
  onDelete,
}: {
  artifacts: Artifact[];
  openId: string | null;
  onOpen: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const t = useT();
  const open = artifacts.find((a) => a.id === openId) ?? null;
  const [version, setVersion] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const versionId = useId();
  const current = open?.versions[Math.min(version, (open?.versions.length ?? 1) - 1)];
  const built = usePage(open?.type ?? "", current?.content ?? "", open?.title ?? "");
  useEffect(() => {
    setVersion(open ? open.versions.length - 1 : 0);
    setConfirming(false);
  }, [open?.id, open?.versions.length]);

  if (!artifacts.length)
    return (
      <p className="muted pad">
        {t(
          "Nothing here yet. Ask for a page, document or code to keep, e.g. “Make a one-page shoot plan as a document”, and it opens here.",
        )}
      </p>
    );

  if (!open)
    return (
      <ul className="plain-list pad">
        {artifacts.map((a) => (
          <li key={a.id}>
            <button type="button" className="row-button" onClick={() => onOpen(a.id)}>
              <span className="row-title">{a.title}</span>
              <span className="muted small">
                {a.type}
                {a.versions.length > 1 ? ` · ${t("{count} versions", { count: a.versions.length })}` : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );

  const v = open.versions[Math.min(version, open.versions.length - 1)]!;
  const ext = EXT[open.type] ?? "txt";
  const runnable = RUNNABLE.includes(open.type);
  const page = runnable ? built.page : null;
  return (
    <div className="artifact">
      <div className="artifact-bar">
        <button type="button" className="ghost" onClick={() => onOpen(null)}>
          ‹ {t("All artifacts")}
        </button>
        <h3 className="artifact-title">{open.title}</h3>
      </div>
      <div className="artifact-bar">
        {open.versions.length > 1 && (
          <span className="inline">
            <label htmlFor={versionId} className="small">
              {t("Version")}
            </label>
            <select id={versionId} value={version} onChange={(e) => setVersion(Number(e.target.value))}>
              {open.versions.map((_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
          </span>
        )}
        <button type="button" onClick={() => void navigator.clipboard?.writeText(v.content)}>
          {t("Copy")}
        </button>
        <button
          type="button"
          onClick={() =>
            download(
              `${slug(open.title)}.${open.type === "threejs" ? "html" : ext}`,
              open.type === "threejs" && page ? page : v.content,
              runnable ? "text/html" : "text/plain",
            )
          }
        >
          {t("Download")}
        </button>
        {confirming ? (
          <button type="button" className="danger" onClick={() => onDelete(open.id)}>
            {t("Yes, delete")}
          </button>
        ) : (
          <button type="button" onClick={() => setConfirming(true)}>
            {t("Delete")}
          </button>
        )}
      </div>
      <div className="artifact-body">
        {runnable && page === null ? (
          <p className="muted pad">{built.error ?? t("Loading the 3D engine…")}</p>
        ) : page !== null ? (
          <iframe
            title={open.title}
            srcDoc={page}
            sandbox={sandboxFor(open.type)}
            className={open.type === "threejs" ? "scene-frame" : undefined}
            referrerPolicy="no-referrer"
          />
        ) : open.type === "markdown" ? (
          <div className="pad">
            <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>{v.content}</ChatMarkdown>
          </div>
        ) : (
          <div className="pad">
            <CodeBlock code={v.content} lang={open.type} />
          </div>
        )}
      </div>
      {runnable && (
        <p className="muted small pad">
          {t("Pages run in a sealed frame: they can’t see this app, your files or your other chats.")}
        </p>
      )}
    </div>
  );
}

export function TasksPanel({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  novaNote,
}: {
  tasks: Task[];
  onAdd: (title: string) => void;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  novaNote: string;
}) {
  const t = useT();
  const inputId = useId();
  const [text, setText] = useState("");
  const open = tasks.filter((x) => !x.done);
  const done = tasks.filter((x) => x.done);
  const row = (task: Task) => (
    <li key={task.id} className="task">
      <input type="checkbox" id={`task-${task.id}`} checked={task.done} onChange={() => onToggle(task)} />
      <label htmlFor={`task-${task.id}`} className={task.done ? "done" : undefined}>
        {task.title}
        {task.novaId && <span className="muted small"> · {t("on Radheya board")}</span>}
      </label>
      <button
        type="button"
        className="ghost icon"
        aria-label={t("Delete task {title}", { title: task.title })}
        onClick={() => onDelete(task)}
      >
        ×
      </button>
    </li>
  );
  return (
    <div className="pad stack">
      <form
        className="inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) onAdd(text.trim());
          setText("");
        }}
      >
        <label htmlFor={inputId} className="visually-hidden">
          {t("New task")}
        </label>
        <input
          id={inputId}
          value={text}
          placeholder={t("New task")}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" disabled={!text.trim()}>
          {t("Add")}
        </button>
      </form>
      {!tasks.length && (
        <p className="muted">
          {t("No tasks yet. Add one here, type /task, or press “Add tasks” under a reply with a checklist.")}
        </p>
      )}
      {open.length > 0 && <ul className="plain-list">{open.map(row)}</ul>}
      {done.length > 0 && (
        <details>
          <summary>{t("Done ({count})", { count: done.length })}</summary>
          <ul className="plain-list">{done.map(row)}</ul>
        </details>
      )}
      {novaNote && <p className="muted small">{novaNote}</p>}
    </div>
  );
}

const TEXT_FILE = /\.(txt|md|markdown|csv|tsv|json|fountain|srt|vtt|html?)$/i;
const MAX_FILE = 2_000_000;

export function ProjectPanel({
  project,
  onChange,
  onDelete,
}: {
  project: Project;
  onChange: (p: Project) => void;
  onDelete: () => void;
}) {
  const t = useT();
  const ids = { name: useId(), instructions: useId(), files: useId() };
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const builtIn = project.id === "general" || project.id === "docs";

  const addFiles = async (list: FileList) => {
    const added: ProjectFile[] = [];
    const skipped: string[] = [];
    for (const f of Array.from(list)) {
      if (!TEXT_FILE.test(f.name) || f.size > MAX_FILE) {
        skipped.push(f.name);
        continue;
      }
      added.push({ name: f.name, text: await f.text() });
    }
    onChange({
      ...project,
      files: [...project.files.filter((x) => !added.some((a) => a.name === x.name)), ...added],
    });
    setNote(
      skipped.length
        ? t("Skipped {list}: only text files (txt, md, csv, json, fountain, srt) up to 2 MB.", {
            list: skipped.join(", "),
          })
        : t.plural(added.length, "{count} file added.", "{count} files added."),
    );
  };

  return (
    <div className="pad stack">
      <div className="field">
        <label htmlFor={ids.name}>{t("Project name")}</label>
        <input
          id={ids.name}
          value={project.name}
          disabled={builtIn}
          onChange={(e) => onChange({ ...project, name: e.target.value })}
        />
      </div>
      {project.kind === "docs" ? (
        <p className="muted">
          {t("This project answers from the MAATAA UI docs and lists the passages it used as sources.")}
        </p>
      ) : (
        <>
          <div className="field">
            <label htmlFor={ids.instructions}>{t("Instructions for every chat in this project")}</label>
            <textarea
              id={ids.instructions}
              rows={5}
              value={project.instructions}
              placeholder={t(
                "e.g. We are shooting “Dhoop”, a 20-minute short in Delhi. Keep answers practical.",
              )}
              onChange={(e) => onChange({ ...project, instructions: e.target.value })}
            />
          </div>
          <div className="field">
            <span id={ids.files} className="label">
              {t("Project files")}
            </span>
            <p className="muted small" style={{ margin: 0 }}>
              {t(
                "Scripts, notes and lists. For each question the closest passages are sent to the model, and shown as sources.",
              )}
            </p>
            {project.files.length > 0 && (
              <ul className="plain-list" aria-labelledby={ids.files}>
                {project.files.map((f) => (
                  <li key={f.name} className="task">
                    <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
                      {f.name}{" "}
                      <span className="muted small">
                        · {t("{count} characters", { count: f.text.length.toLocaleString() })}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="ghost icon"
                      aria-label={t("Remove file {name}", { name: f.name })}
                      onClick={() =>
                        onChange({ ...project, files: project.files.filter((x) => x.name !== f.name) })
                      }
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <label className="file-button">
              {t("Add files")}
              <input
                type="file"
                multiple
                accept=".txt,.md,.markdown,.csv,.tsv,.json,.fountain,.srt,.vtt,.html"
                onChange={(e) => {
                  if (e.target.files) void addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <p role="status" className="muted small" style={{ margin: 0 }}>
              {note}
            </p>
          </div>
        </>
      )}
      {!builtIn &&
        (confirming ? (
          <div className="inline">
            <span>{t("Delete this project with its chats, artifacts and tasks?")}</span>
            <button type="button" className="danger" onClick={onDelete}>
              {t("Yes, delete")}
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              {t("Cancel")}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} style={{ justifySelf: "start" }}>
            {t("Delete project")}
          </button>
        ))}
    </div>
  );
}
