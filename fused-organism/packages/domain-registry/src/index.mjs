import manifest from "../registry.manifest.json" with { type: "json" };
import domains from "../data/domain-catalog.json" with { type: "json" };
import contexts from "../data/context-registry.json" with { type: "json" };
import products from "../products/compositions.json" with { type: "json" };
import flows from "../data/flow-registry.json" with { type: "json" };
import routes from "../data/route-registry.json" with { type: "json" };
import actors from "../data/actor-registry.json" with { type: "json" };
import sliceMap from "../flows/slice-map.json" with { type: "json" };
import routeResolutions from "../flows/route-resolutions.json" with { type: "json" };
import futureProductionTables from "../catalog/future-production-tables.json" with { type: "json" };
import flowClassifications from "../flows/flow-classifications.json" with { type: "json" };
import spine from "../catalog/spine.json" with { type: "json" };
import registeredRoutes from "../routes/registered.json" with { type: "json" };
import declaredPatterns from "../routes/declared-patterns.json" with { type: "json" };
import routeAliases from "../routes/aliases.json" with { type: "json" };
import routeResolutionRegistry from "../routes/resolutions.json" with { type: "json" };
import routeFindings from "../routes/findings.json" with { type: "json" };
import flowRouteReferences from "../routes/flow-references.json" with { type: "json" };
import deferredRoutes from "../routes/deferred.json" with { type: "json" };
import routePatternPolicy from "../routes/pattern-derivation-policy.json" with { type: "json" };
import scalarTypes from "../data/scalar-types.json" with { type: "json" };
import tableContracts from "../data/table-contracts.json" with { type: "json" };
import authoredKernel from "../schema-sources/authored/maataa-core-v1/contracts.json" with { type: "json" };
import communicationsDraft from "../schema-sources/authored/maataa-communications-v1/contracts.draft.json" with { type: "json" };
import { validateTableContract } from "./contracts.mjs";
import schemaSources from "../schema-sources/registry.json" with { type: "json" };
import candidateSchemaSources from "../schema-sources/candidates/neroevents-postgres-migrations.json" with { type: "json" };
import maataaCommunicationsSource from "../schema-sources/approved/maataa-communications-v1.json" with { type: "json" };

export const registry = Object.freeze({ manifest, domains, contexts, products, flows, routes, registeredRoutes, declaredPatterns, routeAliases, routeResolutionRegistry, routeFindings, flowRouteReferences, deferredRoutes, routePatternPolicy, actors, sliceMap, routeResolutions, futureProductionTables, flowClassifications, spine, scalarTypes, tableContracts, authoredContracts: authoredKernel.contracts, draftContracts: communicationsDraft.contracts, schemaSources: { ...schemaSources, records: [candidateSchemaSources, maataaCommunicationsSource] } });

const uniqueBy = (items, field) => new Map(items.map((item) => [item[field], item]));
const compositionProducts = (source) => source.products.products ?? [];
const appProducts = (source) => source.products.applicationProducts ?? [];
const actorId = (actor) => typeof actor === "string" ? actor : actor.roleId;
const allRouteRefs = (flow) => [...(flow.entryPoints ?? []), ...(flow.steps ?? []), ...(flow.routes ?? [])]
  .map((item) => typeof item === "string" ? item : item.route)
  .filter(Boolean);
