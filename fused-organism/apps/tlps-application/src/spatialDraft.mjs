export const SPATIAL_DRAFT_KEY = "tlps:spatial-workspace:layout-draft:v1";

export const starterSpatialDraft = {
  version: 1,
  canvasItems: [
    {
      id: "layout-entrance",
      kind: "rectangle",
      x: 214,
      y: 276,
      width: 170,
      height: 106,
      title: "Main entrance",
      color: "#8CC9C4",
    },
    {
      id: "layout-stage",
      kind: "rectangle",
      x: 518,
      y: 194,
      width: 250,
      height: 160,
      title: "Exhibition stage",
      color: "#F0C77B",
    },
    {
      id: "layout-note",
      kind: "note",
      x: 830,
      y: 408,
      width: 220,
      height: 148,
      title: "Power + access",
      color: "#D8D0EF",
    },
  ],
  models: [
    {
      id: "sample-cube",
      name: "Main stage",
      geometry: "box",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1.5, 0.35, 0.8],
      material: { color: "#E0B060", opacity: 1, unlit: false },
    },
    {
      id: "sample-sphere",
      name: "Entry marker",
      geometry: "sphere",
      position: [-1.7, 0.15, 0],
      rotation: [0, 0, 0],
      scale: [0.35, 0.35, 0.35],
      material: { color: "#09A6A0", opacity: 1, unlit: false },
    },
  ],
};

function isFiniteVector(value) {
  return Array.isArray(value) && value.length === 3 && value.every((part) => Number.isFinite(part));
}

function validCanvasItems(items) {
  return (
    Array.isArray(items) &&
    items.length <= 1000 &&
    items.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        ["rectangle", "note", "ellipse"].includes(item.kind) &&
        [item.x, item.y, item.width, item.height].every(Number.isFinite) &&
        item.width > 0 &&
        item.height > 0 &&
        (item.color === undefined || typeof item.color === "string"),
    )
  );
}

function validModels(models) {
  return (
    Array.isArray(models) &&
    models.length <= 250 &&
    models.every(
      (model) =>
        model &&
        typeof model.id === "string" &&
        typeof model.name === "string" &&
        ["box", "sphere", "plane"].includes(model.geometry) &&
        isFiniteVector(model.position) &&
        isFiniteVector(model.rotation) &&
        isFiniteVector(model.scale) &&
        model.scale.every((part) => part >= 0.05 && part <= 100) &&
        model.material &&
        /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(model.material.color) &&
        Number.isFinite(model.material.opacity) &&
        model.material.opacity >= 0 &&
        model.material.opacity <= 1 &&
        typeof model.material.unlit === "boolean",
    )
  );
}

export function isSpatialDraft(value) {
  return Boolean(
    value && value.version === 1 && validCanvasItems(value.canvasItems) && validModels(value.models),
  );
}

export function readSpatialDraft(storage, key = SPATIAL_DRAFT_KEY) {
  try {
    const saved = storage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return isSpatialDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSpatialDraft(storage, draft, key = SPATIAL_DRAFT_KEY) {
  if (!isSpatialDraft(draft)) return false;
  try {
    storage.setItem(key, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}
