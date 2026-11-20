import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  assertRegistryPublishable, getContextDependencies, getContextDependents, getRegistryGate,
  getRegistryHeatmap, lookupDependencies, registry, resolveProductComposition, resolveRoute,
  searchRegistry, validateRegistry,
} from "../src/index.mjs";
import { buildRouteImpactIndexes, diffApplicationIR, explainComposition, previewLogicalSchema, resolveComposition, sealApplicationIR, validateApplicationIR } from "../src/composition.mjs";
import { assessDraftCompileTestability, assessContractCoverage, compileDraftLogicalSchema, compileLogicalSchema, diffTableContracts, validateTableContract, validateTableContractStructure } from "../src/contracts.mjs";
import { generatePrismaPreview } from "../src/prisma-preview.mjs";
import { sha256 } from "../src/hash.mjs";
import recoveredKernel from "../schema-sources/authored/maataa-core-v1/contracts.json" with { type: "json" };
import organisationApproval from "../schema-sources/approvals/organisation-m2.7/approval-record.json" with { type: "json" };
import organisationClosure from "../schema-sources/approvals/organisation-m2.7/fk-closure.json" with { type: "json" };
import checksumVerification from "../schema-sources/approvals/organisation-m2.7/checksum-verification.json" with { type: "json" };
import workspaceMembershipKeyAmendment from "../schema-sources/approvals/organisation-m2.7/amendments/workspace-membership-composite-key.v1.1.0.json" with { type: "json" };
import organisationScopeIntegrityAmendment from "../schema-sources/authored/maataa-core-v1/organisation-scope-integrity-amendment.v1.2.0.json" with { type: "json" };

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

