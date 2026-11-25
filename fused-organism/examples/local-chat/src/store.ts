// Projects, conversations, artifacts and tasks, kept in this browser
// (IndexedDB). Nothing here leaves the computer; nova.ts optionally copies
// tasks to Maataa Workstation.
import type { LocalChatMessage } from "@maataa/ui";

export interface ProjectFile {
  name: string;
  text: string;
}

export interface Project {
  id: string;
  name: string;
  /** Added to the system prompt for every chat in the project. */
  instructions: string;
  files: ProjectFile[];
  /** "docs" = answers from the MAATAA UI docs index. */
  kind?: "docs";
  createdAt: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  messages: LocalChatMessage[];
  updatedAt: string;
}

export interface ArtifactVersion {
  content: string;
  at: string;
}

export interface Artifact {
  id: string;
  projectId: string;
  conversationId: string;
  title: string;
  /** "html", "svg", "markdown" or a programming language */
  type: string;
  versions: ArtifactVersion[];
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
  createdAt: string;
  /** The Radheya card id in Maataa Workstation, once copied there. */
  novaId?: string;
}

export interface Data {
  projects: Project[];
  conversations: Conversation[];
  artifacts: Artifact[];
  tasks: Task[];
}

type Kind = keyof Data;
const KINDS: Kind[] = ["projects", "conversations", "artifacts", "tasks"];
const DB_NAME = "maataa-local-chat";

export const now = () => new Date().toISOString();
export const newId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const DEFAULT_PROJECTS: Project[] = [
  { id: "general", name: "General", instructions: "", files: [], createdAt: "2026-01-01T00:00:00.000Z" },
  {
    id: "docs",
    name: "MAATAA UI docs",
    instructions: "",
    files: [],
    kind: "docs",
    createdAt: "2026-01-01T00:00:01.000Z",
  },
];

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      for (const kind of KINDS)
        if (!req.result.objectStoreNames.contains(kind))
          req.result.createObjectStore(kind, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
  return dbPromise;
}

/** Everything saved so far, with the two starter projects if none exist. */
export async function loadAll(): Promise<Data> {
  const db = await openDb();
  const data: Data = { projects: [], conversations: [], artifacts: [], tasks: [] };
  if (db) {
    await Promise.all(
      KINDS.map(
        (kind) =>
          new Promise<void>((resolve) => {
            const req = db.transaction(kind).objectStore(kind).getAll();
            req.onsuccess = () => {
              (data[kind] as unknown[]) = req.result;
              resolve();
            };
            req.onerror = () => resolve();
          }),
      ),
    );
  }
  for (const p of DEFAULT_PROJECTS) if (!data.projects.some((x) => x.id === p.id)) data.projects.push(p);
  data.projects.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  data.conversations.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return data;
}

/** Saves one record. Fails quietly (the app keeps working, unsaved). */
export async function put<K extends Kind>(kind: K, record: Data[K][number]): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction(kind, "readwrite");
    tx.objectStore(kind).put(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
    tx.onabort = () => resolve(false);
  });
}

export async function remove(kind: Kind, id: string): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction(kind, "readwrite");
    tx.objectStore(kind).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

/** Splits project files into passages for the keyword search. */
export function fileChunks(project: Project) {
  return project.files.flatMap((f, fi) => {
    const parts = f.text.split(/\n{2,}/);
    const chunks: { id: string; title: string; text: string }[] = [];
    let buf = "";
    for (const part of parts) {
      if (buf && buf.length + part.length > 900) {
        chunks.push({ id: `${fi}-${chunks.length}`, title: f.name, text: buf });
        buf = "";
      }
      buf = buf ? `${buf}\n\n${part}` : part;
    }
    if (buf.trim()) chunks.push({ id: `${fi}-${chunks.length}`, title: f.name, text: buf });
    return chunks;
  });
}

/** A short title from the first question. */
export function titleFrom(messages: LocalChatMessage[], fallback: string): string {
  const first = messages
    .find((m) => m.role === "user")
    ?.content.trim()
    .replace(/\s+/g, " ");
  if (!first) return fallback;
  return first.length > 60 ? `${first.slice(0, 57)}…` : first;
}
