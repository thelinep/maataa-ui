import test from "node:test";
import assert from "node:assert/strict";
import { createRenderPlan } from "../../packages/renderer/src/index.mjs";

test("renderer rejects unregistered components", () => {
  assert.equal(createRenderPlan({ componentId: "evil.component", props: {} }).reason, "UNREGISTERED_COMPONENT");
});

test("renderer validates the top-level node before reading its fields", () => {
  let invoked = false;
  const node = { props: {} };
  Object.defineProperty(node, "componentId", { enumerable: true, get() { invoked = true; return "maataa.core.button"; } });
  assert.equal(createRenderPlan(node).reason, "HOSTILE_NODE");
  assert.equal(invoked, false);
});

test("renderer rejects executable props", () => {
  assert.equal(createRenderPlan({ componentId: "maataa.core.button", version: "1.0.0", props: () => {} }).reason, "HOSTILE_PAYLOAD");
});

test("renderer rejects nested hostile payloads at runtime without invoking accessors", () => {
  const nested = createRenderPlan({ componentId: "maataa.core.button", version: "1.0.0", props: { safe: { onClick: () => "run" } } });
  assert.equal(nested.reason, "HOSTILE_PAYLOAD");

  let getterInvoked = false;
  const props = {};
  Object.defineProperty(props, "payload", { enumerable: true, get() { getterInvoked = true; throw new Error("should not run"); } });
  const accessor = createRenderPlan({ componentId: "maataa.core.button", version: "1.0.0", props });
  assert.equal(accessor.reason, "HOSTILE_PAYLOAD");
  assert.equal(getterInvoked, false);

  const polluted = Object.create({ inherited: "hostile" });
  polluted.label = "Click";
  const customPrototype = createRenderPlan({ componentId: "maataa.core.button", version: "1.0.0", props: polluted });
  assert.equal(customPrototype.reason, "HOSTILE_PAYLOAD");
});