test("Organisation workspace and membership references enforce tenant scope", () => {
  const byId = new Map(registry.tableContracts.contracts.map((contract) => [contract.id, contract]));
  const affected = organisationScopeIntegrityAmendment.contractIds.map((id) => byId.get(id));
  assert.ok(affected.every(Boolean));
  assert.equal(organisationScopeIntegrityAmendment.decision, "APPROVED");
  assert.equal(organisationScopeIntegrityAmendment.productionBoundary.migrationApproved, false);
  assert.equal(organisationScopeIntegrityAmendment.productionBoundary.deploymentApproved, false);
  assert.equal(sha256(affected), organisationScopeIntegrityAmendment.contractSetHash, "review hash must bind the current canonical contract set");

  const fkFor = (contract, name) => contract.foreignKeys.find((item) => item.name === name);
  const relationFor = (contract, name) => contract.relations.find((item) => item.name === name);
  const workspaceOwned = ["workspace_activity", "workspace_favourites", "workspace_invites", "workspace_roles", "workspace_settings"];
  for (const tableName of workspaceOwned) {
    const contract = byId.get(`organisation.${tableName}`);
    const workspaceFk = fkFor(contract, `${tableName}_workspace_fk`);
    assert.ok(workspaceFk, `${tableName} must have a workspace FK`);
    assert.deepEqual(workspaceFk.fields, ["workspace_id", "organisation_id"]);
    assert.equal(workspaceFk.references, "organisation.workspaces");
    assert.deepEqual(workspaceFk.referencedFields, ["id", "organisation_id"]);
    assert.deepEqual(relationFor(contract, "workspace").from, ["workspace_id", "organisation_id"]);
    assert.deepEqual(relationFor(contract, "workspace").toFields, ["id", "organisation_id"]);
  }

  const membershipKey = ["id", "workspace_id", "organisation_id"];
  for (const id of ["organisation.workspace_memberships", "organisation.workspace_roles"]) {
    assert.ok(byId.get(id).uniqueConstraints.some((key) => JSON.stringify(key.fields) === JSON.stringify(membershipKey)), `${id} must expose the composite referenced key`);
  }
  const scopedMembershipRefs = [
    ["organisation.workspace_activity", "workspace_activity_actor_membership_fk", "actorMembership", "actor_membership_id", "restrict"],
    ["organisation.workspace_favourites", "workspace_favourites_membership_fk", "membership", "membership_id", "cascade"],
    ["organisation.workspace_invites", "workspace_invites_inviter_membership_fk", "invitedByMembership", "invited_by_membership_id", "restrict"],
  ];
  for (const [id, fkName, relationName, sourceKey, onDelete] of scopedMembershipRefs) {
    const contract = byId.get(id);
    const fk = fkFor(contract, fkName);
    assert.deepEqual(fk.fields, [sourceKey, "workspace_id", "organisation_id"]);
    assert.equal(fk.references, "organisation.workspace_memberships");
    assert.deepEqual(fk.referencedFields, membershipKey);
    assert.equal(fk.onDelete, onDelete);
    assert.deepEqual(relationFor(contract, relationName).from, fk.fields);
    assert.deepEqual(relationFor(contract, relationName).toFields, membershipKey);
  }

  const invite = byId.get("organisation.workspace_invites");
  const roleFk = fkFor(invite, "workspace_invites_role_fk");
  assert.deepEqual(roleFk.fields, ["role_id", "workspace_id", "organisation_id"]);
  assert.equal(roleFk.references, "organisation.workspace_roles");
  assert.deepEqual(roleFk.referencedFields, membershipKey);
  assert.equal(roleFk.onDelete, "restrict");
  assert.deepEqual(relationFor(invite, "role").from, roleFk.fields);
  assert.deepEqual(relationFor(invite, "role").toFields, membershipKey);
});

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
  assert.equal(registry.manifest.integrity.compilerReady, true, "the full reviewed schema now closes the schema gate");
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
  assert.equal(gate.schemaCompilerReady, true);
  assert.equal(gate.compilerReady, true);
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
  assert.equal(explicitlyAllowed.compilerStatus, "SCHEMA_READY");
  assert.equal(explicitlyAllowed.lifecycleState, "RESOLVED");
  assert.equal(explicitlyAllowed.schemaReadiness.counts.total, 160);
  assert.deepEqual(explicitlyAllowed.schemaReadiness.counts, { total: 160, complete: 160, partial: 0, nameOnly: 0 });
  assert.ok(!explicitlyAllowed.compilerBlockers.some((item) => item.kind === "schema-contract"));
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
  assert.equal(preview.status, "SCHEMA_READY");
  assert.equal(preview.models.length, 160);
  assert.equal(preview.relations.length, 625, "the preview exposes relations from the complete canonical casting slice");
  assert.equal(preview.prismaPreview.status, "READY_FOR_PRISMA_ADAPTER");
  assert.equal(preview.prismaPreview.text, "");
  assert.equal(preview.prismaPreview.models.length, 160, "complete canonical slice is eligible for the provider adapter");
  const contractById = new Map(registry.tableContracts.contracts.map((contract) => [contract.id, contract]));
  for (const model of preview.models) {
    const contract = contractById.get(model.tableId);
    assert.deepEqual(model.fields.map(({ name, ...field }) => [name, field]), Object.entries(contract?.fields ?? {}), "the preview must project authored fields without inventing any");
    assert.deepEqual(model.relations, contract?.relations ?? []);
  }
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
  assert.deepEqual(coverage.counts, { total: 160, complete: 160, partial: 0, nameOnly: 0 });
  assert.equal(coverage.status, "SCHEMA_READY");
  const preview = previewLogicalSchema(casting);
  assert.equal(preview.prismaPreview.models.length, 160);
  assert.equal(preview.models.filter((model) => model.fields.length > 0).length, 160, "all casting tables now contribute canonical contract fields");
  const castingPackage = JSON.parse(readFileSync(new URL("../schema-sources/authored/casting-v1/contracts.draft.json", import.meta.url), "utf8"));
  assert.equal(castingPackage.status, "SCHEMA_READY");
  assert.equal(castingPackage.readiness.schemaReady, true);
  assert.equal(castingPackage.readiness.authoredDraftCount, 0);
  assert.equal(castingPackage.readiness.migrationApproved, false);
  assert.equal(castingPackage.readiness.deploymentApproved, false);
});

