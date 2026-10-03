import { starterSpatialDraft } from "../spatialDraft.mjs";
import {
  INITIAL_SPATIAL_LAYOUT_VERSION,
  SPATIAL_LAYOUT_PERMISSIONS,
  createSpatialLayoutConformanceHost,
  createSpatialLayoutHostAdapter,
} from "./localConformanceHost.mjs";

// Fixture-only identities. These are not host credentials or canonical records.
export const SPATIAL_SIMULATION_ACTOR_ID = "fixture-actor-spatial-preview";
export const SPATIAL_SIMULATION_PROJECT_ID = "8c7d0ed4-ff62-4e04-91b2-c288fd73558b";
export const SPATIAL_SIMULATION_LAYOUT_ID = "69f2bd7e-6762-4c7f-b40c-6de7f5bac69b";
export const SPATIAL_SIMULATION_ORGANISATION_ID = "53c6609e-b04f-415e-849d-cbc7f3c80255";
export const SPATIAL_SIMULATION_WORKSPACE_ID = "60b0274b-771e-4c5d-9ae4-ff39bfeaec1b";
export const SPATIAL_SIMULATION_USER_ID = "0ee4a654-64ae-4474-91a3-8f0d3c14ecbe";

export function spatialDraftToLayoutData(draft, units = "m") {
  return {
    schemaVersion: "tlps.spatial-layout-data/v1",
    canvas2d: {
      coordinateSpace: "maataa-canvas-world-v1",
      width: 1200,
      height: 760,
      origin: "top-left; x increases right; y increases down",
      units: "canvas-world-units",
      items: structuredClone(draft.canvasItems),
    },
    scene3d: {
      coordinateUnits: units,
      rotationUnit: "radian",
      models: structuredClone(draft.models),
    },
  };
}

export function layoutDataToSpatialDraft(layoutData) {
  return {
    version: 1,
    canvasItems: structuredClone(layoutData.canvas2d.items),
    models: structuredClone(layoutData.scene3d.models),
  };
}

const fixtureDraft = structuredClone(starterSpatialDraft);
const readPermission = SPATIAL_LAYOUT_PERMISSIONS.view;
const writePermissions = [SPATIAL_LAYOUT_PERMISSIONS.create, SPATIAL_LAYOUT_PERMISSIONS.edit];

export const spatialSimulationFixtures = Object.freeze({
  actors: [
    {
      id: SPATIAL_SIMULATION_ACTOR_ID,
      user_id: SPATIAL_SIMULATION_USER_ID,
      organisation_id: SPATIAL_SIMULATION_ORGANISATION_ID,
      workspace_id: SPATIAL_SIMULATION_WORKSPACE_ID,
      permissions: [readPermission, ...writePermissions],
      roleId: "producer",
      permissionSource: "LOCAL_FIXTURE_ONLY",
    },
  ],
  projects: [
    {
      id: SPATIAL_SIMULATION_PROJECT_ID,
      organisation_id: SPATIAL_SIMULATION_ORGANISATION_ID,
      workspace_id: SPATIAL_SIMULATION_WORKSPACE_ID,
      name: "Spatial preview sample project",
      units: "m",
    },
  ],
  layouts: [
    {
      id: SPATIAL_SIMULATION_LAYOUT_ID,
      organisation_id: SPATIAL_SIMULATION_ORGANISATION_ID,
      workspace_id: SPATIAL_SIMULATION_WORKSPACE_ID,
      spatial_project_id: SPATIAL_SIMULATION_PROJECT_ID,
      name: "Sample spatial layout",
      version_number: INITIAL_SPATIAL_LAYOUT_VERSION,
      canvas_width: 1200,
      canvas_height: 760,
      layout_data: spatialDraftToLayoutData(fixtureDraft),
      layout_status: "draft",
      created_at: "2026-10-01T09:00:00.000Z",
      updated_at: "2026-10-01T09:00:00.000Z",
      created_by_user_id: SPATIAL_SIMULATION_USER_ID,
    },
  ],
});

export function createSpatialSimulationClient(fixtures = spatialSimulationFixtures, hostOptions = {}) {
  const host = createSpatialLayoutConformanceHost({ fixtures, ...hostOptions });
  const adapter = createSpatialLayoutHostAdapter(host);

  async function loadProjectLayout() {
    const collection = adapter.listProjectLayouts({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId: SPATIAL_SIMULATION_PROJECT_ID });
    if (collection.status !== 200) return { ok: false, status: collection.status, body: collection.body };
    const first = collection.body.data[0];
    if (!first) return { ok: false, status: 404, body: { code: "SPATIAL_LAYOUT_NOT_FOUND" } };
    const detail = adapter.getSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId: first.id });
    if (detail.status !== 200) return { ok: false, status: detail.status, body: detail.body };
    const layout = detail.body.data;
    return {
      ok: true,
      project: { id: SPATIAL_SIMULATION_PROJECT_ID, name: "Spatial preview sample project", units: layout.layout_data.scene3d.coordinateUnits },
      layout,
      draft: layoutDataToSpatialDraft(layout.layout_data),
    };
  }

  return Object.freeze({
    mode: adapter.mode,
    loadProjectLayout,
    requestCreate: (projectId, body) => adapter.createProjectLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, projectId, body }),
    requestUpdate: (layoutId, body) => adapter.updateSpatialLayout({ actorId: SPATIAL_SIMULATION_ACTOR_ID, layoutId, body }),
    // This call represents a second fixture request using an old response version.
    requestUpdateAsFixtureActor: (actorId, layoutId, body) => adapter.updateSpatialLayout({ actorId, layoutId, body }),
  });
}
