import test from "node:test";
import assert from "node:assert/strict";
import { semanticTokens } from "../../packages/core/src/index.mjs";

test("semantic control states have distinct token values", () => {
  const values = Object.values(semanticTokens);
  assert.equal(new Set(values).size, values.length);
});
