// Coding studio: ask a local model for a change to one of your approved
// project folders, review what it proposes, and only then check, approve and
// apply it. Every step that writes to disk is a separate, explicit click.
import { useCallback, useEffect, useId, useState } from "react";
import { useT } from "@maataa/ui";
import {
  addRoot,
  batchAction,
  cancelCodingTask,
  codingDetail,
  codingTeam,
  createCodingTask,
  listBatches,
  listRoots,
  isCloudModel,
  ollamaStatus,
  retryCodingTask,
  reviewCodingTask,
  type ChangeBatch,
  type CodingDetail,
  type CodingTeam,
  type ProposedChange,
  type WorkspaceRoot,
} from "./ws-api";

type T = ReturnType<typeof useT>;
const STATE_NAMES: Record<string, string> = {
  queued: "Waiting to start",
  assigned: "Waiting to start",
  running: "The model is working",
  awaiting_result_review: "Ready for your review",
  revision_requested: "You asked for changes",
  completed: "Finished",
  accepted: "Accepted",
  rejected: "Rejected",
  failed: "Failed",
  cancelled: "Cancelled",
};
const BATCH_NAMES: Record<string, string> = {
  draft: "Not checked yet",
  "checks-passed": "Checks passed",
  "checks-failed": "Checks failed",
  approved: "Approved, not applied",
  applied: "Applied to the folder",
  "rolled-back": "Undone",
  failed: "Failed",
};
const OP_NAMES: Record<ProposedChange["operation"], string> = {
  create: "New file",
  overwrite: "Replace file",
  edit: "Edit",
  delete: "Delete file",
  rename: "Rename",
};
const BUSY_STATES = ["queued", "assigned", "running"];
const msg = (e: unknown, t: T) => t(e instanceof Error ? e.message : String(e));
const folderName = (r: WorkspaceRoot) =>
  r.label || r.name || r.path.split("/").filter(Boolean).pop() || r.path;

