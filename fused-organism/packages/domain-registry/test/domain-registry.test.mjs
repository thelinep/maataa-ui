import test from "node:test";
import assert from "node:assert/strict";
import {
  assertRegistryPublishable, getContextDependencies, getContextDependents, getRegistryGate,
  getRegistryHeatmap, lookupDependencies, registry, resolveProductComposition, resolveRoute,
  searchRegistry, validateRegistry,
} from "../src/index.mjs";
import { buildRouteImpactIndexes, diffApplicationIR, explainComposition, previewLogicalSchema, resolveComposition, sealApplicationIR, validateApplicationIR } from "../src/composition.mjs";
import { assessCompileTestability, assessContractCoverage, compileLogicalSchema, diffTableContracts, validateTableContract, validateTableContractStructure } from "../src/contracts.mjs";

const castingIntent = { appId: "casting-pipeline-demo", name: "Casting Pipeline", description: "Casting pipeline for a film production company", productTags: ["film"], flowIds: ["TLPS-FLOW-027", "TLPS-FLOW-028", "TLPS-FLOW-029", "TLPS-FLOW-030", "TLPS-FLOW-031"], seedProfile: "demo-casting" };

function completeFixture() {
  const flow = { id: "FLOW-1", actors: ["producer"], products: ["production"], canonicalProductIds: ["production-os"], entryPoints: [{ route: "/talent" }], steps: [] };
  const requiredContexts = ["identity", "organisation", "project", "communications", "platform", "evidence", "people"];
  const contextRecords = requiredContexts.map((id) => ({ id, version: "1.0.0", status: "stubbed", stability: "experimental", dependencyStatus: "authored", dependsOn: [], tableIds: id === "people" ? ["people.profiles"] : [], dependencies: [], provides: [], flowIds: id === "people" ? ["FLOW-1"] : [], productIds: id === "people" ? ["production-os"] : [] }));
  return {
    manifest: { integrity: { status: "complete" } },
    domains: { status: "imported", domains: [{ id: "people-domain", tableIds: ["people.profiles"] }], tables: [{ id: "people.profiles", name: "profiles", domain: "people-domain", context: "people", status: "stubbed", provenance: { status: { rule: "future-production-set@1" } } }] },
    contexts: { status: "complete", canonicalSpine: ["identity", "organisation", "project", "communications", "platform"], rules: { spineAlwaysIncluded: true }, sharedCapabilities: [], contexts: contextRecords },
    products: { status: "complete", products: [{ id: "production-os", flowIds: ["FLOW-1"], sharedServices: ["evidence"], contexts: requiredContexts.map((contextId) => ({ contextId, version: "1.0.0" })) }], applicationProducts: [], tagResolutions: { production: { classification: "canonical-product", canonicalProductId: "production-os" } } },
    flows: { status: "complete", contextBindings: [{ flowId: "FLOW-1", contextIds: ["people"], tableIds: ["people.profiles"] }], flows: [flow] },
    routes: { status: "complete", routes: [{ path: "/talent", status: "registered" }] },
    routeResolutions: { aliases: [], resolutions: [{ requested: "/talent", status: "exact", matched: "/talent" }], dynamicPatternDiscrepancy: null },
    actors: { status: "complete", actors: [{ id: "producer", status: "registered" }] },
    sliceMap: { referencedSlices: ["talent"], resolutions: { talent: { resolution: "context", context: "people" } } },
    futureProductionTables: { tableIds: [] },
    flowClassifications: { classifications: [] },
    spine: { contexts: ["identity", "organisation", "project", "communications", "platform"], rules: { spineAlwaysIncluded: true } },
  };
}

