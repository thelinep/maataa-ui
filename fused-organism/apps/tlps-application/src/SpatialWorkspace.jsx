import React, { useEffect, useRef, useState } from "react";
import { CanvasSurface, Scene3D } from "@tlps/domain-primitives";
import {
  readSpatialDraft,
  starterSpatialDraft,
  writeSpatialDraft,
} from "./spatialDraft.mjs";
import { createSpatialSimulationClient, spatialDraftToLayoutData, layoutDataToSpatialDraft } from "./spatial-api/spatialSimulation.mjs";
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
  const [draft, setDraft] = useState(() =>
    page.id === "223" ? starterSpatialDraft : readSpatialDraft(browserStorage()) || starterSpatialDraft,
  );
  const latestDraft = useRef(draft);
  latestDraft.current = draft;
  const modeRef = useRef(page.id === "223" ? "simulation" : "local");
  const [workspaceMode, setWorkspaceMode] = useState(modeRef.current);
  const cameraPreviewRef = useRef(null);
  const [cameraState, setCameraState] = useState(initialSpatialPreviewState);
  const [view, setView] = useState(page.id === "223" ? "3d" : "canvas");
  const [saveState, setSaveState] = useState("saved");
  const [simulation, setSimulation] = useState({ status: "loading", result: null, error: null });
  const [simulationDraft, setSimulationDraft] = useState(null);
  const [writeResponse, setWriteResponse] = useState(null);
  const simulationClientRef = useRef(null);
  const simulationMode = page.id === "223" && workspaceMode === "simulation";
  modeRef.current = workspaceMode;

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
    if (!simulationMode) return undefined;
    let active = true;
    setSimulation({ status: "loading", result: null, error: null });
    setWriteResponse(null);
    const client = createSpatialSimulationClient();
    simulationClientRef.current = client;
    void client.loadProjectLayout().then((result) => {
      if (!active) return;
      setSimulation(result.ok
        ? { status: "ready", result, error: null }
        : { status: "error", result: null, error: result.body });
      if (result.ok) setSimulationDraft(result.draft);
    }).catch((error) => {
      if (active) setSimulation({ status: "error", result: null, error: { message: error.message } });
    });
    return () => {
      active = false;
      if (simulationClientRef.current === client) simulationClientRef.current = null;
    };
  }, [simulationMode]);

  useEffect(() => {
    if (workspaceMode !== "local") return undefined;
    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      const saved = writeSpatialDraft(browserStorage(), draft);
      setSaveState(saved ? "saved" : "unavailable");
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [draft, workspaceMode]);

  useEffect(() => {
    setView(page.id === "223" ? "3d" : "canvas");
    const nextMode = page.id === "223" ? "simulation" : "local";
    modeRef.current = nextMode;
    setWorkspaceMode(nextMode);
  }, [page.id]);

  useEffect(() => {
    const flushDraft = () => {
      if (modeRef.current === "local") writeSpatialDraft(browserStorage(), latestDraft.current);
    };
    window.addEventListener("pagehide", flushDraft);
    return () => window.removeEventListener("pagehide", flushDraft);
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
  const switchToLocalDemo = () => {
    setDraft(readSpatialDraft(browserStorage()) || starterSpatialDraft);
    setWorkspaceMode("local");
    setWriteResponse(null);
  };
  const switchToSimulation = () => setWorkspaceMode("simulation");
  const saveFixtureLayout = () => {
    const client = simulationClientRef.current;
    const layout = simulation.result?.layout;
    if (!client || !layout) return;
    const response = client.requestUpdate(layout.id, {
      expectedVersion: layout.version_number,
      layoutData: spatialDraftToLayoutData(simulationDraft, simulation.result.project.units),
    });
    setWriteResponse(response);
    if (response.status === 200) {
      const savedLayout = response.body.data;
      const savedDraft = layoutDataToSpatialDraft(savedLayout.layout_data);
      setSimulation((current) => ({
        ...current,
        result: { ...current.result, layout: savedLayout, draft: savedDraft },
      }));
      setSimulationDraft(savedDraft);
    }
  };
  const activeDraft = simulationMode ? simulationDraft : draft;
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
        {!simulationMode && <div className="spatial-save-state" role="status" aria-live="polite">
          <i className={`save-dot save-${saveState}`} />
          <span>
            {saveState === "saved"
              ? "Saved on this browser"
              : saveState === "saving"
                ? "Saving local draft…"
                : "Browser storage unavailable"}
          </span>
        </div>}
      </header>
      {page.id === "223" && (
        <div className="spatial-mode-switch" role="group" aria-label="Spatial preview mode">
          <span>Data view</span>
          <button type="button" aria-pressed={simulationMode} onClick={switchToSimulation}>Contract fixture</button>
          <button type="button" aria-pressed={!simulationMode} onClick={switchToLocalDemo}>Local demo editor</button>
        </div>
      )}
      {simulationMode ? (
        <section className="spatial-simulation-banner" aria-label="Local simulation boundary">
          <div className="spatial-simulation-heading">
            <b>LOCAL CONFORMANCE SIMULATION</b>
            <span>FIXTURE DATA</span>
            <span>NOT AUTHENTICATED</span>
            <span>NOT DURABLE</span>
          </div>
          <p>
            Local in-memory fixture operations for <code>eventsspatial.spatial_projects</code> and
            <code> eventsspatial.spatial_layouts</code>. The selected browser role does not supply identity; a fixed fixture actor and fixture permission set drive local checks.
          </p>
          {simulation.status === "loading" && <div className="spatial-simulation-loading" role="status" aria-live="polite">Loading fixture project and layout…</div>}
          {simulation.status === "error" && (
            <p className="spatial-simulation-error" role="alert">
              Fixture read failed: {simulation.error?.message || simulation.error?.code || "unknown error"}
            </p>
          )}
          {simulation.status === "ready" && (
            <div className="spatial-simulation-record" aria-label="Loaded fixture records">
              <span>Project <b>{simulation.result.project.name}</b></span>
              <span>Layout <b>{simulation.result.layout.name}</b></span>
              <span>Lifecycle <b>{simulation.result.layout.layout_status}</b></span>
              <span>Version <b>{simulation.result.layout.version_number}</b></span>
            </div>
          )}
          <div className="spatial-simulation-write">
            <span><b>Local fixture save</b> Accepted saves update the same in-memory row and increment its version. Refresh clears these changes.</span>
            <button type="button" onClick={saveFixtureLayout} disabled={simulation.status !== "ready" || !simulationDraft}>
              Save layout
            </button>
          </div>
          {writeResponse?.status === 200 && <p className="spatial-simulation-success" role="status">Saved local fixture row · version {writeResponse.body.data.version_number}. No durable data changed.</p>}
          {writeResponse && writeResponse.status !== 200 && <p className="spatial-simulation-error" role="alert">{writeResponse.body.code}: {writeResponse.body.message} No data was changed. {writeResponse.body.code === "SPATIAL_LAYOUT_VERSION_CONFLICT" ? "Reload the layout and explicitly reapply your edit." : ""}</p>}
        </section>
      ) : (
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
      )}
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
        {view === "canvas" && activeDraft && (
          <CanvasSurface
            className="tlps-control-room-canvas"
            label="Exhibition layout"
            items={activeDraft.canvasItems}
            readOnly={false}
            onItemsChange={(canvasItems) => simulationMode
              ? setSimulationDraft((current) => ({ ...current, canvasItems }))
              : setDraft((current) => ({ ...current, canvasItems }))}
          />
        )}
        {view === "canvas" && simulation.status === "loading" && <div className="spatial-simulation-skeleton" aria-label="Loading spatial canvas" />}
      </section>
      <section
        id="spatial-3d-panel"
        role="tabpanel"
        aria-labelledby="spatial-3d-tab"
        aria-label="3D preview"
        className="spatial-editor-panel"
        hidden={view !== "3d"}
      >
        {view === "3d" && activeDraft && (
          <Scene3D
            className="tlps-control-room-scene"
            label="Exhibition 3D preview"
            models={activeDraft.models}
            readOnly={false}
            onModelsChange={(models) => simulationMode
              ? setSimulationDraft((current) => ({ ...current, models }))
              : setDraft((current) => ({ ...current, models }))}
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
        {view === "3d" && simulation.status === "loading" && <div className="spatial-simulation-skeleton" aria-label="Loading 3D scene" />}
      </section>
      <p className="spatial-preview-boundary">
        <b>Preview boundary:</b> {simulationMode
          ? "This editable view uses local fixture data and an in-memory conformance host. It is not authenticated or durable; refreshing resets fixture edits."
          : "This local demo draft stays in this browser. It is not saved to a TLPS account or server, and it does not submit an approval or alter production plans."}
      </p>
    </div>
  );
}