export function CodingStudio() {
  const t = useT();
  const ids = { h: useId(), root: useId(), model: useId(), req: useId(), path: useId() };
  const [team, setTeam] = useState<CodingTeam | null>(null);
  const [roots, setRoots] = useState<WorkspaceRoot[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [rootId, setRootId] = useState("");
  const [model, setModel] = useState("");
  const [request, setRequest] = useState("");
  const [newPath, setNewPath] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [tm, r] = await Promise.all([codingTeam(), listRoots()]);
      setTeam(tm);
      setRoots(r);
      setRootId((x) => x || r[0]?.id || "");
      setError(null);
    } catch (e) {
      setError(msg(e, t));
      setTeam((x) => x ?? { tasks: [], controls: {} });
    }
  }, [t]);
  useEffect(() => {
    void refresh();
    void ollamaStatus().then(
      (s) => {
        const names = s.models.map((m) => m.name);
        setModels(names);
        // Coding runs on this computer: prefer a coding model, then qwen2.5:7b (it passed
        // Workstation's 18 coding checks on this Mac), then any model that isn't a cloud one.
        const local = names.filter((n) => !isCloudModel(n));
        setModel(
          (m) =>
            m ||
            local.find((n) => /coder|code/i.test(n)) ||
            local.find((n) => n === "qwen2.5:7b") ||
            local[0] ||
            "",
        );
      },
      () => setModels([]),
    );
  }, [refresh]);
  const working = team?.tasks.some((x) => BUSY_STATES.includes(x.state)) ?? false;
  useEffect(() => {
    if (!working) return;
    const timer = window.setInterval(() => void refresh(), 4000);
    return () => window.clearInterval(timer);
  }, [working, refresh]);

  const when = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(document.documentElement.lang || "en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";
  const halted = team?.controls.runtime_halted;
  const unavailable = team && team.controls.execution_available === false;

  return (
    <section className="studio" aria-labelledby={ids.h}>
      <div className="studio-head">
        <h2 id={ids.h}>{t("Coding studio")}</h2>
        <button type="button" onClick={() => void refresh()}>
          {t("Refresh")}
        </button>
      </div>
      <p className="muted small">
        {t(
          "A model on this computer proposes a change to one of your project folders. Nothing is written until you check, approve and apply it.",
        )}
      </p>
      <p aria-live="polite" className="muted small studio-status">
        {status}
      </p>
      {error && (
        <p role="alert" className="tone-error">
          {error}
        </p>
      )}
      {unavailable && (
        <p className="tone-warn small">
          {halted
            ? t("Workstation is halted, so new coding tasks won’t run. Resume it in Workstation first.")
            : t("Workstation’s coding runner isn’t running, so new tasks will wait.")}
        </p>
      )}

      <div className="studio-split preprod">
        <div className="stack">
          <form
            className="studio-card stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (!rootId || !model || !request.trim()) return;
              setBusy(true);
              setError(null);
              void createCodingTask(rootId, model, request.trim())
                .then(
                  async (task) => {
                    setRequest("");
                    setStatus(t("Task started. The proposal appears here when it is ready."));
                    await refresh();
                    setOpen(task.id);
                  },
                  (e) => setError(msg(e, t)),
                )
                .finally(() => setBusy(false));
            }}
          >
            <h3>{t("New coding task")}</h3>
            <div className="field">
              <label htmlFor={ids.root}>{t("Project folder")}</label>
              <select id={ids.root} value={rootId} onChange={(e) => setRootId(e.target.value)}>
                {!roots.length && <option value="">{t("No folders yet")}</option>}
                {roots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {folderName(r)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={ids.model}>{t("Model")}</label>
              <select id={ids.model} value={model} onChange={(e) => setModel(e.target.value)}>
                {!models.length && <option value="">{t("No models found")}</option>}
                {models.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={ids.req}>{t("What should change?")}</label>
              <textarea id={ids.req} rows={4} value={request} onChange={(e) => setRequest(e.target.value)} />
            </div>
            <div>
              <button
                type="submit"
                className="primary"
                disabled={busy || !rootId || !model || !request.trim()}
              >
                {busy ? t("Starting…") : t("Ask for a proposal")}
              </button>
            </div>
          </form>

          <details className="studio-card">
            <summary className="mc-t">{t("Add a project folder")}</summary>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPath.trim()) return;
                void addRoot(newPath.trim()).then(
                  async (r) => {
                    setNewPath("");
                    setStatus(t("Folder added: {name}", { name: folderName(r) }));
                    await refresh();
                    setRootId(r.id);
                  },
                  (e) => setError(msg(e, t)),
                );
              }}
            >
              <p className="muted small">
                {t("Workstation may read this folder. It writes only after you approve and apply a change.")}
              </p>
              <div className="field">
                <label htmlFor={ids.path}>{t("Full path on this Mac")}</label>
                <input
                  id={ids.path}
                  value={newPath}
                  placeholder="/Users/…/my-project"
                  onChange={(e) => setNewPath(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" disabled={!newPath.trim()}>
                  {t("Add folder")}
                </button>
              </div>
            </form>
          </details>

          <nav className="studio-card stack" aria-label={t("Coding tasks")}>
            <h3 className="side-h">{t("Coding tasks")}</h3>
            {team === null ? (
              <p className="muted small">{t("Loading…")}</p>
            ) : !team.tasks.length ? (
              <p className="muted small">{t("No coding tasks yet.")}</p>
            ) : (
              <ul className="plain-list">
                {team.tasks.map((x) => {
                  const root = roots.find((r) => r.id === x.rootId);
                  return (
                    <li key={x.id}>
                      <button
                        type="button"
                        className="row-button"
                        aria-current={x.id === open ? "true" : undefined}
                        onClick={() => setOpen(x.id)}
                      >
                        <span className="row-title">
                          {BUSY_STATES.includes(x.state) && <span className="dot busy" aria-hidden="true" />}{" "}
                          {t(STATE_NAMES[x.state] ?? x.state)}
                        </span>
                        <span className="muted small">
                          {root ? folderName(root) : ""} · {x.modelId} · {when(x.created_at)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </div>

        <div className="studio-card stack" style={{ minWidth: 0 }}>
          {open ? (
            <TaskDetail key={open} id={open} roots={roots} onChanged={refresh} setStatus={setStatus} />
          ) : (
            <p className="muted">{t("Choose a coding task, or ask for a new proposal.")}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function TaskDetail({
  id,
  roots,
  onChanged,
  setStatus,
}: {
  id: string;
  roots: WorkspaceRoot[];
  onChanged: () => Promise<void>;
  setStatus: (s: string) => void;
}) {
  const t = useT();
  const ids = { reason: useId(), feedback: useId() };
  const [detail, setDetail] = useState<CodingDetail | null>(null);
  const [batch, setBatch] = useState<ChangeBatch | null>(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<"execute" | "rollback" | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await codingDetail(id);
      setDetail(d);
      const bid = d.task.batchId ?? d.task.result?.batchId;
      setBatch(bid ? ((await listBatches()).find((b) => b.id === bid) ?? null) : null);
    } catch (e) {
      setError(msg(e, t));
    }
  }, [id, t]);
  useEffect(() => {
    void load();
  }, [load]);
  const busyState = detail ? BUSY_STATES.includes(detail.task.state) : false;
  useEffect(() => {
    if (!busyState) return;
    const timer = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(timer);
  }, [busyState, load]);

  const act = async (work: () => Promise<unknown>, done: string) => {
    setBusy(true);
    setError(null);
    try {
      await work();
      setStatus(done);
      setReason("");
      setFeedback("");
      setConfirm(null);
      await load();
      await onChanged();
    } catch (e) {
      setError(msg(e, t));
    } finally {
      setBusy(false);
    }
  };

  if (!detail)
    return error ? (
      <p role="alert" className="tone-error">
        {error}
      </p>
    ) : (
      <p className="muted">{t("Loading…")}</p>
    );
  const task = detail.task;
  const proposal = task.result?.proposal;
  const root = roots.find((r) => r.id === task.rootId);
  const preview = task.batchPreview;

  return (
    <>
      <div className="studio-head">
        <h3>{t(STATE_NAMES[task.state] ?? task.state)}</h3>
        <span className="muted small">
          {root ? folderName(root) : ""} · {task.modelId}
        </span>
      </div>
      {error && (
        <p role="alert" className="tone-error">
          {error}
        </p>
      )}
      {task.error && <p className="tone-error small">{t(task.error)}</p>}
      {busyState && (
        <p className="muted">{t("The model is still working. This page checks again every few seconds.")}</p>
      )}

      {proposal && (
        <div className="stack">
          <h4>{t("What it proposes")}</h4>
          <p>{proposal.summary}</p>
          <ul className="plain-list change-list">
            {proposal.changes.map((c, i) => (
              <li key={i}>
                <details>
                  <summary className="mc-t">
                    <strong>{t(OP_NAMES[c.operation] ?? c.operation)}</strong> <code>{c.relativePath}</code>
                    {c.toPath ? (
                      <>
                        {" → "}
                        <code>{c.toPath}</code>
                      </>
                    ) : null}
                  </summary>
                  {c.operation === "edit" ? (
                    <div className="stack">
                      <pre className="code-box diff-del" aria-label={t("Text it replaces")}>
                        {c.find}
                      </pre>
                      <pre className="code-box diff-add" aria-label={t("New text")}>
                        {c.replacement}
                      </pre>
                    </div>
                  ) : c.content !== undefined ? (
                    <pre className="code-box">{c.content}</pre>
                  ) : null}
                </details>
              </li>
            ))}
          </ul>
          {!!proposal.acceptanceChecks?.length && (
            <>
              <h4>{t("How to tell it worked")}</h4>
              <ul className="small">
                {proposal.acceptanceChecks.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {detail.controls.human_result_review_available && (
        <div className="stack">
          <h4>{t("Your review")}</h4>
          <div className="field">
            <label htmlFor={ids.reason}>
              {t("What should change, or why not (needed to ask for changes or reject)")}
            </label>
            <textarea id={ids.reason} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="inline">
            <button
              type="button"
              className="primary"
              disabled={busy}
              onClick={() =>
                void act(
                  () => reviewCodingTask(task.id, "accept", reason.trim() || undefined),
                  t("Accepted. The changes are ready to check."),
                )
              }
            >
              {t("Accept")}
            </button>
            <button
              type="button"
              disabled={busy || !reason.trim()}
              onClick={() =>
                void act(() => reviewCodingTask(task.id, "revise", reason.trim()), t("Asked for changes."))
              }
            >
              {t("Ask for changes")}
            </button>
            <button
              type="button"
              className="danger"
              disabled={busy || !reason.trim()}
              onClick={() =>
                void act(() => reviewCodingTask(task.id, "reject", reason.trim()), t("Rejected."))
              }
            >
              {t("Reject")}
            </button>
          </div>
        </div>
      )}

      {detail.controls.retry_available && (
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            if (feedback.trim())
              void act(() => retryCodingTask(task.id, feedback.trim()), t("Trying again."));
          }}
        >
          <div className="field">
            <label htmlFor={ids.feedback}>{t("Try again with these instructions")}</label>
            <textarea
              id={ids.feedback}
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" disabled={busy || !feedback.trim()}>
              {t("Try again")}
            </button>
          </div>
        </form>
      )}

      {detail.controls.cancel_available && (
        <div>
          <button
            type="button"
            className="danger"
            disabled={busy}
            onClick={() => void act(() => cancelCodingTask(task.id), t("Cancelled."))}
          >
            {t("Cancel the task")}
          </button>
        </div>
      )}

      {(batch || preview) && (
        <div className="stack">
          <h4>{t("Changes to the folder")}</h4>
          <p>
            <strong>
              {t(
                BATCH_NAMES[batch?.status ?? preview?.status ?? ""] ?? batch?.status ?? preview?.status ?? "",
              )}
            </strong>
          </p>
          {preview?.changes.some((c) => c.diff) && (
            <details>
              <summary className="mc-t">{t("See the exact differences")}</summary>
              {preview.changes.map((c, i) => (
                <div key={i} className="stack">
                  <code className="small">{c.relativePath}</code>
                  {c.diff && <pre className="code-box">{c.diff}</pre>}
                </div>
              ))}
            </details>
          )}
          {!!batch?.checks?.length && (
            <ul className="small">
              {batch.checks.map((c, i) => (
                <li key={i} className={c.status === "failed" ? "tone-error" : undefined}>
                  {c.status === "failed" ? "✗ " : c.status === "passed" ? "✓ " : "· "}
                  {c.label ?? c.name}
                  {c.detail ? `: ${c.detail}` : ""}
                </li>
              ))}
            </ul>
          )}
          {batch && (
            <div className="inline">
              {(batch.status === "draft" || batch.status === "checks-failed") && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void act(() => batchAction(batch.id, "check"), t("Checked."))}
                >
                  {t("Check the changes")}
                </button>
              )}
              {batch.status === "checks-passed" && (
                <button
                  type="button"
                  className="primary"
                  disabled={busy}
                  onClick={() =>
                    void act(
                      () => batchAction(batch.id, "approve"),
                      t("Approved. Apply it when you are ready."),
                    )
                  }
                >
                  {t("Approve")}
                </button>
              )}
              {batch.status === "approved" &&
                (confirm === "execute" ? (
                  <>
                    <span>{t("This writes to {folder}.", { folder: root ? root.path : "" })}</span>
                    <button
                      type="button"
                      className="primary"
                      disabled={busy}
                      onClick={() =>
                        void act(() => batchAction(batch.id, "execute"), t("Applied to the folder."))
                      }
                    >
                      {t("Yes, apply it")}
                    </button>
                    <button type="button" onClick={() => setConfirm(null)}>
                      {t("Not now")}
                    </button>
                  </>
                ) : (
                  <button type="button" className="primary" onClick={() => setConfirm("execute")}>
                    {t("Apply to the folder")}
                  </button>
                ))}
              {batch.status === "applied" &&
                batch.rollback?.available &&
                (confirm === "rollback" ? (
                  <>
                    <button
                      type="button"
                      className="danger"
                      disabled={busy}
                      onClick={() => void act(() => batchAction(batch.id, "rollback"), t("Undone."))}
                    >
                      {t("Yes, undo it")}
                    </button>
                    <button type="button" onClick={() => setConfirm(null)}>
                      {t("Not now")}
                    </button>
                  </>
                ) : (
                  <button type="button" className="danger" onClick={() => setConfirm("rollback")}>
                    {t("Undo these changes")}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {!!detail.events.length && (
        <details>
          <summary className="mc-t">{t("History")}</summary>
          <ol className="small">
            {detail.events.map((e) => (
              <li key={e.id}>
                {new Date(e.timestamp).toLocaleString(document.documentElement.lang || "en-IN")} · {e.kind}
                {e.reason ? ` · ${e.reason}` : ""}
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}
