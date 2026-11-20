import test from "node:test";
import assert from "node:assert/strict";
import { createSpatialApiClient } from "./src/spatialApi.mjs";

const projectId = "44444444-4444-4444-8444-444444444444";
const layoutId = "55555555-5555-4555-8555-555555555555";

test("spatial API client attaches host token and calls project-scoped list", async () => {
  let observed;
  const client = createSpatialApiClient({
    baseUrl: "https://api.tlps.in",
    projectId,
    getAccessToken: async () => "signed-user-jwt",
    fetchImpl: async (url, init) => {
      observed = { url, init };
      return Response.json({ data: [{ id: layoutId }] });
    },
  });
  assert.deepEqual(await client.listLayouts(), [{ id: layoutId }]);
  assert.equal(observed.url.pathname, `/v1/spatial-projects/${projectId}/layouts`);
  assert.equal(observed.init.headers.get("authorization"), "Bearer signed-user-jwt");
});

test("layout saves use PATCH, same row ID, and exact current version", async () => {
  let observed;
  const client = createSpatialApiClient({
    baseUrl: "https://api.tlps.in",
    projectId,
    getAccessToken: async () => "signed-user-jwt",
    fetchImpl: async (url, init) => {
      observed = { url, init };
      return Response.json({ data: { id: layoutId, version_number: 8 } });
    },
  });
  const result = await client.updateLayout(layoutId, 7, { layout_data: { version: 1, canvasItems: [], models: [] } });
  assert.equal(result.version_number, 8);
  assert.equal(observed.url.pathname, `/v1/spatial-layouts/${layoutId}`);
  assert.equal(observed.init.method, "PATCH");
  assert.equal(observed.init.headers.get("if-match"), "7");
});

test("client refuses insecure remote origins and missing host session adapters", () => {
  assert.throws(() => createSpatialApiClient({ baseUrl: "http://api.tlps.in", projectId, getAccessToken: async () => "token" }), /SPATIAL_API_REQUIRES_HTTPS/);
  assert.throws(() => createSpatialApiClient({ baseUrl: "http://127.0.0.1:4178", projectId, getAccessToken: async () => "token" }), /SPATIAL_API_REQUIRES_HTTPS/);
  assert.doesNotThrow(() => createSpatialApiClient({ baseUrl: "http://127.0.0.1:4178", projectId, getAccessToken: async () => "local", allowLocalHttp: true }));
  assert.throws(() => createSpatialApiClient({ baseUrl: "https://api.tlps.in", projectId }), /HOST_SESSION_ADAPTER_REQUIRED/);
});

test("client surfaces stale version conflicts without retrying or overwriting", async () => {
  let calls = 0;
  const client = createSpatialApiClient({
    baseUrl: "https://api.tlps.in",
    projectId,
    getAccessToken: async () => "signed-user-jwt",
    fetchImpl: async () => { calls += 1; return Response.json({ error: "LAYOUT_VERSION_CONFLICT" }, { status: 409 }); },
  });
  await assert.rejects(client.updateLayout(layoutId, 7, { name: "stale" }), (error) => error.status === 409 && error.message === "LAYOUT_VERSION_CONFLICT");
  assert.equal(calls, 1);
});