const isSemver = (version) => typeof version === "string" && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version);
const normalizePath = (path) => {
  const pathname = String(path).split(/[?#]/, 1)[0].replace(/\/{2,}/g, "/");
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
};
const authoredAliasTargets = (source) => (source.routeAliases?.aliases ?? source.routeResolutions.aliases ?? []).map((item) => item.target ?? item.matched);
const matchPattern = (pattern, path) => {
  const escaped = normalizePath(pattern).split("/").map((part) => part.startsWith(":") || /^\{[^/]+\}$/.test(part) ? "[^/]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/");
  return new RegExp(`^${escaped}/?$`).test(normalizePath(path));
};

export function resolveRoute(path, source = registry) {
  const requested = String(path);
  const routeList = source.registeredRoutes?.routes ?? source.routes.routes ?? [];
  const itemPath = (item) => item.path ?? item.route;
  const exact = routeList.find((item) => itemPath(item) === requested && (item.routeState === "REGISTERED_STATIC" || item.status === "registered"));
  if (exact) return { requested, status: "exact", routeState: "REGISTERED_STATIC", registered: true, executable: true, matched: itemPath(exact), route: exact };
  const normalizedPath = normalizePath(requested);
  const normalized = routeList.find((item) => (item.routeState === "REGISTERED_STATIC" || (item.status === "registered" && !/(^|\/)(:[^/]+|\{[^/]+\})(?=\/|$)/.test(itemPath(item)))) && normalizePath(itemPath(item)) === normalizedPath);
  if (normalized) return { requested, status: "normalized", routeState: "REGISTERED_STATIC", registered: true, executable: true, matched: itemPath(normalized), route: normalized };
  const registeredDynamic = routeList.find((item) => (item.routeState === "REGISTERED_DYNAMIC" || (item.status === "registered" && /(^|\/)(:[^/]+|\{[^/]+\})(?=\/|$)/.test(itemPath(item)))) && matchPattern(itemPath(item), requested));
  if (registeredDynamic) return { requested, status: "dynamic-match", routeState: "REGISTERED_DYNAMIC", registered: true, executable: true, matched: itemPath(registeredDynamic), route: registeredDynamic };
  const patterns = source.declaredPatterns?.patterns ?? source.routePatterns?.patterns ?? [];
  const declared = patterns.find((item) => matchPattern(item.path, requested));
  if (declared) return { requested, status: "declared-unregistered", routeState: "DECLARED_UNREGISTERED", registered: false, executable: false, matched: declared.path, route: declared };
  const alias = (source.routeAliases?.aliases ?? source.routeResolutions.aliases ?? []).find((item) => normalizePath(item.requested) === normalizedPath && item.provenance && item.approvedBy);
  const aliasTarget = alias?.target ?? alias?.matched;
  const aliasRoute = alias && routeList.find((item) => normalizePath(itemPath(item)) === normalizePath(aliasTarget) && (item.registered === true || item.status === "registered" || item.routeState === "REGISTERED_STATIC" || item.routeState === "REGISTERED_DYNAMIC"));
  if (alias && aliasRoute) return { requested, status: "alias", routeState: "APPROVED_ALIAS", registered: true, executable: true, matched: aliasTarget, route: aliasRoute };
  return { requested, status: "unresolved", routeState: "UNRESOLVED", registered: false, executable: false, owner: "platform", resolution: null, route: null };
}

const findingMetadata = {
  "duplicate-table-id": ["DATA_QUALITY_GAP", "ERROR", "data-quality", "Remove or reconcile the duplicate canonical table ID."],
  "duplicate-domain-id": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Assign each domain a unique canonical ID."],
  "duplicate-context-id": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Assign each context a unique canonical ID."],
  "duplicate-flow-id": ["DATA_QUALITY_GAP", "ERROR", "data-quality", "Reconcile duplicate flow IDs against the source flow index."],
  "duplicate-product-id": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Assign each composition a unique canonical ID."],
  "invalid-table-id": ["SCHEMA_FORMAT_GAP", "ERROR", "platform", "Correct the table ID or its declared derivation source."],
  "table-status-derivation-mismatch": ["DATA_QUALITY_GAP", "ERROR", "platform", "Regenerate status from the canonical future-production set."],
  "table-domain-cardinality": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Assign the table to exactly one canonical domain."],
  "table-domain-mismatch": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Align the table domain field with its canonical owner."],
  "table-context-cardinality": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Assign the table to exactly one canonical context."],
  "domain-table-missing": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Remove the stale domain reference or restore the canonical table."],
  "context-table-missing": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Remove the stale context reference or restore the canonical table."],
  "context-version-invalid": ["SCHEMA_FORMAT_GAP", "BLOCKER", "architecture", "Assign a valid semantic version to the context package."],
  "context-status-invalid": ["SCHEMA_FORMAT_GAP", "BLOCKER", "architecture", "Use one of the canonical context status values."],
  "context-dependency-missing": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Add the missing context or remove the dependency edge."],
  "context-self-dependency": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Remove the context's self-dependency."],
  "context-dependency-cycle": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Break the cycle while preserving real schema or contract dependencies."],
  "context-dependency-version-mismatch": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Pin the dependency to its declared context version."],
  "context-not-in-spine": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Use only the five canonical spine contexts in the spine list."],
  "table-not-deterministically-derived": ["SCHEMA_FORMAT_GAP", "BLOCKER", "platform", "Regenerate canonical ID and status from the manifest derivation rules."],
  "slice-unresolved": ["SOURCE_GAP", "BLOCKER", "platform", "Add an explicit context resolution or special classification to the slice map."],
  "slice-context-missing": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Map the slice to a registered context."],
  "slice-duplicate-resolution": ["DATA_QUALITY_GAP", "BLOCKER", "platform", "Keep one explicit resolution for each referenced slice."],
  "slice-product-tag-unresolved": ["SOURCE_GAP", "BLOCKER", "architecture", "Map the product tag to a canonical composition or explicit service classification."],
  "flow-context-unresolved": ["SOURCE_GAP", "BLOCKER", "architecture", "Add an exact slice/context binding for the flow."],
  "flow-route-unresolved": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Register the route or add a reviewed dynamic-pattern or alias resolution."],
  "flow-route-deferred": ["DATA_QUALITY_GAP", "INFO", "platform", "Resolve or renew this explicitly deferred route gap before its target registry version."],
  "flow-route-declared-unregistered": ["DATA_QUALITY_GAP", "ERROR", "platform", "Register the matching declared route, correct the flow path, or approve an explicit alias."],
  "flow-route-classification-invalid": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Assign one allowed resolution category and an owner to every unresolved flow route reference."],
  "flow-route-target-missing": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Point the flow reference at an existing concrete route or registered pattern."],
  "flow-route-reference-missing": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Regenerate the flow route reference registry from every source entry point, step, and route."],
  "flow-route-reference-duplicate": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Keep one flow route reference record per source occurrence."],
  "flow-route-reference-mismatch": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Regenerate the reference so its route path matches the source flow occurrence."],
  "route-record-state-invalid": ["DATA_QUALITY_GAP", "ERROR", "platform", "Make each registered route state agree with its source path and executable registration flags."],
  "route-resolution-state-invalid": ["DATA_QUALITY_GAP", "ERROR", "platform", "Regenerate the route resolution from registered pages, declared patterns, and authored aliases."],
  "flow-actor-missing": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Register the actor or correct the flow actor reference."],
  "flow-product-missing": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Resolve the product tag to a canonical composition or shared service."],
  "product-context-missing": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Add the referenced context or correct the product composition."],
  "product-flow-missing": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Add the referenced flow or correct the composition."],
  "product-composition-empty": ["SOURCE_GAP", "BLOCKER", "architecture", "Supply the canonical product composition."],
  "capability-provider-duplicate": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Declare the capability as explicitly shared or assign one provider."],
  "route-alias-target-missing": ["DATA_QUALITY_GAP", "ERROR", "source-steward", "Point the approved alias at a registered route."],
  "dynamic-route-pattern-source-gap": ["SOURCE_GAP", "BLOCKER", "source-steward", "Supply the referenced dynamic route patterns or correct the claimed source count."],
  "route-pattern-contract-incomplete": ["SOURCE_GAP", "BLOCKER", "platform", "Register intended dynamic routes, retire stale declarations, or correct their source."],
  "flow-product-classification-missing": ["SOURCE_GAP", "BLOCKER", "architecture", "Assign the flow a canonical product tag or an explicit shared/spine/opt-in classification."],
  "flow-classification-invalid": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Correct the flow's explicit classification and its context references."],
  "flow-classification-duplicate": ["DATA_QUALITY_GAP", "ERROR", "architecture", "Keep one classification record per flow."],
  "future-production-table-missing": ["DATA_QUALITY_GAP", "BLOCKER", "platform", "Remove the stale ID or restore the canonical planned table."],
  "canonical-spine-policy-invalid": ["SCHEMA_FORMAT_GAP", "BLOCKER", "architecture", "Use the five canonical spine contexts and require spine inclusion."],
  "product-spine-closure-missing": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Add the full canonical spine and default evidence service to the composition."],
  "product-dependency-closure-missing": ["DATA_QUALITY_GAP", "BLOCKER", "architecture", "Include every direct context dependency in the product closure."],
};

function finding(code, entity, message, options = {}) {
  const [findingClass, severity, owner, resolution] = findingMetadata[code] ?? ["DATA_QUALITY_GAP", "ERROR", "architecture", "Resolve the reported integrity issue."];
  return {
    id: options.id,
    code,
    class: findingClass,
    severity: options.severity ?? severity,
    owner: options.owner ?? owner,
    subject: entity,
    entity,
    problem: message,
    message,
    resolution,
    ...(options.flowId ? { flowId: options.flowId } : {}),
    ...(options.requestedPath ? { requestedPath: options.requestedPath } : {}),
    ...(options.category ? { category: options.category } : {}),
    ...(options.targetVersion ? { targetVersion: options.targetVersion } : {}),
    ...(options.sourceEvidence ? { sourceEvidence: options.sourceEvidence } : {}),
    resolvedWhen: options.resolvedWhen ?? { test: `${code}(${JSON.stringify(entity)})`, expected: "no finding" },
  };
}

export function validateRegistry(source = registry) {
  const findings = [];
  const domainList = source.domains.domains ?? [];
  const tableList = source.domains.tables ?? [];
  const contextList = source.contexts.contexts ?? [];
  const flowList = source.flows.flows ?? [];
  const productList = compositionProducts(source);
  const routeList = source.registeredRoutes?.routes ?? source.routes.routes ?? [];
  const tableById = uniqueBy(tableList, "id");
  const contextById = uniqueBy(contextList, "id");
  const productById = uniqueBy([...productList, ...appProducts(source)], "id");
  const flowById = uniqueBy(flowList, "id");
  const actorById = uniqueBy(source.actors.actors ?? [], "id");
  const plannedIds = new Set(source.futureProductionTables.tableIds ?? []);
  const spineIds = new Set(source.spine.contexts ?? []);
  const expectedSpine = ["identity", "organisation", "project", "communications", "platform"];
  const emitted = new Set();
  const add = (code, entity, message, options) => {
    const key = `${code}:${entity}`;
    if (emitted.has(key)) return;
    emitted.add(key);
    findings.push(finding(code, entity, message, options));
  };
  const schemaSources = source.schemaSources?.records ?? [];
  const schemaSourceIds = new Set();
  for (const record of schemaSources) {
    if (!record?.id || schemaSourceIds.has(record.id)) {
      add("schema-source-invalid", record?.id ?? "<missing>", "Schema source records must have unique non-empty IDs.");
      continue;
    }
    schemaSourceIds.add(record.id);
    const validClassification = ["AUTHORITATIVE", "CANDIDATE", "SUPERSEDED", "REJECTED"].includes(record.classification) && typeof record.name === "string" && record.name.trim().length > 0;
    const validCommit = /^[a-f0-9]{40}$/.test(record.repository?.commitSha ?? "");
    const filePaths = Array.isArray(record.files) ? record.files.map((file) => file?.path) : [];
    const validFiles = Array.isArray(record.files) && record.files.length > 0 && filePaths.length === new Set(filePaths).size && record.files.every((file) => typeof file?.path === "string" && file.path.length > 0 && /^[a-f0-9]{40}$/.test(file.blobSha ?? ""));
    const validCoverage = Array.isArray(record.coverage?.contexts) && Array.isArray(record.coverage?.canonicalTableIds) && Array.isArray(record.coverage?.sourceNativeTables);
    const validDecision = ["pending", "adopted", "rejected", "superseded"].includes(record.adoptionDecision?.status);
    const authorityReviewed = record.classification !== "AUTHORITATIVE" || (record.adoptionDecision?.status === "adopted" && record.adoptionDecision?.decidedBy && record.reviewer);
    const expectedDecision = { AUTHORITATIVE: "adopted", CANDIDATE: "pending", SUPERSEDED: "superseded", REJECTED: "rejected" }[record.classification];
    const classificationConsistent = record.adoptionDecision?.status === expectedDecision;
    if (!validClassification || !validCommit || !validFiles || !validCoverage || !validDecision || !authorityReviewed || !classificationConsistent) {
      add("schema-source-invalid", record.id, "Schema source classification, immutable repository/file pins, coverage, or adoption review metadata is incomplete or inconsistent.");
    }
  }
  const duplicateIds = (items, field, code) => {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item[field])) add(code, item[field], `Duplicate canonical ID: ${item[field]}.`);
      seen.add(item[field]);
    }
  };
  duplicateIds(domainList, "id", "duplicate-domain-id");
  duplicateIds(contextList, "id", "duplicate-context-id");
  duplicateIds(tableList, "id", "duplicate-table-id");
  duplicateIds(flowList, "id", "duplicate-flow-id");
  duplicateIds(productList, "id", "duplicate-product-id");

  for (const table of tableList) {
    const expectedId = `${String(table.context ?? "").toLowerCase()}.${table.name}`;
    if (table.id !== expectedId || !/^[a-z][a-z0-9]*\.[a-z][a-z0-9_]*$/.test(table.id ?? "")) add("invalid-table-id", table.id, `Table ID does not match context-dot-name policy; expected ${expectedId}.`);
    const expectedStatus = plannedIds.has(table.id) ? "planned" : "stubbed";
    if (table.status !== expectedStatus || table.provenance?.status?.rule !== "future-production-set@1") add("table-status-derivation-mismatch", table.id, `Derived status should be ${expectedStatus} under future-production-set@1.`);
    const owners = domainList.filter((domain) => (domain.tableIds ?? []).includes(table.id));
    if (owners.length !== 1) add("table-domain-cardinality", table.id, `Table must belong to exactly one canonical domain; found ${owners.length}.`);
    if (owners.length === 1 && owners[0].id !== table.domain) add("table-domain-mismatch", table.id, `Table declares domain ${table.domain}; owner is ${owners[0].id}.`);
    const contextOwners = contextList.filter((context) => (context.tableIds ?? []).includes(table.id));
    if (contextOwners.length !== 1 || (contextOwners[0] && contextOwners[0].id !== table.context)) add("table-context-cardinality", table.id, `Table must belong to exactly one canonical context; found ${contextOwners.length}.`);
  }
  for (const id of plannedIds) if (!tableById.has(id)) add("future-production-table-missing", id, `Future-production set references missing table ${id}.`);
  for (const domain of domainList) for (const id of domain.tableIds ?? []) if (!tableById.has(id)) add("domain-table-missing", `${domain.id}:${id}`, `Domain references missing table ${id}.`);

  const capabilities = new Map();
  for (const context of contextList) {
    if (!isSemver(context.version)) add("context-version-invalid", context.id, `Context version ${context.version ?? "<missing>"} is not valid semantic versioning.`);
    if (!["implemented", "stubbed", "planned"].includes(context.status)) add("context-status-invalid", context.id, `Context status ${context.status ?? "<missing>"} is not valid.`);
    if (context.coreSpine && !spineIds.has(context.id)) add("context-not-in-spine", context.id, `Context ${context.id} is marked core spine but is not in the canonical spine.`);
    for (const id of context.tableIds ?? []) if (!tableById.has(id)) add("context-table-missing", `${context.id}:${id}`, `Context references missing table ${id}.`);
    for (const dep of context.dependsOn ?? (context.dependencies ?? []).map((edge) => typeof edge === "string" ? edge : edge.contextId)) {
      const target = typeof dep === "string" ? dep : dep.contextId;
      if (target === context.id) add("context-self-dependency", context.id, `Context ${context.id} depends on itself.`);
      if (!contextById.has(target)) add("context-dependency-missing", `${context.id}:${target}`, `Context dependency ${target} is not registered.`);
      const explicitEdge = (context.dependencies ?? []).find((edge) => (typeof edge === "string" ? edge : edge.contextId) === target);
      if (explicitEdge && typeof explicitEdge !== "string" && explicitEdge.version && contextById.get(target)?.version !== explicitEdge.version) add("context-dependency-version-mismatch", `${context.id}:${target}`, `Dependency version ${explicitEdge.version} does not match ${contextById.get(target)?.version ?? "<missing>"}.`);
    }
    for (const capability of context.provides ?? []) {
      const providers = capabilities.get(capability) ?? [];
      providers.push(context.id);
      capabilities.set(capability, providers);
    }
  }
  const sharedCapabilities = new Set(source.contexts.sharedCapabilities ?? []);
  for (const [capability, providers] of capabilities) if (providers.length > 1 && !sharedCapabilities.has(capability)) add("capability-provider-duplicate", capability, `Capability ${capability} has multiple providers: ${providers.join(", ")}.`);
  const visiting = new Set(); const visited = new Set();
  const visit = (id, chain = []) => {
    if (visiting.has(id)) { add("context-dependency-cycle", [...chain, id].join(" -> "), `Context dependency cycle: ${[...chain, id].join(" -> ")}.`); return; }
    if (visited.has(id) || !contextById.has(id)) return;
    visiting.add(id);
    for (const dep of contextById.get(id).dependsOn ?? []) visit(dep, [...chain, id]);
    visiting.delete(id); visited.add(id);
  };
  for (const context of contextList) visit(context.id);

  const sliceResolution = source.sliceMap.resolutions ?? {};
  const referencedSlices = new Set(source.sliceMap.referencedSlices ?? []);
  for (const slice of referencedSlices) {
    const resolution = sliceResolution[slice];
    if (!resolution) add("slice-unresolved", slice, `Referenced slice ${slice} has no resolution or explicit special classification.`);
    else if (resolution.resolution === "context" && !contextById.has(resolution.context)) add("slice-context-missing", slice, `Slice ${slice} resolves to missing context ${resolution.context}.`);
  }
  for (const [slice, resolution] of Object.entries(sliceResolution)) if (resolution.resolution === "context" && !contextById.has(resolution.context)) add("slice-context-missing", slice, `Slice ${slice} resolves to missing context ${resolution.context}.`);
  const routeByPath = uniqueBy(routeList, "path");
  const declaredRouteList = source.declaredPatterns?.patterns ?? source.routePatterns?.patterns ?? [];
  const routePatternById = uniqueBy(declaredRouteList, "id");
  const flowRouteRefs = source.flowRouteReferences?.references ?? [];
  const flowRouteRefByOccurrence = new Map();
  for (const ref of flowRouteRefs) {
    if (flowRouteRefByOccurrence.has(ref.id)) add("flow-route-reference-duplicate", ref.id, `Flow route occurrence ${ref.id} is duplicated.`);
    flowRouteRefByOccurrence.set(ref.id, ref);
  }
  const routeResolutionList = source.routeResolutionRegistry?.resolutions ?? source.routeResolutions.resolutions ?? [];
  const resolutionByPath = uniqueBy(routeResolutionList, "requested");
  const deferredRouteList = source.deferredRoutes?.routes ?? [];
  if (deferredRouteList.length !== new Set(deferredRouteList.map((item) => item.path)).size) add("flow-route-classification-invalid", "deferred-routes", "Deferred route paths must be unique.");
  const deferredByPath = uniqueBy(deferredRouteList, "path");
  const deferredCategories = new Set(["derivable-pattern", "typo", "renamed", "missing-source", "retired"]);
  for (const deferred of deferredRouteList) {
    if (!deferred.path || !deferred.flowIds?.length || !deferredCategories.has(deferred.category) || !deferred.owner || !isSemver(deferred.targetVersion)) add("flow-route-classification-invalid", deferred.path ?? "<missing-path>", "Deferred routes require a path, source flow IDs, one allowed category, an owner, and a semantic target version.");
    if (!resolutionByPath.has(deferred.path) || resolutionByPath.get(deferred.path)?.resolution?.status !== "UNRESOLVED") add("flow-route-classification-invalid", deferred.path, "A deferred route must correspond to a currently unresolved flow route.");
    for (const flowId of deferred.flowIds ?? []) if (!(resolutionByPath.get(deferred.path)?.flowIds ?? []).includes(flowId)) add("flow-route-classification-invalid", `${deferred.path}:${flowId}`, "Deferred route flow IDs must match source flow references.");
  }
  if (source.registeredRoutes) for (const route of routeList) {
    const hasParams = /(^|\/)(:[^/]+|\{[^/]+\})(?=\/|$)/.test(route.path ?? route.route ?? "");
    const expectedState = hasParams ? "REGISTERED_DYNAMIC" : "REGISTERED_STATIC";
    if (route.routeState !== expectedState || route.declared !== true || route.registered !== true || route.executable !== true || route.source !== "manifest.pages") add("route-record-state-invalid", route.id ?? route.path, `Registered route must be ${expectedState} with manifest.pages provenance and declared/registered/executable set true.`);
  }
  if (source.declaredPatterns) for (const pattern of declaredRouteList) {
    if (pattern.routeState !== "DECLARED_UNREGISTERED" || pattern.declared !== true || pattern.registered !== false || pattern.executable !== false || pattern.source !== "manifest.routeParams" || !/(^|\/)(:[^/]+|\{[^/]+\})(?=\/|$)/.test(pattern.path ?? "")) add("route-record-state-invalid", pattern.id ?? pattern.path, "Declared pattern must remain non-executable and retain manifest.routeParams provenance.");
  }
  if (source.routeResolutionRegistry) for (const item of routeResolutionList) {
    const result = item.resolution ?? {};
    const state = result.status;
    const registeredTarget = routeList.some((route) => (route.path ?? route.route) === result.path);
    const declaredTarget = declaredRouteList.some((pattern) => pattern.path === result.path);
    const aliasTarget = authoredAliasTargets(source).includes(result.path);
    const valid = state === "REGISTERED_STATIC" ? registeredTarget && result.registered && result.executable && result.kind === "static"
      : state === "REGISTERED_DYNAMIC" ? registeredTarget && result.registered && result.executable && result.kind === "dynamic"
        : state === "DECLARED_UNREGISTERED" ? declaredTarget && !result.registered && !result.executable
          : state === "APPROVED_ALIAS" ? aliasTarget && result.registered && result.executable && result.kind === "alias"
            : state === "UNRESOLVED" ? !result.path && !result.registered && !result.executable : false;
    if (!valid) add("route-resolution-state-invalid", item.requested, `Resolution state ${state ?? "<missing>"} does not match its provenance, registration, and executable flags.`);
  }
  const classifiedFlows = new Map((source.flowClassifications.classifications ?? []).map((item) => [item.flowId, item]));
  for (const binding of source.flows.contextBindings ?? []) {
    if (!flowById.has(binding.flowId)) add("flow-context-unresolved", binding.flowId, `Context binding references missing flow ${binding.flowId}.`);
    for (const id of binding.contextIds ?? []) if (!contextById.has(id)) add("flow-context-unresolved", `${binding.flowId}:${id}`, `Flow context ${id} is not registered.`);
    for (const id of binding.tableIds ?? []) if (!tableById.has(id)) add("flow-context-unresolved", `${binding.flowId}:${id}`, `Flow table ${id} is not registered.`);
  }
  for (const flow of flowList) {
    const binding = (source.flows.contextBindings ?? []).find((item) => item.flowId === flow.id);
    if (!binding || !(binding.contextIds ?? []).length) add("flow-context-unresolved", flow.id, "Flow has no resolved context binding.");
    for (const field of ["entryPoints", "steps", "routes"]) for (const [index, item] of (flow[field] ?? []).entries()) {
      const path = typeof item === "string" ? item : item.route;
      if (!path) continue;
      const occurrenceId = `${flow.id}:${field}:${index}`;
      if (source.flowRouteReferences && !flowRouteRefByOccurrence.has(occurrenceId)) add("flow-route-reference-missing", occurrenceId, `Flow route source occurrence ${occurrenceId} is absent from the route reference registry.`);
      const occurrence = flowRouteRefByOccurrence.get(occurrenceId);
      if (occurrence && occurrence.routePath !== path) add("flow-route-reference-mismatch", occurrenceId, `Flow route reference ${occurrenceId} records ${occurrence.routePath}, but source flow records ${path}.`);
      const stored = resolutionByPath.get(path);
      const storedState = stored?.resolution?.status ?? stored?.routeState;
      const resolved = stored ? { ...stored.resolution, status: storedState?.toLowerCase().replaceAll("_", "-"), routeState: storedState, matched: stored.resolution?.path ?? stored.matched } : resolveRoute(path, source);
      if (occurrence && storedState && occurrence.routeStatus !== storedState) add("flow-route-reference-mismatch", occurrenceId, `Flow route reference ${occurrenceId} says ${occurrence.routeStatus}, but resolution state is ${storedState}.`);
      if (resolved.routeState === "DECLARED_UNREGISTERED") add("flow-route-declared-unregistered", path, `Flow route ${path} matches declared pattern ${resolved.matched}, but that pattern is not registered or executable.`, { flowId: stored?.flowIds?.[0], requestedPath: path, sourceEvidence: { declaredPattern: true, registeredPage: false } });
      else if (resolved.routeState === "UNRESOLVED" || resolved.status === "unresolved") {
        const deferred = deferredByPath.get(path);
        if (deferred) add("flow-route-deferred", path, `Flow route ${path} remains unresolved and is explicitly deferred to ${deferred.targetVersion} (${deferred.category}; owner: ${deferred.owner}).`, { severity: "INFO", owner: deferred.owner, flowId: stored?.flowIds?.[0] ?? flow.id, requestedPath: path, category: deferred.category, targetVersion: deferred.targetVersion, sourceEvidence: { declaredPattern: false, registeredPage: false, deferred: true, targetVersion: deferred.targetVersion } });
        else add("flow-route-unresolved", path, `No registered page, declared pattern, explicitly authored alias, or approved deferral matches this flow route ${path}.`, { flowId: stored?.flowIds?.[0] ?? flow.id, requestedPath: path, sourceEvidence: { declaredPattern: false, registeredPage: false } });
      }
    }
    for (const actor of flow.actors ?? []) {
      const id = actorId(actor); const record = actorById.get(id);
      if (!record || record.status !== "registered") add("flow-actor-missing", `${flow.id}:${id}`, `Flow actor ${id} is not registered.`);
    }
    for (const tag of flow.products ?? []) {
      const resolution = source.products.tagResolutions?.[tag];
      if (!resolution) add("slice-product-tag-unresolved", tag, `Flow product tag ${tag} has no canonical composition or service classification.`);
      else if (resolution.classification === "canonical-product" && !productById.has(resolution.canonicalProductId)) add("flow-product-missing", `${flow.id}:${tag}`, `Flow product tag ${tag} targets missing composition ${resolution.canonicalProductId}.`);
    }
    if (!(flow.products ?? []).length && !classifiedFlows.has(flow.id)) add("flow-product-classification-missing", flow.id, `Flow ${flow.id} has no product tag or explicit special classification.`);
  }
  for (const ref of flowRouteRefs) {
    if (!flowById.has(ref.flowId)) add("flow-route-classification-invalid", ref.id, `Flow route reference ${ref.id} points to missing flow ${ref.flowId}.`);
    if (!resolutionByPath.has(ref.routePath)) add("flow-route-reference-missing", ref.id, `Flow route reference ${ref.id} has no deterministic route resolution.`);
    if (!ref.routeStatus || !["REGISTERED_STATIC", "REGISTERED_DYNAMIC", "DECLARED_UNREGISTERED", "APPROVED_ALIAS", "UNRESOLVED"].includes(ref.routeStatus)) add("flow-route-classification-invalid", ref.id, `Flow route reference ${ref.id} lacks a valid explicit route state.`);
  }
  const registeredDynamicRoutes = routeList.filter((item) => item.routeState === "REGISTERED_DYNAMIC");
  if (declaredRouteList.length && !registeredDynamicRoutes.length) add("route-pattern-contract-incomplete", "dynamic-route-contract", `The manifest declares ${declaredRouteList.length} dynamic patterns, but none is registered as an executable application route.`);
  const authoredAliases = source.routeAliases?.aliases ?? source.routeResolutions.aliases ?? [];
  for (const alias of authoredAliases) {
    if (!alias.provenance || !alias.approvedBy) add("flow-route-classification-invalid", alias.requested, `Approved alias ${alias.requested} lacks authorship provenance or approver.`);
    const target = alias.target ?? alias.matched;
    if (!routeByPath.has(target)) add("route-alias-target-missing", alias.requested, `Approved alias targets missing registered route ${target}.`);
  }
  for (const product of productList) {
    if (!(product.contexts ?? []).length || !(product.flowIds ?? []).length) add("product-composition-empty", product.id, `Composition ${product.id} is missing context or flow members.`);
    for (const ref of product.contexts ?? []) {
      const id = typeof ref === "string" ? ref : ref.contextId;
      if (!contextById.has(id)) add("product-context-missing", `${product.id}:${id}`, `Product references missing context ${id}.`);
    }
    for (const id of product.flowIds ?? []) if (!flowById.has(id)) add("product-flow-missing", `${product.id}:${id}`, `Product references missing flow ${id}.`);
  }
  if (JSON.stringify(source.spine.contexts ?? []) !== JSON.stringify(expectedSpine) || JSON.stringify(source.contexts.canonicalSpine ?? []) !== JSON.stringify(expectedSpine) || source.spine.rules?.spineAlwaysIncluded !== true) add("canonical-spine-policy-invalid", "spine", "Canonical spine must be identity, organisation, project, communications, platform with spineAlwaysIncluded enabled.");
  for (const id of expectedSpine) if (!contextById.has(id)) add("context-not-in-spine", id, `Canonical spine context ${id} is not registered.`);
  for (const product of productList) {
    const included = new Set((product.contexts ?? []).map((item) => typeof item === "string" ? item : item.contextId));
    if (expectedSpine.some(id => !included.has(id)) || !product.sharedServices?.includes("evidence")) add("product-spine-closure-missing", product.id, `Composition ${product.id} must include the full spine and default evidence service.`);
    for (const id of included) for (const dep of contextById.get(id)?.dependsOn ?? []) if (!included.has(dep)) add("product-dependency-closure-missing", `${product.id}:${id}:${dep}`, `Composition ${product.id} omits dependency ${dep} of context ${id}.`);
  }
  const seenClassifications = new Set();
  for (const item of source.flowClassifications.classifications ?? []) {
    if (seenClassifications.has(item.flowId)) add("flow-classification-duplicate", item.flowId, `Flow ${item.flowId} has multiple special classification records.`);
    seenClassifications.add(item.flowId);
    if (!flowById.has(item.flowId) || !(item.contextIds ?? []).length || item.contextIds.some((id) => !contextById.has(id))) add("flow-classification-invalid", item.flowId, `Flow ${item.flowId} special classification references missing flow/context data.`);
  }
  return findings.map((item, index) => ({ ...item, id: `REG-${String(index + 1).padStart(3, "0")}` }));
}

