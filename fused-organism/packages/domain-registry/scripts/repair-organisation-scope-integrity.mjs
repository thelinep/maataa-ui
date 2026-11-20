import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalJson, sha256 } from "../src/hash.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(packageRoot, "data/table-contracts.json");
const amendmentPath = path.join(packageRoot, "schema-sources/authored/maataa-core-v1/organisation-scope-integrity-amendment.v1.2.0.json");
const amendmentRef = "schema-sources/authored/maataa-core-v1/organisation-scope-integrity-amendment.v1.2.0.json";
const ids = [
  "organisation.workspace_activity",
  "organisation.workspace_favourites",
  "organisation.workspace_invites",
  "organisation.workspace_roles",
  "organisation.workspace_settings",
  "organisation.workspace_memberships",
  "organisation.workspaces",
];
const modifiedIds = new Set(ids.slice(0, 5));

const registry = JSON.parse(await readFile(registryPath, "utf8"));
const contracts = new Map(registry.contracts.map((contract) => [contract.id, structuredClone(contract)]));
let priorAmendment;
try {
  priorAmendment = JSON.parse(await readFile(amendmentPath, "utf8"));
} catch {
  priorAmendment = null;
}
const priorBase = new Map((priorAmendment?.baseContracts ?? []).map((item) => [item.id, item]));
const baseContracts = ids.map((id) => {
  const contract = contracts.get(id);
  if (!contract) throw new Error(`CONTRACT_MISSING:${id}`);
  return priorBase.get(id) ?? { id, version: contract.version, hash: sha256(contract) };
});
const reviewedAt = new Date().toISOString();
const reviewedBy = "thelinep";

function replaceForeignKey(contract, name, fields, referencedFields, onDelete) {
  const fk = contract.foreignKeys.find((item) => item.name === name);
  if (!fk) throw new Error(`FOREIGN_KEY_MISSING:${contract.id}:${name}`);
  Object.assign(fk, { fields, referencedFields, onDelete });
}

function replaceRelation(contract, name, from, toFields) {
  const relation = contract.relations.find((item) => item.name === name);
  if (!relation) throw new Error(`RELATION_MISSING:${contract.id}:${name}`);
  Object.assign(relation, { from, toFields });
}

for (const id of modifiedIds) {
  const contract = contracts.get(id);
  contract.version = "1.1.0";
}

const workspaceScopedTables = [
  "organisation.workspace_activity",
  "organisation.workspace_favourites",
  "organisation.workspace_invites",
  "organisation.workspace_roles",
  "organisation.workspace_settings",
];
for (const id of workspaceScopedTables) {
  const contract = contracts.get(id);
  const fkName = `${contract.name}_workspace_fk`;
  replaceForeignKey(contract, fkName, ["workspace_id", "organisation_id"], ["id", "organisation_id"], "cascade");
  replaceRelation(contract, "workspace", ["workspace_id", "organisation_id"], ["id", "organisation_id"]);
}

const roles = contracts.get("organisation.workspace_roles");
roles.uniqueConstraints ??= [];
if (!roles.uniqueConstraints.some((item) => item.name === "workspace_roles_id_workspace_organisation_unique")) {
  roles.uniqueConstraints.push({
    name: "workspace_roles_id_workspace_organisation_unique",
    fields: ["id", "workspace_id", "organisation_id"],
  });
}

const activity = contracts.get("organisation.workspace_activity");
replaceForeignKey(activity, "workspace_activity_actor_membership_fk", ["actor_membership_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"], "restrict");
replaceRelation(activity, "actorMembership", ["actor_membership_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"]);

const favourites = contracts.get("organisation.workspace_favourites");
replaceForeignKey(favourites, "workspace_favourites_membership_fk", ["membership_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"], "cascade");
replaceRelation(favourites, "membership", ["membership_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"]);

const invites = contracts.get("organisation.workspace_invites");
replaceForeignKey(invites, "workspace_invites_role_fk", ["role_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"], "restrict");
replaceRelation(invites, "role", ["role_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"]);
replaceForeignKey(invites, "workspace_invites_inviter_membership_fk", ["invited_by_membership_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"], "restrict");
replaceRelation(invites, "invitedByMembership", ["invited_by_membership_id", "workspace_id", "organisation_id"], ["id", "workspace_id", "organisation_id"]);

const revisedContracts = ids.map((id) => contracts.get(id));
function setProvenance(value, contractId) {
  if (Array.isArray(value)) {
    for (const item of value) setProvenance(item, contractId);
  } else if (value && typeof value === "object") {
    if (value.source === "maataa-core-v1" || value.reference?.startsWith("schema-sources/authored/maataa-core-v1/contracts.json#")) {
      value.source = "maataa-core-v1-scope-integrity-v1.2.0";
      value.reference = `${amendmentRef}#${contractId}`;
      value.reviewStatus = "approved";
      value.reviewedBy = reviewedBy;
      value.reviewedAt = reviewedAt;
    }
    for (const child of Object.values(value)) setProvenance(child, contractId);
  }
}
for (const id of modifiedIds) setProvenance(contracts.get(id), id);

const contractSetHash = sha256(revisedContracts);
const amendment = {
  schemaVersion: "1.0.0",
  amendmentId: "organisation-scope-integrity-v1.2.0",
  context: "organisation",
  decision: "APPROVED",
  reviewedBy,
  reviewedAt,
  reviewBasis: "MAATAA-authored tenant/workspace integrity corrections; exact affected contract set and closure-bound provider previews.",
  baseContracts,
  contractIds: ids,
  contractSetHash,
  decisions: [
    { id: "workspace-reference-tenant-closure", findingCount: 5, decision: "All five workspace-owned records reference workspaces by (workspace_id, organisation_id); direct organisation references remain explicit." },
    { id: "membership-reference-workspace-closure", findingCount: 3, decision: "Membership references carry workspace and organisation scope. Optional actor/inviter references restrict membership deletion until the actor reference is explicitly cleared; favourites cascade with membership deletion." },
    { id: "workspace-role-reference-closure", findingCount: 1, decision: "Invited roles are referenced by (role_id, workspace_id, organisation_id); roles cannot be deleted while invitations refer to them." },
  ],
  contracts: revisedContracts,
  productionBoundary: { migrationApproved: false, deploymentApproved: false },
};

for (const contract of revisedContracts) contracts.set(contract.id, contract);
registry.contracts = registry.contracts.map((contract) => contracts.get(contract.id));
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
await writeFile(amendmentPath, `${JSON.stringify(amendment, null, 2)}\n`);
console.log(JSON.stringify({
  status: "UPDATED",
  contractIds: ids,
  contractSetHash,
  amendmentPath: path.relative(packageRoot, amendmentPath),
  changedForeignKeyFindings: 9,
}, null, 2));
