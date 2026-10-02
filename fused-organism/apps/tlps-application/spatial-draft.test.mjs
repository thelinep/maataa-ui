import test from "node:test";
import assert from "node:assert/strict";
import {
  isSpatialDraft,
  readSpatialDraft,
  SPATIAL_DRAFT_KEY,
  starterSpatialDraft,
  writeSpatialDraft,
} from "./src/spatialDraft.mjs";

function storageWith(value = null) {
  const values = new Map(value === null ? [] : [[SPATIAL_DRAFT_KEY, value]]);
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, next) {
      values.set(key, next);
    },
  };
}

test("spatial draft validates the canvas and 3D models together", () => {
  assert.equal(isSpatialDraft(starterSpatialDraft), true);
  assert.equal(isSpatialDraft({ ...starterSpatialDraft, models: [{ id: "invalid" }] }), false);
});

test("spatial draft persists and reloads a JSON-safe local copy", () => {
  const storage = storageWith();
  assert.equal(writeSpatialDraft(storage, starterSpatialDraft), true);
  assert.deepEqual(readSpatialDraft(storage), starterSpatialDraft);
});

test("corrupt or unavailable local storage fails safely", () => {
  assert.equal(readSpatialDraft(storageWith("{broken")), null);
  assert.equal(
    writeSpatialDraft(
      {
        setItem() {
          throw new Error("quota");
        },
      },
      starterSpatialDraft,
    ),
    false,
  );
});
