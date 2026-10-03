import test from "node:test";
import assert from "node:assert/strict";
import {
  createSpatialLayoutConformanceHost,
  createSpatialLayoutHostAdapter,
  INITIAL_SPATIAL_LAYOUT_VERSION,
  SPATIAL_LAYOUT_PERMISSIONS,
  SPATIAL_HOST_DATA_SOURCE,
  SPATIAL_HOST_MODE,
} from "./src/spatial-api/localConformanceHost.mjs";
import {
  SPATIAL_SIMULATION_ACTOR_ID,
  SPATIAL_SIMULATION_LAYOUT_ID,
  SPATIAL_SIMULATION_ORGANISATION_ID,
  SPATIAL_SIMULATION_PROJECT_ID,
  SPATIAL_SIMULATION_USER_ID,
  SPATIAL_SIMULATION_WORKSPACE_ID,
  spatialDraftToLayoutData,
  spatialSimulationFixtures,
} from "./src/spatial-api/spatialSimulation.mjs";
import { starterSpatialDraft } from "./src/spatialDraft.mjs";

const createHost = (overrides = {}) => createSpatialLayoutConformanceHost({
  fixtures: structuredClone(spatialSimulationFixtures),
  idFactory: () => "8c43a044-8b12-4ce2-8750-2ae2a1059890",
  clock: () => new Date("2026-10-03T12:30:00.000Z"),
  ...overrides,
});

test("fixture host lists deterministic pages and gets layouts inside actor tenant only", () => {
  const host = createHost();
  const listed = host.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID });
  assert.equal(listed.status, 200);
  assert.equal(listed.mode, SPATIAL_HOST_MODE);
  assert.equal(listed.dataSource, SPATIAL_HOST_DATA_SOURCE);
  assert.equal(listed.production, false);
  assert.equal(listed.authenticated, false);
  assert.equal(listed.durable, false);
  assert.deepEqual(listed.body.page, { limit: 50, offset: 0, nextOffset: null, total: 1, orderBy: ["updated_at:desc", "id:asc"], includesArchived: true });
  const detail = host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID });
  assert.equal(detail.status, 200);
  assert.equal(detail.body.data.version_number, 1);
});

test("collection order is updated_at descending then id ascending with bounded offsets", () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  fixtures.layouts.push({
    ...structuredClone(fixtures.layouts[0]),
    id: "00000000-0000-4000-8000-000000000001",
    name: "Older layout",
    updated_at: "2026-10-01T08:00:00.000Z",
  });
  const host = createHost({ fixtures });
  const first = host.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID, limit: 1 });
  assert.deepEqual(first.body.data.map(({ id }) => id), [SPATIAL_SIMULATION_LAYOUT_ID]);
  assert.equal(first.body.page.nextOffset, 1);
  const second = host.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID, limit: 1, offset: 1 });
  assert.deepEqual(second.body.data.map(({ id }) => id), ["00000000-0000-4000-8000-000000000001"]);
  assert.equal(second.body.page.nextOffset, null);
});

test("unknown actor, missing permission, bad query, and cross-tenant reads have stable safe errors", () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  fixtures.actors.push({ id: "fixture-no-write", organisation_id: SPATIAL_SIMULATION_ORGANISATION_ID, workspace_id: SPATIAL_SIMULATION_WORKSPACE_ID, permissions: [SPATIAL_LAYOUT_PERMISSIONS.view] });
  const host = createHost({ fixtures });
  assert.equal(host.getSpatialLayout({ actorId: "missing", layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.code, "UNAUTHENTICATED");
  assert.equal(host.updateSpatialLayout({ actorId: "fixture-no-write", layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body: { expectedVersion: 1, name: "blocked" } }).body.code, "FORBIDDEN");
  assert.equal(host.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID, limit: 101 }).body.code, "VALIDATION_FAILED");
  assert.equal(host.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }).body.code, "SPATIAL_PROJECT_NOT_FOUND");
  assert.equal(host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }).body.code, "SPATIAL_LAYOUT_NOT_FOUND");
});

test("create derives tenant and project keys, initializes version one, and assigns fixture actor", () => {
  const host = createHost();
  const result = host.createProjectLayout({
    actorId: SPATIAL_SIMULATION_ACTOR_ID,
    projectId: SPATIAL_SIMULATION_PROJECT_ID,
    body: { name: "New layout", layoutData: spatialDraftToLayoutData(starterSpatialDraft) },
  });
  assert.equal(result.status, 201);
  assert.deepEqual({
    id: result.body.data.id,
    organisation_id: result.body.data.organisation_id,
    workspace_id: result.body.data.workspace_id,
    spatial_project_id: result.body.data.spatial_project_id,
    version_number: result.body.data.version_number,
    layout_status: result.body.data.layout_status,
    created_by_user_id: result.body.data.created_by_user_id,
  }, {
    id: "8c43a044-8b12-4ce2-8750-2ae2a1059890",
    organisation_id: SPATIAL_SIMULATION_ORGANISATION_ID,
    workspace_id: SPATIAL_SIMULATION_WORKSPACE_ID,
    spatial_project_id: SPATIAL_SIMULATION_PROJECT_ID,
    version_number: INITIAL_SPATIAL_LAYOUT_VERSION,
    layout_status: "draft",
    created_by_user_id: SPATIAL_SIMULATION_USER_ID,
  });
});

