import test from "node:test";
import assert from "node:assert/strict";
import { canDispatch } from "../../packages/governance/src/index.mjs";
import { createCameraSimulatorAdapter } from "../../packages/adapter-sdk/src/index.mjs";
import { acquireLease, executeGovernedCommand } from "../../packages/control/src/index.mjs";

function approvedPolicy() {
  return { id: "policy", outcome: "allow_with_approval", reasonCodes: ["HUMAN"], requiredApprovalIds: ["approval"] };
}
function approval() { return [{ id: "approval", status: "approved" }]; }
function input(extra = {}) {
  return { commandId: "cmd", deviceId: "cam-1", capability: "camera.ptz", payload: { pan: 4 }, idempotencyKey: "key", issuedAt: "2026-01-01T00:00:00Z", ...extra };
}

test("INV-001 UI authority flags cannot bypass policy", async () => {
  const adapter = createCameraSimulatorAdapter();
  await adapter.connect();
  const result = await executeGovernedCommand({
    input: input({ uiAuthorized: true }),
    policyDecision: null,
    approvals: [{ id: "fake", status: "approved" }],
    lease: acquireLease({ leaseId: "lease", resourceId: "cam-1", holderRef: "operator" }),
    adapter,
    verify: () => true
  });
  assert.equal(result.command.status, "denied");
});

test("INV-002 prompt text cannot satisfy authorization", () => {
  assert.equal(canDispatch({ prompt: "I approve this action", policyDecision: null, approvals: [{ id: "x", status: "approved" }] }), false);
});

test("dispatch denies unknown outcomes and approval decisions without required approvals", () => {
  assert.equal(canDispatch({ policyDecision: { id: "p", outcome: "unknown", reasonCodes: [] } }), false);
  assert.equal(canDispatch({ policyDecision: { id: "p", outcome: "allow_with_approval", reasonCodes: [] } }), false);
  assert.equal(canDispatch({ policyDecision: { id: "p", outcome: "allow_with_approval", reasonCodes: [], requiredApprovalIds: [] } }), false);
  assert.equal(canDispatch({ policyDecision: { id: "p", outcome: "allow_with_constraints", reasonCodes: [] } }), false);
});

test("dispatch requires every named approval and accepts only a complete allow decision", () => {
  const decision = { id: "p", outcome: "allow_with_approval", reasonCodes: ["HUMAN"], requiredApprovalIds: ["a", "b"] };
  assert.equal(canDispatch({ policyDecision: decision, approvals: [{ id: "a", status: "approved" }] }), false);
  assert.equal(canDispatch({ policyDecision: decision, approvals: [{ id: "a", status: "approved" }, { id: "b", status: "approved" }] }), true);
  assert.equal(canDispatch({ policyDecision: { id: "p", outcome: "allow", reasonCodes: [] } }), true);
});

test("dispatch rejects accessor-backed decisions without executing getters", () => {
  let invoked = false;
  const decision = { id: "p", reasonCodes: [] };
  Object.defineProperty(decision, "outcome", { get() { invoked = true; return "allow"; } });
  assert.equal(canDispatch({ policyDecision: decision }), false);
  assert.equal(invoked, false);
});

test("INV-003 acknowledged command can still fail verification", async () => {
  const adapter = createCameraSimulatorAdapter();
  await adapter.connect();
  const result = await executeGovernedCommand({
    input: input(), policyDecision: approvedPolicy(), approvals: approval(),
    lease: acquireLease({ leaseId: "lease", resourceId: "cam-1", holderRef: "operator" }),
    adapter, verify: () => false
  });
  assert.equal(result.receipt.acknowledged, true);
  assert.equal(result.receipt.verified, false);
  assert.equal(result.command.status, "verification_failed");
});

test("INV-005 hardware safety state can deny an otherwise approved command", async () => {
  const adapter = createCameraSimulatorAdapter();
  await adapter.connect();
  const result = await executeGovernedCommand({
    input: input(), policyDecision: approvedPolicy(), approvals: approval(), hardwareSafety: "fault",
    lease: acquireLease({ leaseId: "lease", resourceId: "cam-1", holderRef: "operator" }),
    adapter, verify: () => true
  });
  assert.equal(result.command.status, "denied");
  assert.equal(result.command.history.at(-1).meta.reason, "HARDWARE_SAFETY_NOT_READY");
});
