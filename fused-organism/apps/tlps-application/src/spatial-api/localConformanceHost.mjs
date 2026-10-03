/**
 * Browser-local reference host for the DRAFT TLPS spatial API contract.
 * It is an in-memory conformance fixture, not an HTTP server, identity provider,
 * database transaction, durable store, or production authorization boundary.
 */

export const SPATIAL_HOST_MODE = "LOCAL_CONFORMANCE_SIMULATION";
export const SPATIAL_HOST_DATA_SOURCE = "FIXTURE_DATA";
export const INITIAL_SPATIAL_LAYOUT_VERSION = 1;
export const SPATIAL_LAYOUT_PERMISSIONS = Object.freeze({
  view: "spatial.layout.view",
  create: "spatial.layout.create",
  edit: "spatial.layout.edit",
});
export const SPATIAL_LAYOUT_LIST_DEFAULT_LIMIT = 50;
export const SPATIAL_LAYOUT_LIST_MAX_LIMIT = 100;

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 760;
const HEX_COLOR = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const mutableFields = new Set(["name", "canvasWidth", "canvasHeight", "layoutData"]);

const ERROR_STATUS = Object.freeze({
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  SPATIAL_PROJECT_NOT_FOUND: 404,
  SPATIAL_LAYOUT_NOT_FOUND: 404,
  SPATIAL_LAYOUT_VERSION_CONFLICT: 409,
  UNSUPPORTED_OPERATION: 501,
});

function response(status, body) {
  return Object.freeze({
    status,
    body: structuredClone(body),
    mode: SPATIAL_HOST_MODE,
    dataSource: SPATIAL_HOST_DATA_SOURCE,
    production: false,
    authenticated: false,
    durable: false,
  });
}

function error(code, message, details = {}) {
  return response(ERROR_STATUS[code], { code, message, requestId: null, details });
}

function validationError(message, details = {}) {
  return error("VALIDATION_FAILED", message, details);
}

function sameTenant(left, right) {
  return Boolean(left && right &&
    left.organisation_id === right.organisation_id &&
    left.workspace_id === right.workspace_id);
}

function validFixtures(fixtures) {
  return Boolean(fixtures && Array.isArray(fixtures.actors) &&
    Array.isArray(fixtures.projects) && Array.isArray(fixtures.layouts));
}

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function checkKeys(value, allowed, required, label) {
  if (!isObject(value)) return `${label} must be an object`;
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length) return `${label} contains unsupported properties: ${unknown.join(", ")}`;
  const missing = required.filter((key) => !(key in value));
  if (missing.length) return `${label} is missing required properties: ${missing.join(", ")}`;
  return null;
}

function validateVector3(value, label, { scale = false } = {}) {
  if (!Array.isArray(value) || value.length !== 3 || !value.every(isFiniteNumber)) {
    return `${label} must contain exactly three finite numbers`;
  }
  if (scale && value.some((component) => component < 0.05 || component > 100)) {
    return `${label} components must be between 0.05 and 100`;
  }
  if (!scale && value.some((component) => Math.abs(component) > 10000)) {
    return `${label} components must be between -10000 and 10000`;
  }
  return null;
}