test("imports source counts and applies deterministic M1 registry policy", () => {
  assert.equal(registry.domains.domains.length, 18);
  assert.equal(registry.domains.tables.length, 352);
  assert.equal(registry.domains.tables.filter((table) => table.status === "stubbed").length, 335);
  assert.equal(registry.domains.tables.filter((table) => table.status === "planned").length, 17);
  assert.equal(new Set(registry.domains.tables.map((table) => table.id)).size, 352);
  assert.equal(registry.contexts.contexts.length, 17);
  assert.deepEqual(registry.contexts.canonicalSpine, ["identity", "organisation", "project", "communications", "platform"]);
  assert.deepEqual(registry.spine.contexts, registry.contexts.canonicalSpine);
  assert.equal(registry.spine.sharedServices.evidence.defaultIncluded, true);
  assert.equal(registry.spine.sharedServices.ai.defaultIncluded, false);
  assert.equal(registry.spine.rules.publicOptIn, true);
  assert.ok(!registry.contexts.canonicalSpine.includes("evidence"));
  assert.equal(registry.products.products.length, 6);
  assert.deepEqual(registry.products.products.map((product) => product.id), ["production-os", "campaign-os", "marketplace", "finance-commerce", "investorhub", "events-wedding-spatial"]);
  const sourceTags = new Set(registry.flows.flows.flatMap((flow) => flow.products ?? []));
  assert.ok([...sourceTags].every((tag) => registry.products.tagResolutions[tag]));
  assert.equal(registry.flows.flows.length, 160);
  assert.equal(registry.flows.contextBindings.length, 160);
  assert.equal(registry.sliceMap.referencedSlices.length, registry.sliceMap.resolvedCount + registry.sliceMap.explicitlyClassifiedCount);
  assert.equal(registry.sliceMap.unresolvedCount, 0);
  assert.deepEqual(getContextDependencies("creative"), ["project", "people"]);
  assert.deepEqual(getContextDependents("creative"), []);
  assert.ok(getContextDependents("people").includes("creative"));
  assert.equal(registry.routeResolutions.counts.unresolved, 11);
  assert.equal(registry.routeResolutions.aliases.length, 0);
  assert.equal(registry.registeredRoutes.routes.length, 284);
  assert.equal(registry.declaredPatterns.patterns.length, 0);
  assert.equal(registry.flowRouteReferences.counts.distinctPaths, 293);
  assert.equal(registry.routeResolutionRegistry.counts.unresolved, 11);
  assert.equal(registry.routeResolutionRegistry.counts.registeredStatic, 282);
  assert.equal(registry.flowRouteReferences.counts.references, 2524);
  assert.equal(registry.declaredPatterns.sourceFieldPresent, false);
  assert.equal(registry.declaredPatterns.reviewClaim.dynamicPatterns, 17);
  assert.equal(registry.declaredPatterns.sourceFlowDocumentPageCount, 307);
  assert.equal(registry.routePatternPolicy.ruleId, "segment-shape-frequency@1");
  assert.equal(registry.routePatternPolicy.minimumConcreteRoutes, 3);
  assert.equal(registry.routePatternPolicy.behavior.patternsDerived, 0);
  assert.equal(registry.deferredRoutes.routes.length, 11);
  assert.ok(registry.deferredRoutes.routes.every((item) => item.category === "missing-source" && item.owner && item.targetVersion === "1.1.0"));
  assert.equal(registry.manifest.integrity.domainRegistry.valid, true);
  assert.equal(registry.manifest.integrity.routeRegistry.valid, true);
  assert.equal(registry.manifest.integrity.registryCompilerReady, true);
  assert.equal(registry.manifest.integrity.compilerReady, false, "catalog publication readiness is separate from schema compilation readiness");
  assert.ok(registry.registeredRoutes.routes.every((route) => route.routeState === "REGISTERED_STATIC" && route.registered && route.executable));
});

