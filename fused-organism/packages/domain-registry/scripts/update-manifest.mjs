import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getRegistryGate } from "../src/index.mjs";
import { assessContractCoverage } from "../src/contracts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (name) => JSON.parse(await readFile(path.join(root, name), "utf8"));
const manifest = await readJson("registry.manifest.json");
const domains = await readJson("data/domain-catalog.json");
const contexts = await readJson("data/context-registry.json");
const products = await readJson("data/product-composition-registry.json");
const flows = await readJson("data/flow-registry.json");
const registeredRoutes = await readJson("routes/registered.json");
const declaredPatterns = await readJson("routes/declared-patterns.json");
const routeAliases = await readJson("routes/aliases.json");
const routeResolutionRegistry = await readJson("routes/resolutions.json");
const routeFindings = await readJson("routes/findings.json");
const flowRouteReferences = await readJson("routes/flow-references.json");
const deferredRoutes = await readJson("routes/deferred.json");
const routePatternPolicy = await readJson("routes/pattern-derivation-policy.json");
const actors = await readJson("data/actor-registry.json");
const sliceMap = await readJson("data/slice-map.json");
const spine = await readJson("catalog/spine.json");
const tableContracts = await readJson("data/table-contracts.json");
const authoredKernel = await readJson("schema-sources/authored/maataa-core-v1/contracts.json");
const communicationsDraft = await readJson("schema-sources/authored/maataa-communications-v1/contracts.draft.json");
const communicationsCorrections = await readJson("schema-sources/authored/maataa-communications-v1/contract-review-corrections.json");
const communicationsContractReview = await readJson("schema-sources/authored/maataa-communications-v1/contracts.review.json");
const castingDraft = await readJson("schema-sources/authored/casting-v1/contracts.draft.json");
const castingPeopleReview = await readJson("schema-sources/authored/casting-v1/people.review.json");
const castingProjectReview = await readJson("schema-sources/authored/casting-v1/project.review.json");
const castingContextReviews = Object.fromEntries(await Promise.all(["identity", "evidence", "platform", "production"].map(async (contextId) => [
  contextId,
  await readJson(`schema-sources/authored/casting-v1/${contextId}.review.json`),
])));
const normalizeReviewedPeopleContract = (contract) => {
  const normalized = structuredClone(contract);
  normalized.schemaLifecycle = "DRAFT";
  const clearReviewStamp = (value) => {
    if (!value || typeof value !== "object") return;
    if (value.kind === "MAATAA_AUTHORED") {
      delete value.reviewedBy;
      delete value.reviewedAt;
    }
    for (const child of Object.values(value)) clearReviewStamp(child);
  };
  clearReviewStamp(normalized);
  return normalized;
};
const canonicalPeopleContracts = tableContracts.contracts.filter((contract) => contract.context === "people");
const normalizedPeopleHash = createHash("sha256")
  .update(JSON.stringify(canonicalPeopleContracts.map(normalizeReviewedPeopleContract)))
  .digest("hex");
const peopleReviewCurrent = canonicalPeopleContracts.length === castingPeopleReview.contractCount
  && normalizedPeopleHash === castingPeopleReview.contractSetHash
  && JSON.stringify(canonicalPeopleContracts.map((contract) => contract.id).sort()) === JSON.stringify(castingPeopleReview.contractIds);
const canonicalProjectContracts = tableContracts.contracts.filter((contract) => contract.context === "project");
const normalizeReviewedProjectContract = (contract) => {
  const normalized = structuredClone(contract);
  if (castingProjectReview.coreProposalIds.includes(normalized.id)) delete normalized.schemaLifecycle;
  else normalized.schemaLifecycle = "DRAFT";
  const clearReviewStamp = (value) => {
    if (!value || typeof value !== "object") return;
    if (value.kind === "MAATAA_AUTHORED") {
      delete value.reviewedBy;
      delete value.reviewedAt;
    }
    if (value.reviewStatus === "approved") {
      value.reviewStatus = "unreviewed";
      delete value.reviewedBy;
      delete value.reviewedAt;
    }
    for (const child of Object.values(value)) clearReviewStamp(child);
  };
  clearReviewStamp(normalized);
  return normalized;
};
const normalizedProjectHash = createHash("sha256")
  .update(JSON.stringify(canonicalProjectContracts.map(normalizeReviewedProjectContract)))
  .digest("hex");
