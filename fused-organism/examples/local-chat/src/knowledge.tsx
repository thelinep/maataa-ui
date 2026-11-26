// Knowledge: the document collections Maataa Workstation searches when the
// chat answers. Add text files, see what is in each collection, search it,
// and remove what no longer belongs.
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useT } from "@maataa/ui";
import {
  createCollection,
  deleteCollection,
  deleteDocument,
  ingestDocument,
  listCollections,
  listDocuments,
  reindexCollection,
  searchKnowledge,
  type KnowledgeCollection,
  type KnowledgeDocument,
  type KnowledgeHit,
} from "./ws-api";

const ACCEPT =
  ".md,.markdown,.txt,.js,.jsx,.ts,.tsx,.mjs,.py,.json,.csv,.html,.css,.yml,.yaml,.rs,.go,.java,.c,.cpp,.h,.sh,.srt,.vtt,.fountain";

export function Knowledge() {
  const t = useT();
  const ids = { h: useId(), name: useId(), file: useId(), q: useId() };
  const fileRef = useRef<HTMLInputElement>(null);
  const [collections, setCollections] = useState<KnowledgeCollection[] | null>(null);
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<KnowledgeHit[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [c, d] = await Promise.all([listCollections(), listDocuments()]);
      setCollections(c);
      setDocs(d);
      setSelected((s) => (s && c.some((x) => x.id === s) ? s : (c[0]?.id ?? null)));
      setError(null);
    } catch (e) {
      setError(t(e instanceof Error ? e.message : String(e)));
      setCollections((c) => c ?? []);
    }
  }, [t]);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const current = collections?.find((c) => c.id === selected) ?? null;
  const inCurrent = useMemo(() => docs.filter((d) => d.collectionId === selected), [docs, selected]);
  const fail = (e: unknown) => setError(t(e instanceof Error ? e.message : String(e)));

  const addFiles = async (files: File[]) => {
    if (!current) return;
    setError(null);
    let added = 0;
    const problems: string[] = [];
    for (const [i, file] of files.entries()) {
      setBusy(t("Reading {name} ({n} of {total})…", { name: file.name, n: i + 1, total: files.length }));
      let text = "";
      try {
        text = await file.text();
      } catch {
        problems.push(t("Couldn’t read {name} as text.", { name: file.name }));
        continue;
      }
      if (!text.trim()) {
        problems.push(t("{name} is empty, so it was skipped.", { name: file.name }));
        continue;
      }
      try {
        const r = await ingestDocument(current.id, file.name, text);
        added++;
        setStatus(t("{name} added ({count} passages).", { name: file.name, count: r.chunkCount }));
      } catch (e) {
        problems.push(
          t("Couldn’t add {name}: {reason}", {
            name: file.name,
            reason: t(e instanceof Error ? e.message : String(e)),
          }),
        );
      }
    }
    setBusy(null);
    if (added > 1) setStatus(t("{count} files added.", { count: added }));
    await refresh();
    if (problems.length) setError(problems.join(" "));
  };

  return (
    <section className="studio" aria-labelledby={ids.h}>
      <div className="studio-head">
        <h2 id={ids.h}>{t("Knowledge")}</h2>
        <button type="button" onClick={() => void refresh()}>
          {t("Refresh")}
        </button>
      </div>
      <p className="muted small">
        {t(
          "When the chat answers through Workstation, it looks things up in these collections. Text files only: notes, scripts, subtitles, code, CSV.",
        )}
      </p>
      <p aria-live="polite" className="muted small studio-status">
        {busy ?? status}
      </p>
      {error && (
        <p role="alert" className="tone-error">
          {error}
        </p>
      )}

      <div className="studio-split preprod">
        <nav className="studio-card stack" aria-label={t("Collections")}>
          <h3 className="side-h">{t("Collections")}</h3>
          {collections === null ? (
            <p className="muted small">{t("Loading…")}</p>
          ) : !collections.length ? (
            <p className="muted small">{t("No collections yet.")}</p>
          ) : (
            <ul className="plain-list">
              {collections.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="row-button"
                    aria-current={c.id === selected ? "true" : undefined}
                    onClick={() => {
                      setSelected(c.id);
                      setHits(null);
                      setConfirm(null);
                    }}
                  >
                    <span className="row-title">{c.name}</span>
                    <span className="muted small">
                      {t("{docs} files · {chunks} passages", {
                        docs: c.docCount ?? 0,
                        chunks: c.chunkCount ?? 0,
                      })}
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
              if (!name.trim()) return;
              void createCollection(name.trim()).then(async (c) => {
                setName("");
                setStatus(t("Collection made: {name}", { name: c.name }));
                await refresh();
                setSelected(c.id);
              }, fail);
            }}
          >
            <div className="field">
              <label htmlFor={ids.name}>{t("New collection")}</label>
              <input id={ids.name} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <button type="submit" disabled={!name.trim()}>
                {t("Make collection")}
              </button>
            </div>
          </form>
        </nav>

        <div className="studio-card stack" style={{ minWidth: 0 }}>
          {!current ? (
            <p className="muted">{t("Make a collection on the left, then add files to it.")}</p>
          ) : (
            <>
              <div className="studio-head">
                <h3>{current.name}</h3>
                <span className="muted small">
                  {t("Search model: {model}", { model: current.embeddingModel ?? "nomic-embed-text" })}
                </span>
              </div>
              <div className="inline">
                <input
                  ref={fileRef}
                  id={ids.file}
                  type="file"
                  multiple
                  accept={ACCEPT}
                  className="visually-hidden"
                  tabIndex={-1}
                  aria-label={t("Add files")}
                  onChange={(e) => {
                    const files = [...(e.target.files ?? [])];
                    e.target.value = "";
                    if (files.length) void addFiles(files);
                  }}
                />
                <button
                  type="button"
                  className="primary"
                  disabled={busy !== null}
                  onClick={() => fileRef.current?.click()}
                >
                  {t("Add files")}
                </button>
                <button
                  type="button"
                  disabled={busy !== null || !inCurrent.length}
                  onClick={() => {
                    setBusy(t("Re-reading every file…"));
                    void reindexCollection(current.id)
                      .then(() => setStatus(t("Collection re-read.")), fail)
                      .finally(() => {
                        setBusy(null);
                        void refresh();
                      });
                  }}
                >
                  {t("Re-read all files")}
                </button>
                {!inCurrent.length &&
                  (confirm === current.id ? (
                    <>
                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          void deleteCollection(current.id).then(() => {
                            setConfirm(null);
                            setStatus(t("Deleted."));
                            void refresh();
                          }, fail)
                        }
                      >
                        {t("Yes, delete it")}
                      </button>
                      <button type="button" onClick={() => setConfirm(null)}>
                        {t("Keep it")}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="danger" onClick={() => setConfirm(current.id)}>
                      {t("Delete empty collection")}
                    </button>
                  ))}
              </div>

              <form
                className="inline"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query.trim()) return;
                  setBusy(t("Searching…"));
                  void searchKnowledge(query.trim(), current.id)
                    .then((r) => {
                      setHits(r.results ?? []);
                      setStatus(t("{count} passages found.", { count: (r.results ?? []).length }));
                    }, fail)
                    .finally(() => setBusy(null));
                }}
              >
                <label htmlFor={ids.q} className="visually-hidden">
                  {t("Search this collection")}
                </label>
                <input
                  id={ids.q}
                  type="search"
                  value={query}
                  placeholder={t("Search this collection")}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button type="submit" disabled={!query.trim() || busy !== null}>
                  {t("Search")}
                </button>
              </form>
              {hits && (
                <div className="stack">
                  <h4>{t("What the chat would see")}</h4>
                  {!hits.length ? (
                    <p className="muted small">{t("Nothing matched.")}</p>
                  ) : (
                    <ol className="hit-list">
                      {hits.map((h, i) => (
                        <li key={i}>
                          <strong>{h.docName}</strong>
                          {typeof h.score === "number" && (
                            <span className="muted small"> · {Math.round(h.score * 100)}%</span>
                          )}
                          <p className="small">{h.text.length > 420 ? `${h.text.slice(0, 420)}…` : h.text}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}

              <h4>{t("Files")}</h4>
              {!inCurrent.length ? (
                <p className="muted small">{t("No files yet.")}</p>
              ) : (
                <div className="studio-scroll">
                  <table className="plain-table">
                    <caption className="visually-hidden">
                      {t("Files in {name}", { name: current.name })}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">{t("Name")}</th>
                        <th scope="col">{t("Size")}</th>
                        <th scope="col">{t("Passages")}</th>
                        <th scope="col">{t("Status")}</th>
                        <th scope="col">
                          <span className="visually-hidden">{t("Actions")}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inCurrent.map((d) => (
                        <tr key={d.id}>
                          <td>{d.name}</td>
                          <td>{d.sizeKb} KB</td>
                          <td>{d.chunkCount}</td>
                          <td>{d.status === "embedded" ? t("Ready") : t(d.status)}</td>
                          <td>
                            {confirm === d.id ? (
                              <span className="inline">
                                <button
                                  type="button"
                                  className="danger small-btn"
                                  onClick={() =>
                                    void deleteDocument(d.id).then(() => {
                                      setConfirm(null);
                                      setStatus(t("{name} removed.", { name: d.name }));
                                      void refresh();
                                    }, fail)
                                  }
                                >
                                  {t("Yes, remove")}
                                </button>
                                <button type="button" className="small-btn" onClick={() => setConfirm(null)}>
                                  {t("Keep it")}
                                </button>
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="small-btn"
                                aria-label={t("Remove {name}", { name: d.name })}
                                onClick={() => setConfirm(d.id)}
                              >
                                {t("Remove")}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