test("unresolved deferred routes remain non-executable while the reviewed registry snapshot is publishable", () => {
  const gate = getRegistryGate();
  assert.equal(gate.draftInspectable, true);
  assert.equal(gate.publishable, true);
  assert.equal(gate.compilerConsumable, true);
  assert.equal(gate.counts.BLOCKER ?? 0, 0);
  assert.equal(gate.counts.ERROR ?? 0, 0);
  assert.equal(gate.counts.INFO, 11);
  assert.equal(gate.domainRegistry.valid, true);
  assert.equal(gate.routeRegistry.valid, true);
  assert.equal(gate.routeRegistry.registeredStatic, 284);
  assert.equal(gate.routeRegistry.declaredUnregistered, 0);
  assert.equal(gate.routeRegistry.unresolved, 11);
  assert.equal(gate.routeRegistry.deferred, 11);
  assert.equal(gate.registryCompilerReady, true);
  assert.equal(gate.schemaCompilerReady, false);
  assert.equal(gate.compilerReady, false);
  assert.ok(gate.findings.every((item) => /^REG-\d{3}$/.test(item.id) && ["SOURCE_GAP", "SCHEMA_FORMAT_GAP", "DATA_QUALITY_GAP"].includes(item.class) && ["BLOCKER", "ERROR", "WARNING", "INFO"].includes(item.severity) && item.owner && item.problem && item.resolution && item.resolvedWhen));
  assertRegistryPublishable();
  assert.throws(() => resolveProductComposition("production-os"), /explicit override required/);
  for (const item of registry.deferredRoutes.routes) assert.equal(resolveRoute(item.path).routeState, "UNRESOLVED");
  const incompleteDeferrals = structuredClone(registry);
  incompleteDeferrals.deferredRoutes.routes.pop();
  const incompleteGate = getRegistryGate(incompleteDeferrals);
  assert.equal(incompleteGate.publishable, false);
  assert.ok(incompleteGate.findings.some((item) => item.code === "flow-route-unresolved" && item.severity === "ERROR"));
});

test("accepts a complete fixture and resolves the canonical product", () => {
  const fixture = completeFixture();
  assert.deepEqual(validateRegistry(fixture), []);
  assert.equal(getRegistryGate(fixture).publishable, true);
  assert.deepEqual(resolveProductComposition("production-os", fixture), { productId: "production-os", flowIds: ["FLOW-1"], contextIds: ["identity", "organisation", "project", "communications", "platform", "evidence", "people"], tableIds: ["people.profiles"], tableStatuses: ["stubbed"] });
});

test("planned tables require an explicit generation override", () => {
  const fixture = completeFixture();
  fixture.domains.tables[0].status = "planned";
  fixture.futureProductionTables.tableIds = ["people.profiles"];
  assert.equal(getRegistryGate(fixture).publishable, true);
  assert.throws(() => resolveProductComposition("production-os", fixture), /explicit override required/);
  assert.deepEqual(resolveProductComposition("production-os", fixture, { allowPlanned: true }).tableStatuses, ["planned"]);
});

test("reports duplicate IDs, invalid versions, self-dependencies, missing dependencies, and cycles", () => {
  const fixture = completeFixture();
  fixture.contexts.contexts.push({ id: "people.audit", version: "bad", status: "stubbed", dependsOn: ["people.self", "unknown", "people"], dependencies: [], tableIds: [], provides: [] });
  fixture.contexts.contexts[0].dependsOn.push("people.audit");
  fixture.contexts.contexts.push({ id: "people.audit", version: "1.0.0", status: "stubbed", dependsOn: ["people.self"], tableIds: [], provides: [] });
  fixture.contexts.contexts.push({ id: "people.self", version: "1.0.0", status: "stubbed", dependsOn: ["people.self", "people.audit"], tableIds: [], provides: [] });
  fixture.domains.tables.push({ ...fixture.domains.tables[0] });
  fixture.flows.flows.push({ ...fixture.flows.flows[0] });
  const codes = new Set(validateRegistry(fixture).map((item) => item.code));
  for (const code of ["duplicate-table-id", "duplicate-flow-id", "duplicate-context-id", "context-version-invalid", "context-self-dependency", "context-dependency-missing", "context-dependency-cycle"]) assert.ok(codes.has(code), `missing ${code}`);
});