export function getRegistryGate(source = registry) {
  const findings = validateRegistry(source);
  const counts = findings.reduce((result, item) => { result[item.severity] = (result[item.severity] ?? 0) + 1; return result; }, {});
  const routeCodes = new Set(["flow-route-unresolved", "flow-route-deferred", "flow-route-declared-unregistered", "flow-route-classification-invalid", "flow-route-target-missing", "flow-route-reference-missing", "flow-route-reference-duplicate", "flow-route-reference-mismatch", "route-alias-target-missing", "route-pattern-contract-incomplete", "dynamic-route-pattern-source-gap"]);
  const routeFindings = findings.filter((item) => routeCodes.has(item.code));
  const domainFindings = findings.filter((item) => !routeCodes.has(item.code));
  const routeRecords = source.registeredRoutes?.routes ?? source.routes.routes ?? [];
  const patternRecords = source.declaredPatterns?.patterns ?? source.routePatterns?.patterns ?? [];
  const aliasRecords = source.routeAliases?.aliases ?? source.routeResolutions.aliases ?? [];
  const resolutionRecords = source.routeResolutionRegistry?.resolutions ?? source.routeResolutions.resolutions ?? [];
  const deferredRouteList = source.deferredRoutes?.routes ?? [];
  const routeStates = resolutionRecords.map((item) => item.resolution?.status ?? item.routeState);
  const domainValid = !domainFindings.some((item) => item.severity === "BLOCKER" || item.severity === "ERROR");
  const routeValid = !routeFindings.some((item) => item.severity === "BLOCKER" || item.severity === "ERROR");
  const publishable = (counts.BLOCKER ?? 0) === 0 && (counts.ERROR ?? 0) === 0;
  const tableIds = (source.domains.tables ?? []).map((item) => item.id);
  const contracts = source.tableContracts?.contracts ?? [];
  const contractsById = new Map(contracts.map((item) => [item.id, item]));
  const schemaCompilerReady = tableIds.length > 0 && contracts.length === tableIds.length && contractsById.size === tableIds.length && tableIds.every((id) => {
    const contract = contractsById.get(id);
    return contract && validateTableContract(contract, source).valid;
  });
  return {
    draftInspectable: true,
    publishable,
    compilerConsumable: publishable,
    registryCompilerReady: publishable,
    schemaCompilerReady,
    compilerReady: schemaCompilerReady,
    domainRegistry: { valid: domainValid, blockers: domainFindings.filter((item) => item.severity === "BLOCKER").length, errors: domainFindings.filter((item) => item.severity === "ERROR").length },
    routeRegistry: {
      valid: routeValid,
      registeredStatic: routeRecords.filter((item) => item.routeState === "REGISTERED_STATIC" || (item.status === "registered" && !/(^|\/)(:[^/]+|\{[^/]+\})(?=\/|$)/.test(item.path ?? item.route))).length,
      registeredDynamic: routeRecords.filter((item) => item.routeState === "REGISTERED_DYNAMIC").length,
      declaredUnregistered: patternRecords.length,
      approvedAliases: aliasRecords.length,
      unresolved: routeStates.filter((state) => state === "UNRESOLVED" || !state).length,
      deferred: deferredRouteList.length,
      declaredPatternFlowReferences: routeStates.filter((state) => state === "DECLARED_UNREGISTERED").length,
    },
    counts,
    findings,
  };
}

