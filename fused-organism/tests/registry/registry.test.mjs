import test from "node:test";
import assert from "node:assert/strict";
import { registry, isRegisteredComponent } from "../../packages/registry/src/index.mjs";

test("registry is generated and unique", () => {
  assert.ok(registry.length >= 70);
  assert.equal(new Set(registry.map((entry) => entry.componentId)).size, registry.length);
  assert.equal(isRegisteredComponent("maataa.control.command-ack"), true);
});

test("all interactive registry entries declare accessibility role where expected", () => {
  const core = registry.filter((entry) => entry.category === "foundation");
  assert.ok(core.some((entry) => entry.componentId === "maataa.core.button" && entry.a11yRole === "button"));
});

test("every registry entry resolves to a render adapter or is explicitly headless", () => {
  for (const entry of registry) {
    const hasAdapter = typeof entry.renderAdapter === "string" && entry.renderAdapter.length > 0;
    assert.ok(entry.headless === true || hasAdapter, `${entry.componentId} has neither a render adapter nor headless=true`);
  }
});