test("reconciles exact, normalized, and parameterized routes without inventing aliases", () => {
  const fixture = completeFixture();
  fixture.routes.routes.push({ path: "/casting/actors/:actorId", status: "registered" });
  assert.equal(resolveRoute("/talent", fixture).status, "exact");
  assert.equal(resolveRoute("/talent/", fixture).status, "normalized");
  assert.equal(resolveRoute("/casting/actors/123", fixture).status, "dynamic-match");
  assert.equal(resolveRoute("/missing", fixture).status, "unresolved");
  assert.equal(fixture.routeResolutions.aliases.length, 0);
  fixture.declaredPatterns = { patterns: [{ id: "project-detail", path: "/projects/:projectId", routeState: "DECLARED_UNREGISTERED", registered: false, executable: false }] };
  const declared = resolveRoute("/projects/project-001", fixture);
  assert.equal(declared.routeState, "DECLARED_UNREGISTERED");
  assert.equal(declared.registered, false);
  assert.equal(declared.executable, false);
  fixture.routeAliases = { aliases: [{ requested: "/old-talent", target: "/talent" }] };
  assert.equal(resolveRoute("/old-talent", fixture).routeState, "UNRESOLVED");
  fixture.routeAliases.aliases[0] = { requested: "/old-talent", target: "/talent", provenance: "approved change request CR-1", approvedBy: "platform" };
  assert.equal(resolveRoute("/old-talent", fixture).routeState, "APPROVED_ALIAS");
});

test("declared dynamic patterns produce one systemic blocker until a dynamic page is registered", () => {
  const fixture = completeFixture();
  fixture.declaredPatterns = { patterns: [{ id: "project-detail", path: "/projects/:projectId", routeState: "DECLARED_UNREGISTERED", declared: true, registered: false, executable: false, source: "manifest.routeParams" }] };
  fixture.registeredRoutes = { routes: [{ id: "P001", path: "/talent", status: "registered", routeState: "REGISTERED_STATIC", declared: true, registered: true, executable: true, source: "manifest.pages" }] };
  const gate = getRegistryGate(fixture);
  assert.equal(gate.counts.BLOCKER, 1);
  assert.equal(gate.routeRegistry.declaredUnregistered, 1);
  assert.equal(gate.compilerReady, false);
  fixture.registeredRoutes.routes.push({ id: "P002", path: "/projects/:projectId", status: "registered", routeState: "REGISTERED_DYNAMIC", declared: true, registered: true, executable: true, source: "manifest.pages" });
  assert.equal(getRegistryGate(fixture).findings.some((item) => item.code === "route-pattern-contract-incomplete"), false);
});

test("every source flow-route occurrence is registered or explicitly classified", () => {
  const references = registry.flowRouteReferences.references;
  const sourceOccurrences = registry.flows.flows.flatMap((flow) => ["entryPoints", "steps", "routes"].flatMap((field) => (flow[field] ?? []).flatMap((item, index) => {
    const routePath = typeof item === "string" ? item : item.route;
    return routePath ? [`${flow.id}:${field}:${index}`] : [];
  })));
  assert.equal(references.length, sourceOccurrences.length);
  assert.deepEqual(new Set(references.map((ref) => ref.id)), new Set(sourceOccurrences));
  const unresolved = references.filter((ref) => ref.routeStatus === "UNRESOLVED");
  assert.equal(unresolved.length, 32);
  assert.equal(new Set(unresolved.map((ref) => ref.routePath)).size, 11);
  assert.ok(references.every((ref) => ["REGISTERED_STATIC", "REGISTERED_DYNAMIC", "DECLARED_UNREGISTERED", "APPROVED_ALIAS", "UNRESOLVED"].includes(ref.routeStatus)));
  assert.ok(references.filter((ref) => ref.routeStatus === "REGISTERED_STATIC").every((ref) => ref.resolutionId));
  assert.equal(registry.routeFindings.findings.length, 11);
  assert.ok(registry.routeFindings.findings.every((item) => item.severity === "INFO" && item.flowId && item.requestedPath && item.category === "missing-source" && item.targetVersion === "1.1.0" && item.sourceEvidence.registeredPage === false));
  assert.deepEqual(new Set(registry.routeFindings.findings.map((item) => item.requestedPath)), new Set(registry.routeResolutionRegistry.resolutions.filter((item) => item.resolution.status === "UNRESOLVED").map((item) => item.requested)));
});

