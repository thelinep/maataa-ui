import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  applyLocalAction,
  applyLocalBulkAction,
  createLocalActionRecord,
  createLocalRecord,
  deleteLocalRecords,
  listLocalEvents,
  listLocalSavedViews,
  loadLocalRecords,
  replaceLocalRecords,
  resetLocalRoute,
  saveLocalView,
  updateLocalRecord,
} from "./localWorkspaceStore.mjs";
import "./local-workspace.css";

const STATUSES = ["Planned", "In progress", "In review", "On track", "Blocked", "Submitted", "Approved", "Needs changes", "Completed"];

function downloadFile(filename, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function actionStatus(action) {
  if (/approve|accept|verify/i.test(action)) return "Approved";
  if (/reject|return|changes/i.test(action)) return "Needs changes";
  if (/complete|wrap|finish|close/i.test(action)) return "Completed";
  if (/start|launch|activate|begin|check.?in/i.test(action)) return "In progress";
  if (/submit|file|publish|capture|report|send|upload/i.test(action)) return "Submitted";
  return "In review";
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function useDialogFocus(onClose) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement;
    const root = dialogRef.current;
    const focusable = () => Array.from(root?.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)") || []);
    focusable()[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items.at(-1)?.focus();
      } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
        event.preventDefault();
        items[0]?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);
  return dialogRef;
}

