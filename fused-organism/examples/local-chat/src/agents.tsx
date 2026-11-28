// Agents and automations: Workstation's agents, workflows and scheduled
// automations, and every request still waiting for a person's yes or no.
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { ChatMarkdown, renderChatBlock, useT } from "@maataa/ui";
import {
  approveAgent,
  approveWorkflow,
  configureAutomation,
  createAutomation,
  decideComputer,
  decideMcp,
  decideWorkflowRun,
  deleteAutomation,
  discardAgent,
  discardWorkflow,
  draftAgent,
  draftWorkflow,
  listAgents,
  listAutomations,
  listCollections,
  listComputerApprovals,
  listMcpApprovals,
  listWorkflowRuns,
  listWorkflows,
  ollamaStatus,
  runAgent,
  runAutomation,
  runWorkflow,
  type Agent,
  type Automation,
  type ComputerApproval,
  type KnowledgeCollection,
  type McpApproval,
  type Schedule,
  type Workflow,
  type WorkflowRun,
} from "./ws-api";

type Tab = "agents" | "workflows" | "automations" | "approvals";
type T = ReturnType<typeof useT>;

const STATUS_NAMES: Record<string, string> = {
  draft: "Draft",
  idle: "Ready",
  approved: "Ready",
  active: "Ready",
  running: "Running now",
  error: "Last run failed",
  awaiting_approval: "Waiting for your yes",
  done: "Finished",
  completed: "Finished",
  failed: "Failed",
  scheduled: "On a schedule",
  paused: "Paused",
  Draft: "Off",
  Enabled: "On",
};
const statusName = (s: string, t: T) => t(STATUS_NAMES[s] ?? s);
const msg = (e: unknown, t: T) => t(e instanceof Error ? e.message : String(e));
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (h = 7, m = 30) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

/** When an automation runs, in the reader's language. */
function describeTrigger(a: Automation, collections: KnowledgeCollection[], t: T): string {
  const tr = a.trigger;
  if (!tr) return "";
  if (tr.type === "event") {
    const c = collections.find((x) => x.id === tr.collectionId);
    return c
      ? t("When a file is added to {name}", { name: c.name })
      : t("When a file is added to any collection");
  }
  const s = tr.schedule;
  if (s.kind === "interval") return t("Every {n} minutes", { n: s.everyMinutes ?? 60 });
  if (s.kind === "weekly")
    return t("Every {day} at {time}", { day: t(WEEKDAYS[s.weekday ?? 0]!), time: hhmm(s.hour, s.minute) });
  return t("Every day at {time}", { time: hhmm(s.hour, s.minute) });
}

/** How many requests are waiting for a person: shown on the studio menu. */
export async function countApprovals(): Promise<number> {
  const [c, m, r] = await Promise.all([
    listComputerApprovals().catch(() => []),
    listMcpApprovals().catch(() => []),
    listWorkflowRuns().catch(() => []),
  ]);
  return c.length + m.length + r.filter((x) => x.status === "awaiting_approval").length;
}