test("supports bidirectional context/table/product dependencies, global search, and status heatmaps", () => {
  const fixture = completeFixture();
  fixture.contexts.contexts.push({ id: "people.audit", version: "2.0.0", status: "stubbed", dependsOn: ["people"], tableIds: [], provides: [] });
  assert.deepEqual(getContextDependencies("people.audit", fixture), ["people"]);
  assert.deepEqual(getContextDependents("people", fixture), ["people.audit"]);
  assert.ok(lookupDependencies("context", "people", fixture).usedBy.some((item) => item.id === "people.audit"));
  assert.deepEqual(lookupDependencies("product", "production-os", fixture).dependsOn[0], { type: "context", id: "identity", version: "1.0.0" });
  assert.ok(searchRegistry("profiles", fixture).some((item) => item.type === "table"));
  const table = getRegistryHeatmap(fixture).find((item) => item.type === "tables");
  assert.equal(table.total, 1);
  assert.equal(table.countByStatus.stubbed, 1);
});

test("M2 casting resolver is deterministic, pinned, and closes flows over contexts, spine, and default Evidence", () => {
  const before = JSON.stringify(registry);
  const first = resolveComposition(castingIntent);
  const second = resolveComposition(castingIntent);
  assert.deepEqual(first, second);
  assert.equal(first.irHash, second.irHash);
  assert.equal(first.registry.hash, registry.manifest.milestones.M1.registryHash);
  assert.deepEqual(first.flowIds, castingIntent.flowIds);
  assert.deepEqual(first.contextVersions.map((item) => item.contextId), ["communications", "evidence", "identity", "organisation", "people", "platform", "production", "project"]);
  assert.equal(first.tableIds.length, 160);
  assert.ok(first.whyIncluded.some((item) => item.type === "context" && item.id === "production" && item.via.startsWith("flow:")));
  assert.ok(first.whyIncluded.some((item) => item.type === "context" && item.id === "evidence" && item.via === "shared-service:evidence"));
  assert.equal(first.policies.publicContextOptIn, false);
  assert.equal(first.routeReadiness.status, "READY");
  assert.equal(first.routeReadiness.total, 16);
  assert.equal(first.routeReadiness.blocked, 0);
  assert.equal(first.compilerStatus, "BLOCKED", "planned tables remain compiler-blocked without a local override");
  assert.ok(first.compilerBlockers.some((item) => item.kind === "planned-table"));
  const explicitlyAllowed = resolveComposition({ ...castingIntent, overrides: { allowPlanned: true } });
  assert.equal(explicitlyAllowed.compilerStatus, "SCHEMA_INCOMPLETE");
  assert.equal(explicitlyAllowed.lifecycleState, "RESOLVED");
  assert.equal(explicitlyAllowed.schemaReadiness.counts.total, 160);
  assert.equal(explicitlyAllowed.schemaReadiness.counts.nameOnly, 160);
  assert.ok(explicitlyAllowed.compilerBlockers.some((item) => item.kind === "schema-contract"));
  assert.deepEqual(validateApplicationIR(first), { valid: true, errors: [] });
  assert.equal(JSON.stringify(registry), before, "resolver must not mutate canonical registry data");
});

