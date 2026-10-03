#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../schemas/api-contract-proposal.schema.json");
const defaultContract = path.join(packageRoot, "apps/tlps-application/api-contracts/spatial-preview.v1.draft.json");
const requireDomainRegistry = createRequire(path.join(packageRoot, "packages/domain-registry/package.json"));
const Ajv = requireDomainRegistry("ajv");
const jsonOutput = process.argv.includes("--json");
const inputPath = process.argv.slice(2).find((argument) => argument !== "--json");
const contractPath = path.resolve(inputPath ?? defaultContract);

const sortKeys = (value) => Array.isArray(value)
  ? value.map(sortKeys)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])]))
    : value;
const canonicalJson = (value) => JSON.stringify(sortKeys(value));
const digest = (value) => createHash("sha256").update(value, "utf8").digest("hex");
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const errors = [];
const sourceHashChecks = [];
const ajv = new Ajv({ allErrors: true, jsonPointers: true, schemaId: "auto", coerceTypes: false, useDefaults: false, removeAdditional: false });
const schema = await readJson(schemaPath);
const contract = await readJson(contractPath);

function addSchemaErrors(candidateSchema, label) {
  try {
    const validate = ajv.compile(candidateSchema);
    return { valid: true, validate };
  } catch (failure) {
    errors.push(`${label} is not a valid supported JSON Schema: ${failure.message}`);
    return { valid: false, validate: null };
  }
}

const validateProposal = addSchemaErrors(schema, "proposal schema").validate;
if (validateProposal && !validateProposal(contract)) {
  for (const item of validateProposal.errors ?? []) errors.push(`${item.dataPath || "/"} ${item.message}`);
}

const normalizeDraft2020Subset = (value) => {
  if (Array.isArray(value)) return value.map(normalizeDraft2020Subset);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    key === "$ref" && typeof item === "string" ? item.replace(/^#\/\$defs\//, "#/definitions/") : normalizeDraft2020Subset(item),
  ]));
};
const clone = (value) => JSON.parse(JSON.stringify(value));
function expandLayoutRef(value) {
  if (Array.isArray(value)) return value.map(expandLayoutRef);
  if (!value || typeof value !== "object") return value;
  if (value.$ref === "#/layoutDataContract/schema") return expandLayoutRef(clone(contract.layoutDataContract.schema));
  if (value.$ref === "#/$defs/vector3") return { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 };
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, expandLayoutRef(item)]));
}

let layoutDataSchemaStatus = "NOT_PRESENT";
if (contract.layoutDataContract?.schema) {
  const layoutSchema = normalizeDraft2020Subset(contract.layoutDataContract.schema);
  delete layoutSchema.$schema;
  if (layoutSchema.$defs) {
    layoutSchema.definitions = layoutSchema.$defs;
    delete layoutSchema.$defs;
  }
  const layoutSchemaResult = addSchemaErrors(layoutSchema, "/layoutDataContract/schema");
  layoutDataSchemaStatus = layoutSchemaResult.valid ? "PASS_DRAFT7_COMPATIBLE_SUBSET" : "FAIL";
}
if (contract.errorModel?.body) addSchemaErrors(contract.errorModel.body, "/errorModel/body");

for (const [opId, operationSchema] of Object.entries(contract.requestSchemas ?? {})) {
  const expanded = normalizeDraft2020Subset(expandLayoutRef(operationSchema));
  const prune = (value) => {
    if (Array.isArray(value)) return value.forEach(prune);
    if (!value || typeof value !== "object") return;
    delete value.$schema;
    delete value.$defs;
    for (const child of Object.values(value)) prune(child);
  };
  prune(expanded);
  addSchemaErrors(expanded, `/requestSchemas/${opId}`);
}
for (const [opId, operationSchema] of Object.entries(contract.responseSchemas ?? {})) {
  const expanded = normalizeDraft2020Subset(expandLayoutRef(operationSchema));
  const prune = (value) => {
    if (Array.isArray(value)) return value.forEach(prune);
    if (!value || typeof value !== "object") return;
    delete value.$schema;
    delete value.$defs;
    for (const child of Object.values(value)) prune(child);
  };
  prune(expanded);
  addSchemaErrors(expanded, `/responseSchemas/${opId}`);
}