/** Validate the strict, editor-derived layout_data envelope and semantic bounds. */
export function validateSpatialLayoutData(layoutData, projectUnits) {
  const envelopeError = checkKeys(layoutData,
    ["schemaVersion", "canvas2d", "scene3d"],
    ["schemaVersion", "canvas2d", "scene3d"], "layoutData");
  if (envelopeError) return envelopeError;
  if (layoutData.schemaVersion !== "tlps.spatial-layout-data/v1") return "layoutData.schemaVersion is unsupported";

  const canvas = layoutData.canvas2d;
  const canvasError = checkKeys(canvas,
    ["coordinateSpace", "width", "height", "origin", "units", "items"],
    ["coordinateSpace", "width", "height", "origin", "units", "items"], "layoutData.canvas2d");
  if (canvasError) return canvasError;
  if (canvas.coordinateSpace !== "maataa-canvas-world-v1" || canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT ||
      canvas.origin !== "top-left; x increases right; y increases down" || canvas.units !== "canvas-world-units") {
    return "layoutData.canvas2d coordinate metadata does not match the v1 editor";
  }
  if (!Array.isArray(canvas.items) || canvas.items.length > 1000) return "layoutData.canvas2d.items must contain at most 1000 items";
  const canvasIds = new Set();
  for (const [index, item] of canvas.items.entries()) {
    const label = `layoutData.canvas2d.items[${index}]`;
    const itemError = checkKeys(item,
      ["id", "kind", "x", "y", "width", "height", "title", "color"],
      ["id", "kind", "x", "y", "width", "height", "title"], label);
    if (itemError) return itemError;
    if (typeof item.id !== "string" || item.id.length < 1 || item.id.length > 128) return `${label}.id must be 1–128 characters`;
    if (canvasIds.has(item.id)) return `${label}.id must be unique within canvas items`;
    canvasIds.add(item.id);
    if (!["rectangle", "note", "ellipse"].includes(item.kind)) return `${label}.kind is unsupported`;
    if (typeof item.title !== "string" || item.title.length > 500) return `${label}.title must be at most 500 characters`;
    for (const dimension of ["x", "y", "width", "height"]) {
      if (!isFiniteNumber(item[dimension])) return `${label}.${dimension} must be finite`;
    }
    if (item.x < 0 || item.y < 0 || item.width <= 0 || item.height <= 0 ||
        item.x + item.width > CANVAS_WIDTH || item.y + item.height > CANVAS_HEIGHT) {
      return `${label} must fit within the ${CANVAS_WIDTH}×${CANVAS_HEIGHT} canvas`;
    }
    if (item.color !== undefined && (typeof item.color !== "string" || !HEX_COLOR.test(item.color))) {
      return `${label}.color must be a 3- or 6-digit hex color`;
    }
  }

  const scene = layoutData.scene3d;
  const sceneError = checkKeys(scene,
    ["coordinateUnits", "rotationUnit", "models"],
    ["coordinateUnits", "rotationUnit", "models"], "layoutData.scene3d");
  if (sceneError) return sceneError;
  if (typeof scene.coordinateUnits !== "string" || !scene.coordinateUnits.trim() || scene.coordinateUnits !== projectUnits) {
    return "layoutData.scene3d.coordinateUnits must equal spatial_projects.units";
  }
  if (scene.rotationUnit !== "radian") return "layoutData.scene3d.rotationUnit must be radian";
  if (!Array.isArray(scene.models) || scene.models.length > 250) return "layoutData.scene3d.models must contain at most 250 models";
  const modelIds = new Set();
  for (const [index, model] of scene.models.entries()) {
    const label = `layoutData.scene3d.models[${index}]`;
    const modelError = checkKeys(model,
      ["id", "name", "geometry", "position", "rotation", "scale", "material"],
      ["id", "name", "geometry", "position", "rotation", "scale", "material"], label);
    if (modelError) return modelError;
    if (typeof model.id !== "string" || model.id.length < 1 || model.id.length > 128) return `${label}.id must be 1–128 characters`;
    if (modelIds.has(model.id)) return `${label}.id must be unique within scene models`;
    modelIds.add(model.id);
    if (typeof model.name !== "string" || model.name.length > 160) return `${label}.name must be at most 160 characters`;
    if (!["box", "sphere", "plane"].includes(model.geometry)) return `${label}.geometry is unsupported`;
    for (const field of ["position", "rotation", "scale"]) {
      const vectorError = validateVector3(model[field], `${label}.${field}`, { scale: field === "scale" });
      if (vectorError) return vectorError;
    }
    const materialError = checkKeys(model.material,
      ["color", "opacity", "unlit"], ["color", "opacity", "unlit"], `${label}.material`);
    if (materialError) return materialError;
    if (typeof model.material.color !== "string" || !HEX_COLOR.test(model.material.color)) return `${label}.material.color is invalid`;
    if (!isFiniteNumber(model.material.opacity) || model.material.opacity < 0 || model.material.opacity > 1) return `${label}.material.opacity must be between 0 and 1`;
    if (typeof model.material.unlit !== "boolean") return `${label}.material.unlit must be boolean`;
  }
  return null;
}