test("M2 makes public context opt-in, fails closed on a service without a context record, and isolates overrides", () => {
  const base = resolveComposition(castingIntent);
  const optedIn = resolveComposition({ ...castingIntent, includePublicContext: true, overrides: { allowPlanned: true } });
  assert.equal(base.contextVersions.some((item) => item.contextId === "public"), false);
  assert.equal(optedIn.contextVersions.some((item) => item.contextId === "public"), true);
  assert.deepEqual(optedIn.overrides, { allowPlanned: true });
  assert.equal(optedIn.irHash === base.irHash, false);
  assert.throws(() => resolveComposition({ ...castingIntent, sharedServices: ["ai"] }), /Context ai is not registered/);
  assert.throws(() => resolveComposition({ ...castingIntent, sharedServices: ["unknown-service"] }), /Unknown shared service/);
});

test("route readiness blocks only when a selected flow route is non-executable", () => {
  const source = structuredClone(registry);
  const path = "/mobile/065/casting-dashboard";
  const resolution = source.routeResolutionRegistry.resolutions.find((item) => item.requested === path);
  resolution.resolution = { kind: "unresolved", path: null, match: false, source: null, registered: false, executable: false, status: "UNRESOLVED" };
  source.deferredRoutes.routes.push({ path, category: "missing-source", owner: "platform", targetVersion: "1.1.0" });
  const blocked = resolveComposition(castingIntent, source);
  assert.equal(blocked.routeReadiness.status, "BLOCKED");
  assert.equal(blocked.routeReadiness.blockers.length, 1);
  assert.equal(blocked.routeReadiness.blockers[0].path, path);
  assert.equal(blocked.routeReadiness.blockers[0].flowIds.includes("TLPS-FLOW-027"), true);
  const unselected = resolveComposition({ ...castingIntent, flowIds: ["TLPS-FLOW-030"] });
  assert.equal(unselected.routeReadiness.status, "READY");
});

test("M2 explain, logical schema preview, semantic diff, and route impact preserve evidence limits", () => {
  const casting = resolveComposition(castingIntent);
  const finance = explainComposition(casting, "Which flow required Finance?");
  assert.match(finance.answer, /not included/);
  const evidence = explainComposition(casting, "Why was Evidence added?");
  assert.match(evidence.answer, /default shared-service rule/);
  assert.ok(evidence.whyIncluded.length > 0);
  const preview = previewLogicalSchema(casting);
  assert.deepEqual(previewLogicalSchema(casting), preview, "logical preview is deterministic for a pinned IR");
  assert.equal(preview.status, "SCHEMA_INCOMPLETE");
  assert.equal(preview.models.length, 160);
  assert.equal(preview.relations.length, 0);
  assert.equal(preview.prismaPreview.status, "SCHEMA_INCOMPLETE");
  assert.equal(preview.prismaPreview.text, "");
  assert.ok(preview.models.every((model) => model.fields.length === 0 && model.relations.length === 0));
  const withPublic = resolveComposition({ ...castingIntent, includePublicContext: true });
  const diff = diffApplicationIR(casting, withPublic);
  assert.ok(diff.levels.contextVersions.added.some((item) => item.contextId === "public"));
  assert.ok(diff.summary.tablesAdded > 0);
  const routeDraft = structuredClone(casting);
  const changedRoute = routeDraft.routeReadiness.routes.find((item) => item.flowIds.includes("TLPS-FLOW-027"));
  changedRoute.status = "UNRESOLVED";
  changedRoute.resolvedPath = null;
  changedRoute.executable = false;
  routeDraft.routeReadiness.blockers = [{ path: changedRoute.path, status: "UNRESOLVED", flowIds: changedRoute.flowIds }];
  const routeDiff = diffApplicationIR(casting, routeDraft);
  assert.equal(routeDiff.summary.routesChanged, 1);
  assert.ok(routeDiff.levels.routesAndFlows.routes.affectedFlowIds.includes("TLPS-FLOW-027"));
  assert.equal(routeDiff.levels.routesAndFlows.routes.blockedAdded[0], changedRoute.path);
  const impacts = buildRouteImpactIndexes();
  const deferred = impacts.blockedByRoute["/mobile/auth/create-organisation"];
  assert.ok(deferred.flowIds.includes("TLPS-FLOW-005"));
  assert.equal(deferred.productIds.length, 0, "unclassified source flow is not assigned to a product by inference");
  assert.equal(impacts.deferredRouteBacklog.length, 11);
});