export function assertRegistryPublishable(source = registry) {
  const gate = getRegistryGate(source);
  if (!gate.publishable) throw new Error(`Registry cannot be published or consumed by the compiler: ${gate.counts.BLOCKER ?? 0} blockers and ${gate.counts.ERROR ?? 0} errors.`);
  return gate;
}

export function getContextDependencies(contextId, source = registry) {
  const context = (source.contexts.contexts ?? []).find((item) => item.id === contextId);
  return [...(context?.dependsOn ?? [])];
}

export function getContextDependents(contextId, source = registry) {
  return (source.contexts.contexts ?? []).filter((item) => (item.dependsOn ?? []).includes(contextId)).map((item) => item.id).sort();
}

export function resolveProductComposition(productId, source = registry, { allowPlanned = false } = {}) {
  assertRegistryPublishable(source);
  const product = compositionProducts(source).find((item) => item.id === productId);
  if (!product) throw new Error(`Unknown canonical product composition: ${productId}`);
  const contextIds = (product.contexts ?? []).map((item) => typeof item === "string" ? item : item.contextId);
  const tables = (source.domains.tables ?? []).filter((table) => contextIds.includes(table.context));
  const planned = tables.filter((table) => table.status === "planned").map((table) => table.id);
  if (planned.length && !allowPlanned) throw new Error(`Composition ${productId} includes planned tables; explicit override required: ${planned.join(", ")}.`);
  return { productId, flowIds: [...product.flowIds], contextIds, tableIds: tables.map((table) => table.id).sort(), tableStatuses: [...new Set(tables.map((table) => table.status))].sort() };
}