export function AgentsStudio() {
  const t = useT();
  const h = useId();
  const [tab, setTab] = useState<Tab>("agents");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [waiting, setWaiting] = useState(0);
  useEffect(() => {
    void ollamaStatus().then(
      (s) => setModels(s.models.map((m) => m.name)),
      () => setModels([]),
    );
  }, []);
  const tabs: [Tab, string][] = [
    ["agents", t("Agents")],
    ["workflows", t("Workflows")],
    ["automations", t("Automations")],
    ["approvals", waiting ? t("Waiting for you ({count})", { count: waiting }) : t("Waiting for you")],
  ];
  const report = { setError: (e: unknown) => setError(e === null ? null : msg(e, t)), setStatus };
  return (
    <section className="studio" aria-labelledby={h}>
      <div className="studio-head">
        <h2 id={h}>{t("Agents and automations")}</h2>
      </div>
      <div role="tablist" aria-label={t("Agents and automations")} className="inline">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === k}
            onClick={() => {
              setTab(k);
              setError(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="muted small studio-status">
        {status}
      </p>
      {error && (
        <p role="alert" className="tone-error">
          {error}
        </p>
      )}
      {tab === "agents" && <AgentsTab models={models} {...report} />}
      {tab === "workflows" && <WorkflowsTab {...report} />}
      {tab === "automations" && <AutomationsTab models={models} {...report} />}
      <ApprovalsTab hidden={tab !== "approvals"} onCount={setWaiting} {...report} />
    </section>
  );
}

interface Report {
  setError: (e: unknown) => void;
  setStatus: (s: string) => void;
}

// ---- agents -----------------------------------------------------------------

function AgentsTab({ models, setError, setStatus }: Report & { models: string[] }) {
  const t = useT();
  const ids = { goal: useId(), model: useId(), instr: useId() };
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [goal, setGoal] = useState("");
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("");
  const [answer, setAnswer] = useState<{ id: string; text: string; tools: number } | null>(null);

  const refresh = useCallback(async () => {
    try {
      setAgents(
        (await listAgents()).sort((a, b) => String(b.lastRun ?? "").localeCompare(String(a.lastRun ?? ""))),
      );
    } catch (e) {
      setError(e);
      setAgents((a) => a ?? []);
    }
  }, [setError]);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const act = async (label: string, work: () => Promise<unknown>, done: string) => {
    setBusy(label);
    setError(null);
    try {
      await work();
      setStatus(done);
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };
  const current = agents?.find((a) => a.id === open) ?? null;

  return (
    <div className="studio-split preprod">
      <div className="studio-card stack">
        <h3 className="side-h">{t("Agents")}</h3>
        {agents === null ? (
          <p className="muted small">{t("Loading…")}</p>
        ) : !agents.length ? (
          <p className="muted small">{t("No agents yet.")}</p>
        ) : (
          <ul className="plain-list">
            {agents.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className="row-button"
                  aria-current={a.id === open ? "true" : undefined}
                  onClick={() => {
                    setOpen(a.id);
                    setAnswer(null);
                  }}
                >
                  <span className="row-title">{a.name}</span>
                  <span className="muted small">
                    {a.role ? `${a.role} · ` : ""}
                    {statusName(a.status, t)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            if (goal.trim().length < 8) return;
            void act(
              "draft",
              async () => {
                const a = await draftAgent(goal.trim(), model || undefined);
                setGoal("");
                setOpen(a.id);
              },
              t("A draft agent is ready. Try it, then approve it."),
            );
          }}
        >
          <div className="field">
            <label htmlFor={ids.goal}>{t("New agent: what should it do?")}</label>
            <textarea id={ids.goal} rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={ids.model}>{t("Model")}</label>
            <select id={ids.model} value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">{t("Workstation’s choice")}</option>
              {models.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" disabled={goal.trim().length < 8 || busy !== null}>
              {busy === "draft" ? t("Drafting…") : t("Draft an agent")}
            </button>
          </div>
        </form>
      </div>

      <div className="studio-card stack" style={{ minWidth: 0 }}>
        {!current ? (
          <p className="muted">{t("Choose an agent, or draft a new one from a goal.")}</p>
        ) : (
          <>
            <div className="studio-head">
              <h3>{current.name}</h3>
              <span className="muted small">
                {statusName(current.status, t)}
                {current.modelId ? ` · ${current.modelId}` : ""}
              </span>
            </div>
            {(current.description || current.goal) && <p>{current.description || current.goal}</p>}
            {current.systemPrompt && (
              <details>
                <summary className="mc-t">{t("Its instructions")}</summary>
                <p className="small pre-wrap">{current.systemPrompt}</p>
              </details>
            )}
            {current.status === "draft" && (
              <div className="inline">
                <span className="muted small">{t("Drafts can be tried before you approve them.")}</span>
                <button
                  type="button"
                  className="primary"
                  disabled={busy !== null}
                  onClick={() => void act("approve", () => approveAgent(current.id), t("Agent approved."))}
                >
                  {t("Approve")}
                </button>
                <button
                  type="button"
                  className="danger"
                  disabled={busy !== null}
                  onClick={() =>
                    void act(
                      "discard",
                      async () => {
                        await discardAgent(current.id);
                        setOpen(null);
                      },
                      t("Draft discarded."),
                    )
                  }
                >
                  {t("Discard")}
                </button>
              </div>
            )}
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (!instruction.trim()) return;
                void act(
                  "run",
                  async () => {
                    const r = await runAgent(current.id, instruction.trim());
                    setAnswer({
                      id: current.id,
                      text: r.result.content,
                      tools: r.result.toolTrace?.length ?? 0,
                    });
                  },
                  t("{name} finished.", { name: current.name }),
                );
              }}
            >
              <div className="field">
                <label htmlFor={ids.instr}>{t("Ask {name} to…", { name: current.name })}</label>
                <textarea
                  id={ids.instr}
                  rows={2}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" className="primary" disabled={!instruction.trim() || busy !== null}>
                  {busy === "run" ? t("Working… this can take a few minutes") : t("Run")}
                </button>
              </div>
            </form>
            {(answer?.id === current.id ? answer.text : current.lastResult?.content) && (
              <div className="stack">
                <h4>
                  {answer?.id === current.id
                    ? t.plural(answer.tools, "Answer (1 tool call)", "Answer ({count} tool calls)")
                    : t("Last answer")}
                </h4>
                <div className="answer">
                  <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>
                    {(answer?.id === current.id ? answer.text : current.lastResult?.content) ?? ""}
                  </ChatMarkdown>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---- workflows --------------------------------------------------------------

function WorkflowsTab({ setError, setStatus }: Report) {
  const t = useT();
  const goalId = useId();
  const [flows, setFlows] = useState<Workflow[] | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [f, r] = await Promise.all([listWorkflows(), listWorkflowRuns()]);
      setFlows(f);
      setRuns(r.sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt))));
    } catch (e) {
      setError(e);
      setFlows((f) => f ?? []);
    }
  }, [setError]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const active = runs.some((r) => r.status === "running");
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => void refresh(), 3000);
    return () => window.clearInterval(timer);
  }, [active, refresh]);

  const act = async (label: string, work: () => Promise<unknown>, done: string) => {
    setBusy(label);
    setError(null);
    try {
      await work();
      setStatus(done);
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="stack">
      <form
        className="studio-card inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (goal.trim().length >= 8)
            void act(
              "draft",
              async () => {
                await draftWorkflow(goal.trim());
                setGoal("");
              },
              t("A draft workflow is ready. Check its steps, then approve it."),
            );
        }}
      >
        <div className="field" style={{ flex: "1 1 320px" }}>
          <label htmlFor={goalId}>{t("New workflow: what should happen, step by step?")}</label>
          <input id={goalId} value={goal} onChange={(e) => setGoal(e.target.value)} />
        </div>
        <button type="submit" disabled={goal.trim().length < 8 || busy !== null} style={{ alignSelf: "end" }}>
          {busy === "draft" ? t("Drafting…") : t("Draft a workflow")}
        </button>
      </form>
      {flows === null ? (
        <p className="muted">{t("Loading…")}</p>
      ) : !flows.length ? (
        <p className="muted">{t("No workflows yet.")}</p>
      ) : (
        <ul className="plain-list day-list">
          {flows.map((f) => {
            const last = runs.find((r) => r.workflowId === f.id);
            return (
              <li key={f.id} className="studio-card stack">
                <div className="studio-head">
                  <h3>{f.name}</h3>
                  <span className="muted small">{statusName(f.status, t)}</span>
                </div>
                {f.description && <p className="small">{f.description}</p>}
                <ol className="step-list" aria-label={t("Steps")}>
                  {f.nodes.map((n, i) => {
                    const step = last?.steps.find((s) => s.nodeId === n.id);
                    return (
                      <li key={n.id ?? i} className={step ? `step-${step.status}` : undefined}>
                        {n.type === "approval" ? "✋ " : ""}
                        {n.label}
                        {step && step.status !== "pending" && (
                          <span className="muted small"> · {statusName(step.status, t)}</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <div className="inline">
                  {f.status === "draft" ? (
                    <>
                      <button
                        type="button"
                        className="primary"
                        disabled={busy !== null}
                        onClick={() => void act("ok", () => approveWorkflow(f.id), t("Workflow approved."))}
                      >
                        {t("Approve")}
                      </button>
                      <button
                        type="button"
                        className="danger"
                        disabled={busy !== null}
                        onClick={() => void act("no", () => discardWorkflow(f.id), t("Draft discarded."))}
                      >
                        {t("Discard")}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="primary"
                      disabled={busy !== null || last?.status === "running"}
                      onClick={() =>
                        void act("run", () => runWorkflow(f.id), t("{name} started.", { name: f.name }))
                      }
                    >
                      {t("Run")}
                    </button>
                  )}
                  {last?.status === "awaiting_approval" && (
                    <>
                      <strong>{t("Waiting for your yes")}</strong>
                      <button
                        type="button"
                        className="primary"
                        onClick={() =>
                          void act("yes", () => decideWorkflowRun(last.id, true), t("Approved."))
                        }
                      >
                        {t("Approve this step")}
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          void act("no", () => decideWorkflowRun(last.id, false), t("Stopped at this step."))
                        }
                      >
                        {t("Stop here")}
                      </button>
                    </>
                  )}
                </div>
                {last && (
                  <p className="muted small">
                    {t("Last run: {status}", { status: statusName(last.status, t) })}
                    {last.error ? ` · ${last.error}` : ""}
                  </p>
                )}
                {last?.lastOutput && (
                  <details>
                    <summary className="mc-t">{t("Last result")}</summary>
                    <div className="answer">
                      <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>{last.lastOutput}</ChatMarkdown>
                    </div>
                  </details>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---- automations -----------------------------------------------------------

function AutomationsTab({ models, setError, setStatus }: Report & { models: string[] }) {
  const t = useT();
  const nameId = useId();
  const [autos, setAutos] = useState<Automation[] | null>(null);
  const [collections, setCollections] = useState<KnowledgeCollection[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    try {
      const [a, c] = await Promise.all([listAutomations(), listCollections().catch(() => [])]);
      setAutos(a);
      setCollections(c);
    } catch (e) {
      setError(e);
      setAutos((a) => a ?? []);
    }
  }, [setError]);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const act = async (label: string, work: () => Promise<unknown>, done?: string) => {
    setBusy(label);
    setError(null);
    try {
      await work();
      if (done) setStatus(done);
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="stack">
      <p className="muted small">
        {t(
          "An automation asks a model for a result on a schedule, or when a file is added to a collection, using that collection’s passages.",
        )}
      </p>
      <form
        className="studio-card inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim())
            void act(
              "new",
              async () => {
                await createAutomation(name.trim());
                setName("");
              },
              t("Automation made. It stays off until you turn it on."),
            );
        }}
      >
        <div className="field" style={{ flex: "1 1 280px" }}>
          <label htmlFor={nameId}>{t("New automation, named for what it produces")}</label>
          <input id={nameId} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" disabled={!name.trim() || busy !== null} style={{ alignSelf: "end" }}>
          {t("Make")}
        </button>
      </form>
      {autos === null ? (
        <p className="muted">{t("Loading…")}</p>
      ) : !autos.length ? (
        <p className="muted">{t("No automations yet.")}</p>
      ) : (
        <ul className="plain-list day-list">
          {autos.map((a) => (
            <AutomationCard
              key={a.id}
              auto={a}
              models={models}
              collections={collections}
              busy={busy}
              output={outputs[a.id]}
              onSave={(patch, done) => void act(a.id, () => configureAutomation(a.id, patch), done)}
              onRun={() =>
                void act(
                  `run-${a.id}`,
                  async () => {
                    const r = await runAutomation(a.id);
                    setOutputs((o) => ({ ...o, [a.id]: r.output }));
                  },
                  t("{name} finished.", { name: a.name }),
                )
              }
              onDelete={() => void act(a.id, () => deleteAutomation(a.id), t("Deleted."))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function AutomationCard({
  auto,
  models,
  collections,
  busy,
  output,
  onSave,
  onRun,
  onDelete,
}: {
  auto: Automation;
  models: string[];
  collections: KnowledgeCollection[];
  busy: string | null;
  output?: string;
  onSave: (patch: Parameters<typeof configureAutomation>[1], done: string) => void;
  onRun: () => void;
  onDelete: () => void;
}) {
  const t = useT();
  const ids = {
    when: useId(),
    every: useId(),
    day: useId(),
    time: useId(),
    model: useId(),
    on: useId(),
    coll: useId(),
  };
  const schedule: Schedule =
    auto.trigger?.type === "schedule" ? auto.trigger.schedule : { kind: "daily", hour: 7, minute: 30 };
  const [when, setWhen] = useState<Schedule["kind"] | "event">(
    auto.trigger?.type === "event" ? "event" : schedule.kind,
  );
  const [every, setEvery] = useState(schedule.everyMinutes ?? 60);
  const [weekday, setWeekday] = useState(schedule.weekday ?? 1);
  const [time, setTime] = useState(
    `${String(schedule.hour ?? 7).padStart(2, "0")}:${String(schedule.minute ?? 30).padStart(2, "0")}`,
  );
  const [model, setModel] = useState(auto.modelId ?? "");
  const [picked, setPicked] = useState<string[]>(auto.collections ?? []);
  const [eventColl, setEventColl] = useState(
    auto.trigger?.type === "event" ? (auto.trigger.collectionId ?? "") : "",
  );
  const [confirm, setConfirm] = useState(false);
  const modelChoices = useMemo(
    () => (auto.modelId && !models.includes(auto.modelId) ? [auto.modelId, ...models] : models),
    [auto.modelId, models],
  );

  const trigger = () => {
    if (when === "event") return { type: "event", collectionId: eventColl || null };
    const [hour, minute] = time.split(":").map(Number);
    if (when === "interval") return { type: "schedule", schedule: { kind: "interval", everyMinutes: every } };
    if (when === "weekly") return { type: "schedule", schedule: { kind: "weekly", weekday, hour, minute } };
    return { type: "schedule", schedule: { kind: "daily", hour, minute } };
  };
  const on = auto.status === "Enabled";
  const when_ = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleString(document.documentElement.lang || "en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : "—";

  return (
    <li className="studio-card stack">
      <div className="studio-head">
        <h3>{auto.name}</h3>
        <span className={on ? "small tone-ok" : "muted small"}>{on ? t("On") : t("Off")}</span>
      </div>
      <p className="muted small">
        {describeTrigger(auto, collections, t)}
        {on && auto.nextRun ? ` · ${t("Next: {when}", { when: when_(auto.nextRun) })}` : ""}
        {auto.lastRun ? ` · ${t("Last: {when}", { when: when_(auto.lastRun) })}` : ""}
      </p>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ trigger: trigger(), modelId: model || null, collections: picked }, t("Saved."));
        }}
      >
        <div className="inline">
          <div className="field">
            <label htmlFor={ids.when}>{t("When")}</label>
            <select id={ids.when} value={when} onChange={(e) => setWhen(e.target.value as typeof when)}>
              <option value="daily">{t("Every day")}</option>
              <option value="weekly">{t("Every week")}</option>
              <option value="interval">{t("Every few minutes")}</option>
              <option value="event">{t("When a file is added")}</option>
            </select>
          </div>
          {when === "interval" && (
            <div className="field">
              <label htmlFor={ids.every}>{t("Minutes between runs")}</label>
              <input
                id={ids.every}
                type="number"
                min={1}
                max={10080}
                value={every}
                onChange={(e) => setEvery(Number(e.target.value) || 60)}
              />
            </div>
          )}
          {when === "weekly" && (
            <div className="field">
              <label htmlFor={ids.day}>{t("Day")}</label>
              <select id={ids.day} value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
                {WEEKDAYS.map((d, i) => (
                  <option key={d} value={i}>
                    {t(d)}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(when === "daily" || when === "weekly") && (
            <div className="field">
              <label htmlFor={ids.time}>{t("Time")}</label>
              <input
                id={ids.time}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value || "07:30")}
              />
            </div>
          )}
          {when === "event" && (
            <div className="field">
              <label htmlFor={ids.coll}>{t("Watch collection")}</label>
              <select id={ids.coll} value={eventColl} onChange={(e) => setEventColl(e.target.value)}>
                <option value="">{t("Any collection")}</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="field">
            <label htmlFor={ids.model}>{t("Model")}</label>
            <select id={ids.model} value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">{t("Workstation’s choice")}</option>
              {modelChoices.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        {collections.length > 0 && (
          <fieldset className="plain-fieldset">
            <legend className="small">{t("Look things up in")}</legend>
            <div className="inline">
              {collections.map((c) => (
                <label key={c.id} className="inline small">
                  <input
                    type="checkbox"
                    checked={picked.includes(c.id)}
                    onChange={(e) =>
                      setPicked((p) => (e.target.checked ? [...p, c.id] : p.filter((x) => x !== c.id)))
                    }
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="inline">
          <button type="submit" disabled={busy !== null}>
            {t("Save")}
          </button>
          <button
            type="button"
            className={on ? undefined : "primary"}
            disabled={busy !== null}
            onClick={() =>
              onSave(
                { status: on ? "Draft" : "Enabled", trigger: trigger() },
                on ? t("Turned off.") : t("Turned on."),
              )
            }
          >
            {on ? t("Turn off") : t("Turn on")}
          </button>
          <button type="button" disabled={busy !== null} onClick={onRun}>
            {busy === `run-${auto.id}` ? t("Running…") : t("Run now")}
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
      </form>
      {output && (
        <div className="answer">
          <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>{output}</ChatMarkdown>
        </div>
      )}
      {!!auto.logs?.length && (
        <details>
          <summary className="mc-t">{t("Run notes")}</summary>
          <ul className="small">
            {auto.logs.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}

// ---- approvals ------------------------------------------------------------

function ApprovalsTab({
  hidden,
  onCount,
  setError,
  setStatus,
}: Report & { hidden: boolean; onCount: (n: number) => void }) {
  const t = useT();
  const [computer, setComputer] = useState<ComputerApproval[]>([]);
  const [mcp, setMcp] = useState<McpApproval[]>([]);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [flows, setFlows] = useState<Workflow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [c, m, r, f] = await Promise.all([
      listComputerApprovals().catch(() => []),
      listMcpApprovals().catch(() => []),
      listWorkflowRuns().catch(() => []),
      listWorkflows().catch(() => []),
    ]);
    const waiting = r.filter((x) => x.status === "awaiting_approval");
    setComputer(c);
    setMcp(m);
    setRuns(waiting);
    setFlows(f);
    setLoaded(true);
    onCount(c.length + m.length + waiting.length);
  }, [onCount]);
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const decide = async (work: () => Promise<unknown>, done: string) => {
    setError(null);
    try {
      await work();
      setStatus(done);
    } catch (e) {
      setError(e);
    }
    await refresh();
  };
  if (hidden) return null;
  const none = loaded && !computer.length && !mcp.length && !runs.length;

  return (
    <div className="stack">
      <p className="muted small">
        {t(
          "Workstation asks before it runs a command, uses a connected tool, or passes a workflow’s sign-off step.",
        )}
      </p>
      {!loaded ? (
        <p className="muted">{t("Loading…")}</p>
      ) : none ? (
        <p className="muted">{t("Nothing is waiting for you.")}</p>
      ) : (
        <ul className="plain-list day-list">
          {computer.map((a) => (
            <li key={a.id} className="studio-card stack">
              <div className="studio-head">
                <h3>{t(a.title ?? a.tool)}</h3>
                {a.risk && <span className="muted small">{t("Risk: {risk}", { risk: t(a.risk) })}</span>}
              </div>
              {a.detail && <pre className="code-box">{a.detail}</pre>}
              {a.where && <p className="muted small">{t("In: {where}", { where: a.where })}</p>}
              <div className="inline">
                <button
                  type="button"
                  className="primary"
                  onClick={() => void decide(() => decideComputer(a.id, "allow"), t("Allowed once."))}
                >
                  {t("Allow once")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void decide(() => decideComputer(a.id, "always"), t("Allowed for this chat."))
                  }
                >
                  {t("Allow for this chat")}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void decide(() => decideComputer(a.id, "deny"), t("Refused."))}
                >
                  {t("Refuse")}
                </button>
              </div>
            </li>
          ))}
          {mcp.map((a) => (
            <li key={a.approvalId} className="studio-card stack">
              <div className="studio-head">
                <h3>{t("Use the tool {tool}", { tool: a.toolName })}</h3>
                {a.serverName && <span className="muted small">{a.serverName}</span>}
              </div>
              {a.arguments !== undefined && (
                <pre className="code-box">{JSON.stringify(a.arguments, null, 2)}</pre>
              )}
              <div className="inline">
                <button
                  type="button"
                  className="primary"
                  onClick={() => void decide(() => decideMcp(a.approvalId, true), t("Allowed once."))}
                >
                  {t("Allow once")}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void decide(() => decideMcp(a.approvalId, false), t("Refused."))}
                >
                  {t("Refuse")}
                </button>
              </div>
            </li>
          ))}
          {runs.map((r) => {
            const f = flows.find((x) => x.id === r.workflowId);
            const node = f?.nodes.find((n) => n.id === r.currentNodeId);
            return (
              <li key={r.id} className="studio-card stack">
                <div className="studio-head">
                  <h3>{t("Sign-off: {step}", { step: node?.label ?? "" })}</h3>
                  <span className="muted small">{f?.name}</span>
                </div>
                {r.lastOutput && (
                  <details open>
                    <summary className="mc-t">{t("What the workflow made so far")}</summary>
                    <div className="answer">
                      <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>{r.lastOutput}</ChatMarkdown>
                    </div>
                  </details>
                )}
                <div className="inline">
                  <button
                    type="button"
                    className="primary"
                    onClick={() => void decide(() => decideWorkflowRun(r.id, true), t("Approved."))}
                  >
                    {t("Approve this step")}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      void decide(() => decideWorkflowRun(r.id, false), t("Stopped at this step."))
                    }
                  >
                    {t("Stop here")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