test("M2.5 derives casting schema coverage and refuses invented schema", () => {
  const casting = resolveComposition({ ...castingIntent, overrides: { allowPlanned: true } });
  const coverage = assessContractCoverage(casting.tableIds, registry);
  assert.deepEqual(coverage.counts, { total: 160, complete: 0, partial: 0, nameOnly: 160 });
  assert.equal(coverage.status, "SCHEMA_INCOMPLETE");
  const preview = previewLogicalSchema(casting);
  assert.equal(preview.prismaPreview.models.length, 0);
  assert.equal(preview.models.some((model) => model.fields.length > 0), false);
});

test("M2.5 validates source-backed table contracts and reports semantic changes", () => {
  const source = structuredClone(registry);
  const provenance = { source: "reviewed-schema.sql", reference: "tables.organisations", reviewStatus: "approved", reviewedBy: "schema-steward" };
  const contract = {
    schemaVersion: "1.0.0", id: "organisation.organisations", context: "organisation", name: "organisations", version: "1.0.0",
    fields: { id: { type: "uuid", nullable: false, generated: true, provenance }, label: { type: "string", nullable: false, generated: false, maxLength: 160, provenance }, created_at: { type: "datetime", nullable: false, generated: false, defaultExpression: { kind: "current-timestamp" }, timezone: "UTC", provenance }, updated_at: { type: "datetime", nullable: false, generated: false, defaultExpression: { kind: "current-timestamp" }, timezone: "UTC", provenance } },
    enums: [], primaryKey: ["id"], uniqueConstraints: [], foreignKeys: [], relations: [], indexes: [],
    ownership: { owner: "organisation", steward: "platform", provenance },
    lifecycle: { createdAt: "created_at", updatedAt: "updated_at", retentionPolicy: "approved:test-retention-v1", provenance }, provenance,
  };
  source.tableContracts.contracts = [contract];
  assert.deepEqual(validateTableContract(contract, source), { valid: true, errors: [] });
  const explicitUuidGeneration = structuredClone(contract);
  explicitUuidGeneration.fields.id.defaultExpression = { kind: "uuid-v4" };
  assert.deepEqual(validateTableContract(explicitUuidGeneration, source), { valid: true, errors: [] }, "uuid-v4 is an explicit generation rule for generated UUIDs");
  const invalid = structuredClone(contract);
  invalid.primaryKey = ["unknown"];
  assert.ok(validateTableContract(invalid, source).errors.some((item) => item.includes("unknown field")));
  const ambiguousDefault = structuredClone(contract);
  ambiguousDefault.fields.label.defaultLiteral = "now()";
  ambiguousDefault.fields.label.defaultExpression = { kind: "current-timestamp" };
  assert.ok(validateTableContract(ambiguousDefault, source).errors.some((item) => item.includes("both defaultLiteral and defaultExpression")));
  const logicalOnly = structuredClone(contract);
  logicalOnly.relations = [{ name: "relatedOrganisation", from: ["id"], to: contract.id, toFields: ["id"], cardinality: "many-to-one", provenance }];
  assert.deepEqual(validateTableContract(logicalOnly, source), { valid: true, errors: [] }, "logical relations are not fabricated from or forced to duplicate physical FKs");
  const implicitManyToMany = structuredClone(contract);
  implicitManyToMany.relations = [{ name: "members", to: contract.id, cardinality: "many-to-many", provenance }];
  assert.ok(validateTableContract(implicitManyToMany, source).errors.some((item) => item.includes("requires an authored join-table contract")));
  const changed = structuredClone(contract);
  changed.fields.label.maxLength = 200;
  const diff = diffTableContracts({ contracts: [contract] }, { contracts: [changed] });
  assert.deepEqual(diff.changed.map((item) => item.tableId), [contract.id]);
  assert.ok(diff.changed[0].changedPaths.includes("fields.label.maxLength"));
});

