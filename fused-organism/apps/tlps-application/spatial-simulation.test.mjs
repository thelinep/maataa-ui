import test from "node:test";
import assert from "node:assert/strict";
import {
  createSpatialSimulationClient,
  SPATIAL_SIMULATION_ACTOR_ID,
  SPATIAL_SIMULATION_PROJECT_ID,
  SPATIAL_SIMULATION_LAYOUT_ID,
  spatialSimulationFixtures,
} from "./src/spatial-api/spatialSimulation.mjs";
import { starterSpatialDraft } from "./src/spatialDraft.mjs";

test("simulation loads a project layout through its local conformance adapter", async () => {
  const client = createSpatialSimulationClient();
  const result = await client.loadProjectLayout();
  assert.equal(client.mode, "LOCAL_CONFORMANCE_SIMULATION");
  assert.equal(result.ok, true);
  assert.equal(result.project.id, SPATIAL_SIMULATION_PROJECT_ID);
  assert.equal(result.layout.spatial_project_id, result.project.id);
  assert.equal(result.layout.id, SPATIAL_SIMULATION_LAYOUT_ID);
  assert.equal(result.draft.canvasItems.length, 3);
  assert.equal(result.draft.models.length, 2);
  assert.equal(spatialSimulationFixtures.actors[0].id, SPATIAL_SIMULATION_ACTOR_ID);
});

test("fixture identity and permissions are independent of browser role previews", async () => {
  const isolated = structuredClone(spatialSimulationFixtures);
  isolated.actors[0].id = "some-other-fixture-actor";
  const result = await createSpatialSimulationClient(isolated).loadProjectLayout();
  assert.equal(result.ok, false);
  assert.equal(result.body.code, "UNAUTHENTICATED");
});

test("simulation client saves the same fixture row and returns its next version", async () => {
  const fixtures = structuredClone(spatialSimulationFixtures);
  const client = createSpatialSimulationClient(fixtures);
  const changed = structuredClone(starterSpatialDraft);
  changed.canvasItems[0].title = "Saved in local fixture";
  const beforeId = fixtures.layouts[0].id;
  const result = client.requestUpdate(beforeId, { expectedVersion: 1, layoutData: {
    schemaVersion: "tlps.spatial-layout-data/v1",
    canvas2d: { coordinateSpace: "maataa-canvas-world-v1", width: 1200, height: 760, origin: "top-left; x increases right; y increases down", units: "canvas-world-units", items: changed.canvasItems },
    scene3d: { coordinateUnits: "m", rotationUnit: "radian", models: changed.models },
  } });
  assert.equal(result.status, 200);
  assert.equal(result.body.data.id, beforeId);
  assert.equal(result.body.data.version_number, 2);
  const reloaded = await client.loadProjectLayout();
  assert.equal(reloaded.layout.version_number, 2);
  assert.equal(reloaded.layout.layout_data.canvas2d.items[0].title, "Saved in local fixture");
});