const projectReviewCurrent = canonicalProjectContracts.length === castingProjectReview.contractCount
  && normalizedProjectHash === castingProjectReview.contractSetHash
  && JSON.stringify(canonicalProjectContracts.map((contract) => contract.id).sort()) === JSON.stringify(castingProjectReview.contractIds);
const normalizeReviewedContextContract = (contract, review) => {
  const normalized = structuredClone(contract);
  if (review.coreProposalIds.includes(normalized.id)) delete normalized.schemaLifecycle;
  else normalized.schemaLifecycle = "DRAFT";
  const clearReviewStamp = (value) => {
    if (!value || typeof value !== "object") return;
    if (value.kind === "MAATAA_AUTHORED") {
      delete value.reviewedBy;
      delete value.reviewedAt;
    }
    if (value.reviewStatus === "approved") {
      value.reviewStatus = "unreviewed";
      delete value.reviewedBy;
      delete value.reviewedAt;
    }
    for (const child of Object.values(value)) clearReviewStamp(child);
  };
  clearReviewStamp(normalized);
  return normalized;
};
const castingContextReviewState = Object.fromEntries(Object.entries(castingContextReviews).map(([contextId, review]) => {
  const contracts = tableContracts.contracts.filter((contract) => contract.context === contextId);
  const hash = createHash("sha256").update(JSON.stringify(contracts.map((contract) => normalizeReviewedContextContract(contract, review)))).digest("hex");
  const current = contracts.length === review.contractCount
    && hash === review.contractSetHash
    && JSON.stringify(contracts.map((contract) => contract.id).sort()) === JSON.stringify(review.contractIds);
  return [contextId, { review, contracts, current }];
}));
const communicationsPrismaPreviews = await Promise.all(["postgresql", "sqlite"].map(async (provider) => ({
  provider,
  ...(await readJson(`schema-sources/authored/maataa-communications-v1/prisma-preview.${provider}.draft.metadata.json`)),
})));
const scalarTypes = await readJson("data/scalar-types.json");
const schemaSourceRegistry = await readJson("schema-sources/registry.json");
const schemaSourceRecords = await Promise.all(schemaSourceRegistry.records.map((relative) => readJson(`schema-sources/${relative.replace(/^\.\//, "")}`)));
const architectureSource = await readJson("sources/deepseek_json_20261002_2c644e.json");
const sourceSpine = await readJson("sources/deepseek_json_20261002_104c0f.json");
const projections = [
  ["catalog/spine.json", "data/spine.json"],
  ["catalog/future-production-tables.json", "data/future-production-tables.json"],
  ["contexts/", "data/context-registry.json"],
  ["products/compositions.json", "data/product-composition-registry.json"],
  ["flows/slice-map.json", "data/slice-map.json"],
  ["flows/route-resolutions.json", "data/route-resolutions.json"],
  ["flows/flow-classifications.json", "data/flow-classifications.json"],
];
for (const [canonical, projection] of projections) {
  if (canonical === "contexts/") {
    const aggregate = await readJson(projection);
    for (const context of aggregate.contexts) {
      const packaged = await readJson(`contexts/${context.id}/context.json`);
      if (JSON.stringify(packaged) !== JSON.stringify(context)) throw new Error(`Context package projection mismatch: ${context.id}`);
    }
    continue;
  }
  if (JSON.stringify(await readJson(canonical)) !== JSON.stringify(await readJson(projection))) throw new Error(`Registry projection mismatch: ${canonical} vs ${projection}`);
}
const expectedLegacyRoutes = { schemaVersion: "1.0.0", status: "source-imported", routes: registeredRoutes.routes.map(({ kind, declared, registered, executable, routeState, ...route }) => ({ ...route, status: "registered" })) };
if (JSON.stringify(expectedLegacyRoutes) !== JSON.stringify(await readJson("data/route-registry.json"))) throw new Error("Legacy route catalog projection mismatch: routes/registered.json vs data/route-registry.json");
const assetFiles = [];
for (const directory of ["catalog", "contexts", "control-plane", "data", "flows", "products", "routes", "schemas", "sources", "schema-sources", "applications", "composition"]) {
  const walk = async (current) => {
    for (const entry of await readdir(path.join(root, current), { withFileTypes: true })) {
      const relative = path.posix.join(current, entry.name);
      if (entry.isDirectory()) await walk(relative);
      else if (entry.isFile()) assetFiles.push(relative);
    }
  };
  await walk(directory);
}
assetFiles.sort();
const contentHashes = [];
for (const file of assetFiles) contentHashes.push({ path: `./${file}`, sha256: createHash("sha256").update(await readFile(path.join(root, file))).digest("hex") });
const registryHash = createHash("sha256").update(contentHashes.map((item) => `${item.path}\0${item.sha256}\n`).join("")).digest("hex");
const gate = getRegistryGate();
const schemaCoverage = assessContractCoverage(domains.tables.map((item) => item.id), { domains, tableContracts, scalarTypes, authoredContracts: authoredKernel.contracts, castingDraftContracts: castingDraft.contracts });
const counts = gate.counts;
manifest.schemaVersion = "1.1.0";
manifest.registryId = "tlps-domain-registry";
manifest.version = "1.0.0";
manifest.milestones = {
  ...(manifest.milestones ?? {}),
  M1: manifest.milestones?.M1 ?? {
    registryVersion: "1.0.0",
    registryHash: "8924c3614daa415bf33ef3b47e68e0d1b35dd6f632602dad9019512d4db5a2da",
    frozenAt: "2026-10-02",
    acceptedRouteDeferrals: 11,
  },
};
manifest.status = gate.publishable ? "validated" : "draft";
manifest.owner = { team: "platform", role: "domain-registry" };
manifest.derivations = { tableStatus: { version: 1, default: "stubbed", plannedSet: "./catalog/future-production-tables.json" }, tableId: { version: 1, pattern: "<context>.<name>", policy: "context-dot-name@1" }, routePattern: { policy: routePatternPolicy.ruleId, source: "./routes/pattern-derivation-policy.json", minimumConcreteRoutes: routePatternPolicy.minimumConcreteRoutes, derivedPatterns: routePatternPolicy.behavior.patternsDerived } };
manifest.assets = {
  domainCatalog: { path: "./data/domain-catalog.json", version: "1.0.0", status: "status-derived", expectedRecords: 352, records: domains.tables.length, domains: domains.domains.length, stubbed: domains.tables.filter((row) => row.status === "stubbed").length, planned: domains.tables.filter((row) => row.status === "planned").length, duplicateIds: domains.tables.length - new Set(domains.tables.map((row) => row.id)).size },
  spine: { path: "./catalog/spine.json", version: spine.version, contexts: spine.contexts, sharedServices: spine.sharedServices },
  contextRegistry: { path: "./contexts/", version: "1.0.0", status: "authored", expectedRecords: 17, records: contexts.contexts.length, spine: contexts.canonicalSpine, creativeDependencies: contexts.contexts.find((item) => item.id === "creative")?.dependsOn ?? [] },
  products: { path: "./products/compositions.json", version: "1.0.0", status: products.status, expectedRecords: 6, records: products.products.length, applicationManifestRecords: products.applicationProducts.length },
  flows: { path: "./data/flow-registry.json", version: "1.0.0", status: flows.status, records: flows.flows.length, contextBindings: flows.contextBindings.length },
  routes: { path: "./routes/registered.json", version: registeredRoutes.schemaVersion, status: registeredRoutes.status, records: registeredRoutes.routes.length, registeredStatic: registeredRoutes.routes.filter((item) => item.routeState === "REGISTERED_STATIC").length, registeredDynamic: registeredRoutes.routes.filter((item) => item.routeState === "REGISTERED_DYNAMIC").length },
  declaredRoutePatterns: { path: "./routes/declared-patterns.json", version: declaredPatterns.schemaVersion, status: declaredPatterns.status, records: declaredPatterns.patterns.length, sourceFieldPresent: declaredPatterns.sourceFieldPresent, claimedByReview: declaredPatterns.claimedByReview },
  routeAliases: { path: "./routes/aliases.json", version: routeAliases.schemaVersion, status: routeAliases.status, records: routeAliases.aliases.length },
  deferredRoutes: { path: "./routes/deferred.json", version: deferredRoutes.schemaVersion, status: deferredRoutes.status, records: deferredRoutes.routes.length, categories: deferredRoutes.routes.reduce((counts, item) => ({ ...counts, [item.category]: (counts[item.category] ?? 0) + 1 }), {}) },
  routePatternPolicy: { path: "./routes/pattern-derivation-policy.json", version: routePatternPolicy.schemaVersion, ruleId: routePatternPolicy.ruleId, minimumConcreteRoutes: routePatternPolicy.minimumConcreteRoutes, derivedPatterns: routePatternPolicy.behavior.patternsDerived },
  routeResolutions: { path: "./routes/resolutions.json", version: routeResolutionRegistry.schemaVersion, status: routeResolutionRegistry.status, ...routeResolutionRegistry.counts },
  routeFindings: { path: "./routes/findings.json", version: routeFindings.schemaVersion, status: routeFindings.status, records: routeFindings.findings.length },
  flowRouteReferences: { path: "./routes/flow-references.json", version: flowRouteReferences.schemaVersion, status: flowRouteReferences.status, ...flowRouteReferences.counts },
  actors: { path: "./data/actor-registry.json", version: "1.0.0", status: actors.status, records: actors.actors.length, unresolved: actors.actors.filter((item) => item.status !== "registered").length },
  sliceMap: { path: "./flows/slice-map.json", version: "1.0.0", status: sliceMap.status, referencedUnique: sliceMap.referencedSliceCount, contextResolved: sliceMap.resolvedCount, explicitSpecial: sliceMap.explicitlyClassifiedCount, unresolved: sliceMap.unresolvedCount },
  applicationRegistry: { path: "./applications/registry.json", version: "1.0.0", status: "local-preview", records: (await readJson("applications/registry.json")).records.length, resolverVersion: "1.0.0" },
  tableContracts: { path: "./data/table-contracts.json", version: tableContracts.schemaVersion, status: tableContracts.status, records: tableContracts.contracts.length, catalogTables: domains.tables.length, ...schemaCoverage.counts, byContext: schemaCoverage.byContext },
  authoredContracts: {
    path: "./schema-sources/authored/maataa-core-v1/contracts.json",
    sourceId: authoredKernel.sourceId,
    status: authoredKernel.status,
    records: authoredKernel.contracts.length,
    canonicalized: authoredKernel.contracts.filter((contract) => tableContracts.contracts.some((canonical) => canonical.id === contract.id)).length,
    pendingReview: authoredKernel.contracts.filter((contract) => !tableContracts.contracts.some((canonical) => canonical.id === contract.id)).length,
  },
  communicationsDraftContracts: {
    path: "./schema-sources/authored/maataa-communications-v1/contracts.draft.json",
    schemaLifecycle: communicationsDraft.schemaLifecycle,
    records: communicationsDraft.contracts.length,
    contractSetHash: communicationsDraft.contractSetHash,
    readiness: communicationsDraft.readiness,
    correctionSetId: communicationsCorrections.correctionSetId,
    correctionDecisionStatus: communicationsCorrections.decisionStatus,
    review: {
      path: "./schema-sources/authored/maataa-communications-v1/contracts.review.json",
      status: communicationsContractReview.contractSetHash === communicationsDraft.contractSetHash ? communicationsContractReview.reviewStatus : "STALE",
      reviewer: communicationsContractReview.reviewer,
      contractSetHash: communicationsContractReview.contractSetHash,
      logicalSchemaHash: communicationsContractReview.logicalSchemaHash,
      schemaReady: communicationsContractReview.retainedBoundaries.schemaReady,
      canonicalPromotion: communicationsContractReview.retainedBoundaries.canonicalPromotion,
    },
    prismaPreviews: communicationsPrismaPreviews.map(({ provider, ...preview }) => ({
      provider,
      path: `./schema-sources/authored/maataa-communications-v1/prisma-preview.${provider}.draft.prisma`,
      validation: preview.validationStatus,
      validationTool: preview.validationTool,
      contractSetHash: preview.contractSetHash,
      deployable: preview.deployable,
      migrationExecutable: preview.migrationExecutable,
      unprojectedLogicalInvariants: preview.unprojectedLogicalInvariants ?? [],
    })),
  },
  castingDraftContracts: {
    path: "./schema-sources/authored/casting-v1/contracts.draft.json",
    schemaLifecycle: castingDraft.schemaLifecycle,
    composition: castingDraft.composition,
    resolvedContractCount: castingDraft.resolvedContractCount,
    authoredDraftCount: castingDraft.contracts.length,
    contractSetHash: castingDraft.contractSetHash,
    readiness: castingDraft.readiness,
    peopleReview: {
      path: "./schema-sources/authored/casting-v1/people.review.json",
      status: peopleReviewCurrent ? castingPeopleReview.reviewStatus : "STALE",
      reviewer: castingPeopleReview.reviewer,
      contractCount: castingPeopleReview.contractCount,
      contractSetHash: castingPeopleReview.contractSetHash,
      compositionContractSetHash: castingDraft.contractSetHash,
      logicalSchemaHash: castingDraft.readiness.logicalSchemaHash,
      identityContextCanonical: tableContracts.contracts.some((contract) => contract.id === "identity.users"),
      compositionSchemaReady: castingDraft.readiness.schemaReady,
      applicationMembershipAuthorizationImplemented: castingPeopleReview.retainedBoundaries.applicationMembershipAuthorizationImplemented,
      canonicalizedContracts: tableContracts.contracts.filter((contract) => contract.context === "people").length,
      canonicalPromotion: castingPeopleReview.decision === "APPROVE",
    },
    projectReview: {
      path: "./schema-sources/authored/casting-v1/project.review.json",
      status: projectReviewCurrent ? castingProjectReview.reviewStatus : "STALE",
      reviewer: castingProjectReview.reviewer,
      contractCount: castingProjectReview.contractCount,
      contractSetHash: castingProjectReview.contractSetHash,
      compositionContractSetHash: castingProjectReview.compositionContractSetHash,
      logicalSchemaHash: castingProjectReview.logicalSchemaHash,
      compositionSchemaReady: castingProjectReview.retainedBoundaries.compositionSchemaReady,
      canonicalizedContracts: canonicalProjectContracts.length,
      canonicalPromotion: castingProjectReview.decision === "APPROVE",
    },
    contextReviews: Object.fromEntries(Object.entries(castingContextReviewState).map(([contextId, { review, contracts, current }]) => [contextId, {
      path: `./schema-sources/authored/casting-v1/${contextId}.review.json`,
      status: current ? review.reviewStatus : "STALE",
      reviewer: review.reviewer,
      contractCount: review.contractCount,
      contractSetHash: review.contractSetHash,
      compositionContractSetHash: review.compositionContractSetHash,
      logicalSchemaHash: review.logicalSchemaHash,
      compositionSchemaReady: review.retainedBoundaries.compositionSchemaReady,
      canonicalizedContracts: contracts.length,
      canonicalPromotion: review.decision === "APPROVE",
    }])),
  },
  scalarTypes: { path: "./data/scalar-types.json", version: scalarTypes.schemaVersion, status: scalarTypes.status, records: scalarTypes.types.length },
  schemaSources: { path: "./schema-sources/registry.json", version: schemaSourceRegistry.schemaVersion, records: schemaSourceRecords.length, byClassification: schemaSourceRecords.reduce((counts, item) => ({ ...counts, [item.classification]: (counts[item.classification] ?? 0) + 1 }), {}) },
  compositionArtifacts: { path: "./composition/route-impact-indexes.json", version: "1.0.0", status: "generated-preview", routeBacklog: (await readJson("composition/route-impact-indexes.json")).deferredRouteBacklog.length, compiler: "not-implemented" },
};
manifest.sources = manifest.sources.filter((source) => source.key !== "m1ArchitectureProposal").map((source) => ({ ...source, snapshot: `./sources/${source.file}` }));
const proposalSnapshot = contentHashes.find((item) => item.path === "./sources/m1-registry-architecture-proposal.txt");
manifest.sources.push({ key: "m1ArchitectureProposal", file: "m1-registry-architecture-proposal.txt", snapshot: proposalSnapshot.path, sha256: proposalSnapshot.sha256 });
const sourceSpines = { architecture: architectureSource.spine, spineFile: sourceSpine.contexts.map((item) => item.id) };
manifest.discrepancies = [
  { code: "source-spine-reconciled-by-m1-policy", sourceSpines, decision: "Five-context spine per catalog/spine.json; evidence is a default shared service." },
  { code: "route-counts-reconciled", manifestRegisteredPages: registeredRoutes.routes.length, flowSourcePagesMetadata: declaredPatterns.sourceFlowDocumentPageCount, distinctFlowRoutePaths: routeResolutionRegistry.counts.distinctRequestedPaths, registeredFlowRoutePaths: routeResolutionRegistry.counts.registeredStatic + routeResolutionRegistry.counts.registeredDynamic, unresolvedFlowRoutePaths: routeResolutionRegistry.counts.unresolved, registeredPagesUnreferencedByFlows: registeredRoutes.routes.filter((item) => !item.flowIds.length).length, resolverFallbacks: ["normalized path lookup only; no prefix or fuzzy matching"], source: "The detailed flow artifact's counts.sourcePages=307 is metadata, not its unique byRoute index. The index has 293 unique route paths: 282 registered and 11 unresolved. Of 284 manifest pages, two are not referenced by those flows." },
  { code: "route-vocabulary-separated", registeredPages: registeredRoutes.routes.length, registeredStatic: registeredRoutes.routes.filter((item) => item.routeState === "REGISTERED_STATIC").length, registeredDynamic: registeredRoutes.routes.filter((item) => item.routeState === "REGISTERED_DYNAMIC").length, declaredPatterns: declaredPatterns.patterns.length, deferredRoutes: deferredRoutes.routes.length, unresolvedFlowPaths: routeResolutionRegistry.counts.unresolved, claimedPatterns: declaredPatterns.reviewClaim.dynamicPatterns, source: "The supplied application manifest has 284 pages and no routeParams or pageGroups field. The 17-pattern review claim is retained as unverified metadata; no patterns are synthesized." },
  { code: "product-model-separated", canonicalCompositions: products.products.length, applicationProducts: products.applicationProducts.length },
];
manifest.provenance = {
  m1PoliciesApplied: "2026-10-02",
  gitAvailable: true,
  gitRepository: "packages/domain-registry",
  packageHash: registryHash,
  packageHashMethod: "SHA-256 over sorted package asset paths and their SHA-256 digests; excludes registry.manifest.json.",
};
manifest.counts = {
  expectedDomains: 18, domains: domains.domains.length, expectedTables: 352, tables: domains.tables.length,
  stubbedTables: domains.tables.filter((row) => row.status === "stubbed").length, plannedTables: domains.tables.filter((row) => row.status === "planned").length,
  missingTableStatuses: 0, duplicateTableIds: domains.tables.length - new Set(domains.tables.map((row) => row.id)).size,
  expectedContexts: 17, contexts: contexts.contexts.length, contextsWithTables: contexts.contexts.filter((item) => item.tableIds.length).length,
  coreSpineEntries: contexts.canonicalSpine.length, sourceSpineEntries: sourceSpine.contexts.length, architectureSpineEntries: architectureSource.spine.length,
  expectedProducts: 6, productCompositions: products.products.length, applicationProducts: products.applicationProducts.length,
  flows: flows.flows.length, flowContextBindings: flows.contextBindings.length, flowsWithoutProductTags: flows.flows.filter((item) => !(item.products ?? []).length).length,
  explicitlyClassifiedFlows: 8, referencedUniqueSlices: sliceMap.referencedSliceCount, resolvedSlices: sliceMap.resolvedCount, explicitlyClassifiedSlices: sliceMap.explicitlyClassifiedCount, unresolvedSlices: sliceMap.unresolvedCount,
  routes: registeredRoutes.routes.length, registeredRoutes: registeredRoutes.routes.length, registeredStaticRoutes: registeredRoutes.routes.filter((item) => item.routeState === "REGISTERED_STATIC").length, registeredDynamicRoutes: registeredRoutes.routes.filter((item) => item.routeState === "REGISTERED_DYNAMIC").length,
  declaredDynamicPatterns: declaredPatterns.patterns.length, approvedRouteAliases: routeAliases.aliases.length, unresolvedRoutes: routeResolutionRegistry.counts.unresolved, deferredRoutes: deferredRoutes.routes.length,
  requestedFlowRoutePaths: routeResolutionRegistry.counts.distinctRequestedPaths, dynamicPatternsClaimedByReview: declaredPatterns.claimedByReview, flowRouteReferenceOccurrences: flowRouteReferences.counts.references,
  actors: actors.actors.length, unresolvedActors: actors.actors.filter((item) => item.status !== "registered").length,
};
manifest.integrity = {
  status: gate.publishable ? "complete" : "blocked",
  policy: "BLOCKER > 0 or ERROR > 0 fails validation, publish, and compiler consumption. Explicitly deferred route gaps remain UNRESOLVED and non-executable, require category, owner, and targetVersion, and are informational until that target version.",
  blockers: counts.BLOCKER ?? 0,
  errors: counts.ERROR ?? 0,
  warnings: counts.WARNING ?? 0,
  info: counts.INFO ?? 0,
  ...counts,
  publishable: gate.publishable,
  compilerConsumable: gate.compilerConsumable,
  registryCompilerReady: gate.registryCompilerReady,
  compilerReady: gate.compilerReady,
  schemaCompilerReadiness: { status: schemaCoverage.status, ...schemaCoverage.counts, reason: "Registry package validity does not imply database schema readiness; incomplete contracts fail closed." },
  domainRegistry: gate.domainRegistry,
  routeRegistry: gate.routeRegistry,
  findings: gate.findings,
  registryHash,
  contentHashes,
};
await writeFile(path.join(root, "registry.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Updated manifest ${manifest.version}: ${counts.BLOCKER ?? 0} blocker(s), ${counts.ERROR ?? 0} error(s), hash ${registryHash}.`);
