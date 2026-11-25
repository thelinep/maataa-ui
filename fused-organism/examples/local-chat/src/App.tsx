import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  CHAT_BLOCKS_PROMPT,
  CHAT_BLOCK_KINDS,
  CHAT_3D_PROMPT,
  CHAT_DIAGRAM_PROMPT,
  CHAT_MEDIA_PROMPT,
  LocalChat,
  LocaleProvider,
  ThemePicker,
  builtInThemes,
  createKeywordRetriever,
  findArtifacts,
  findTasks,
  formatContext,
  listLocalModels,
  useT,
  useThemePreference,
  type ChatArtifact,
  type ChatCommand,
  type ChatContext,
  type FencedBlock,
  type DocChunk,
  type LocalChatMessage,
  type LocalModelOptions,
} from "@maataa/ui";
import { appMessagesHi } from "./messages";
import { ArtifactsPanel, ProjectPanel, TasksPanel } from "./panels";
import {
  fileChunks,
  hashText,
  loadAll,
  newId,
  now,
  put,
  remove,
  titleFrom,
  type Artifact,
  type Conversation,
  type Data,
  type Project,
  type Task,
} from "./store";
import { archiveTask, novaAvailable, pushTask, setTaskDone } from "./nova";
import { APP_CSS } from "./styles";
import { LivePreview, MediaBlock, MermaidDiagram, RUNNABLE, isMediaBlock, renderMath } from "./rich";

type ServerKind = "ollama" | "lmstudio" | "custom";
type PanelTab = "artifacts" | "tasks" | "project";

interface Settings {
  server: ServerKind;
  customUrl: string;
  model: string;
  language: "en-IN" | "hi-IN";
  projectId: string;
  syncTasks: boolean;
  /** Make pictures, sound and video as soon as a reply asks, without a tap. */
  autoMedia: boolean;
}

const STORAGE_KEY = "maataa-local-chat";
const DEFAULTS: Settings = {
  server: "ollama",
  customUrl: "http://localhost:8080",
  model: "",
  language: "en-IN",
  projectId: "general",
  syncTasks: false,
  autoMedia: false,
};

function loadSettings(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

function connection(settings: Settings): Omit<LocalModelOptions, "model"> {
  if (settings.server === "ollama") return { baseUrl: "/ollama", api: "ollama" };
  if (settings.server === "lmstudio") return { baseUrl: "/lmstudio", api: "openai" };
  return { baseUrl: settings.customUrl, api: "openai" };
}

const wide = () => typeof window !== "undefined" && window.matchMedia("(min-width: 861px)").matches;

export function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Settings just won't be remembered.
    }
    document.documentElement.lang = settings.language;
  }, [settings]);

  return (
    <LocaleProvider
      locale={settings.language}
      messages={settings.language === "hi-IN" ? appMessagesHi : undefined}
      wrap={false}
    >
      <style>{APP_CSS}</style>
      <Main settings={settings} setSettings={setSettings} />
    </LocaleProvider>
  );
}