test("accepted PATCH fully replaces layoutData and increments the same row once per save", () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  const host = createHost({ fixtures });
  const rowBeforeId = fixtures.layouts[0].id;
  const changed = structuredClone(starterSpatialDraft);
  changed.canvasItems[0].title = "Updated entrance";
  const first = host.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body: { expectedVersion: 1, layoutData: spatialDraftToLayoutData(changed) } });
  assert.equal(first.status, 200);
  assert.equal(first.body.data.version_number, 2);
  assert.equal(first.body.data.id, rowBeforeId);
  const current = host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: rowBeforeId }).body.data;
  assert.equal(current.version_number, 2);
  assert.equal(current.layout_data.canvas2d.items[0].title, "Updated entrance");
  const second = host.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body: { expectedVersion: 2, name: "Second save" } });
  assert.equal(second.status, 200);
  assert.equal(second.body.data.id, rowBeforeId);
  assert.equal(second.body.data.version_number, 3);
  assert.equal(second.body.data.name, "Second save");
});

test("stale expectedVersion returns safe 409 details and performs no mutation", () => {
  const host = createHost();
  assert.equal(host.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body: { expectedVersion: 1, name: "first" } }).status, 200);
  const before = host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.data;
  const stale = host.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body: { expectedVersion: 1, name: "stale" } });
  assert.equal(stale.status, 409);
  assert.deepEqual(stale.body, {
    code: "SPATIAL_LAYOUT_VERSION_CONFLICT",
    message: "The spatial layout changed since it was loaded.",
    requestId: null,
    details: { expectedVersion: 1, currentVersion: 2, writesPerformed: false, retry: "reload-and-explicitly-reapply" },
  });
  assert.deepEqual(host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.data, before);
});

test("invalid, stale, unauthorized, or client-owned-field writes never mutate the row", () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  const host = createHost({ fixtures });
  const before = host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.data;
  const invalidData = spatialDraftToLayoutData(starterSpatialDraft);
  invalidData.cameraState = { status: "READY" };
  const cases = [
    { body: { name: "missing version" } },
    { body: { expectedVersion: 1, version_number: 500, name: "injection" } },
    { body: { expectedVersion: 1, layoutData: invalidData } },
    { body: { expectedVersion: 1, layoutData: { ...spatialDraftToLayoutData(starterSpatialDraft), canvas2d: { ...spatialDraftToLayoutData(starterSpatialDraft).canvas2d, items: [{ ...starterSpatialDraft.canvasItems[0], x: 1190 }] } } } },
    { body: { expectedVersion: 1, name: "" } },
  ];
  for (const { body } of cases) {
    assert.equal(host.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body }).status, 400);
    assert.deepEqual(host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.data, before);
  }
});

test("tenant fields cannot be overridden and workspace/project mismatch is hidden as not found", () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  fixtures.layouts[0].workspace_id = "efbd4a62-ae65-49db-9bc7-42ea3a45b9d2";
  const host = createHost({ fixtures });
  assert.equal(host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.code, "SPATIAL_LAYOUT_NOT_FOUND");
  const result = host.createProjectLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID, body: { name: "X", layoutData: spatialDraftToLayoutData(starterSpatialDraft), workspace_id: "attacker" } });
  assert.equal(result.body.code, "VALIDATION_FAILED");
});

test("published and archived layouts cannot be modified through draft PATCH", () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  fixtures.layouts[0].layout_status = "published";
  const host = createHost({ fixtures });
  const result = host.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID, body: { expectedVersion: 1, name: "unsafe edit" } });
  assert.equal(result.status, 403);
  assert.equal(result.body.code, "FORBIDDEN");
  assert.equal(host.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: SPATIAL_SIMULATION_LAYOUT_ID }).body.data.name, "Sample spatial layout");
});

test("host adapter exposes only the narrow contract boundary", () => {
  const adapter = createSpatialLayoutHostAdapter(createHost());
  assert.equal(adapter.mode, SPATIAL_HOST_MODE);
  assert.equal(adapter.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID }).status, 200);
  assert.equal("layouts" in adapter, false);
  assert.throws(() => createSpatialLayoutHostAdapter({}), /SPATIAL_HOST_METHOD_REQUIRED/);
});

test("fixture collections and version helper inputs are checked", async () => {
  const { advanceSpatialLayoutVersionOnSameRow } = await import("./src/spatial-api/localConformanceHost.mjs");
  assert.throws(() => createSpatialLayoutConformanceHost(), /SPATIAL_FIXTURE_COLLECTIONS_REQUIRED/);
  const row = { id: "layout", version_number: 1 };
  assert.strictEqual(advanceSpatialLayoutVersionOnSameRow(row), row);
  assert.equal(row.version_number, 2);
  assert.throws(() => advanceSpatialLayoutVersionOnSameRow({ version_number: 0 }), /POSITIVE_SAFE_INTEGER/);
});
