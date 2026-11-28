// Maataa Workstation as the chat's backend: its smart chat (memory, added
// sources, knowledge, Think, follow-ups), its saved sessions, and its skills.
// Everything goes through the /nova proxy (dev server or desktop app).
import type { ChatTransport, ChatTransportEvent, LocalChatMessage } from "@maataa/ui";
import { uploadPicture } from "./nova";
import type { Conversation } from "./store";

const API = "/nova/api";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
  return body as T;
}

// ---- smart chat ---------------------------------------------------------

/** Pictures already sent to Workstation, so a picture is uploaded once. */
const uploaded = new Map<string, Promise<string>>();
const mediaIdFor = (dataUrl: string) => {
  let id = uploaded.get(dataUrl);
  if (!id) {
    id = uploadPicture(dataUrl, "chat-picture.png");
    uploaded.set(dataUrl, id);
    id.catch(() => uploaded.delete(dataUrl));
  }
  return id;
};

export interface TurnOptions {
  model: string;
  sessionId: string;
  /** Let thinking models reason before answering (slower). */
  think: boolean;
}

/**
 * A chat transport that asks Workstation's /api/chat/turn. It streams the
 * reply and reports which passages it read, what it is doing, and suggested
 * follow-ups.
 */
export function workstationTransport(opts: TurnOptions): ChatTransport {
  return async function* (messages, signal) {
    const history = await Promise.all(
      messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map(async (m) => ({
          role: m.role,
          content: m.content,
          ...(m.images?.length ? { mediaIds: await Promise.all(m.images.map(mediaIdFor)) } : {}),
        })),
    );
    // Passages from Workstation's knowledge collections, as its own screen sends them.
    const question = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    let retrieved: { docName: string; text: string }[] = [];
    try {
      const found = await call<{ results?: { docName?: string; text?: string }[] }>("/knowledge/search", {
        method: "POST",
        body: JSON.stringify({ query: question, topK: 4 }),
        signal,
      });
      retrieved = (found.results ?? [])
        .filter((r) => r.text)
        .map((r) => ({ docName: String(r.docName ?? "document"), text: String(r.text) }));
    } catch {
      retrieved = [];
    }
    if (retrieved.length)
      yield {
        type: "sources",
        sources: [...new Set(retrieved.map((r) => r.docName))].map((title) => ({ title })),
      };
    const res = await fetch(`${API}/chat/turn`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: opts.model,
        sessionId: opts.sessionId,
        messages: history,
        think: opts.think,
        memory: true,
        followups: true,
        computer: false,
        retrieved,
        // The chat's system message: its formats (charts, scenes, …) and any
        // project or docs passages. Workstation versions that know the
        // `instructions` field add it to their system prompt; older ones
        // ignore it, and replies come back as plain text.
        instructions: messages
          .filter((m) => m.role === "system")
          .map((m) => m.content)
          .join("\n\n"),
      }),
    });
    if (!res.ok || !res.body) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `Maataa Workstation answered ${res.status}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let lastStep = "";
    const events = function* (line: string): Generator<string | ChatTransportEvent> {
      if (!line.trim()) return;
      let ev: Record<string, unknown>;
      try {
        ev = JSON.parse(line) as Record<string, unknown>;
      } catch {
        return;
      }
      if (ev.type === "token" && typeof ev.text === "string") yield ev.text;
      else if (ev.type === "error") throw new Error(String(ev.error ?? "Maataa Workstation couldn't reply."));
      else if (ev.type === "context" && Array.isArray(ev.sources)) {
        const sources = (ev.sources as Record<string, unknown>[])
          .map((s) => ({ title: String(s.label ?? s.title ?? s.docName ?? "source") }))
          .filter((s) => s.title);
        if (sources.length) yield { type: "sources", sources };
      } else if (ev.type === "steps" && Array.isArray(ev.steps)) {
        const steps = ev.steps as { label?: string; detail?: string }[];
        const last = steps[steps.length - 1];
        const text = String(last?.label ?? "");
        if (text && text !== lastStep) {
          lastStep = text;
          yield { type: "status", text };
        }
      } else if (ev.type === "followups" && Array.isArray(ev.items)) {
        yield { type: "followups", items: (ev.items as unknown[]).map(String) };
      }
    };
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) yield* events(line);
    }
    yield* events(buffer);
  };
}

// ---- saved sessions -------------------------------------------------------

/** A Workstation session as its store keeps it (other fields are kept as they are). */
export interface WorkstationSession {
  id: string;
  title: string;
  modelId?: string;
  tags?: string[];
  messages: { id: string; role: "user" | "assistant"; content: string; createdAt?: string }[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

const PROJECT_TAG = "project:";
const OUR_TAG = "maataa-chat";

export async function listSessions(): Promise<WorkstationSession[]> {
  const all = await call<WorkstationSession[]>("/store/sessions");
  return Array.isArray(all) ? all.filter((s) => s && s.id && Array.isArray(s.messages) && !s.archived) : [];
}

/** A Workstation session as a chat conversation. Untagged ones go to `fallbackProject`. */
export function toConversation(s: WorkstationSession, fallbackProject: string): Conversation {
  const tag = (s.tags ?? []).find((t) => t.startsWith(PROJECT_TAG));
  return {
    id: s.id,
    projectId: tag ? tag.slice(PROJECT_TAG.length) : fallbackProject,
    title: s.title || "Chat",
    messages: s.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ id: m.id, role: m.role, content: String(m.content ?? "") })),
    updatedAt: s.updatedAt ?? s.createdAt ?? new Date(0).toISOString(),
  };
}

/**
 * Saves a conversation as a Workstation session, keeping any fields the old
 * screen added. Pictures stay in the chat; the session keeps the words.
 */
export async function saveSession(
  c: Conversation,
  model: string,
  previous: WorkstationSession | undefined,
): Promise<WorkstationSession> {
  const now = new Date().toISOString();
  const tags = [
    ...(previous?.tags ?? []).filter((t) => !t.startsWith(PROJECT_TAG) && t !== OUR_TAG),
    OUR_TAG,
    `${PROJECT_TAG}${c.projectId}`,
  ];
  const record: WorkstationSession = {
    pinned: false,
    archived: false,
    preferences: {},
    snapshots: [],
    forkedFrom: null,
    excludedDocIds: [],
    createdAt: now,
    ...previous,
    id: c.id,
    title: c.title,
    modelId: model || previous?.modelId,
    tags,
    updatedAt: c.updatedAt || now,
    messages: c.messages
      .filter((m: LocalChatMessage) => !m.error && (m.content || m.images?.length))
      .map((m: LocalChatMessage) => {
        const old = previous?.messages.find((x) => x.id === m.id);
        return {
          ...(old ?? {}),
          id: m.id,
          role: m.role,
          content: m.content || (m.images?.length ? "(picture)" : ""),
          createdAt: old?.createdAt ?? now,
        };
      }),
  };
  return call<WorkstationSession>("/store/sessions", { method: "PUT", body: JSON.stringify(record) });
}

export const deleteSession = (id: string) =>
  call<{ ok: boolean }>(`/store/sessions/${encodeURIComponent(id)}`, { method: "DELETE" });

// ---- skills -----------------------------------------------------------------

export interface Skill {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
}

/** The skills that really run (Workstation's REAL_SKILL_IDS), in a useful order. */
export const RUNNABLE_SKILLS = [
  "skl_callsheet",
  "skl_shotlist",
  "skl_treatment",
  "skl_translate",
  "skl_summarize",
  "skl_pptx",
  "skl_webfetch",
  "skl_filesearch",
  "skl_codelint",
];

export async function listSkills(): Promise<Skill[]> {
  const all = await call<Skill[]>("/store/skills");
  return (Array.isArray(all) ? all : [])
    .filter((s) => s.enabled !== false && RUNNABLE_SKILLS.includes(s.id))
    .sort((a, b) => RUNNABLE_SKILLS.indexOf(a.id) - RUNNABLE_SKILLS.indexOf(b.id));
}

export interface SkillRun {
  result: { markdown?: string; summary?: string; data?: unknown; kind?: string; [k: string]: unknown };
  output?: { id: string; libraryPath?: string } | null;
}

export const runSkill = (id: string, inputs: Record<string, unknown>) =>
  call<SkillRun>(`/skills/${encodeURIComponent(id)}/run`, {
    method: "POST",
    body: JSON.stringify({ inputs }),
  });
