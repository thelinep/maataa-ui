import { createCameraSimulatorAdapter } from "@maataa/adapter-sdk";

export const SPATIAL_PREVIEW_STATUS = Object.freeze({
  IDLE: "IDLE",
  CONNECTING: "CONNECTING",
  READY: "READY",
  DISCONNECTED: "DISCONNECTED",
  UNAVAILABLE: "UNAVAILABLE",
  ERROR: "ERROR",
});

export const initialSpatialPreviewState = Object.freeze({
  status: SPATIAL_PREVIEW_STATUS.IDLE,
  source: "SIMULATOR",
  telemetry: null,
  error: null,
});

function supportsPreview(adapter) {
  return Boolean(
    adapter &&
    adapter.descriptor?.capabilities?.includes("camera.read") &&
    typeof adapter.connect === "function" &&
    typeof adapter.disconnect === "function" &&
    typeof adapter.readState === "function",
  );
}

function snapshot(state) {
  return {
    ...state,
    telemetry: state.telemetry ? structuredClone(state.telemetry) : null,
  };
}

export function createSpatialPreviewAdapter({ cameraAdapter = createCameraSimulatorAdapter() } = {}) {
  let state = snapshot(initialSpatialPreviewState);
  let generation = 0;
  let pendingConnect = null;
  const listeners = new Set();

  function publish(nextState) {
    state = nextState;
    const next = snapshot(state);
    for (const listener of listeners) {
      try {
        listener(next);
      } catch {
        // One view subscriber must not prevent the others receiving a state update.
      }
    }
  }

  function getState() {
    return snapshot(state);
  }

  function subscribe(listener) {
    if (typeof listener !== "function") throw new TypeError("PREVIEW_LISTENER_REQUIRED");
    listeners.add(listener);
    listener(getState());
    return () => listeners.delete(listener);
  }

  async function connect() {
    if (!supportsPreview(cameraAdapter)) {
      publish({ ...state, status: SPATIAL_PREVIEW_STATUS.UNAVAILABLE, telemetry: null, error: null });
      return getState();
    }
    if (state.status === SPATIAL_PREVIEW_STATUS.READY) return getState();
    if (pendingConnect) return pendingConnect;

    const attempt = ++generation;
    publish({ ...state, status: SPATIAL_PREVIEW_STATUS.CONNECTING, telemetry: null, error: null });
    pendingConnect = (async () => {
      try {
        const result = await cameraAdapter.connect();
        if (attempt !== generation) return getState();
        if (!result?.connected) throw new Error("SIMULATOR_CONNECTION_NOT_CONFIRMED");
        const telemetry = await cameraAdapter.readState();
        if (attempt !== generation) return getState();
        if (!telemetry || typeof telemetry !== "object") throw new Error("SIMULATOR_STATE_INVALID");
        publish({ status: SPATIAL_PREVIEW_STATUS.READY, source: "SIMULATOR", telemetry, error: null });
      } catch (error) {
        if (attempt === generation) {
          publish({
            status: SPATIAL_PREVIEW_STATUS.ERROR,
            source: "SIMULATOR",
            telemetry: null,
            error: typeof error?.message === "string" ? error.message : "SIMULATOR_CONNECTION_FAILED",
          });
        }
      } finally {
        if (attempt === generation) pendingConnect = null;
      }
      return getState();
    })();
    return pendingConnect;
  }

  async function disconnect() {
    const attempt = ++generation;
    pendingConnect = null;
    if (!supportsPreview(cameraAdapter)) {
      publish({ ...state, status: SPATIAL_PREVIEW_STATUS.UNAVAILABLE, telemetry: null, error: null });
      return getState();
    }
    try {
      await cameraAdapter.disconnect();
      if (attempt === generation) {
        publish({
          status: SPATIAL_PREVIEW_STATUS.DISCONNECTED,
          source: "SIMULATOR",
          telemetry: null,
          error: null,
        });
      }
    } catch (error) {
      if (attempt === generation) {
        publish({
          status: SPATIAL_PREVIEW_STATUS.ERROR,
          source: "SIMULATOR",
          telemetry: null,
          error: typeof error?.message === "string" ? error.message : "SIMULATOR_DISCONNECT_FAILED",
        });
      }
    }
    return getState();
  }

  return Object.freeze({ connect, disconnect, getState, subscribe });
}
