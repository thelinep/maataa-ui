const STORAGE_KEY = "tlps:local-workspace:v1";
const SAMPLE_STATUSES = ["In progress", "In review", "Planned", "On track", "Blocked"];

function browserStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function emptyStore() {
  return { version: 1, routes: {}, events: [], savedViews: {} };
}

function readStore(storage = browserStorage()) {
  try {
    const parsed = JSON.parse(storage?.getItem(STORAGE_KEY) || "null");
    if (parsed?.version === 1 && parsed.routes && Array.isArray(parsed.events) && parsed.savedViews) {
      return parsed;
    }
  } catch {
    // A damaged or unavailable browser store starts a clean local preview session.
  }
  return emptyStore();
}

function writeStore(store, storage = browserStorage()) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

function newId() {
  return globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function initialRecords(page) {
  const name = page.name.replace(/(dashboard|workspace|manager|management|center|overview|list|board|planner|hub)/gi, "").trim() || page.family;
  const now = new Date().toISOString();
  return SAMPLE_STATUSES.map((status, index) => ({
    id: `sample-${page.id}-${index + 1}`,
    title: `${name} · Local item ${index + 1}`,
    status,
    owner: "Local demo",
    progress: [35, 70, 0, 100, 20][index],
    notes: "Sample record. Edit or replace it with local preview data.",
    createdAt: now,
    updatedAt: now,
    sample: true,
  }));
}

export function loadLocalRecords(page, storage) {
  const store = readStore(storage);
  if (Object.hasOwn(store.routes, page.route) && Array.isArray(store.routes[page.route]?.records)) {
    return store.routes[page.route].records;
  }
  const records = initialRecords(page);
  store.routes[page.route] = { records };
  writeStore(store, storage);
  return records;
}

export function saveLocalRecords(route, records, storage) {
  const store = readStore(storage);
  store.routes[route] = { ...(store.routes[route] || {}), records };
  return writeStore(store, storage);
}

export function replaceLocalRecords(route, imported, actor = "Local demo", storage) {
  if (!Array.isArray(imported) || imported.length > 1000) return false;
  const normalized = [];
  for (const item of imported) {
    if (!item || typeof item !== "object" || typeof item.title !== "string" || !item.title.trim()) return false;
    normalized.push({
      id: newId(),
      title: item.title.trim().slice(0, 160),
      status: typeof item.status === "string" && item.status.trim() ? item.status.trim().slice(0, 60) : "Planned",
      owner: typeof item.owner === "string" ? item.owner.trim().slice(0, 100) : actor,
      progress: Number.isFinite(Number(item.progress)) ? Math.max(0, Math.min(100, Number(item.progress))) : 0,
      notes: typeof item.notes === "string" ? item.notes.slice(0, 2000) : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sample: false,
    });
  }
  const store = readStore(storage);
  const now = new Date().toISOString();
  store.routes[route] = { ...(store.routes[route] || {}), records: normalized };
  store.events.unshift({ id: newId(), route, action: "Imported local records", detail: `${normalized.length} record(s)`, actor, createdAt: now });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage);
}

export function applyLocalAction(route, recordId, action, changes, actor = "Local demo", storage) {
  const store = readStore(storage);
  const records = store.routes[route]?.records || [];
  const current = records.find((record) => record.id === recordId);
  if (!current) return null;
  const now = new Date().toISOString();
  const updated = { ...current, ...changes, id: current.id, updatedAt: now, sample: false };
  store.routes[route] = { ...(store.routes[route] || {}), records: records.map((record) => record.id === recordId ? updated : record) };
  store.events.unshift({ id: newId(), route, action, detail: `${updated.title} · ${updated.status}`, actor, createdAt: now });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage) ? updated : null;
}

export function applyLocalBulkAction(route, recordIds, action, changes, actor = "Local demo", storage) {
  const store = readStore(storage);
  const records = store.routes[route]?.records || [];
  const ids = new Set(recordIds);
  const selected = records.filter((record) => ids.has(record.id));
  if (!selected.length) return false;
  const now = new Date().toISOString();
  store.routes[route] = {
    ...(store.routes[route] || {}),
    records: records.map((record) => ids.has(record.id) ? { ...record, ...changes, updatedAt: now, sample: false } : record),
  };
  store.events.unshift({ id: newId(), route, action, detail: `${selected.length} record(s)`, actor, createdAt: now });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage);
}

