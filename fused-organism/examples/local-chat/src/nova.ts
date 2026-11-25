// Copies tasks to the Radheya board in Maataa Workstation (nova-console on
// 127.0.0.1:8787), reached through the dev server's /nova proxy. Optional:
// when nova isn't running, tasks simply stay in this browser.
import type { Task } from "./store";

const BASE = "/nova/api/radheya";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/** True when Maataa Workstation answers. */
export async function novaAvailable(): Promise<boolean> {
  try {
    await call<unknown>("");
    return true;
  } catch {
    return false;
  }
}

/** Creates the card if it doesn't exist yet; returns its id. */
export async function pushTask(task: Task, projectName: string): Promise<string> {
  if (task.novaId) return task.novaId;
  const card = await call<{ id: string }>("/cards", {
    method: "POST",
    body: JSON.stringify({
      title: task.title,
      body: `From MAATAA local chat · ${projectName}`,
      labels: ["maataa-chat", projectName],
    }),
  });
  return card.id;
}

/** Moves the card to done (or back to backlog). */
export async function setTaskDone(novaId: string, done: boolean): Promise<void> {
  await call(`/cards/${encodeURIComponent(novaId)}/move`, {
    method: "POST",
    body: JSON.stringify({ to: done ? "done" : "backlog" }),
  });
}

/** Archives the card. */
export async function archiveTask(novaId: string): Promise<void> {
  await call(`/cards/${encodeURIComponent(novaId)}`, { method: "DELETE" });
}

// ---- pictures, sound and video ------------------------------------------

export type MediaKind = "image" | "audio" | "video";

export interface NovaJob {
  id: string;
  status: "running" | "done" | "failed" | "cancelled";
  mediaIds: string[];
  error?: string | null;
  progress?: string | null;
}

/** Where a made file can be shown or downloaded from (through the proxy). */
export const mediaUrl = (id: string) => `/nova/api/media/${encodeURIComponent(id)}/file`;

async function novaCall<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch("/nova/api" + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
  return body as T;
}

const num = (v: unknown, fallback: number) => (typeof v === "number" && isFinite(v) ? v : fallback);

/** Starts making a picture, sound or video from a reply block's JSON. */
export function startMedia(kind: MediaKind, data: Record<string, unknown>): Promise<NovaJob> {
  const post = (path: string, body: unknown) =>
    novaCall<NovaJob>(path, { method: "POST", body: JSON.stringify(body) });
  if (kind === "image")
    return post("/images/generate", {
      prompt: String(data.prompt ?? ""),
      negative: typeof data.negative === "string" ? data.negative : undefined,
      width: num(data.width, 1024),
      height: num(data.height, 1024),
    });
  if (kind === "video")
    return post("/video/animate", { prompt: String(data.prompt ?? ""), seconds: num(data.seconds, 4) });
  const sound = data.kind === "voice" || data.kind === "sfx" ? data.kind : "music";
  if (sound === "voice")
    return post("/audio/voice", {
      text: String(data.text ?? data.prompt ?? ""),
      voice: typeof data.voice === "string" ? data.voice : undefined,
    });
  return post(`/audio/${sound}`, {
    prompt: String(data.prompt ?? ""),
    seconds: num(data.seconds, sound === "sfx" ? 8 : 20),
  });
}

export const getJob = (id: string) => novaCall<NovaJob>(`/images/jobs/${encodeURIComponent(id)}`);
export const cancelJob = (id: string) =>
  novaCall<unknown>(`/images/jobs/${encodeURIComponent(id)}/cancel`, { method: "POST", body: "{}" });