let tableRegistry;
let flowRegistry;
for (const [key, relative, expected, assign] of [
  ["tableContractsSha256", "packages/domain-registry/data/table-contracts.json", contract.sourceHashes?.tableContractsSha256, (value) => { tableRegistry = value; }],
  ["flowRegistrySha256", "packages/domain-registry/data/flow-registry.json", contract.sourceHashes?.flowRegistrySha256, (value) => { flowRegistry = value; }],
]) {
  try {
    const bytes = await readFile(path.join(packageRoot, relative));
    const actual = createHash("sha256").update(bytes).digest("hex");
    sourceHashChecks.push({ source: relative, expected, actual, matches: expected === actual });
    if (expected !== actual) errors.push(`/sourceHashes/${key} does not match ${relative}`);
    assign(JSON.parse(bytes));
  } catch (failure) {
    sourceHashChecks.push({ source: relative, expected, error: failure.message, matches: false });
    errors.push(`/sourceHashes/${key} source could not be read`);
  }
}

const canonicalTableIds = new Set((tableRegistry?.contracts ?? []).map(({ id }) => id));
const canonicalFlowIds = new Set((flowRegistry?.flows ?? []).map(({ id }) => id));
const bindings = contract.sourceBindings?.tableContracts ?? [];
const bindingIds = bindings.map(({ id }) => id);
const bindingSet = new Set(bindingIds);
if (bindingSet.size !== bindingIds.length) errors.push("/sourceBindings/tableContracts contains duplicate canonical table IDs");
for (const binding of bindings) if (!canonicalTableIds.has(binding.id)) errors.push(`/sourceBindings/tableContracts references noncanonical table ${binding.id}`);
const flowIds = contract.sourceBindings?.flows ?? [];
if (new Set(flowIds).size !== flowIds.length) errors.push("/sourceBindings/flows contains duplicate flow IDs");
for (const id of flowIds) if (!canonicalFlowIds.has(id)) errors.push(`/sourceBindings/flows references unknown flow ${id}`);
const sourceActors = new Map();
for (const flow of flowRegistry?.flows?.filter(({ id }) => flowIds.includes(id)) ?? []) {
  for (const actor of flow.actors ?? []) {
    const previous = sourceActors.get(actor.roleId) ?? new Set();
    for (const ability of actor.abilities ?? []) previous.add(ability);
    sourceActors.set(actor.roleId, previous);
  }
}
const declaredPermissions = new Set((contract.security?.permissions ?? []).map(({ code }) => code));
const fixturePermissions = new Set(contract.security?.fixtureActors?.permissions ?? []);
const allowedPermissionCodes = new Set(["spatial.layout.view", "spatial.layout.create", "spatial.layout.edit"]);
for (const permission of declaredPermissions) if (!allowedPermissionCodes.has(permission)) errors.push(`/security/permissions declares unsupported permission ${permission}`);
for (const permission of fixturePermissions) if (!declaredPermissions.has(permission)) errors.push(`/security/fixtureActors references undeclared permission ${permission}`);

