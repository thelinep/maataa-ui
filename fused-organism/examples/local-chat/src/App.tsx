import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  LocalChat,
  LocaleProvider,
  SegmentedTabs,
  ThemePicker,
  ThumbMenu,
  builtInThemes,
  useThemePreference,
  type ChatCommand,
  createKeywordRetriever,
  formatContext,
  listLocalModels,
  useT,
  type ChatContext,
  type DocChunk,
  type LocalChatMessage,
  type LocalModelOptions,
} from "@maataa/ui";
import { appMessagesHi } from "./messages";

type ServerKind = "ollama" | "lmstudio" | "custom";

interface Settings {
  server: ServerKind;
  customUrl: string;
  model: string;
  language: "en-IN" | "hi-IN";
}

const STORAGE_KEY = "maataa-local-chat";
const DEFAULTS: Settings = {
  server: "ollama",
  customUrl: "http://localhost:8080",
  model: "",
  language: "en-IN",
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
  const ids = { server: useId(), url: useId(), model: useId(), language: useId() };
  const [tab, setTab] = useState("chat");
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState<{ tone: "ok" | "error" | "busy"; text: string }>({
    tone: "busy",
    text: "",
  });
  const [chatLog, setChatLog] = useState<LocalChatMessage[]>([]);
  const [docsLog, setDocsLog] = useState<LocalChatMessage[]>([]);
  const [docs, setDocs] = useState<DocChunk[] | null>(null);
  const [resetCount, setResetCount] = useState(0);
  const theme = useThemePreference();
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

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
      setSettings((s) => (names.includes(s.model) ? s : { ...s, model: names[0] }));
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

  useEffect(() => {
    fetch("/maataa-docs.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: { chunks: DocChunk[] }) => setDocs(json.chunks))
      .catch(() => setDocs([]));
  }, []);

  const search = useMemo(() => (docs ? createKeywordRetriever(docs) : null), [docs]);
  const getContext = useCallback(
    (question: string): ChatContext => {
      const hits = search ? search(question, 6) : [];
      if (!hits.length) return { text: "Passages from the MAATAA UI docs: none matched this question." };
      return {
        text: "Passages from the MAATAA UI docs:\n\n" + formatContext(hits, 7000),
        sources: hits.map((h) => ({ title: h.chunk.title })),
      };
    },
    [search],
  );

  const languageLine =
    settings.language === "hi-IN"
      ? "Reply in Hindi (Devanagari script). Keep code, component names, props and commands in English."
      : "Reply in English.";
  const model: LocalModelOptions | undefined = settings.model
    ? { ...conn, model: settings.model }
    : undefined;

  const newConversation = () => {
    if (tab === "chat") setChatLog([]);
    else setDocsLog([]);
    setResetCount((n) => n + 1);
  };
  const toggleLanguage = () => set("language", settings.language === "hi-IN" ? "en-IN" : "hi-IN");
  const themeNames = ["system", ...builtInThemes.map((th) => th.name)];
  const nextTheme = () =>
    theme.setChoice(themeNames[(themeNames.indexOf(theme.choice) + 1) % themeNames.length]!);

  const commands: ChatCommand[] = [
    { name: "chat", description: t("Switch to free chat"), run: () => setTab("chat") },
    { name: "docs", description: t("Switch to MAATAA UI docs"), run: () => setTab("docs") },
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

  const label = { fontSize: 13, fontWeight: 600 } as const;
  const control = {
    minHeight: 36,
    padding: "4px 8px",
    borderRadius: 6,
    border: "1px solid var(--maataa-color-border-control, #9C7C66)",
    background: "var(--maataa-color-background-primary, #FFFAF0)",
    color: "inherit",
    font: "inherit",
  } as const;
  const statusColor =
    status.tone === "ok"
      ? "var(--maataa-color-interactive-success, #2D6A3E)"
      : status.tone === "error"
        ? "var(--maataa-color-interactive-error, #8B3A2B)"
        : "var(--maataa-color-text-secondary, #6B5546)";

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16, display: "grid", gap: 12 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22, flex: 1 }}>{t("MAATAA local chat")}</h1>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <label htmlFor={ids.language} style={label}>
            {t("Language")}
          </label>
          <select
            id={ids.language}
            value={settings.language}
            onChange={(e) => set("language", e.target.value as Settings["language"])}
            style={control}
          >
            <option value="en-IN">English</option>
            <option value="hi-IN" lang="hi">
              हिन्दी
            </option>
          </select>
        </span>
        <ThemePicker />
      </header>

      <main style={{ display: "grid", gap: 12 }}>
        <details
          style={{
            border: "1px solid var(--maataa-color-border-primary, #D4AF9F)",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            {t("Model")}: {settings.model || t("none")} ·{" "}
            <span style={{ color: statusColor }}>{status.text}</span>
          </summary>
          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <label htmlFor={ids.server} style={label}>
                {t("Model server")}
              </label>
              <select
                id={ids.server}
                value={settings.server}
                onChange={(e) => set("server", e.target.value as ServerKind)}
                style={control}
              >
                <option value="ollama">{t("Ollama on this computer")}</option>
                <option value="lmstudio">{t("LM Studio on this computer")}</option>
                <option value="custom">{t("Other OpenAI-compatible server")}</option>
              </select>
            </div>
            {settings.server === "custom" && (
              <div style={{ display: "grid", gap: 4 }}>
                <label htmlFor={ids.url} style={label}>
                  {t("Server address")}
                </label>
                <input
                  id={ids.url}
                  value={settings.customUrl}
                  onChange={(e) => set("customUrl", e.target.value)}
                  style={control}
                />
              </div>
            )}
            <div style={{ display: "grid", gap: 4 }}>
              <label htmlFor={ids.model} style={label}>
                {t("Model")}
              </label>
              <select
                id={ids.model}
                value={settings.model}
                disabled={!models.length}
                onChange={(e) => set("model", e.target.value)}
                style={control}
              >
                {!models.length && <option value="">{t("none")}</option>}
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                onClick={() => void checkServer()}
                style={{ ...control, cursor: "pointer" }}
              >
                {t("Check again")}
              </button>
            </div>
          </div>
          <p role="status" style={{ margin: "8px 0 0", color: statusColor, fontSize: 13 }}>
            {status.text}
          </p>
        </details>

        <SegmentedTabs
          label={t("Chat mode")}
          value={tab}
          onChange={setTab}
          tabs={[
            {
              id: "chat",
              label: t("Chat"),
              content: (
                <LocalChat
                  key={`chat-${settings.language}-${resetCount}`}
                  commands={commands}
                  title={t("Chat with your local model")}
                  hideTitle
                  model={model}
                  systemPrompt={`You are a helpful assistant running locally on the user's own computer. Be clear and concise. ${languageLine}`}
                  initialMessages={chatLog}
                  onMessagesChange={setChatLog}
                  starterQuestions={[
                    t("Write a call sheet note for a 6 am shoot"),
                    t("Explain golden hour in two lines"),
                  ]}
                  height="max(360px, calc(100vh - 360px))"
                />
              ),
            },
            {
              id: "docs",
              label: t("MAATAA UI docs"),
              content: (
                <LocalChat
                  key={`docs-${settings.language}-${resetCount}`}
                  commands={commands}
                  title={t("Ask about MAATAA UI")}
                  hideTitle
                  assistantName={t("Docs helper")}
                  model={model}
                  getContext={getContext}
                  systemPrompt={`You are the MAATAA UI docs helper. MAATAA UI is a React component library (packages @maataa/ui, @maataa/tokens). Answer using only the numbered passages you are given and cite them like [1]. If they do not cover the question, say so plainly. When useful, show the import line and a short TSX example using the documented props. ${languageLine}`}
                  initialMessages={docsLog}
                  onMessagesChange={setDocsLog}
                  starterQuestions={[
                    t("How do I add a theme picker?"),
                    t("Which props does DatePicker take?"),
                    t("How do I show the app in Hindi?"),
                  ]}
                  height="max(360px, calc(100vh - 360px))"
                />
              ),
            },
          ]}
        />
        {docs && docs.length === 0 && tab === "docs" && (
          <p style={{ margin: 0, color: statusColor }}>
            {t("The docs index is missing. Start the app with npm run chat:local to build it.")}
          </p>
        )}
        <ThumbMenu
          label={t("Quick actions")}
          haptics
          items={[
            { id: "new", label: t("New conversation"), icon: "＋", onSelect: newConversation },
            {
              id: "mode",
              label: tab === "chat" ? t("MAATAA UI docs") : t("Chat"),
              icon: tab === "chat" ? "📘" : "💬",
              onSelect: () => setTab(tab === "chat" ? "docs" : "chat"),
            },
            {
              id: "lang",
              label: settings.language === "hi-IN" ? "English" : "हिन्दी",
              icon: "अ",
              onSelect: toggleLanguage,
            },
            { id: "theme", label: t("Next theme"), icon: "◐", onSelect: nextTheme },
            { id: "check", label: t("Check again"), icon: "↻", onSelect: () => void checkServer() },
          ]}
        />
      </main>
    </div>
  );
}
