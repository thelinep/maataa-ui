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