export function lookupDependencies(entityType, entityId, source = registry) {
  const result = { entity: { type: entityType, id: entityId }, dependsOn: [], usedBy: [] };
  const ctxs = source.contexts.contexts ?? [];
  const prods = [...compositionProducts(source), ...appProducts(source)];
  const flowList = source.flows.flows ?? [];
  const bindings = source.flows.contextBindings ?? [];
  if (entityType === "table") {
    const table = source.domains.tables.find((item) => item.id === entityId);
    result.dependsOn = [...(table?.domain ? [{ type: "domain", id: table.domain }] : []), ...(table?.context ? [{ type: "context", id: table.context }] : [])];
    result.usedBy = [...ctxs.filter((item) => (item.tableIds ?? []).includes(entityId)).map((item) => ({ type: "context", id: item.id })), ...bindings.filter((item) => (item.tableIds ?? []).includes(entityId)).map((item) => ({ type: "flow", id: item.flowId }))];
  } else if (entityType === "domain") {
    const domain = source.domains.domains.find((item) => item.id === entityId);
    result.usedBy = (domain?.tableIds ?? []).map((id) => ({ type: "table", id }));
  } else if (entityType === "context") {
    const context = ctxs.find((item) => item.id === entityId);
    result.dependsOn = (context?.dependsOn ?? []).map((id) => ({ type: "context", id }));
    result.usedBy = [
      ...ctxs.filter((item) => (item.dependsOn ?? []).includes(entityId)).map((item) => ({ type: "context", id: item.id })),
      ...prods.filter((item) => (item.contexts ?? []).some((edge) => (typeof edge === "string" ? edge : edge.contextId) === entityId)).map((item) => ({ type: "product", id: item.id })),
      ...(source.domains.tables ?? []).filter((item) => item.context === entityId).map((item) => ({ type: "table", id: item.id })),
      ...bindings.filter((item) => (item.contextIds ?? []).includes(entityId)).map((item) => ({ type: "flow", id: item.flowId })),
    ];
  } else if (entityType === "product") {
    const product = prods.find((item) => item.id === entityId);
    result.dependsOn = [...(product?.contexts ?? []).map((edge) => typeof edge === "string" ? { type: "context", id: edge } : { type: "context", id: edge.contextId, version: edge.version }), ...(product?.flowIds ?? []).map((id) => ({ type: "flow", id }))];
    result.usedBy = flowList.filter((item) => (item.canonicalProductIds ?? item.products ?? []).includes(entityId)).map((item) => ({ type: "flow", id: item.id }));
  } else if (entityType === "flow") {
    const flow = flowList.find((item) => item.id === entityId);
    const binding = bindings.find((item) => item.flowId === entityId);
    result.dependsOn = [...(flow?.canonicalProductIds ?? []).map((id) => ({ type: "product", id })), ...(flow?.actors ?? []).map((actor) => ({ type: "actor", id: actorId(actor) })), ...allRouteRefs(flow ?? {}).map((path) => ({ type: "route", id: path })), ...(binding?.contextIds ?? []).map((id) => ({ type: "context", id })), ...(binding?.tableIds ?? []).map((id) => ({ type: "table", id }))];
    result.usedBy = prods.filter((item) => (item.flowIds ?? []).includes(entityId)).map((item) => ({ type: "product", id: item.id }));
  } else if (entityType === "route") {
    result.usedBy = flowList.filter((item) => allRouteRefs(item).includes(entityId)).map((item) => ({ type: "flow", id: item.id }));
  } else if (entityType === "actor") {
    result.usedBy = flowList.filter((item) => (item.actors ?? []).some((actor) => actorId(actor) === entityId)).map((item) => ({ type: "flow", id: item.id }));
  }
  return result;
}