function validateMutableBody(body, { create = false, projectUnits } = {}) {
  if (!isObject(body)) return "body must be an object";
  const allowed = create ? ["name", "canvasWidth", "canvasHeight", "layoutData"] : [...mutableFields, "expectedVersion"];
  const required = create ? ["name", "layoutData"] : ["expectedVersion"];
  const keysError = checkKeys(body, allowed, required, "body");
  if (keysError) return keysError;
  if (!create && ![...mutableFields].some((key) => key in body)) return "PATCH must include at least one mutable field";
  if (create && "expectedVersion" in body) return "expectedVersion is not accepted when creating a layout";
  if ("expectedVersion" in body && (!Number.isSafeInteger(body.expectedVersion) || body.expectedVersion < 1)) {
    return "expectedVersion must be a positive safe integer";
  }
  if ("name" in body && (typeof body.name !== "string" || !body.name.trim() || body.name.length > 160)) {
    return "name must be a non-empty string of at most 160 characters";
  }
  for (const field of ["canvasWidth", "canvasHeight"]) {
    if (field in body && body[field] !== null &&
        (!isFiniteNumber(body[field]) || body[field] <= 0 || body[field] > 1000000000000)) {
      return `${field} must be null or a positive finite decimal within the canonical precision`;
    }
  }
  if ("layoutData" in body) {
    const layoutDataError = validateSpatialLayoutData(body.layoutData, projectUnits);
    if (layoutDataError) return layoutDataError;
    if ("canvasWidth" in body && body.canvasWidth !== body.layoutData.canvas2d.width) return "canvasWidth must match layoutData.canvas2d.width";
    if ("canvasHeight" in body && body.canvasHeight !== body.layoutData.canvas2d.height) return "canvasHeight must match layoutData.canvas2d.height";
  }
  return null;
}

function projectLayoutView(row) {
  return structuredClone({
    id: row.id,
    organisation_id: row.organisation_id,
    workspace_id: row.workspace_id,
    spatial_project_id: row.spatial_project_id,
    name: row.name,
    version_number: row.version_number,
    canvas_width: row.canvas_width,
    canvas_height: row.canvas_height,
    layout_data: row.layout_data,
    layout_status: row.layout_status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by_user_id: row.created_by_user_id,
  });
}

function compareUpdatedAtThenId(left, right) {
  const leftUpdated = String(left.updated_at);
  const rightUpdated = String(right.updated_at);
  if (leftUpdated !== rightUpdated) return leftUpdated > rightUpdated ? -1 : 1;
  const leftId = String(left.id);
  const rightId = String(right.id);
  return leftId === rightId ? 0 : leftId < rightId ? -1 : 1;
}

function isoNow(clock) {
  const value = clock();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) throw new TypeError("SPATIAL_FIXTURE_CLOCK_INVALID");
  return date.toISOString();
}

/**
 * Advance the existing layout row only after the compare-and-swap check passes.
 * This helper does not represent a database transaction or durable concurrency control.
 */
export function advanceSpatialLayoutVersionOnSameRow(layout) {
  if (!layout || typeof layout !== "object" || Array.isArray(layout)) throw new TypeError("SPATIAL_LAYOUT_ROW_REQUIRED");
  const currentVersion = layout.version_number;
  if (!Number.isSafeInteger(currentVersion) || currentVersion < INITIAL_SPATIAL_LAYOUT_VERSION) {
    throw new TypeError("SPATIAL_LAYOUT_VERSION_MUST_BE_POSITIVE_SAFE_INTEGER");
  }
  if (currentVersion >= Number.MAX_SAFE_INTEGER) throw new RangeError("SPATIAL_LAYOUT_VERSION_EXHAUSTED");
  layout.version_number = currentVersion + 1;
  return layout;
}