test("Casting contracts preserve organisation scope across tenant-owned foreign keys", () => {
  const peopleContracts = registry.tableContracts.contracts.filter((contract) => contract.context === "people");
  const review = JSON.parse(readFileSync(new URL("../schema-sources/authored/casting-v1/people.review.json", import.meta.url), "utf8"));
  assert.equal(peopleContracts.length, 32);
  assert.equal(review.reviewStatus, "REVIEWED");
  assert.equal(review.decision, "APPROVE");
  assert.equal(review.contractSetHash, "8ea1f93f7b411e560abec4afd749725b75437f0b68ed34afca98c1eb847d6bdb");
  assert.equal(registry.manifest.assets.castingDraftContracts.peopleReview.status, "REVIEWED");
  assert.equal(review.compositionContractSetHash, registry.manifest.assets.castingDraftContracts.contractSetHash);
  assert.equal(review.logicalSchemaHash, registry.manifest.assets.castingDraftContracts.readiness.logicalSchemaHash);
  assert.equal(review.retainedBoundaries.identityContextCanonical, true);
  assert.equal(review.retainedBoundaries.compositionSchemaReady, true);
  assert.equal(review.retainedBoundaries.applicationMembershipAuthorizationImplemented, false);
  assert.equal(registry.manifest.assets.castingDraftContracts.peopleReview.compositionSchemaReady, true);
  assert.ok(peopleContracts.every((contract) => contract.schemaLifecycle === "CANONICAL"));
  const targets = new Map([
    ...registry.authoredContracts,
    ...registry.draftContracts,
    ...registry.tableContracts.contracts,
    ...registry.castingDraftContracts,
  ].map((contract) => [contract.id, contract]));
  let tenantOwnedReferences = 0;
  let globalActorReferences = 0;
  for (const contract of [...peopleContracts, ...registry.castingDraftContracts]) {
    for (const foreignKey of contract.foreignKeys) {
      const target = targets.get(foreignKey.references);
      const targetIsTenantOwned = target?.ownership?.tenantKey === "organisation_id"
        || Object.hasOwn(target?.fields ?? {}, "organisation_id");
      const targetHasTenantKey = target?.uniqueConstraints?.some((constraint) => JSON.stringify(constraint.fields) === JSON.stringify(["id", "organisation_id"]));
      if (targetIsTenantOwned && targetHasTenantKey) {
        tenantOwnedReferences += 1;
        assert.deepEqual(foreignKey.referencedFields, ["id", "organisation_id"], `${contract.id}.${foreignKey.name} must prevent cross-organisation references`);
        assert.ok(foreignKey.fields.includes("organisation_id"), `${contract.id}.${foreignKey.name} must carry the source organisation key`);
      }
      if (foreignKey.references === "identity.users") {
        globalActorReferences += 1;
        assert.deepEqual(foreignKey.referencedFields, ["id"], `${contract.id}.${foreignKey.name} references the global user identity`);
      }
    }
  }
  assert.ok(tenantOwnedReferences > 0);
  assert.ok(globalActorReferences > 0);
  assert.match(review.approvalBasis, /application authorization must verify active organisation\/workspace membership/i);
  assert.equal(review.retainedBoundaries.applicationMembershipAuthorizationImplemented, false);
});

test("Project casting contracts are reviewed and canonicalized as one exact context set", () => {
  const contracts = registry.tableContracts.contracts.filter((contract) => contract.context === "project");
  const review = JSON.parse(readFileSync(new URL("../schema-sources/authored/casting-v1/project.review.json", import.meta.url), "utf8"));
  assert.equal(contracts.length, 17);
  assert.equal(review.reviewStatus, "REVIEWED");
  assert.equal(review.decision, "APPROVE");
  assert.equal(review.contractSetHash, "b9e1a35a3d6f1cf3c18a0c2966e0f7db45cf7033dbff1650c8535a8243b96540");
  assert.equal(registry.manifest.assets.castingDraftContracts.projectReview.status, "REVIEWED");
  assert.ok(contracts.every((contract) => contract.schemaLifecycle === "CANONICAL"));
  assert.equal(review.retainedBoundaries.applicationMembershipAuthorizationImplemented, false);
  assert.equal(review.retainedBoundaries.migrationApproved, false);
});