const operations = contract.operations ?? [];
const operationIds = operations.map(({ id }) => id);
if (new Set(operationIds).size !== operationIds.length) errors.push("/operations contains duplicate operation IDs");
const methodPaths = operations.map(({ method, path: routePath }) => `${method} ${routePath}`);
if (new Set(methodPaths).size !== methodPaths.length) errors.push("/operations contains duplicate method/path pairs");
for (const [index, operation] of operations.entries()) {
  for (const tableId of [...(operation.reads ?? []), ...(operation.writes ?? [])]) {
    if (!bindingSet.has(tableId)) errors.push(`/operations/${index} references unbound table ${tableId}`);
  }
  if (operation.permission && !declaredPermissions.has(operation.permission)) errors.push(`/operations/${index} uses undeclared permission ${operation.permission}`);
  const requiredAbility = operation.permission?.endsWith(".view") ? "view" : operation.permission?.endsWith(".create") || operation.permission?.endsWith(".edit") ? "edit" : null;
  for (const role of operation.actorRolesFromFlow ?? []) {
    if (!sourceActors.has(role)) errors.push(`/operations/${index} references actor role ${role} absent from bound flows`);
    else if (requiredAbility && !sourceActors.get(role).has(requiredAbility)) errors.push(`/operations/${index} role ${role} lacks flow ability ${requiredAbility}`);
  }
  const pathParams = Object.keys(operation.request?.pathParams ?? {}).sort();
  const pathTokens = [...(operation.path ?? "").matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort();
  if (canonicalJson(pathParams) !== canonicalJson(pathTokens)) errors.push(`/operations/${index} path placeholders do not match request.pathParams`);
  if (!contract.requestSchemas?.[operation.id] || operation.requestSchema !== `#/requestSchemas/${operation.id}`) errors.push(`/operations/${index} has no matching request schema`);
  if (!contract.responseSchemas?.[operation.id] || operation.responseSchema !== `#/responseSchemas/${operation.id}`) errors.push(`/operations/${index} has no matching response schema`);
  if (operation.lifecycle !== "DRAFT; local conformance only") errors.push(`/operations/${index} must remain DRAFT; local conformance only`);
}

const operationsById = new Map(operations.map((operation) => [operation.id, operation]));
const createLayout = operationsById.get("createSpatialProjectLayout");
if (createLayout) {
  for (const serverField of ["id", "organisation_id", "workspace_id", "spatial_project_id", "version_number", "layout_status", "created_at", "updated_at", "created_by_user_id", "expectedVersion"]) {
    if (serverField in (createLayout.request?.body ?? {})) errors.push(`/operations/createSpatialProjectLayout/request/body/${serverField} must not be client supplied`);
    if (!(createLayout.request?.mustNotAcceptFromClient ?? []).includes(serverField)) errors.push(`/operations/createSpatialProjectLayout must reject client field ${serverField}`);
  }
  if (!createLayout.request?.serverOwnedOrDerived?.some((rule) => /version_number initialized to 1/.test(rule))) errors.push("create must initialize version_number to 1");
  if (createLayout.response?.status !== 201) errors.push("create must return HTTP 201");
}
const updateLayout = operationsById.get("updateSpatialLayout");
if (updateLayout) {
  const updateBody = updateLayout.request?.body ?? {};
  const allowedPatch = new Set(["expectedVersion", "name", "canvasWidth", "canvasHeight", "layoutData"]);
  for (const key of Object.keys(updateBody)) if (!allowedPatch.has(key)) errors.push(`/operations/updateSpatialLayout/request/body/${key} is outside PATCH allowlist`);
  if (canonicalJson(Object.keys(updateBody).sort()) !== canonicalJson([...allowedPatch].sort())) errors.push("PATCH request body must define expectedVersion and exactly the frozen mutable fields");
  if (updateBody.expectedVersion?.required !== true || updateBody.expectedVersion?.type !== "integer") errors.push("PATCH requires integer expectedVersion");
  if (updateLayout.request?.patchSemantics?.layoutData !== "FULL_REPLACEMENT") errors.push("PATCH layoutData must be full replacement");
  if (updateLayout.request?.conflict?.status !== 409 || updateLayout.request?.conflict?.code !== "SPATIAL_LAYOUT_VERSION_CONFLICT" || updateLayout.request?.conflict?.writePerformed !== false) errors.push("PATCH stale-version conflict must be a no-write 409");
  if (!updateLayout.request?.serverOwnedOrImmutable?.some((rule) => /version_number increments once on same row/.test(rule))) errors.push("PATCH must increment version_number once on the same row after accepted save");
  if (!/Only draft spatial layouts (?:can be edited|are editable)/.test(updateLayout.request?.lifecycleRule ?? "")) errors.push("PATCH must state the draft-only lifecycle rule");
  if (updateLayout.response?.status !== 200) errors.push("PATCH must return HTTP 200");
}

if (contract.domainDecision?.authoritativeWorkingLayout !== "eventsspatial.spatial_layouts" || contract.domainDecision?.dualWrite !== false) errors.push("spatial_layouts must remain the single working-layout write target");
if ((operations).some((operation) => (operation.writes ?? []).includes(contract.domainDecision?.exhibitionDeliverable))) errors.push("operation writes to exhibitionDeliverable; dual-write is forbidden");
if (contract.security?.fixtureActors?.browserRoleIsActor !== false || contract.security?.fixtureActors?.realAuthentication !== false || contract.security?.tenantScope?.clientMayOverride !== false) errors.push("fixture actor and tenant boundary claims are inconsistent");
if (contract.claims?.canonicalSchemaChanged !== false || contract.claims?.productionRuntimeExists !== false || contract.claims?.serverAuthorizationImplemented !== false || contract.claims?.persistentReadWriteImplemented !== false || contract.claims?.migrationOrDeploymentApproved !== false) errors.push("proposal claims must not imply production, canonical, authorization, persistence, migration, or deployment readiness");

const secretKey = /(^|_)(secret|password|credential|api_?key|access_?token|refresh_?token)(_|$)/i;
function scanForSecrets(value, pointer = "") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (secretKey.test(key)) errors.push(`${pointer}/${key} must not contain secret material`);
    scanForSecrets(child, `${pointer}/${key}`);
  }
}
scanForSecrets(contract);
if (contract.runtimeBinding?.baseUrl !== null || contract.runtimeBinding?.environmentId !== null || contract.runtimeBinding?.verificationEvidence !== null) errors.push("runtime binding must remain unconfigured for local fixture conformance");