test("COMPILE_TESTABLE is separate from SCHEMA_READY and emits deterministic logical schema", () => {
  const source = structuredClone(registry);
  const provenance = { source: "communications-design", reference: "communications.notifications#table", reviewStatus: "unreviewed" };
  const contract = {
    schemaVersion: "1.0.0", id: "communications.notifications", context: "communications", name: "notifications", version: "1.0.0",
    fields: {
      id: { type: "uuid", nullable: false, generated: true, provenance },
      created_at: { type: "datetime", nullable: false, generated: false, defaultExpression: { kind: "current-timestamp" }, timezone: "UTC", provenance },
      updated_at: { type: "datetime", nullable: false, generated: false, defaultExpression: { kind: "current-timestamp" }, timezone: "UTC", provenance },
    },
    enums: [], primaryKey: ["id"], uniqueConstraints: [], foreignKeys: [], relations: [], indexes: [],
    ownership: { owner: "communications", steward: "platform", provenance },
    lifecycle: { createdAt: "created_at", updatedAt: "updated_at", retentionPolicy: "proposed:retention-v1", provenance }, provenance,
  };
  source.tableContracts.contracts = [contract];
  assert.deepEqual(validateTableContractStructure(contract, source), { valid: true, errors: [] });
  assert.ok(validateTableContract(contract, source).errors.some((item) => item.includes("must cite a source and reference and be approved")));
  assert.deepEqual(assessCompileTestability([contract.id], source), {
    status: "COMPILE_TESTABLE", counts: { total: 1, structurallyComplete: 1, partial: 0, nameOnly: 0 },
    entries: [{ tableId: contract.id, status: "STRUCTURALLY_COMPLETE", fieldCount: 3, errors: [] }],
  });
  const first = compileLogicalSchema([contract.id], source);
  const second = compileLogicalSchema([contract.id], source);
  assert.equal(first.status, "LOGICAL_SCHEMA_READY");
  assert.deepEqual(first, second);
  assert.match(first.schemaHash, /^[a-f0-9]{64}$/);
  assert.equal(assessCompileTestability(["communications.announcements"], source).status, "SCHEMA_INCOMPLETE");
  source.tableContracts.contracts = [contract, structuredClone(contract)];
  const duplicate = assessCompileTestability([contract.id], source);
  assert.equal(duplicate.status, "SCHEMA_INCOMPLETE");
  assert.ok(duplicate.entries[0].errors.some((item) => item.includes("duplicate authored contract ID")));
});

test("Application IR drafts can be resealed and content tampering is detected", () => {
  const ir = resolveComposition(castingIntent);
  ir.application.name = "Casting Pipeline Example";
  const sealed = sealApplicationIR(ir);
  assert.notEqual(sealed.irHash, ir.irHash);
  assert.equal(validateApplicationIR(sealed).valid, true);
  sealed.seedProfile = "changed-without-reseal";
  assert.ok(validateApplicationIR(sealed).errors.some((item) => item.includes("hash does not match")));
  const forged = structuredClone(sealApplicationIR(resolveComposition({ ...castingIntent, overrides: { allowPlanned: true } })));
  forged.tableIds[0] = "unknown.forged_table";
  forged.tables[0] = { ...forged.tables[0], id: "unknown.forged_table" };
  const resealedForgery = sealApplicationIR(forged);
  assert.ok(validateApplicationIR(resealedForgery).errors.some((item) => item.includes("does not match the pinned catalog") || item.includes("deterministic resolution")));
});