test("All casting context reviews bind to the exact canonical contract sets", () => {
  const contexts = ["communications", "evidence", "identity", "organisation", "people", "platform", "production", "project"];
  const castingPackage = JSON.parse(readFileSync(new URL("../schema-sources/authored/casting-v1/contracts.draft.json", import.meta.url), "utf8"));
  for (const context of contexts) {
    const contracts = registry.tableContracts.contracts.filter((contract) => contract.context === context);
    assert.ok(contracts.length > 0, `${context} has canonical contracts`);
    assert.ok(contracts.every((contract) => contract.schemaLifecycle === undefined || contract.schemaLifecycle === "CANONICAL"), `${context} contracts are canonical or retained with approved legacy lifecycle metadata`);
    if (context === "communications" || context === "organisation") continue; // Separate approval artifacts cover these legacy slices.
    const review = JSON.parse(readFileSync(new URL(`../schema-sources/authored/casting-v1/${context}.review.json`, import.meta.url), "utf8"));
    assert.equal(review.decision, "APPROVE");
    assert.equal(review.contractCount, contracts.length);
    assert.equal(review.compositionContractSetHash, castingPackage.contractSetHash);
    assert.equal(review.logicalSchemaHash, castingPackage.readiness.logicalSchemaHash);
    assert.equal(review.retainedBoundaries.compositionSchemaReady, true);
    if (context === "people" || context === "project") {
      const manifestReview = registry.manifest.assets.castingDraftContracts[`${context}Review`];
      assert.equal(manifestReview.status, "REVIEWED");
      assert.equal(manifestReview.compositionSchemaReady, true);
    } else {
      const manifestReview = registry.manifest.assets.castingDraftContracts.contextReviews[context];
      assert.equal(manifestReview.status, "REVIEWED");
      assert.equal(manifestReview.compositionSchemaReady, true);
    }
  }
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
  const proposedProductRetention = structuredClone(contract);
  proposedProductRetention.lifecycle.retentionPolicy = "PROPOSED: product-default-v1";
  assert.deepEqual(validateTableContract(proposedProductRetention, source), { valid: true, errors: [] }, "proposed product policy remains schema-reviewable while legal approval is tracked separately");
  const unresolvedRetention = structuredClone(contract);
  unresolvedRetention.lifecycle.retentionPolicy = "TBD";
  assert.ok(validateTableContract(unresolvedRetention, source).errors.some((item) => item.includes("concrete retention policy")));
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

test("draft compilation is explicit and cannot cross the canonical compiler boundary", () => {
  const source = structuredClone(registry);
  source.draftContracts = [];
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
  source.authoredContracts = [contract];
  source.tableContracts.contracts = [];
  assert.deepEqual(validateTableContractStructure(contract, source), { valid: true, errors: [] });
  assert.ok(validateTableContract(contract, source).errors.some((item) => item.includes("provenance must be reviewed")));
  assert.deepEqual(assessDraftCompileTestability([contract.id], source), {
    status: "DRAFT_COMPILE_TESTABLE", counts: { total: 1, structurallyComplete: 1, partial: 0, nameOnly: 0 },
    entries: [{ tableId: contract.id, status: "STRUCTURALLY_COMPLETE", fieldCount: 3, errors: [] }],
  });
  const first = compileDraftLogicalSchema([contract.id], source);
  const second = compileDraftLogicalSchema([contract.id], source);
  assert.equal(first.status, "DRAFT_LOGICAL_SCHEMA_READY");
  assert.equal(first.authority, "DRAFT_OR_MIXED");
  assert.equal(first.prismaEligible, true, "structurally closed DRAFT can generate a non-deployable Prisma preview");
  assert.equal(first.deployable, false);
  assert.equal(first.migrationExecutable, false);
  assert.equal(first.model.tables[0].sourceAuthority, "AUTHORED_NONCANONICAL");
  assert.deepEqual(first, second);
  assert.match(first.schemaHash, /^[a-f0-9]{64}$/);
  const canonicalAttempt = compileLogicalSchema([contract.id], source);
  assert.equal(canonicalAttempt.status, "BLOCKED");
  assert.equal(canonicalAttempt.authority, "CANONICAL_APPROVED_ONLY");
  assert.equal(canonicalAttempt.prismaEligible, false);
  assert.ok(canonicalAttempt.blockers.some((item) => item.reason.includes("No approved canonical table contract")));
  assert.equal(assessContractCoverage(["communications.notifications"], source).entries[0].status, "NAME_ONLY", "draft contracts are excluded from canonical coverage");
  assert.equal(assessDraftCompileTestability(["communications.notifications"], source).status, "DRAFT_COMPILE_TESTABLE", "draft contracts remain usable only through the explicitly draft structural gate");
  source.authoredContracts = [contract, structuredClone(contract)];
  const duplicate = assessDraftCompileTestability([contract.id], source);
  assert.equal(duplicate.status, "SCHEMA_INCOMPLETE");
  assert.ok(duplicate.entries[0].errors.some((item) => item.includes("duplicate authored contract ID")));
  source.authoredContracts = [];
  source.tableContracts.contracts = [structuredClone(contract), structuredClone(contract)];
  const canonicalDuplicate = compileLogicalSchema([contract.id], source);
  assert.equal(canonicalDuplicate.status, "BLOCKED");
  assert.ok(canonicalDuplicate.blockers.some((item) => item.reason.includes("duplicate canonical contract ID")));

  const missingDependency = structuredClone(contract);
  missingDependency.foreignKeys = [{ name: "missing_target_fk", fields: ["id"], references: "communications.missing", referencedFields: ["id"], onDelete: "restrict", onUpdate: "no-action", provenance }];
  missingDependency.relations = [{ name: "missingTarget", from: ["id"], to: "communications.missing", toFields: ["id"], cardinality: "many-to-one", provenance }];
  source.authoredContracts = [missingDependency];
  source.tableContracts.contracts = [];
  const draftMissing = assessDraftCompileTestability([contract.id], source);
  assert.equal(draftMissing.status, "SCHEMA_INCOMPLETE", "draft structural closure must block an unresolved FK/relation target");
  const canonicalMissing = compileLogicalSchema([contract.id], { ...source, tableContracts: { contracts: [missingDependency] } });
  assert.equal(canonicalMissing.status, "BLOCKED");
  assert.equal(canonicalMissing.prismaEligible, false);
  assert.ok(canonicalMissing.blockers.some((item) => item.reason.includes("dependency communications.missing is not in the approved canonical contract registry")));
});

test("Communications reviewed contracts close dependencies and emit a provider-labelled preview", () => {
  const communicationsIds = registry.domains.tables.filter((table) => table.context === "communications").map((table) => table.id).sort();
  assert.equal(communicationsIds.length, 9);
  assert.equal(registry.draftContracts.length, 9);
  const communicationsDraft = JSON.parse(readFileSync(new URL("../schema-sources/authored/maataa-communications-v1/contracts.draft.json", import.meta.url), "utf8"));
  assert.match(communicationsDraft.contractSetHash, /^[a-f0-9]{64}$/);
  assert.equal(communicationsDraft.readiness.schemaReady, false, "a DRAFT is not canonically schema-ready");
  const communicationsReview = JSON.parse(readFileSync(new URL("../schema-sources/authored/maataa-communications-v1/contracts.review.json", import.meta.url), "utf8"));
  const communicationsLogical = JSON.parse(readFileSync(new URL("../schema-sources/authored/maataa-communications-v1/logical-schema.draft.json", import.meta.url), "utf8"));
  assert.equal(communicationsReview.reviewStatus, "REVIEWED");
  assert.equal(communicationsReview.contractSetHash, communicationsDraft.contractSetHash, "review binds the exact current contract set");
  assert.equal(communicationsReview.logicalSchemaHash, communicationsLogical.schemaHash, "review also binds the resolved dependency closure");
  assert.equal(communicationsReview.retainedBoundaries.schemaReady, false);
  assert.equal(communicationsReview.retainedBoundaries.canonicalPromotion, true);
  assert.equal(registry.manifest.assets.communicationsDraftContracts.review.status, "REVIEWED");
  assert.ok(registry.draftContracts.every((contract) => contract.schemaLifecycle === "DRAFT" && contract.provenance.kind === "MAATAA_AUTHORED"));
  const readiness = assessDraftCompileTestability(communicationsIds, registry);
  assert.equal(readiness.status, "DRAFT_COMPILE_TESTABLE");
  assert.deepEqual(readiness.counts, { total: 9, structurallyComplete: 9, partial: 0, nameOnly: 0 });
  const logical = compileDraftLogicalSchema(communicationsIds, registry);
  assert.equal(logical.status, "DRAFT_LOGICAL_SCHEMA_READY");
  assert.equal(logical.model.tables.length, 14, "closure includes all referenced Organisation and Identity contracts");
  assert.ok(logical.model.tables.every((table) => ["CANONICAL", "DRAFT"].includes(table.schemaLifecycle)));
  assert.equal(logical.model.tables.filter((table) => table.id.startsWith("communications.")).length, 9);
  const logicalTables = new Map(logical.model.tables.map((table) => [table.id, table]));
  const directMessages = logicalTables.get("communications.direct_message_threads");
  const memberEpisodes = logicalTables.get("communications.thread_members");
  const announcements = logicalTables.get("communications.announcements");
  const workspaceMembershipKey = ["id", "workspace_id", "organisation_id"];
  for (const table of [directMessages, memberEpisodes]) {
    const membershipReference = table.foreignKeys.find((fk) => fk.references === "organisation.workspace_memberships");
    assert.deepEqual(membershipReference.referencedFields, workspaceMembershipKey, `${table.id} proves workspace and organisation membership scope`);
    assert.equal(membershipReference.fields.length, 3);
  }
  assert.equal(directMessages.invariants[0].kind, "strictly-ordered-uuid-pair");
  assert.equal(directMessages.invariants[1].kind, "referenced-row-predicate");
  assert.equal(memberEpisodes.invariants[0].kind, "at-most-one-active-row");
  assert.equal(memberEpisodes.invariants[1].kind, "immutable-episode-identity-and-terminal-state");
  assert.equal(memberEpisodes.fields.workspace_membership_id.nullable, false);
  assert.deepEqual(memberEpisodes.uniqueConstraints, [], "the generated episode ID avoids timestamp collisions and preserves history");
  assert.equal(announcements.invariants[0].kind, "conditional-nullability");
  const invalidDirectMessage = structuredClone(directMessages);
  invalidDirectMessage.invariants[0].fields = ["participant_low_membership_id", "missing_field"];
  assert.equal(validateTableContractStructure(invalidDirectMessage, registry).valid, false, "invariant field references are validated");
  const invalidParentPredicate = structuredClone(directMessages);
  invalidParentPredicate.invariants[1].predicate.equals = "not-a-thread-kind";
  assert.equal(validateTableContractStructure(invalidParentPredicate, registry).valid, false, "cross-row predicate values must exist in the referenced enum");
  const invalidEpisodeTerminal = structuredClone(memberEpisodes);
  invalidEpisodeTerminal.invariants[1].terminalField = "missing_at";
  assert.equal(validateTableContractStructure(invalidEpisodeTerminal, registry).valid, false, "episode terminal fields must exist and be nullable");
  const noProvider = generatePrismaPreview(logical);
  assert.equal(noProvider.status, "BLOCKED", "the adapter never silently chooses a provider");
  const edgeCount = logical.model.tables.reduce((total, table) => total + table.foreignKeys.length, 0);
  for (const provider of ["postgresql", "sqlite"]) {
    const preview = generatePrismaPreview(logical, { targetProvider: provider });
    assert.equal(preview.status, "GENERATED_UNVALIDATED");
    assert.match(preview.schema, new RegExp(`provider = "${provider}"`));
    assert.equal(preview.metadata.schemaLifecycle, "DRAFT");
    assert.equal(preview.metadata.deployable, false);
    assert.equal(preview.metadata.migrationExecutable, false);
    assert.ok(preview.metadata.unprojectedLogicalInvariants.length >= 5, "Prisma model validation does not claim to validate database-only invariants");
    assert.equal((preview.schema.match(/@relation\("R_/g) ?? []).length, edgeCount * 2, "each FK has its local Prisma relation and inverse relation field");
    assert.equal((preview.schema.match(/onDelete: /g) ?? []).length, edgeCount, "every declared delete action is projected");
    assert.equal((preview.schema.match(/onUpdate: /g) ?? []).length, edgeCount, "every declared update action is projected");
    assert.match(preview.schema, /enum E_/);
  }
  assert.equal(assessContractCoverage(communicationsIds, registry).counts.complete, 9, "reviewed canonical Communications contracts contribute to coverage");
  assert.equal(assessContractCoverage(registry.tableContracts.contracts.map((item) => item.id), registry).counts.complete, 352);
});

test("M2.7 Organisation approval is complete, closed, and scoped to registry readiness", () => {
  const recoveredBytes = readFileSync(new URL("../schema-sources/authored/maataa-core-v1/contracts.json", import.meta.url));
  assert.equal(createHash("sha256").update(recoveredBytes).digest("hex"), "b1023d82cc7b3f14876c14f7b69a5789e70b80c7f3b945841010dc8ed5d5a3c0");
  const tableIds = [...organisationApproval.tables].sort();
  const contracts = new Map(registry.tableContracts.contracts.map((contract) => [contract.id, contract]));
  const original = new Map(recoveredKernel.contracts.map((contract) => [contract.id, contract]));
  assert.equal(organisationApproval.decision, "APPROVED");
  assert.equal(organisationApproval.scope.schemaApproval, "APPROVED");
  assert.equal(organisationApproval.scope.provenanceApproval, "APPROVED");
  assert.equal(organisationApproval.scope.migrationApproval, "NOT_GRANTED_BY_THIS_RECORD");
  assert.equal(organisationApproval.productionBoundary.legalComplianceReviewRequired, true);
  assert.equal(checksumVerification.verificationStatus, "UNRESOLVED");
  assert.equal(registry.tableContracts.contracts.length, 352, "the canonical registry now contains all reviewed contracts");
  assert.equal(registry.authoredContracts.length, 13, "draft proposals remain available in the authored source package");
  assert.equal(registry.manifest.assets.authoredContracts.pendingReview, 0, "all contracts from the original authored kernel now have canonical registry entries");
  assert.deepEqual(
    (({ status, total, complete, partial, nameOnly }) => ({ status, total, complete, partial, nameOnly }))(registry.manifest.integrity.schemaCompilerReadiness),
    { status: "SCHEMA_READY", total: 352, complete: 352, partial: 0, nameOnly: 0 },
  );
  assert.deepEqual(registry.tableContracts.contracts.map((contract) => contract.id).sort(), registry.domains.tables.map((table) => table.id).sort());
  assert.ok(registry.tableContracts.contracts.every((contract) => contract.provenance.reviewStatus === "approved" || contract.provenance.kind === "MAATAA_AUTHORED" && contract.provenance.reviewedBy === "thelinep"));
  const canonicalIds = new Set(registry.tableContracts.contracts.map((contract) => contract.id));
  const pendingProposals = registry.authoredContracts.filter((contract) => !canonicalIds.has(contract.id));
  assert.equal(pendingProposals.length, 0);
  assert.ok(pendingProposals.every((contract) => contract.provenance.reviewStatus === "unreviewed"));

  const normalizeReview = (value) => {
    if (Array.isArray(value)) return value.map(normalizeReview);
    if (!value || typeof value !== "object") return value;
    const normalized = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === "reviewedBy" || key === "reviewedAt") continue;
      normalized[key] = key === "reviewStatus" && child === "approved" ? "unreviewed" : normalizeReview(child);
    }
    return normalized;
  };
  for (const tableId of ["organisation.organisations", "organisation.organisation_memberships", "organisation.workspaces", "organisation.workspace_memberships"]) {
    const promoted = structuredClone(contracts.get(tableId));
    const draft = original.get(tableId);
    assert.ok(draft, `Recovered source is missing ${tableId}`);
    assert.deepEqual(promoted.primaryKey, draft.primaryKey, `${tableId} primary key changed during promotion`);
    if (tableId === "organisation.workspace_memberships") {
      assert.equal(workspaceMembershipKeyAmendment.decision, "APPROVED");
      assert.equal(workspaceMembershipKeyAmendment.approvedBy, "thelinep");
      assert.equal(promoted.version, workspaceMembershipKeyAmendment.resultVersion);
      assert.deepEqual(promoted.uniqueConstraints.at(-1), workspaceMembershipKeyAmendment.addedUniqueConstraint);
      const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])])) : value;
      assert.equal(createHash("sha256").update(JSON.stringify(stable(promoted))).digest("hex"), workspaceMembershipKeyAmendment.resultContractHash);
      promoted.version = draft.version;
      promoted.uniqueConstraints = promoted.uniqueConstraints.filter((item) => item.name !== workspaceMembershipKeyAmendment.addedUniqueConstraint.name);
    }
    promoted.lifecycle.retentionPolicy = draft.lifecycle.retentionPolicy;
    assert.deepEqual(normalizeReview(promoted), draft, `${tableId} changed beyond approval metadata and retention reference`);
  }

  const coverage = assessContractCoverage(tableIds, registry);
  assert.equal(coverage.status, "SCHEMA_READY");
  assert.deepEqual(coverage.counts, { total: 10, complete: 10, partial: 0, nameOnly: 0 });
  const structural = assessDraftCompileTestability(tableIds, registry);
  assert.equal(structural.status, "DRAFT_COMPILE_TESTABLE");
  assert.deepEqual(structural.counts, { total: 10, structurallyComplete: 10, partial: 0, nameOnly: 0 });
  const logical = compileDraftLogicalSchema(tableIds, registry);
  assert.equal(logical.status, "DRAFT_LOGICAL_SCHEMA_READY");
  assert.equal(logical.authority, "DRAFT_OR_MIXED");
  assert.equal(logical.prismaEligible, true, "closed authored schema may emit a DRAFT Prisma preview");
  assert.equal(logical.deployable, false);
  assert.equal(logical.model.tables.length, 11, "Organisation closure includes identity.users");
  assert.equal(logical.model.tables.find((item) => item.id === "identity.users").schemaLifecycle, "CANONICAL");
  const canonicalLogical = compileLogicalSchema(tableIds, registry);
  assert.notEqual(canonicalLogical.status, "BLOCKED", "identity.users now resolves from the reviewed canonical Identity context");
  assert.equal(canonicalLogical.authority, "CANONICAL_APPROVED_ONLY");
  assert.equal(canonicalLogical.model.tables.length, 11);
  const promotedWithoutApproval = structuredClone(registry);
  promotedWithoutApproval.tableContracts.contracts.push(structuredClone(registry.authoredContracts.find((item) => item.id === "identity.users")));
  const unapprovedDependency = compileLogicalSchema(tableIds, promotedWithoutApproval);
  assert.equal(unapprovedDependency.status, "BLOCKED", "a duplicate canonical dependency must not become compiler input");
  assert.ok(unapprovedDependency.blockers.some((item) => item.reason.includes("duplicate canonical contract ID")));

  const newEdges = registry.tableContracts.contracts
    .filter((contract) => organisationApproval.newlyAuthoredContracts.includes(contract.id))
    .flatMap((contract) => contract.foreignKeys.map((foreignKey) => ({ sourceTable: contract.id, foreignKey: foreignKey.name, targetTable: foreignKey.references, status: "CLOSED" })))
    .sort((a, b) => `${a.sourceTable}:${a.foreignKey}`.localeCompare(`${b.sourceTable}:${b.foreignKey}`));
  const approvedEdges = [...organisationClosure.newForeignKeyEdges]
    .sort((a, b) => `${a.sourceTable}:${a.foreignKey}`.localeCompare(`${b.sourceTable}:${b.foreignKey}`));
  assert.deepEqual(newEdges, approvedEdges);
  assert.equal(newEdges.length, 15);

  const globalCoverage = assessContractCoverage(registry.domains.tables.map((table) => table.id), registry);
  assert.equal(globalCoverage.status, "SCHEMA_READY");
  assert.deepEqual(globalCoverage.counts, { total: 352, complete: 352, partial: 0, nameOnly: 0 });
  assert.equal(getRegistryGate(registry).schemaCompilerReady, true);
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