let registrySearchIndex;
export function searchRegistry(query, source = registry) {
  const needle = String(query ?? "").trim().toLocaleLowerCase();
  if (!needle) return [];
  const groups = [["domain", source.domains.domains ?? []], ["table", source.domains.tables ?? []], ["context", source.contexts.contexts ?? []], ["product", [...compositionProducts(source), ...appProducts(source)]], ["flow", source.flows.flows ?? []], ["route", source.routes.routes ?? []], ["actor", source.actors.actors ?? []]];
  if (source === registry && !registrySearchIndex) registrySearchIndex = groups.flatMap(([type, items]) => items.map((item) => ({ type, item, text: JSON.stringify(item).toLocaleLowerCase() })));
  const entries = source === registry ? registrySearchIndex : groups.flatMap(([type, items]) => items.map((item) => ({ type, item, text: JSON.stringify(item).toLocaleLowerCase() })));
  return entries.filter(({ text }) => text.includes(needle)).map(({ type, item }) => ({ type, id: item.id ?? item.path, label: item.name ?? item.title ?? item.path ?? item.id, status: item.status ?? item.maturity?.stage ?? item.stability ?? item.compositionStatus ?? "unrated" }));
}

export function getRegistryHeatmap(source = registry) {
  const assets = [["domains", source.domains, "domains"], ["tables", source.domains, "tables"], ["contexts", source.contexts, "contexts"], ["products", source.products, "products"], ["applicationProducts", source.products, "applicationProducts"], ["flows", source.flows, "flows"], ["routes", source.routes, "routes"], ["actors", source.actors, "actors"]];
  return assets.map(([type, asset, key]) => {
    const rows = asset[key] ?? [];
    const countByStatus = rows.reduce((counts, item) => { const status = item.status ?? item.maturity?.stage ?? item.stability ?? item.compositionStatus ?? "unrated"; counts[status] = (counts[status] ?? 0) + 1; return counts; }, {});
    return { type, total: rows.length, sourceStatus: asset.status, countByStatus };
  });
}

export { manifest };
