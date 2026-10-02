export const policyOutcomes = Object.freeze(["allow","deny","allow_with_approval","allow_with_constraints"]);
function ownValue(record, key) {
  const descriptor = Object.getOwnPropertyDescriptor(record, key);
  return descriptor && Object.hasOwn(descriptor, "value") ? descriptor.value : undefined;
}

function isRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isStringList(value, { nonEmpty = false } = {}) {
  if (!Array.isArray(value) || (nonEmpty && value.length === 0)) return false;
  for (let index = 0; index < value.length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !Object.hasOwn(descriptor, "value") || typeof descriptor.value !== "string" || descriptor.value.length === 0) return false;
  }
  return true;
}

export function canDispatch(input) {
  try {
    if (!isRecord(input)) return false;
    const policyDecision = ownValue(input, "policyDecision");
    const approvals = ownValue(input, "approvals") ?? [];
    if (!isRecord(policyDecision) || !Array.isArray(approvals)) return false;

    const id = ownValue(policyDecision, "id");
    const outcome = ownValue(policyDecision, "outcome");
    const reasonCodes = ownValue(policyDecision, "reasonCodes");
    if (typeof id !== "string" || id.length === 0 || !policyOutcomes.includes(outcome) || !isStringList(reasonCodes)) return false;
    if (outcome === "deny" || outcome === "allow_with_constraints") return false;
    if (outcome === "allow") return true;

    const requiredApprovalIds = ownValue(policyDecision, "requiredApprovalIds");
    if (!isStringList(requiredApprovalIds, { nonEmpty: true })) return false;
    const approvedIds = new Set();
    for (const approval of approvals) {
      if (!isRecord(approval)) continue;
      if (ownValue(approval, "status") === "approved") {
        const approvalId = ownValue(approval, "id");
        if (typeof approvalId === "string" && approvalId.length > 0) approvedIds.add(approvalId);
      }
    }
    for (let index = 0; index < requiredApprovalIds.length; index += 1) {
      const approvalId = Object.getOwnPropertyDescriptor(requiredApprovalIds, String(index))?.value;
      if (!approvedIds.has(approvalId)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
export function evidenceReceipt({actionId,evidenceIds=[],verified=false}) {
  return Object.freeze({actionId,evidenceIds:[...evidenceIds],verified,createdAt:new Date().toISOString()});
}

const governanceComponentIds = new Set(["maataa.governance.proposal-diff", "maataa.governance.policy-status", "maataa.governance.approval-gate", "maataa.governance.approval-decision", "maataa.governance.evidence-viewer", "maataa.governance.provenance-trail", "maataa.governance.audit-trail", "maataa.governance.execution-receipt", "maataa.governance.authoritative-state", "maataa.governance.stale-state-warning", "maataa.governance.conflict-state"]);
export function createHeadlessComponent(componentId, props={}) { if(!governanceComponentIds.has(componentId)) throw new Error(`UNKNOWN_GOVERNANCE_COMPONENT:${componentId}`); return Object.freeze({kind:"maataa.headless",componentId,props:Object.freeze({...props})}); }