export default function LocalWorkspace({ page, role, navigate, relatedRoutes = [] }) {
  const [records, setRecords] = useState(() => loadLocalRecords(page));
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [savedViews, setSavedViews] = useState(() => listLocalSavedViews(page.route));
  const [viewName, setViewName] = useState("");
  const [editing, setEditing] = useState(null);
  const [runningAction, setRunningAction] = useState("");
  const [actionRecordId, setActionRecordId] = useState("");
  const [actionNote, setActionNote] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const importRef = useRef(null);

  const actor = role?.label || "Local demo";
  const filtered = useMemo(() => records.filter((record) => {
    const matchesSearch = !search || `${record.title} ${record.owner} ${record.status} ${record.notes}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (status === "all" || record.status === status);
  }), [records, search, status]);
  const events = listLocalEvents(page.route, 6);
  const appName = page.family;
  const completedCount = records.filter((record) => ["Approved", "Completed"].includes(record.status)).length;
  const openCount = records.filter((record) => !["Approved", "Completed"].includes(record.status)).length;
  const progress = records.length ? Math.round(records.reduce((sum, record) => sum + Number(record.progress || 0), 0) / records.length) : 0;

  function createRecord(values) {
    const record = createLocalRecord(page.route, values, actor);
    if (!record) {
      setError("Could not save this record in local browser storage.");
      return;
    }
    setRecords((current) => [record, ...current]);
    setEditing(null);
    setNotice("Record saved in this browser.");
    setError("");
  }

  function updateRecord(id, values) {
    const updated = updateLocalRecord(page.route, id, values, actor);
    if (!updated) {
      setError("Could not save this change in local browser storage.");
      return;
    }
    setRecords((current) => current.map((record) => record.id === id ? updated : record));
    setEditing(null);
    setNotice("Changes saved in this browser.");
    setError("");
  }

  function removeRecords(ids) {
    if (!ids.length || !window.confirm(`Delete ${ids.length} local record${ids.length === 1 ? "" : "s"}?`)) return;
    if (!deleteLocalRecords(page.route, ids, actor)) {
      setError("Could not delete these records from local browser storage.");
      return;
    }
    setRecords((current) => current.filter((record) => !ids.includes(record.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
    setNotice(`${ids.length} local record${ids.length === 1 ? "" : "s"} deleted.`);
    setError("");
  }

  function runAction(event) {
    event.preventDefault();
    let target = records.find((record) => record.id === actionRecordId) || records.find((record) => selected.includes(record.id)) || records[0];
    const nextStatus = actionStatus(runningAction);
    if (!target) {
      target = createLocalActionRecord(page.route, { title: `${page.name} · ${runningAction}`, status: nextStatus, progress: nextStatus === "Completed" || nextStatus === "Approved" ? 100 : 35, notes: actionNote }, runningAction, actor);
      if (!target) {
        setError("The action could not create a local record. Browser storage may be full or unavailable.");
        return;
      }
      setRecords((current) => [target, ...current]);
    } else {
      const updated = applyLocalAction(page.route, target.id, runningAction, {
        status: nextStatus,
        progress: nextStatus === "Completed" || nextStatus === "Approved" ? 100 : Math.max(target.progress || 0, 35),
        notes: actionNote ? `${target.notes ? `${target.notes}\n` : ""}${runningAction}: ${actionNote}` : target.notes,
      }, actor);
      if (!updated) {
        setError("The action could not be saved in local browser storage.");
        return;
      }
      target = updated;
      setRecords((current) => current.map((record) => record.id === updated.id ? updated : record));
    }
    if (/dpr|report|export/i.test(runningAction)) {
      downloadFile(`${page.id}-local-report.json`, JSON.stringify({ kind: "LOCAL_PREVIEW_REPORT", route: page.route, action: runningAction, record: target, generatedAt: new Date().toISOString() }, null, 2), "application/json");
    }
    setRunningAction("");
    setActionNote("");
    setActionRecordId("");
    setError("");
    setNotice(`${runningAction} recorded locally. No external service was contacted.`);
  }

  function saveView() {
    const item = saveLocalView(page.route, { name: viewName, search, status });
    if (!item) {
      setError("Enter a view name and make sure browser storage is available.");
      return;
    }
    setSavedViews((current) => [item, ...current].slice(0, 20));
    setViewName("");
    setError("");
    setNotice("View saved in this browser.");
  }

  function exportRecords(format) {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "json") {
      downloadFile(`${page.id}-local-records-${stamp}.json`, JSON.stringify({ route: page.route, exportedAt: new Date().toISOString(), records }, null, 2), "application/json");
      return;
    }
    const columns = ["title", "status", "owner", "progress", "notes", "updatedAt"];
    const csv = [columns.join(","), ...records.map((record) => columns.map((key) => {
      let value = String(record[key] ?? "");
      if (/^[\s]*[=+\-@]/.test(value)) value = `'${value}`;
      return `"${value.replaceAll('"', '""')}"`;
    }).join(","))].join("\n");
    downloadFile(`${page.id}-local-records-${stamp}.csv`, csv, "text/csv");
  }

  async function importRecords(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = Array.isArray(parsed) ? parsed : parsed?.records;
      if (!Array.isArray(imported)) throw new Error("The JSON file needs a records array.");
      if (!window.confirm(`Replace this screen's ${records.length} local records with ${imported.length} imported records?`)) return;
      if (!replaceLocalRecords(page.route, imported, actor)) throw new Error("The records could not be saved. Check the JSON fields and available browser storage.");
      setRecords(loadLocalRecords(page));
      setSelected([]);
      setNotice(`${imported.length} records imported into this browser.`);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read this JSON file.");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  function resetRoute() {
    if (!window.confirm(`Reset ${page.name} to its five local sample records?`)) return;
    if (!resetLocalRoute(page.route, page)) {
      setError("Could not reset local data.");
      return;
    }
    setRecords(loadLocalRecords(page));
    setSelected([]);
    setSearch("");
    setStatus("all");
    setNotice("Local sample data restored.");
    setError("");
  }

  function openAction(action) {
    setRunningAction(action);
    setActionRecordId(selected[0] || records[0]?.id || "");
    setActionNote("");
  }

  const primaryActions = page.primaryActions.slice(0, 4);

  return <div className="local-workspace">
    <nav className="route-breadcrumb" aria-label="Breadcrumb">
      <button type="button" onClick={() => navigate("/mobile/017/home-dashboard")}>Workspace</button><span>/</span><button type="button" onClick={() => navigate("/mobile/017/home-dashboard")}>{appName}</button><span>/</span><b>{page.name}</b>
    </nav>
    <header className="local-workspace-heading">
      <div><span className="local-eyebrow">{page.family.toUpperCase()} · LOCAL WORKSPACE</span><h1>{page.name}</h1><p>Manage records and actions in this browser. This local workspace does not contact hosted services.</p></div>
      <div className="local-heading-actions"><button type="button" className="local-button local-button-primary" onClick={() => setEditing({ mode: "create", values: { title: "", owner: actor, status: "Planned", progress: 0, notes: "" } })}>＋ New record</button>{primaryActions[0] && <button type="button" className="local-button" onClick={() => openAction(primaryActions[0])}>{primaryActions[0]}</button>}</div>
    </header>

    <div className="local-mode-banner"><span className="local-mode-dot"/><div><b>Local-only data</b><span>Saved in this browser on this device. No company account, server, email, payment, or external provider is connected.</span></div><span className="local-mode-role">{actor}</span></div>
    {notice && <div className="local-notice" role="status" aria-live="polite">{notice}<button type="button" aria-label="Dismiss notice" onClick={() => setNotice("")}>×</button></div>}
    {error && <div className="local-error" role="alert">{error}</div>}

    <section className="local-metrics" aria-label="Local workspace summary">
      <article><span>Local records</span><strong>{records.length}</strong><small>Saved for this route</small></article>
      <article><span>Open items</span><strong>{openCount}</strong><small>Not yet completed or approved</small></article>
      <article><span>Average progress</span><strong>{progress}%</strong><small>{completedCount} completed or approved</small></article>
    </section>

    <div className="local-workspace-grid">
      <section className="local-records-panel" aria-labelledby="local-records-title">
        <div className="local-panel-heading"><div><span className="local-eyebrow">{page.family.toUpperCase()}</span><h2 id="local-records-title">{page.name} records</h2><p>{filtered.length} shown · {records.length} stored locally</p></div><div className="local-export-buttons"><button type="button" onClick={() => importRef.current?.click()}>Import JSON</button><input ref={importRef} className="local-file-input" type="file" accept="application/json,.json" aria-label="Import local records from JSON" onChange={(event) => importRecords(event.target.files?.[0])}/><button type="button" onClick={() => exportRecords("csv")}>Export CSV</button><button type="button" onClick={() => exportRecords("json")}>Export JSON</button></div></div>
        <div className="local-controls">
          <label>Search records<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, owner, notes…" /></label>
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button type="button" className="local-button" onClick={() => setShowDetails((current) => !current)}>{showDetails ? "Compact view" : "Show details"}</button>
          <button type="button" className="local-button" onClick={resetRoute}>Reset samples</button>
        </div>
        <div className="local-saved-views">
          <label>Saved views<select value="" onChange={(event) => { const item = savedViews.find((view) => view.id === event.target.value); if (item) { setSearch(item.search); setStatus(item.status); } }}><option value="">Choose saved view</option>{savedViews.map((view) => <option key={view.id} value={view.id}>{view.name}</option>)}</select></label>
          <input aria-label="Name for saved view" value={viewName} onChange={(event) => setViewName(event.target.value)} placeholder="Name current filter" />
          <button type="button" className="local-button" disabled={!viewName.trim()} onClick={saveView}>Save view</button>
        </div>
        {selected.length > 0 && <div className="local-bulk-bar"><span>{selected.length} selected</span><button type="button" onClick={() => {
          const updatedAt = new Date().toISOString();
          const next = records.map((record) => selected.includes(record.id) ? { ...record, status: "Completed", progress: 100, updatedAt, sample: false } : record);
          if (applyLocalBulkAction(page.route, selected, "Bulk complete", { status: "Completed", progress: 100 }, actor)) {
            setRecords(next);
            setError("");
            setNotice(`${selected.length} records marked complete locally.`);
            setSelected([]);
          } else setError("Could not save the bulk update in local browser storage.");
        }}>Mark complete</button><button type="button" onClick={() => removeRecords(selected)}>Delete selected</button><button type="button" onClick={() => setSelected([])}>Clear selection</button></div>}
        <div className="local-table-scroll"><table className={showDetails ? "local-record-table" : "local-record-table compact"}><thead><tr><th><input type="checkbox" aria-label="Select all visible records" checked={filtered.length > 0 && filtered.every((record) => selected.includes(record.id))} onChange={(event) => setSelected(event.target.checked ? filtered.map((record) => record.id) : [])}/></th><th>Record</th><th>Status</th><th>Owner</th><th>Progress</th>{showDetails && <th>Notes / updated</th>}<th>Actions</th></tr></thead><tbody>
          {filtered.map((record) => <tr key={record.id}>
            <td><input type="checkbox" aria-label={`Select ${record.title}`} checked={selected.includes(record.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...new Set([...current, record.id])] : current.filter((id) => id !== record.id))}/></td>
            <td><b>{record.title}</b>{record.sample && <small className="local-sample-tag">Sample</small>}</td>
            <td><span className={`local-status local-status-${record.status.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{record.status}</span></td>
            <td>{record.owner}</td><td><span className="local-progress"><i style={{ width: `${record.progress}%` }}/></span><small>{record.progress}%</small></td>
            {showDetails && <td className="local-notes-cell"><span>{record.notes || "—"}</span><small>{formatDate(record.updatedAt)}</small></td>}
            <td className="local-row-actions"><button type="button" onClick={() => setEditing({ mode: "edit", id: record.id, values: { ...record } })}>Edit</button><button type="button" onClick={() => removeRecords([record.id])}>Delete</button></td>
          </tr>)}
          {!filtered.length && <tr><td colSpan={showDetails ? 7 : 6} className="local-empty-row">No matching records. Change the filter or create a local record.</td></tr>}
        </tbody></table></div>
        <p className="local-data-disclaimer">This is a local development workspace. Do not enter confidential or production data.</p>
      </section>

      <aside className="local-side-column">
        <section className="local-side-panel"><div className="local-panel-heading"><div><span className="local-eyebrow">LOCAL SIMULATOR</span><h2>Available actions</h2></div></div>{primaryActions.length ? primaryActions.map((action) => <button type="button" className="local-action" key={action} onClick={() => openAction(action)}><span>{action}</span><b>→</b></button>) : <p className="local-muted">No route actions are listed in the manifest.</p>}<p className="local-side-note">Actions change local records and create a local history entry. External systems are not called.</p></section>
        <section className="local-side-panel"><div className="local-panel-heading"><div><span className="local-eyebrow">THIS ROUTE</span><h2>Related screens</h2></div></div>{relatedRoutes.length ? relatedRoutes.map((item) => <button type="button" className="local-related" key={item.route} onClick={() => navigate(item.route)}><span><b>{item.name}</b><small>{item.family}</small></span><i>→</i></button>) : <p className="local-muted">Use the workspace navigation to open another screen.</p>}</section>
        <section className="local-side-panel"><div className="local-panel-heading"><div><span className="local-eyebrow">LOCAL ACTIVITY</span><h2>Recent changes</h2></div></div>{events.length ? <ol className="local-event-list">{events.map((event) => <li key={event.id}><b>{event.action}</b><span>{event.detail}</span><small>{event.actor} · {formatDate(event.createdAt)}</small></li>)}</ol> : <p className="local-muted">Local edits and actions will appear here.</p>}</section>
      </aside>
    </div>

    {editing && <RecordDialog initial={editing.values} mode={editing.mode} onClose={() => setEditing(null)} onSubmit={(values) => editing.mode === "create" ? createRecord(values) : updateRecord(editing.id, values)}/>}
    {runningAction && <ActionDialog action={runningAction} records={records} selectedId={actionRecordId} note={actionNote} onRecordChange={setActionRecordId} onNoteChange={setActionNote} onClose={() => setRunningAction("")} onSubmit={runAction}/>}
  </div>;
}

function RecordDialog({ initial, mode, onClose, onSubmit }) {
  const [form, setForm] = useState(initial);
  const dialogRef = useDialogFocus(onClose);
  return <div className="local-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section ref={dialogRef} tabIndex={-1} className="local-modal" role="dialog" aria-modal="true" aria-labelledby="local-record-dialog-title">
    <header><div><span className="local-eyebrow">LOCAL RECORD</span><h2 id="local-record-dialog-title">{mode === "create" ? "Create record" : "Edit record"}</h2></div><button type="button" aria-label="Close dialog" onClick={onClose}>×</button></header>
    <form onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, progress: Number(form.progress) }); }}>
      <label>Record name<input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })}/></label>
      <div className="local-form-row"><label>Owner<input maxLength={100} value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })}/></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label></div>
      <label>Progress: {form.progress}%<input type="range" min="0" max="100" step="5" value={form.progress} onChange={(event) => setForm({ ...form, progress: Number(event.target.value) })}/></label>
      <label>Notes<textarea rows="4" maxLength={2000} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })}/></label>
      <div className="local-modal-actions"><button type="button" className="local-button" onClick={onClose}>Cancel</button><button type="submit" className="local-button local-button-primary">Save locally</button></div>
    </form>
    <p className="local-modal-disclaimer">Saved only in this browser profile. This does not create or update a hosted TLPS record.</p>
  </section></div>;
}

function ActionDialog({ action, records, selectedId, note, onRecordChange, onNoteChange, onClose, onSubmit }) {
  const dialogRef = useDialogFocus(onClose);
  return <div className="local-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section ref={dialogRef} tabIndex={-1} className="local-modal" role="dialog" aria-modal="true" aria-labelledby="local-action-dialog-title">
    <header><div><span className="local-eyebrow">LOCAL WORKFLOW SIMULATOR</span><h2 id="local-action-dialog-title">{action}</h2></div><button type="button" aria-label="Close dialog" onClick={onClose}>×</button></header>
    <p className="local-modal-intro">This will update local preview state, add an activity entry, and never call an external service.</p>
    {records.length > 0 && <label>Apply to record<select value={selectedId} onChange={(event) => onRecordChange(event.target.value)}>{records.map((record) => <option key={record.id} value={record.id}>{record.title} · {record.status}</option>)}</select></label>}
    <form onSubmit={onSubmit}><label>Action note<textarea rows="4" maxLength="2000" value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Add local context or outcome"/></label><div className="local-next-state"><span>Local result</span><b>{actionStatus(action)}</b></div><div className="local-modal-actions"><button type="button" className="local-button" onClick={onClose}>Cancel</button><button type="submit" className="local-button local-button-primary">Run locally</button></div></form>
  </section></div>;
}