export function createSpatialLayoutConformanceHost({ fixtures, idFactory, clock = () => new Date() } = {}) {
  if (!validFixtures(fixtures)) throw new TypeError("SPATIAL_FIXTURE_COLLECTIONS_REQUIRED");
  let sequence = 0;
  const makeId = idFactory ?? (() => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    sequence += 1;
    return `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`;
  });
  const actors = new Map(fixtures.actors.filter((item) => item?.id).map((item) => [item.id, structuredClone(item)]));
  const projects = new Map(fixtures.projects.filter((item) => item?.id).map((item) => [item.id, structuredClone(item)]));
  const layouts = new Map(fixtures.layouts.filter((item) => item?.id).map((item) => [item.id, structuredClone(item)]));

  function resolveActor(actorId) {
    return typeof actorId === "string" ? actors.get(actorId) : undefined;
  }

  function authorize(actorId, permission) {
    const actor = resolveActor(actorId);
    if (!actor) return { response: error("UNAUTHENTICATED", "A known local fixture actor is required.", { identitySource: "FIXTURE_DATA" }) };
    if (!Array.isArray(actor.permissions) || !actor.permissions.includes(permission)) {
      return { actor, response: error("FORBIDDEN", "The fixture actor does not have the required permission.", { permission }) };
    }
    return { actor };
  }

  function projectForActor(actor, projectId) {
    const project = projects.get(projectId);
    return sameTenant(actor, project) ? project : null;
  }

  function layoutForActor(actor, layoutId) {
    const layout = layouts.get(layoutId);
    const project = layout ? projects.get(layout.spatial_project_id) : null;
    if (!layout || !project || !sameTenant(actor, layout) || !sameTenant(actor, project) ||
        !sameTenant(layout, project)) return null;
    return { layout, project };
  }

  function listProjectLayouts({ actorId, projectId, limit = SPATIAL_LAYOUT_LIST_DEFAULT_LIMIT, offset = 0 } = {}) {
    const { actor, response: denied } = authorize(actorId, SPATIAL_LAYOUT_PERMISSIONS.view);
    if (denied) return denied;
    if (!UUID_V4.test(projectId ?? "")) return validationError("projectId must be a UUID v4");
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > SPATIAL_LAYOUT_LIST_MAX_LIMIT ||
        !Number.isSafeInteger(offset) || offset < 0) {
      return validationError(`limit must be 1–${SPATIAL_LAYOUT_LIST_MAX_LIMIT} and offset must be a non-negative safe integer`);
    }
    const project = projectForActor(actor, projectId);
    if (!project) return error("SPATIAL_PROJECT_NOT_FOUND", "Spatial project was not found.");
    const records = [...layouts.values()]
      .filter((layout) => layout.spatial_project_id === project.id && sameTenant(actor, layout) && sameTenant(layout, project))
      .sort(compareUpdatedAtThenId);
    const page = records.slice(offset, offset + limit);
    const nextOffset = offset + page.length < records.length ? offset + page.length : null;
    return response(200, {
      data: page.map(projectLayoutView),
      page: { limit, offset, nextOffset, total: records.length, orderBy: ["updated_at:desc", "id:asc"], includesArchived: true },
    });
  }

  function getSpatialLayout({ actorId, layoutId } = {}) {
    const { actor, response: denied } = authorize(actorId, SPATIAL_LAYOUT_PERMISSIONS.view);
    if (denied) return denied;
    if (!UUID_V4.test(layoutId ?? "")) return validationError("layoutId must be a UUID v4");
    const found = layoutForActor(actor, layoutId);
    if (!found) return error("SPATIAL_LAYOUT_NOT_FOUND", "Spatial layout was not found.");
    return response(200, { data: projectLayoutView(found.layout) });
  }

  function createProjectLayout({ actorId, projectId, body } = {}) {
    const { actor, response: denied } = authorize(actorId, SPATIAL_LAYOUT_PERMISSIONS.create);
    if (denied) return denied;
    if (!UUID_V4.test(projectId ?? "")) return validationError("projectId must be a UUID v4");
    const project = projectForActor(actor, projectId);
    if (!project) return error("SPATIAL_PROJECT_NOT_FOUND", "Spatial project was not found.");
    const bodyError = validateMutableBody(body, { create: true, projectUnits: project.units });
    if (bodyError) return validationError(bodyError);
    const id = makeId();
    if (!UUID_V4.test(id) || layouts.has(id)) return error("UNSUPPORTED_OPERATION", "The local fixture ID generator did not return a unique UUID v4.");
    const now = isoNow(clock);
    const row = {
      id,
      organisation_id: actor.organisation_id,
      workspace_id: actor.workspace_id,
      spatial_project_id: project.id,
      name: body.name,
      version_number: INITIAL_SPATIAL_LAYOUT_VERSION,
      canvas_width: body.canvasWidth ?? body.layoutData.canvas2d.width,
      canvas_height: body.canvasHeight ?? body.layoutData.canvas2d.height,
      layout_data: structuredClone(body.layoutData),
      layout_status: "draft",
      created_at: now,
      updated_at: now,
      created_by_user_id: actor.user_id ?? null,
    };
    layouts.set(row.id, row);
    return response(201, { data: projectLayoutView(row) });
  }

  function updateSpatialLayout({ actorId, layoutId, body } = {}) {
    const { actor, response: denied } = authorize(actorId, SPATIAL_LAYOUT_PERMISSIONS.edit);
    if (denied) return denied;
    if (!UUID_V4.test(layoutId ?? "")) return validationError("layoutId must be a UUID v4");
    const found = layoutForActor(actor, layoutId);
    if (!found) return error("SPATIAL_LAYOUT_NOT_FOUND", "Spatial layout was not found.");
    if (found.layout.layout_status !== "draft") {
      return error("FORBIDDEN", "Only draft spatial layouts can be edited through this working-layout operation.", { lifecycle: found.layout.layout_status });
    }
    const bodyError = validateMutableBody(body, { projectUnits: found.project.units });
    if (bodyError) return validationError(bodyError);
    const nextLayoutData = body.layoutData ?? found.layout.layout_data;
    if (body.canvasWidth !== undefined && body.canvasWidth !== null && body.canvasWidth !== nextLayoutData.canvas2d.width) {
      return validationError("canvasWidth must match the resulting layoutData.canvas2d.width");
    }
    if (body.canvasHeight !== undefined && body.canvasHeight !== null && body.canvasHeight !== nextLayoutData.canvas2d.height) {
      return validationError("canvasHeight must match the resulting layoutData.canvas2d.height");
    }

    // Synchronous compare, validation, and mutation form one indivisible step in this
    // single-threaded in-memory fixture only. This is not database CAS/transaction proof.
    if (body.expectedVersion !== found.layout.version_number) {
      return error("SPATIAL_LAYOUT_VERSION_CONFLICT", "The spatial layout changed since it was loaded.", {
        expectedVersion: body.expectedVersion,
        currentVersion: found.layout.version_number,
        writesPerformed: false,
        retry: "reload-and-explicitly-reapply",
      });
    }
    if (found.layout.version_number >= Number.MAX_SAFE_INTEGER) {
      return error("UNSUPPORTED_OPERATION", "The local fixture version counter cannot be incremented safely.", { writesPerformed: false });
    }

    const next = { ...found.layout };
    for (const field of mutableFields) {
      if (!(field in body)) continue;
      if (field === "layoutData") next.layout_data = structuredClone(body.layoutData);
      else if (field === "canvasWidth") next.canvas_width = body.canvasWidth;
      else if (field === "canvasHeight") next.canvas_height = body.canvasHeight;
      else next.name = body.name;
    }
    next.updated_at = isoNow(clock);
    advanceSpatialLayoutVersionOnSameRow(next);
    Object.assign(found.layout, next);
    return response(200, { data: projectLayoutView(found.layout) });
  }

  function unsupportedOperation() {
    return error("UNSUPPORTED_OPERATION", "This operation is not part of the frozen spatial preview contract.");
  }

  return Object.freeze({
    mode: SPATIAL_HOST_MODE,
    dataSource: SPATIAL_HOST_DATA_SOURCE,
    production: false,
    authenticated: false,
    durable: false,
    listProjectLayouts,
    getSpatialLayout,
    createProjectLayout,
    updateSpatialLayout,
    unsupportedOperation,
  });
}

export function createSpatialLayoutHostAdapter(host) {
  const methods = ["listProjectLayouts", "getSpatialLayout", "createProjectLayout", "updateSpatialLayout"];
  for (const method of methods) if (typeof host?.[method] !== "function") throw new TypeError(`SPATIAL_HOST_METHOD_REQUIRED:${method}`);
  return Object.freeze({
    mode: host.mode,
    listProjectLayouts: (input) => host.listProjectLayouts(input),
    getSpatialLayout: (input) => host.getSpatialLayout(input),
    createProjectLayout: (input) => host.createProjectLayout(input),
    updateSpatialLayout: (input) => host.updateSpatialLayout(input),
  });
}
