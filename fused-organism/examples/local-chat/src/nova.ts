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

/**
 * Moves the card to Review when the task is ticked (or back to Backlog).
 * Workstation only lets a person move a card from Review to Done, and only
 * with evidence attached, so the last step happens on the board.
 */
export async function setTaskDone(novaId: string, done: boolean): Promise<void> {
  await call(`/cards/${encodeURIComponent(novaId)}/move`, {
    method: "POST",
    body: JSON.stringify({ to: done ? "review" : "backlog" }),
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

export async function novaCall<T>(path: string, init?: RequestInit): Promise<T> {
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

// ---- comparing image models ---------------------------------------------

export interface ImageStatus {
  reachable: boolean;
  checkpoints: string[];
  error?: string;
}

/** Whether ComfyUI is up, and which image models it has. */
export async function imageStatus(): Promise<ImageStatus> {
  const s = await novaCall<Partial<ImageStatus>>("/images/status");
  return { reachable: !!s.reachable, checkpoints: s.checkpoints ?? [], error: s.error };
}

/** Sends a picture to Workstation's library; returns its media id. */
export async function uploadPicture(dataUrl: string, name: string): Promise<string> {
  // Decoded here rather than with fetch(dataUrl): the desktop app's security
  // policy only lets the page connect to its own server.
  const [head, b64 = ""] = dataUrl.split(",", 2);
  const type = /^data:([^;,]+)/.exec(head ?? "")?.[1] ?? "application/octet-stream";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], { type });
  const res = await fetch("/nova/api/media", {
    method: "POST",
    headers: {
      "Content-Type": blob.type || "application/octet-stream",
      "X-File-Name": encodeURIComponent(name),
    },
    body: blob,
  });
  const body = (await res.json().catch(() => null)) as { id?: string; error?: string } | null;
  if (!res.ok || !body?.id) throw new Error(body?.error ?? `HTTP ${res.status}`);
  return body.id;
}

/** Image to image: the picture partly re-drawn to follow the prompt. */
export function startImageToImage(input: {
  mediaId: string;
  prompt: string;
  checkpoint: string;
  strength: number;
  seed: number;
}): Promise<NovaJob> {
  return novaCall<NovaJob>("/images/img2img", { method: "POST", body: JSON.stringify(input) });
}

// ---- studio: everything Workstation has made, and its job queue ----------

export interface MediaRecord {
  id: string;
  kind: "image" | "audio" | "video";
  mime: string;
  bytes: number;
  originalName: string;
  source: string;
  createdAt: string;
  provenance?: Record<string, unknown> | null;
}

export interface GenerationJob {
  id: string;
  type: string;
  status: "running" | "done" | "failed" | "cancelled";
  settings?: Record<string, unknown> | null;
  mediaIds: string[];
  error?: string | null;
  progress?: string | null;
  createdAt: string;
  finishedAt?: string | null;
}

/** Every picture, sound and video Workstation holds, newest first. */
export const listMedia = () => novaCall<MediaRecord[]>("/media");
/** Making jobs, newest first. */
export const listJobs = () => novaCall<GenerationJob[]>("/images/jobs");
export const deleteMedia = (id: string) =>
  novaCall<unknown>(`/media/${encodeURIComponent(id)}`, { method: "DELETE" });

/** The words a made file was made from, if Workstation kept them. */
export function promptOf(m: Pick<MediaRecord, "provenance">): string {
  const p = m.provenance ?? {};
  const words = p.prompt ?? p.text ?? p.lyrics;
  return typeof words === "string" ? words : "";
}

/** Which "make" a file came from, so "Make again" asks for the same kind. */
export function makeKindOf(m: MediaRecord, jobs: GenerationJob[]): MakeKind {
  const type = jobs.find((j) => j.id === m.provenance?.jobId)?.type ?? "";
  if (m.kind === "video") return "video";
  if (m.kind === "image") return "image";
  if (type === "audio-voice" || typeof m.provenance?.text === "string") return "voice";
  if (type === "audio-sfx") return "sfx";
  return "music";
}

export type MakeKind = "image" | "music" | "sfx" | "voice" | "video";

/** Starts a new make from the studio's form. */
export function startMake(kind: MakeKind, prompt: string, seconds?: number): Promise<NovaJob> {
  if (kind === "image") return startMedia("image", { prompt });
  if (kind === "video") return startMedia("video", { prompt, seconds: seconds ?? 4 });
  if (kind === "voice") return startMedia("audio", { kind: "voice", text: prompt });
  return startMedia("audio", { kind, prompt, ...(seconds ? { seconds } : {}) });
}

// ---- studio: the Radheya board -------------------------------------------

export const RADHEYA_COLUMNS = ["backlog", "ready", "doing", "review", "done", "blocked"] as const;
export type RadheyaColumn = (typeof RADHEYA_COLUMNS)[number];

export interface RadheyaCard {
  id: string;
  title: string;
  body: string;
  column: RadheyaColumn;
  labels: string[];
  assignee?: { kind: string; model?: string | null };
  notes?: { id?: string; text: string; at?: string; by?: string }[];
  evidence?: { id?: string; kind: string; url?: string | null; label?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface RadheyaView {
  columns: string[];
  board?: { wip?: Record<string, number> };
  cards: RadheyaCard[];
  running: { cardId: string; runId: string }[];
}

export const radheyaView = () => call<RadheyaView>("");
export const createCard = (input: { title: string; body?: string; column?: string; labels?: string[] }) =>
  call<RadheyaCard>("/cards", { method: "POST", body: JSON.stringify(input) });
export const updateCard = (id: string, input: { title: string; body?: string; labels?: string[] }) =>
  call<RadheyaCard>(`/cards/${encodeURIComponent(id)}`, { method: "POST", body: JSON.stringify(input) });
export const moveCard = (id: string, to: string) =>
  call<RadheyaCard>(`/cards/${encodeURIComponent(id)}/move`, {
    method: "POST",
    body: JSON.stringify({ to }),
  });
export const addCardNote = (id: string, text: string) =>
  call<RadheyaCard>(`/cards/${encodeURIComponent(id)}/notes`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
export const addCardLink = (id: string, url: string, label?: string) =>
  call<RadheyaCard>(`/cards/${encodeURIComponent(id)}/evidence`, {
    method: "POST",
    body: JSON.stringify({ url, label }),
  });