function Main({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (update: (s: Settings) => Settings) => void;
}) {
  const t = useT();
  const ids = {
    server: useId(),
    url: useId(),
    model: useId(),
    language: useId(),
    sync: useId(),
    media: useId(),
  };
  const theme = useThemePreference();
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  // ---- model server -------------------------------------------------------
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState<{ tone: "ok" | "error" | "busy"; text: string }>({
    tone: "busy",
    text: "",
  });
  const conn = connection(settings);
  const checkServer = useCallback(async () => {
    setStatus({ tone: "busy", text: t("Checking the model server…") });
    try {
      const names = await listLocalModels(conn);
      setModels(names);
      if (!names.length) {
        setStatus({
          tone: "error",
          text: t("Connected, but no models are installed. For Ollama, run: ollama pull llama3.2"),
        });
        return;
      }
      setStatus({
        tone: "ok",
        text: t.plural(names.length, "Connected · {count} model", "Connected · {count} models"),
      });
      setSettings((s) => (names.includes(s.model) ? s : { ...s, model: names[0]! }));
    } catch {
      setModels([]);
      setStatus({
        tone: "error",
        text: t("Can’t reach the model server. Start Ollama or LM Studio, then press Check again."),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn.baseUrl, conn.api, t]);
  useEffect(() => {
    void checkServer();
  }, [checkServer]);

  // ---- Maataa Workstation (nova) ------------------------------------------
  const [nova, setNova] = useState<"unknown" | "on" | "off">("unknown");
  const [novaNote, setNovaNote] = useState("");
  const checkNova = useCallback(async () => setNova((await novaAvailable()) ? "on" : "off"), []);
  useEffect(() => {
    void checkNova();
  }, [checkNova]);

  // ---- saved data ---------------------------------------------------------
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    void loadAll().then(setData);
  }, []);
  const project = data?.projects.find((p) => p.id === settings.projectId) ?? data?.projects[0] ?? null;
  const [convId, setConvId] = useState(() => newId("c"));
  const conversation = data?.conversations.find((c) => c.id === convId) ?? null;
  const chats = data?.conversations.filter((c) => c.projectId === project?.id) ?? [];
  const artifacts = (data?.artifacts ?? [])
    .filter((a) => a.projectId === project?.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const tasks = (data?.tasks ?? []).filter((x) => x.projectId === project?.id);
  const openTasks = tasks.filter((x) => !x.done).length;

  const upsert = <K extends keyof Data>(kind: K, record: Data[K][number]) => {
    setData((d) => {
      if (!d) return d;
      const list = d[kind] as Data[K][number][];
      const i = list.findIndex((x) => x.id === record.id);
      const next = i >= 0 ? list.map((x, j) => (j === i ? record : x)) : [record, ...list];
      return { ...d, [kind]: next };
    });
    void put(kind, record);
  };
  const drop = (kind: keyof Data, id: string) => {
    setData((d) => (d ? { ...d, [kind]: (d[kind] as { id: string }[]).filter((x) => x.id !== id) } : d));
    void remove(kind, id);
  };

  // ---- layout -------------------------------------------------------------
  const [sideOpen, setSideOpen] = useState(false);
  const [panel, setPanel] = useState<PanelTab | null>(null);
  const [openArtifact, setOpenArtifact] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDialogElement>(null);
  const openSettings = () => settingsRef.current?.showModal();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSideOpen(false);
        if (!wide()) setPanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const newChat = () => {
    setConvId(newId("c"));
    setSideOpen(false);
  };
  const openChat = (c: Conversation) => {
    setConvId(c.id);
    setSideOpen(false);
  };
  const chooseProject = (id: string) => {
    set("projectId", id);
    setConvId(newId("c"));
    setOpenArtifact(null);
    setSideOpen(false);
  };
  const createProject = () => {
    const p: Project = {
      id: newId("p"),
      name: t("New project"),
      instructions: "",
      files: [],
      createdAt: now(),
    };
    upsert("projects", p);
    chooseProject(p.id);
    setPanel("project");
  };
  const deleteProject = (p: Project) => {
    if (!data) return;
    data.conversations.filter((c) => c.projectId === p.id).forEach((c) => drop("conversations", c.id));
    data.artifacts.filter((a) => a.projectId === p.id).forEach((a) => drop("artifacts", a.id));
    data.tasks.filter((x) => x.projectId === p.id).forEach((x) => drop("tasks", x.id));
    drop("projects", p.id);
    chooseProject("general");
    setPanel(null);
  };

  // ---- conversation saving (debounced while a reply streams in) ----------
  const saveTimer = useRef<number | undefined>(undefined);
  const latest = useRef<Conversation | null>(null);
  const onMessagesChange = (messages: LocalChatMessage[]) => {
    if (!project) return;
    if (!messages.length) {
      if (conversation) drop("conversations", conversation.id);
      return;
    }
    const conv: Conversation = {
      id: convId,
      projectId: project.id,
      title: conversation?.title || titleFrom(messages, t("New chat")),
      messages,
      updatedAt: now(),
    };
    latest.current = conv;
    setData((d) => {
      if (!d) return d;
      const rest = d.conversations.filter((c) => c.id !== conv.id);
      return { ...d, conversations: [conv, ...rest] };
    });
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (latest.current) void put("conversations", latest.current);
    }, 400);
  };

  // ---- artifacts ----------------------------------------------------------
  const saveArtifact = (f: ChatArtifact): Artifact | null => {
    if (!project || !data) return null;
    const existing = data.artifacts.find(
      (a) => a.projectId === project.id && a.conversationId === convId && a.title === f.title,
    );
    const last = existing?.versions[existing.versions.length - 1];
    if (existing && last?.content === f.content) return existing;
    const record: Artifact = existing
      ? {
          ...existing,
          type: f.type,
          versions: [...existing.versions, { content: f.content, at: now() }],
          updatedAt: now(),
        }
      : {
          id: newId("a"),
          projectId: project.id,
          conversationId: convId,
          title: f.title,
          type: f.type,
          versions: [{ content: f.content, at: now() }],
          updatedAt: now(),
        };
    upsert("artifacts", record);
    return record;
  };
  const saveArtifacts = (reply: LocalChatMessage): Artifact[] =>
    findArtifacts(reply.content)
      .map(saveArtifact)
      .filter((a): a is Artifact => !!a);
  const showArtifact = (id: string) => {
    setOpenArtifact(id);
    setPanel("artifacts");
  };
  const flushSave = () => {
    window.clearTimeout(saveTimer.current);
    if (latest.current) void put("conversations", latest.current);
  };
  useEffect(() => {
    window.addEventListener("pagehide", flushSave);
    return () => window.removeEventListener("pagehide", flushSave);
  }, []);
  const onReplyDone = (reply: LocalChatMessage) => {
    window.setTimeout(flushSave, 50);
    const saved = saveArtifacts(reply);
    if (saved.length && wide()) showArtifact(saved[saved.length - 1]!.id);
  };

  // ---- tasks --------------------------------------------------------------
  const syncTask = async (task: Task) => {
    if (!settings.syncTasks || nova !== "on" || !project) return;
    try {
      const novaId = task.novaId ?? (await pushTask(task, project.name));
      if (task.done) await setTaskDone(novaId, true);
      if (novaId !== task.novaId) upsert("tasks", { ...task, novaId });
      setNovaNote("");
    } catch (e) {
      setNovaNote(
        t("Maataa Workstation didn’t take the change: {message}", { message: (e as Error).message }),
      );
    }
  };
  const addTasks = (titles: string[]) => {
    if (!project) return 0;
    const have = new Set(tasks.map((x) => x.title.toLowerCase()));
    const fresh = titles.filter((title) => !have.has(title.toLowerCase()));
    for (const title of fresh) {
      const task: Task = { id: newId("t"), projectId: project.id, title, done: false, createdAt: now() };
      upsert("tasks", task);
      void syncTask(task);
    }
    return fresh.length;
  };
  const toggleTask = (task: Task) => {
    const next = { ...task, done: !task.done };
    upsert("tasks", next);
    if (settings.syncTasks && nova === "on" && next.novaId)
      void setTaskDone(next.novaId, next.done).catch((e: Error) =>
        setNovaNote(t("Maataa Workstation didn’t take the change: {message}", { message: e.message })),
      );
  };
  const deleteTask = (task: Task) => {
    drop("tasks", task.id);
    if (settings.syncTasks && nova === "on" && task.novaId)
      void archiveTask(task.novaId).catch(() => undefined);
  };

  // ---- context and prompt -------------------------------------------------
  const [docs, setDocs] = useState<DocChunk[] | null>(null);
  useEffect(() => {
    fetch("/maataa-docs.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: { chunks: DocChunk[] }) => setDocs(json.chunks))
      .catch(() => setDocs([]));
  }, []);
  const docsSearch = useMemo(() => (docs ? createKeywordRetriever(docs) : null), [docs]);
  const filesKey = project?.files.map((f) => f.name + f.text.length).join("|") ?? "";
  const fileSearch = useMemo(
    () => (project && project.files.length ? createKeywordRetriever(fileChunks(project)) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project?.id, filesKey],
  );
  const getContext = useMemo(() => {
    if (project?.kind === "docs")
      return (question: string): ChatContext => {
        const hits = docsSearch ? docsSearch(question, 6) : [];
        if (!hits.length) return { text: "Passages from the MAATAA UI docs: none matched this question." };
        return {
          text: "Passages from the MAATAA UI docs:\n\n" + formatContext(hits, 7000),
          sources: hits.map((h) => ({ title: h.chunk.title })),
        };
      };
    if (fileSearch)
      return (question: string): ChatContext => {
        const hits = fileSearch(question, 5);
        if (!hits.length) return { text: "" };
        return {
          text: "Passages from the project's files:\n\n" + formatContext(hits, 6000),
          sources: [...new Set(hits.map((h) => h.chunk.title))].map((title) => ({ title })),
        };
      };
    return undefined;
  }, [project?.kind, docsSearch, fileSearch]);

  const languageLine =
    settings.language === "hi-IN"
      ? "Reply in Hindi (Devanagari script). Keep code, component names, props, JSON keys and commands in English."
      : "Reply in English.";
  const systemPrompt =
    project?.kind === "docs"
      ? `You are the MAATAA UI docs helper. MAATAA UI is a React component library (packages @maataa/ui, @maataa/tokens). Answer using only the numbered passages you are given and cite them like [1]. If they do not cover the question, say so plainly. When useful, show the import line and a short TSX example using the documented props. ${languageLine}`
      : [
          `You are a helpful assistant running locally on the user's own computer, working with a film and event production team in India. Be clear and concise. ${languageLine}`,
          CHAT_BLOCKS_PROMPT,
          CHAT_DIAGRAM_PROMPT,
          CHAT_3D_PROMPT,
          "To show a working page, write a complete HTML page in a ```html block; it runs live in the chat.",
          nova === "on" ? CHAT_MEDIA_PROMPT : "",
          project?.instructions.trim()
            ? `Project "${project.name}" instructions:\n${project.instructions.trim()}`
            : "",
          project?.files.length
            ? "When passages from the project's files are given, use them and say which file you used."
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");

  const model: LocalModelOptions | undefined = settings.model
    ? { ...conn, model: settings.model }
    : undefined;
  const unavailable =
    status.tone === "error" || (status.tone === "ok" && !model) ? (
      <div className="offline" role="group" aria-label={t("Model not available")}>
        <p style={{ margin: 0, fontWeight: 600 }}>{t("The model isn’t available yet")}</p>
        <p style={{ margin: 0 }}>{status.text}</p>
        <div className="inline" style={{ justifyContent: "center" }}>
          <button type="button" onClick={() => void checkServer()}>
            {t("Check again")}
          </button>
          <button type="button" onClick={openSettings}>
            {t("Model settings")}
          </button>
        </div>
      </div>
    ) : status.tone === "busy" ? (
      <p style={{ margin: 0 }}>{t("Checking the model server…")}</p>
    ) : undefined;

  // ---- commands -----------------------------------------------------------
  const themeNames = ["system", ...builtInThemes.map((th) => th.name)];
  const commands: ChatCommand[] = [
    { name: "new", description: t("Start a new chat"), run: () => newChat() },
    {
      name: "project",
      args: "<name>",
      description: t("Switch project"),
      run: (name) => {
        const list = data?.projects ?? [];
        if (!name) return t("Projects: {list}", { list: list.map((p) => t(p.name)).join(", ") });
        const found = list.find((p) => t(p.name).toLowerCase().startsWith(name.toLowerCase()));
        if (!found) return t("No project is called {name}.", { name });
        chooseProject(found.id);
      },
    },
    { name: "docs", description: t("Switch to MAATAA UI docs"), run: () => chooseProject("docs") },
    {
      name: "task",
      args: "<text>",
      description: t("Add a task to this project"),
      run: (text) => {
        if (!text) return t("Write the task after /task");
        addTasks([text]);
        return t("Task added: {title}", { title: text });
      },
    },
    {
      name: "model",
      args: "<name>",
      description: t("Choose the model"),
      run: (name) => {
        if (!name) return t("Installed models: {list}", { list: models.join(", ") || t("none") });
        const found =
          models.find((m) => m === name) ??
          models.find((m) => m.startsWith(`${name}:`)) ??
          models.find((m) => m.startsWith(name));
        if (!found) return t("No installed model is called {name}.", { name });
        set("model", found);
        return t("Model: {name}", { name: found });
      },
    },
    {
      name: "lang",
      args: "en | hi",
      description: t("Change the language"),
      run: (code) => {
        const next = code.startsWith("hi") ? "hi-IN" : code.startsWith("en") ? "en-IN" : null;
        if (!next) return t("Use /lang en or /lang hi");
        set("language", next);
      },
    },
    {
      name: "theme",
      args: "<name>",
      description: t("Change the theme"),
      run: (name) => {
        if (!themeNames.includes(name)) return t("Themes: {list}", { list: themeNames.join(", ") });
        theme.setChoice(name);
      },
    },
    { name: "check", description: t("Check the model server again"), run: () => void checkServer() },
  ];

  const messageActions = (m: LocalChatMessage) => {
    const list = findTasks(m.content).filter((x) => !x.done);
    if (!list.length) return null;
    const have = new Set(tasks.map((x) => x.title.toLowerCase()));
    const fresh = list.filter((x) => !have.has(x.title.toLowerCase()));
    return (
      <button
        type="button"
        className="chip"
        disabled={!fresh.length}
        onClick={() => {
          addTasks(fresh.map((x) => x.title));
          setPanel("tasks");
        }}
      >
        <span aria-hidden="true">☐ </span>
        {fresh.length ? t.plural(fresh.length, "Add {count} task", "Add {count} tasks") : t("Tasks added")}
      </button>
    );
  };

  // Artifacts show in the reply as a card; the full content opens in the panel.
  const renderBlock = (block: FencedBlock) => {
    if ((CHAT_BLOCK_KINDS as readonly string[]).includes(block.lang)) return undefined;
    if (block.lang === "mermaid") return <MermaidDiagram code={block.code} closed={block.closed} />;
    if (isMediaBlock(block.lang))
      return (
        <MediaBlock
          block={block as FencedBlock & { lang: typeof block.lang }}
          nova={nova}
          autoStart={settings.autoMedia}
          saved={data?.media.find((r) => r.id === hashText(`${block.lang}:${block.code}`))}
          onSaved={(r) =>
            setData((d) => (d ? { ...d, media: [r, ...d.media.filter((x) => x.id !== r.id)] } : d))
          }
        />
      );
    const isPage = RUNNABLE.includes(block.lang);
    if (!isPage && !block.meta.title && block.code.split("\n").length < 40) return undefined;
    const artifact: ChatArtifact = {
      title:
        block.meta.title ||
        (block.lang === "html" ? /<title>([^<]+)<\/title>/i.exec(block.code)?.[1]?.trim() : undefined) ||
        (block.lang === "threejs" ? t("3D scene") : isPage ? t("Page") : block.lang || "text"),
      type: block.lang === "md" ? "markdown" : block.lang || "text",
      content: block.code,
    };
    const open = () => {
      const saved = saveArtifact(artifact);
      if (saved) showArtifact(saved.id);
    };
    if (isPage) return <LivePreview block={block} title={artifact.title} onOpen={open} />;
    return (
      <div className="artifact-card">
        <span className="artifact-icon" aria-hidden="true">
          ◧
        </span>
        <span className="artifact-card-text">
          <strong>{artifact.title}</strong>
          <span className="muted small">
            {block.closed
              ? t.plural(block.code.split("\n").length, "{type} · {count} line", "{type} · {count} lines", {
                  type: block.lang || "text",
                })
              : t("Writing…")}
          </span>
        </span>
        {block.closed && (
          <button type="button" onClick={open}>
            {t("Open")}
          </button>
        )}
      </div>
    );
  };

  const statusDot = status.tone === "ok" && model ? "ok" : status.tone === "busy" ? "busy" : "error";
  const projectName = project ? t(project.name) : "";
  const starters =
    project?.kind === "docs"
      ? [
          t("How do I add a theme picker?"),
          t("Which props does DatePicker take?"),
          t("How do I show the app in Hindi?"),
        ]
      : [
          t("Write a call sheet for a 6 am shoot at a haveli"),
          t("Make a shot list for a kitchen scene"),
          t("Make a one-page shoot plan as a document"),
          t("Compare crew hours this week as a chart"),
        ];

  return (
    <div className={`app${panel ? " with-panel" : ""}`}>
      <header className="top">
        <button
          type="button"
          className="ghost icon only-narrow"
          aria-label={t("Projects and chats")}
          aria-expanded={sideOpen}
          aria-controls="side"
          onClick={() => setSideOpen((o) => !o)}
        >
          ☰
        </button>
        <h1 className="top-title">
          <span className="muted">{projectName}</span>
          {conversation && <span className="crumb"> › {conversation.title}</span>}
        </h1>
        <button
          type="button"
          className="chip model-chip"
          onClick={openSettings}
          aria-label={t("Model settings: {model}, {status}", {
            model: settings.model || t("none"),
            status: status.text,
          })}
        >
          <span className={`dot ${statusDot}`} aria-hidden="true" />
          <span className="lbl">{settings.model || t("No model")}</span>
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={panel === "artifacts"}
          aria-label={t("Artifacts ({count})", { count: artifacts.length })}
          onClick={() => setPanel((p) => (p === "artifacts" ? null : "artifacts"))}
        >
          <span aria-hidden="true">◧</span>
          <span className="lbl"> {t("Artifacts")}</span>
          {artifacts.length > 0 && <span className="count">{artifacts.length}</span>}
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={panel === "tasks"}
          aria-label={t("Tasks ({count} open)", { count: openTasks })}
          onClick={() => setPanel((p) => (p === "tasks" ? null : "tasks"))}
        >
          <span aria-hidden="true">☐</span>
          <span className="lbl"> {t("Tasks")}</span>
          {openTasks > 0 && <span className="count">{openTasks}</span>}
        </button>
        <button type="button" className="primary" onClick={newChat} aria-label={t("New chat")}>
          <span aria-hidden="true">＋</span>
          <span className="lbl"> {t("New chat")}</span>
        </button>
      </header>

      {sideOpen && <div className="scrim only-narrow" onClick={() => setSideOpen(false)} />}
      <nav id="side" className={`side${sideOpen ? " open" : ""}`} aria-label={t("Projects and chats")}>
        <h2 className="side-h">{t("Projects")}</h2>
        <ul className="plain-list">
          {data?.projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="row-button row-inline"
                aria-current={p.id === project?.id ? "true" : undefined}
                onClick={() => chooseProject(p.id)}
              >
                <span aria-hidden="true">{p.kind === "docs" ? "📘" : "📁"} </span>
                <span className="row-title">{t(p.name)}</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="row-button muted" onClick={createProject}>
              ＋ {t("New project")}
            </button>
          </li>
        </ul>
        <div className="side-head">
          <h2 className="side-h">{t("Chats in {project}", { project: projectName })}</h2>
          <button
            type="button"
            className="ghost icon"
            aria-label={t("Project settings")}
            title={t("Project settings")}
            onClick={() => {
              setPanel("project");
              setSideOpen(false);
            }}
          >
            ⚙
          </button>
        </div>
        {chats.length === 0 ? (
          <p className="muted small" style={{ margin: "0 8px" }}>
            {t("No chats yet.")}
          </p>
        ) : (
          <ul className="plain-list">
            {chats.map((c) => (
              <li key={c.id} className="chat-row">
                <button
                  type="button"
                  className="row-button"
                  aria-current={c.id === convId ? "true" : undefined}
                  onClick={() => openChat(c)}
                >
                  <span className="row-title">{c.title}</span>
                </button>
                <button
                  type="button"
                  className="ghost icon"
                  aria-label={t("Delete chat {title}", { title: c.title })}
                  onClick={() => {
                    drop("conversations", c.id);
                    if (c.id === convId) newChat();
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="side-foot">
          <button type="button" className="row-button" onClick={openSettings}>
            ⚙ {t("Settings")}
          </button>
        </div>
      </nav>

      <main className="main">
        {data && project ? (
          <LocalChat
            key={`${convId}-${settings.language}`}
            fill
            bare
            hideTitle
            hideNewConversation
            allowImages
            voice
            title={conversation?.title ?? t("New chat")}
            assistantName={project.kind === "docs" ? t("Docs helper") : undefined}
            commands={commands}
            model={model}
            unavailable={unavailable}
            systemPrompt={systemPrompt}
            getContext={getContext}
            initialMessages={conversation?.messages}
            onMessagesChange={onMessagesChange}
            onReplyDone={onReplyDone}
            messageActions={messageActions}
            renderBlock={renderBlock}
            renderMath={renderMath}
            placeholder={t("Ask anything…")}
            starterQuestions={starters}
            style={{ maxWidth: 860, width: "100%", margin: "0 auto" }}
          />
        ) : (
          <p className="muted pad">{t("Loading your projects…")}</p>
        )}
      </main>

      {panel && project && (
        <aside className="panel" aria-label={t("Side panel")}>
          <div className="panel-head">
            <div role="tablist" aria-label={t("Side panel")} className="inline">
              {(["artifacts", "tasks", "project"] as PanelTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={panel === tab}
                  className="tab"
                  onClick={() => setPanel(tab)}
                >
                  {tab === "artifacts" ? t("Artifacts") : tab === "tasks" ? t("Tasks") : t("Project")}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="ghost icon"
              aria-label={t("Close panel")}
              onClick={() => setPanel(null)}
            >
              ×
            </button>
          </div>
          <div role="tabpanel" className="panel-body">
            {panel === "artifacts" && (
              <ArtifactsPanel
                artifacts={artifacts}
                openId={openArtifact}
                onOpen={setOpenArtifact}
                onDelete={(id) => {
                  drop("artifacts", id);
                  setOpenArtifact(null);
                }}
              />
            )}
            {panel === "tasks" && (
              <TasksPanel
                tasks={tasks}
                onAdd={(title) => addTasks([title])}
                onToggle={toggleTask}
                onDelete={deleteTask}
                novaNote={
                  novaNote ||
                  (settings.syncTasks
                    ? nova === "on"
                      ? t("New tasks are copied to the Radheya board in Maataa Workstation.")
                      : t("Maataa Workstation isn’t running, so tasks stay in this browser for now.")
                    : "")
                }
              />
            )}
            {panel === "project" && (
              <ProjectPanel
                project={project}
                onChange={(p) => upsert("projects", p)}
                onDelete={() => deleteProject(project)}
              />
            )}
          </div>
        </aside>
      )}

      <dialog ref={settingsRef} className="settings" aria-labelledby={`${ids.server}-h`}>
        <form method="dialog" className="stack">
          <h2 id={`${ids.server}-h`} style={{ margin: 0 }}>
            {t("Settings")}
          </h2>
          <div className="grid2">
            <div className="field">
              <label htmlFor={ids.language}>{t("Language")}</label>
              <select
                id={ids.language}
                value={settings.language}
                onChange={(e) => set("language", e.target.value as Settings["language"])}
              >
                <option value="en-IN">English</option>
                <option value="hi-IN" lang="hi">
                  हिन्दी
                </option>
              </select>
            </div>
            <div className="field">
              <ThemePicker />
            </div>
            <div className="field">
              <label htmlFor={ids.server}>{t("Model server")}</label>
              <select
                id={ids.server}
                value={settings.server}
                onChange={(e) => set("server", e.target.value as ServerKind)}
              >
                <option value="ollama">{t("Ollama on this computer")}</option>
                <option value="lmstudio">{t("LM Studio on this computer")}</option>
                <option value="custom">{t("Other OpenAI-compatible server")}</option>
              </select>
            </div>
            {settings.server === "custom" && (
              <div className="field">
                <label htmlFor={ids.url}>{t("Server address")}</label>
                <input
                  id={ids.url}
                  value={settings.customUrl}
                  onChange={(e) => set("customUrl", e.target.value)}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor={ids.model}>{t("Model")}</label>
              <select
                id={ids.model}
                value={settings.model}
                disabled={!models.length}
                onChange={(e) => set("model", e.target.value)}
              >
                {!models.length && <option value="">{t("none")}</option>}
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="muted small" style={{ margin: 0 }}>
            {t("To ask about pictures, pick a model that can see, e.g. gemma3, llava or qwen2.5vl.")}
          </p>
          <div className="inline">
            <button type="button" onClick={() => void checkServer()}>
              {t("Check again")}
            </button>
            <span role="status" className={`small tone-${status.tone}`}>
              {status.text}
            </span>
          </div>
          <fieldset className="stack">
            <legend>{t("Maataa Workstation")}</legend>
            <div className="inline">
              <input
                type="checkbox"
                id={ids.sync}
                checked={settings.syncTasks}
                onChange={(e) => set("syncTasks", e.target.checked)}
              />
              <label htmlFor={ids.sync}>{t("Copy tasks to its Radheya board")}</label>
            </div>
            <div className="inline">
              <input
                type="checkbox"
                id={ids.media}
                checked={settings.autoMedia}
                onChange={(e) => set("autoMedia", e.target.checked)}
              />
              <label htmlFor={ids.media}>
                {t("Make pictures, sound and video as soon as a reply asks (otherwise press Make)")}
              </label>
            </div>
            <p className="muted small" style={{ margin: 0 }}>
              {nova === "on"
                ? t("Connected to Maataa Workstation.")
                : nova === "off"
                  ? t("Not running. Start it (port 8787) and press Check.")
                  : t("Checking…")}{" "}
              {t(
                "Projects, chats and artifacts stay in this browser; Maataa Workstation has no place for them yet.",
              )}
            </p>
            <button type="button" onClick={() => void checkNova()} style={{ justifySelf: "start" }}>
              {t("Check")}
            </button>
          </fieldset>
          <button type="submit" className="primary" style={{ justifySelf: "end" }}>
            {t("Done")}
          </button>
        </form>
      </dialog>
    </div>
  );
}
