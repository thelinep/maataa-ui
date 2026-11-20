import React, { useEffect, useMemo, useRef, useState } from "react";
import { CanvasSurface, Scene3D } from "@tlps/domain-primitives";
import { createSpatialApiClient } from "./spatialApi.mjs";
import {
  isSpatialDraft,
  readSpatialDraft,
  SPATIAL_DRAFT_KEY,
  starterSpatialDraft,
  writeSpatialDraft,
} from "./spatialDraft.mjs";
import "./spatial-workspace.css";

function apiErrorMessage(error, browserDraftAvailable = true) {
  const recovery = browserDraftAvailable
    ? "Your browser draft is still available."
    : "Browser recovery storage is unavailable.";
  switch (error?.status) {
    case 400:
    case 422: return "The API rejected the layout data. Review the fields and try again.";
    case 401: return "The local session is not valid. Re-enter the preview to create a new local session.";
    case 403: return "This local actor is not allowed to make that change.";
    case 404: return "The project or layout no longer exists on the local API.";
    case 409: return "Another save changed this layout. Reload it before trying again.";
    case 413: return "This layout is too large for the local API request limit.";
    case 428: return "The save needs the current layout version. Reload before retrying.";
    case 429: return "The local API is receiving too many requests. Wait and try again.";
    default: return error?.status >= 500
      ? `The local API could not complete the request. ${recovery}`
      : `The local API could not be reached. ${recovery}`;
  }
}

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function SpatialWorkspace({ page, role }) {
  const localApiMode = import.meta.env.DEV && import.meta.env.VITE_TLPS_LOCAL_AUTH === "true";
  const [draft, setDraft] = useState(() => readSpatialDraft(browserStorage()) || starterSpatialDraft);
  const latestDraft = useRef(draft);
  latestDraft.current = draft;
  const serverLayout = useRef(null);
  const userChangedDraft = useRef(false);
  const draftHydrated = useRef(false);
  const browserRecoveryAvailable = useRef(true);
  const apiClient = useMemo(() => {
    const session = typeof window === "undefined" ? null : window.MAATAA_AUTH;
    const baseUrl = import.meta.env.VITE_TLPS_API_BASE_URL;
    const projectId = import.meta.env.VITE_TLPS_SPATIAL_PROJECT_ID;
    if (!baseUrl || !projectId || (!localApiMode && typeof session?.getAccessToken !== "function")) return null;
    try {
      return localApiMode
        ? createSpatialApiClient({ baseUrl, projectId, allowLocalHttp: true, localSession: true })
        : createSpatialApiClient({ baseUrl, projectId, getAccessToken: () => session.getAccessToken() });
    }
    catch { return null; }
  }, [localApiMode]);
  const [view, setView] = useState(page.id === "223" ? "3d" : "canvas");
  const [serverState, setServerState] = useState(apiClient ? "connecting" : "local");
  const [saveState, setSaveState] = useState(apiClient ? "connecting" : "saved");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!apiClient) {
      draftHydrated.current = true;
      return undefined;
    }
    let cancelled = false;
    apiClient.listLayouts().then((layouts) => {
      if (cancelled) return;
      const row = Array.isArray(layouts) ? layouts[0] : null;
      if (userChangedDraft.current) {
        setServerState("conflict");
        setSaveState("conflict");
        return;
      }
      if (row) {
        if (!isSpatialDraft(row.layout_data)) {
          setServerState("invalid-data");
          setSaveState("unavailable");
          return;
        }
        serverLayout.current = { id: row.id, version: row.version_number };
        setDraft(row.layout_data);
      }
      setServerState("connected");
      setSaveState(row ? "saved" : "local");
      setServerError("");
    }).catch(() => {
      if (!cancelled) {
        setServerState("unavailable");
        setSaveState("unavailable");
        setServerError("Could not connect to the local API session or SQLite workspace. Browser recovery depends on this browser's storage being available.");
      }
    }).finally(() => {
      if (!cancelled) draftHydrated.current = true;
    });
    return () => { cancelled = true; };
  }, [apiClient]);

  useEffect(() => {
    if (!draftHydrated.current) return undefined;
    const localSaved = writeSpatialDraft(browserStorage(), draft);
    browserRecoveryAvailable.current = localSaved;
    if (!localSaved && !apiClient) {
      setSaveState("unavailable");
      return undefined;
    }
    if (!apiClient || !userChangedDraft.current || serverState !== "connected") {
      if (!apiClient) setSaveState(localSaved ? "saved" : "unavailable");
      else if (serverState === "unavailable" || serverState === "invalid-data") setSaveState("unavailable");
      return undefined;
    }
    setSaveState("saving");
    const timeout = window.setTimeout(async () => {
      try {
        const persisted = serverLayout.current
          ? await apiClient.updateLayout(serverLayout.current.id, serverLayout.current.version, { layout_data: draft })
          : await apiClient.createLayout({ name: page.name, layout_data: draft });
        serverLayout.current = { id: persisted.id, version: persisted.version_number };
        userChangedDraft.current = false;
        setSaveState("saved");
      } catch (error) {
        setSaveState(error?.status === 409 ? "conflict" : "unavailable");
        if (error?.status === 409) setServerState("conflict");
        setServerError(apiErrorMessage(error, browserRecoveryAvailable.current));
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [apiClient, draft, page.name, serverState]);

  useEffect(() => {
    setView(page.id === "223" ? "3d" : "canvas");
  }, [page.id]);

  useEffect(() => {
    const flushDraft = () => writeSpatialDraft(browserStorage(), latestDraft.current);
    window.addEventListener("pagehide", flushDraft);
    return () => {
      window.removeEventListener("pagehide", flushDraft);
      flushDraft();
    };
  }, []);

  const reset = () => {
    if (!window.confirm("Replace this browser's spatial draft with the sample layout?")) return;
    userChangedDraft.current = true;
    setDraft(starterSpatialDraft);
  };
  const updateDraft = (change) => {
    userChangedDraft.current = true;
    setDraft(change);
  };

  const exportDraft = () =>
    downloadBlob(
      "tlps-spatial-layout.json",
      JSON.stringify({ ...draft, exportedAt: new Date().toISOString() }, null, 2),
      "application/json",
    );
  const saveSnapshot = (dataUrl) => {
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = "tlps-spatial-preview.png";
    anchor.click();
  };

  return (
    <div className="spatial-workspace" aria-labelledby="spatial-heading">
      <nav className="spatial-crumbs" aria-label="Breadcrumb">
        <a href="#/mobile/017/home-dashboard">Workspace</a>
        <span aria-hidden="true">/</span>
        <span>{page.family}</span>
        <span aria-hidden="true">/</span>
        <b>{page.name}</b>
      </nav>
      <header className="spatial-page-heading">
        <div>
          <span className="spatial-eyebrow">EVENTS / WEDDING / SPATIAL · {role?.label || "WORKSPACE"}</span>
          <h1 id="spatial-heading">{page.name}</h1>
          <p>Arrange the exhibition footprint, then review a matching 3D preview.</p>
        </div>
        <div className="spatial-save-state" role="status" aria-live="polite">
          <i className={`save-dot save-${saveState}`} />
          <span>
            {saveState === "saved"
              ? serverLayout.current ? `${localApiMode ? "Saved to local API" : "Saved to TLPS"} · version ${serverLayout.current.version}` : "Saved on this browser"
              : saveState === "connecting"
                ? "Connecting to the local API…"
                : saveState === "local" && serverState === "connected"
                  ? localApiMode ? "Local API ready · no saved layout yet" : "No saved layout yet"
              : saveState === "saving"
                ? serverState === "connected" ? "Saving to TLPS…" : "Saving local draft…"
                : saveState === "conflict"
                  ? "Save conflict · reload the layout before retrying"
              : saveState === "unavailable" && apiClient
                    ? browserRecoveryAvailable.current
                      ? "Server unavailable · draft remains on this browser"
                      : "Server unavailable · browser recovery unavailable"
                    : "Browser storage unavailable"}
          </span>
        </div>
      </header>
      <section className="spatial-draft-banner" aria-label="Draft storage information">
        <div>
          <b>{serverState === "connected" ? localApiMode ? "Local development API" : "TLPS server workspace" : "Local workspace draft"}</b>
          <span>
            {serverState === "connected"
              ? localApiMode
                ? "A synthetic local editor is saving to a private SQLite working copy. This is not company sign-in or shared data."
                : "The project’s working layout is stored in eventsspatial.spatial_layouts; this browser keeps a local recovery copy."
              : browserRecoveryAvailable.current
                ? "Changes stay in this browser until a host session, TLPS API, and project connection are configured."
                : "Browser recovery storage is unavailable. Configure a host session, TLPS API, and project connection to save changes."}
          </span>
        </div>
        <div className="spatial-draft-actions">
          <button type="button" onClick={exportDraft}>
            Export layout JSON
          </button>
          <button type="button" onClick={reset}>
            Reset sample
          </button>
        </div>
      </section>
      {serverError && <p className="spatial-api-error" role="alert">{serverError}</p>}
      <div className="spatial-view-tabs" role="tablist" aria-label="Spatial editor view">
        <button
          type="button"
          role="tab"
          id="spatial-canvas-tab"
          aria-selected={view === "canvas"}
          aria-controls="spatial-canvas-panel"
          onClick={() => setView("canvas")}
        >
          2D layout canvas
        </button>
        <button
          type="button"
          role="tab"
          id="spatial-3d-tab"
          aria-selected={view === "3d"}
          aria-controls="spatial-3d-panel"
          onClick={() => setView("3d")}
        >
          3D preview
        </button>
      </div>
      <section
        id="spatial-canvas-panel"
        role="tabpanel"
        aria-labelledby="spatial-canvas-tab"
        aria-label="2D layout canvas"
        className="spatial-editor-panel"
        hidden={view !== "canvas"}
      >
        {view === "canvas" && (
          <CanvasSurface
            className="tlps-control-room-canvas"
            label="Exhibition layout"
            items={draft.canvasItems}
            onItemsChange={(canvasItems) => updateDraft((current) => ({ ...current, canvasItems }))}
          />
        )}
      </section>
      <section
        id="spatial-3d-panel"
        role="tabpanel"
        aria-labelledby="spatial-3d-tab"
        aria-label="3D preview"
        className="spatial-editor-panel"
        hidden={view !== "3d"}
      >
        {view === "3d" && (
          <Scene3D
            className="tlps-control-room-scene"
            label="Exhibition 3D preview"
            models={draft.models}
            onModelsChange={(models) => updateDraft((current) => ({ ...current, models }))}
            environment={{
              background: "#101F2D",
              grid: true,
              axes: true,
              gridColor: "#526A7C",
              axesColor: "#09A6A0",
            }}
            onSnapshot={saveSnapshot}
          />
        )}
      </section>
      <p className="spatial-preview-boundary">
        <b>Preview boundary:</b> {serverState === "connected"
          ? "This route saves the working spatial layout only; it does not publish an exhibition deliverable or alter production plans."
          : "This draft stays in this browser. It is not saved to a TLPS account or server, and it does not submit an approval or alter production plans."}
      </p>
    </div>
  );
}
