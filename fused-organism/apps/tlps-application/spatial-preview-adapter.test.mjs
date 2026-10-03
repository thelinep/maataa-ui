import test from "node:test";
import assert from "node:assert/strict";
import { createSpatialPreviewAdapter, SPATIAL_PREVIEW_STATUS } from "./src/spatialPreviewAdapter.mjs";

function fakeCamera({ connect, disconnect, readState, capabilities = ["camera.read"] } = {}) {
  return {
    descriptor: { capabilities },
    connect: connect || (async () => ({ connected: true })),
    disconnect: disconnect || (async () => ({ connected: false })),
    readState: readState || (async () => ({ pan: 12, tilt: -2, zoom: 1.5, streamState: "streaming" })),
  };
}

test("camera preview publishes connecting, ready, and disconnected transitions", async () => {
  const adapter = createSpatialPreviewAdapter({ cameraAdapter: fakeCamera() });
  const states = [];
  const unsubscribe = adapter.subscribe((state) => states.push(state.status));

  assert.equal(adapter.getState().status, SPATIAL_PREVIEW_STATUS.IDLE);
  await adapter.connect();
  assert.equal(adapter.getState().status, SPATIAL_PREVIEW_STATUS.READY);
  assert.deepEqual(adapter.getState().telemetry, { pan: 12, tilt: -2, zoom: 1.5, streamState: "streaming" });
  await adapter.disconnect();
  assert.equal(adapter.getState().status, SPATIAL_PREVIEW_STATUS.DISCONNECTED);
  assert.deepEqual(states, ["IDLE", "CONNECTING", "READY", "DISCONNECTED"]);

  unsubscribe();
  await adapter.connect();
  assert.equal(states.at(-1), "DISCONNECTED");
});

test("missing camera read capability is reported as unavailable", async () => {
  const adapter = createSpatialPreviewAdapter({
    cameraAdapter: fakeCamera({ capabilities: ["camera.ptz"] }),
  });

  assert.equal((await adapter.connect()).status, SPATIAL_PREVIEW_STATUS.UNAVAILABLE);
  assert.equal(adapter.getState().telemetry, null);
});

test("connection and read failures are visible and retryable", async () => {
  let shouldFail = true;
  const adapter = createSpatialPreviewAdapter({
    cameraAdapter: fakeCamera({
      connect: async () => {
        if (shouldFail) throw new Error("SIMULATOR_OFFLINE");
        return { connected: true };
      },
    }),
  });

  assert.equal((await adapter.connect()).status, SPATIAL_PREVIEW_STATUS.ERROR);
  assert.equal(adapter.getState().error, "SIMULATOR_OFFLINE");
  shouldFail = false;
  assert.equal((await adapter.connect()).status, SPATIAL_PREVIEW_STATUS.READY);

  const readFailure = createSpatialPreviewAdapter({
    cameraAdapter: fakeCamera({
      readState: async () => {
        throw new Error("SIMULATOR_READ_FAILED");
      },
    }),
  });
  assert.equal((await readFailure.connect()).status, SPATIAL_PREVIEW_STATUS.ERROR);
  assert.equal(readFailure.getState().error, "SIMULATOR_READ_FAILED");
});