export function createLocalRecord(route, input, actor = "Local demo", storage) {
  const store = readStore(storage);
  const records = store.routes[route]?.records || [];
  const now = new Date().toISOString();
  const record = {
    id: newId(),
    title: input.title.trim(),
    status: input.status || "Planned",
    owner: input.owner?.trim() || actor,
    progress: Number.isFinite(input.progress) ? Math.max(0, Math.min(100, input.progress)) : 0,
    notes: input.notes?.trim() || "",
    createdAt: now,
    updatedAt: now,
    sample: false,
  };
  store.routes[route] = { ...(store.routes[route] || {}), records: [record, ...records] };
  store.events.unshift({ id: newId(), route, action: "Created local record", detail: record.title, actor, createdAt: now });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage) ? record : null;
}

export function createLocalActionRecord(route, input, action, actor = "Local demo", storage) {
  const store = readStore(storage);
  const records = store.routes[route]?.records || [];
  const now = new Date().toISOString();
  const record = {
    id: newId(),
    title: input.title.trim(),
    status: input.status || "Planned",
    owner: input.owner?.trim() || actor,
    progress: Number.isFinite(input.progress) ? Math.max(0, Math.min(100, input.progress)) : 0,
    notes: input.notes?.trim() || "",
    createdAt: now,
    updatedAt: now,
    sample: false,
  };
  store.routes[route] = { ...(store.routes[route] || {}), records: [record, ...records] };
  store.events.unshift({ id: newId(), route, action, detail: `${record.title} · ${record.status}`, actor, createdAt: now });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage) ? record : null;
}

export function updateLocalRecord(route, id, changes, actor = "Local demo", storage) {
  const store = readStore(storage);
  const records = store.routes[route]?.records || [];
  const current = records.find((record) => record.id === id);
  if (!current) return null;
  const now = new Date().toISOString();
  const updated = { ...current, ...changes, id: current.id, updatedAt: now, sample: false };
  store.routes[route] = { ...(store.routes[route] || {}), records: records.map((record) => record.id === id ? updated : record) };
  store.events.unshift({ id: newId(), route, action: "Updated local record", detail: updated.title, actor, createdAt: now });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage) ? updated : null;
}

export function deleteLocalRecords(route, ids, actor = "Local demo", storage) {
  const store = readStore(storage);
  const records = store.routes[route]?.records || [];
  const removed = records.filter((record) => ids.includes(record.id));
  const now = new Date().toISOString();
  store.routes[route] = { ...(store.routes[route] || {}), records: records.filter((record) => !ids.includes(record.id)) };
  if (removed.length) {
    store.events.unshift({ id: newId(), route, action: "Deleted local records", detail: `${removed.length} record(s)`, actor, createdAt: now });
    store.events = store.events.slice(0, 500);
  }
  return writeStore(store, storage);
}

export function addLocalEvent(route, action, detail, actor = "Local demo", storage) {
  const store = readStore(storage);
  store.events.unshift({ id: newId(), route, action, detail: detail || "", actor, createdAt: new Date().toISOString() });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage);
}

export function listLocalEvents(route, limit = 8, storage) {
  return readStore(storage).events.filter((event) => !route || event.route === route).slice(0, limit);
}

export function listLocalSavedViews(route, storage) {
  return readStore(storage).savedViews[route] || [];
}

export function saveLocalView(route, view, storage) {
  const store = readStore(storage);
  const views = store.savedViews[route] || [];
  const item = { id: newId(), name: view.name.trim(), search: view.search, status: view.status };
  store.savedViews[route] = [item, ...views].slice(0, 20);
  return writeStore(store, storage) ? item : null;
}

export function resetLocalRoute(route, page, storage) {
  const store = readStore(storage);
  store.routes[route] = { records: initialRecords(page) };
  store.events.unshift({ id: newId(), route, action: "Reset local sample data", detail: page.name, actor: "Local demo", createdAt: new Date().toISOString() });
  store.events = store.events.slice(0, 500);
  return writeStore(store, storage);
}