const errorCodes = new Map((contract.errorModel?.codes ?? []).map(({ code, status }) => [code, status]));
for (const [code, status] of Object.entries({ VALIDATION_FAILED: 400, UNAUTHENTICATED: 401, FORBIDDEN: 403, SPATIAL_PROJECT_NOT_FOUND: 404, SPATIAL_LAYOUT_NOT_FOUND: 404, SPATIAL_LAYOUT_VERSION_CONFLICT: 409, UNSUPPORTED_OPERATION: 501 })) {
  if (errorCodes.get(code) !== status) errors.push(`/errorModel/codes must map ${code} to ${status}`);
}
if (contract.errorModel?.openSemantics?.length) errors.push("/errorModel/openSemantics must be empty for locally frozen semantics");

const blockers = [
  ...(contract.openDecisions ?? []).map((decision) => ({ id: decision.id, class: "OTHER", source: "openDecisions", question: decision.question, blocks: decision.blocks })),
  ...(contract.readiness?.blockers ?? []).map((message, index) => ({ id: `readiness-${index + 1}`, class: "OTHER", source: "readiness.blockers", message })),
];
const externalBlockers = contract.externalBlockers ?? [];
const blockerAudit = contract.blockerAudit ?? [];
const auditClasses = new Set(blockerAudit.map(({ class: category }) => category));
for (const category of ["CONTRACT_SEMANTICS", "PAYLOAD", "PATCH", "QUERY", "PAGINATION", "CONFLICT", "AUTHORIZATION", "IDENTITY", "REAL_HOST", "ENVIRONMENT"]) {
  if (!auditClasses.has(category)) errors.push(`/blockerAudit does not classify ${category}`);
}
for (const entry of blockerAudit) {
  if (entry.status === "RESOLVED_LOCAL" && ["IDENTITY", "REAL_HOST", "ENVIRONMENT"].includes(entry.class)) errors.push(`/blockerAudit/${entry.id} cannot mark an external blocker locally resolved`);
  if (entry.status === "EXTERNAL" && !externalBlockers.some((item) => item.class === entry.class)) errors.push(`/blockerAudit/${entry.id} is external but missing from externalBlockers`);
}
const canonicalFirst = canonicalJson(contract);
const canonicalSecond = canonicalJson(contract);
if (canonicalFirst !== canonicalSecond) errors.push("canonical JSON hashing is nondeterministic");
const contractSetSha256 = digest(canonicalFirst);
const contractSetSha256Repeat = digest(canonicalSecond);
if (contractSetSha256 !== contractSetSha256Repeat) errors.push("canonical contract hashing did not reproduce the same SHA-256 twice");
const result = {
  contract: path.relative(packageRoot, contractPath),
  schemaVersion: contract.schemaVersion,
  serviceId: contract.serviceId,
  validation: errors.length ? "INVALID" : blockers.length ? "VALID_DRAFT_WITH_LOCAL_BLOCKERS" : "VALIDATED_LOCAL_API_CONTRACT",
  schema: errors.length ? "FAIL" : "PASS",
  layoutDataSchema: layoutDataSchemaStatus,
  contractSetSha256,
  canonicalByteLength: Buffer.byteLength(canonicalFirst, "utf8"),
  sourceHashChecks,
  operations: operations.map(({ id, method, path: routePath, lifecycle, permission }) => ({ id, method, path: routePath, lifecycle, permission })),
  localBlockers: blockers,
  externalBlockers,
  findings: errors,
};

if (jsonOutput) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
else {
  console.log(`API contract proposal: ${result.validation}`);
  console.log(`Schema validation: ${result.schema}`);
  console.log(`Nested layout-data schema: ${result.layoutDataSchema}`);
  console.log(`Contract-set SHA-256: ${result.contractSetSha256}`);
  console.log(`Canonical bytes: ${result.canonicalByteLength}`);
  for (const check of sourceHashChecks) console.log(`Source hash ${check.matches ? "PASS" : "FAIL"}: ${check.source}`);
  console.log(`Operations: ${result.operations.length}`);
  for (const operation of result.operations) console.log(`  ${operation.method} ${operation.path} · ${operation.lifecycle}`);
  console.log(`Local blockers: ${blockers.length}`);
  console.log(`External blockers: ${externalBlockers.length}`);
  for (const finding of errors) console.error(`ERROR ${finding}`);
}
if (errors.length) process.exitCode = 1;
