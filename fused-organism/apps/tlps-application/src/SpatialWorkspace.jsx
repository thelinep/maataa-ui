import React, { useEffect, useRef, useState } from "react";
import { CanvasSurface, Scene3D } from "@tlps/domain-primitives";
import {
  readSpatialDraft,
  SPATIAL_DRAFT_KEY,
  starterSpatialDraft,
  writeSpatialDraft,
} from "./spatialDraft.mjs";
import {
  createSpatialPreviewAdapter,
  initialSpatialPreviewState,
  SPATIAL_PREVIEW_STATUS,
} from "./spatialPreviewAdapter.mjs";
import "./spatial-workspace.css";

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
  const [draft, setDraft] = useState(() => readSpatialDraft(browserStorage()) || starterSpatialDraft);
  const latestDraft = useRef(draft);
  latestDraft.current = draft;
  const cameraPreviewRef = useRef(null);
  const [cameraState, setCameraState] = useState(initialSpatialPreviewState);
  const [view, setView] = useState(page.id === "223" ? "3d" : "canvas");
  const [saveState, setSaveState] = useState("saved");

  useEffect(() => {
    const adapter = createSpatialPreviewAdapter();
    cameraPreviewRef.current = adapter;
    const unsubscribe = adapter.subscribe(setCameraState);
    void adapter.connect();
    return () => {
      unsubscribe();
      if (cameraPreviewRef.current === adapter) cameraPreviewRef.current = null;
      void adapter.disconnect();
    };
  }, []);

  useEffect(() => {
    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      const saved = writeSpatialDraft(browserStorage(), draft);
      setSaveState(saved ? "saved" : "unavailable");
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [draft]);

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
    setDraft(starterSpatialDraft);
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
  const toggleCameraSimulator = () => {
    const adapter = cameraPreviewRef.current;
    if (!adapter) return;
    if (cameraState.status === SPATIAL_PREVIEW_STATUS.READY) void adapter.disconnect();
    else void adapter.connect();
  };
  const cameraStatusLabel = {
    [SPATIAL_PREVIEW_STATUS.IDLE]: "Idle",
    [SPATIAL_PREVIEW_STATUS.CONNECTING]: "Connecting",
    [SPATIAL_PREVIEW_STATUS.READY]: "Ready · simulator",
    [SPATIAL_PREVIEW_STATUS.DISCONNECTED]: "Disconnected",
    [SPATIAL_PREVIEW_STATUS.UNAVAILABLE]: "Unavailable",
    [SPATIAL_PREVIEW_STATUS.ERROR]: "Connection error",
  }[cameraState.status];
  const cameraButtonLabel =
    cameraState.status === SPATIAL_PREVIEW_STATUS.READY
      ? "Disconnect simulator"
      : cameraState.status === SPATIAL_PREVIEW_STATUS.CONNECTING
        ? "Connecting…"
        : cameraState.status === SPATIAL_PREVIEW_STATUS.ERROR
          ? "Retry connection"
          : "Connect simulator";

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
              ? "Saved on this browser"
              : saveState === "saving"
                ? "Saving local draft…"
                : "Browser storage unavailable"}
          </span>
        </div>
      </header>
      <section className="spatial-draft-banner" aria-label="Draft storage information">
        <div>
          <b>Spatial preview sample fixture</b>
          <span>
            Illustrative starter content. Edits stay in this browser and are shared between Exhibition Layout
            and 3D / CAD Previz.
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
      <section className="spatial-camera-status" aria-labelledby="camera-status-heading">
        <div className="spatial-camera-copy">
          <div>
            <h2 id="camera-status-heading">Camera preview connection</h2>
            <p>
              Experimental simulator status only. This does not display live video or control a physical
              camera.
            </p>
          </div>
          <span
            className={`camera-status-chip camera-status-${cameraState.status.toLowerCase()}`}
            role="status"
            aria-live="polite"
          >
            <i aria-hidden="true" />
            {cameraStatusLabel}
          </span>
        </div>
        {cameraState.telemetry && (
          <dl className="spatial-camera-telemetry" aria-label="Simulated camera telemetry">
            <div>
              <dt>Pan</dt>
              <dd>{cameraState.telemetry.pan ?? "—"}°</dd>
            </div>
            <div>
              <dt>Tilt</dt>
              <dd>{cameraState.telemetry.tilt ?? "—"}°</dd>
            </div>
            <div>
              <dt>Zoom</dt>
              <dd>{cameraState.telemetry.zoom ?? "—"}×</dd>
            </div>
            <div>
              <dt>Simulated signal</dt>
              <dd>{cameraState.telemetry.streamState ?? "No reading"}</dd>
            </div>
          </dl>
        )}
        {cameraState.status === SPATIAL_PREVIEW_STATUS.ERROR && (
          <p className="spatial-camera-error" role="alert">
            The simulator could not provide a camera state ({cameraState.error || "unknown error"}). Retry the
            connection.
          </p>
        )}
        {cameraState.status === SPATIAL_PREVIEW_STATUS.UNAVAILABLE && (
          <p className="spatial-camera-error" role="status">
            The camera preview adapter is unavailable in this build.
          </p>
        )}
        <button
          type="button"
          className="spatial-camera-action"
          onClick={toggleCameraSimulator}
          disabled={
            cameraState.status === SPATIAL_PREVIEW_STATUS.CONNECTING ||
            cameraState.status === SPATIAL_PREVIEW_STATUS.UNAVAILABLE
          }
        >
          {cameraButtonLabel}
        </button>
      </section>
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
            onItemsChange={(canvasItems) => setDraft((current) => ({ ...current, canvasItems }))}
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
            onModelsChange={(models) => setDraft((current) => ({ ...current, models }))}
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
        <b>Preview boundary:</b> This draft stays in this browser. It is not saved to a TLPS account or
        server, and it does not submit an approval or alter production plans.
      </p>
    </div>
  );
}
