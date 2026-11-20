import { registry as defaultRegistry } from "./index.mjs";
import { assessContractCoverage } from "./contracts.mjs";
import { canonicalJson, sha256, stableValue as stable } from "./hash.mjs";

export const RESOLVER_VERSION = "1.0.0";
const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b));
const flowRoutes = (flow) => uniqueSorted([...(flow.entryPoints ?? []), ...(flow.steps ?? []), ...(flow.routes ?? [])].map((item) => typeof item === "string" ? item : item.route).filter(Boolean));
const tagResolution = (tag, source) => source.products.tagResolutions?.[tag];
const findContext = (id, source) => source.contexts.contexts.find((item) => item.id === id);

function resolveProduct(intent, source) {
  const tags = uniqueSorted(intent.productTags ?? []);
  if (!tags.length) throw new Error("Provide at least one registered product tag.");
  const resolutions = tags.map((tag) => ({ tag, ...tagResolution(tag, source) }));
  const invalid = resolutions.filter((item) => !item.classification);
  if (invalid.length) throw new Error(`Unknown product tag(s): ${invalid.map((item) => item.tag).join(", ")}.`);
  const canonicalIds = uniqueSorted(resolutions.filter((item) => item.classification === "canonical-product").map((item) => item.canonicalProductId));
  if (canonicalIds.length !== 1) throw new Error(canonicalIds.length ? `Intent resolves to multiple canonical products: ${canonicalIds.join(", ")}.` : "Product tags do not resolve to a canonical product.");
  const product = source.products.products.find((item) => item.id === canonicalIds[0]);
  if (!product) throw new Error(`Canonical product ${canonicalIds[0]} is missing from the composition registry.`);
  return { product, tags, resolutions };
}

export function resolveComposition(intent, source = defaultRegistry) {
  if (!intent || typeof intent !== "object" || Array.isArray(intent)) throw new TypeError("Composition intent must be an object with productTags and optional flowIds.");
  const { product, tags, resolutions } = resolveProduct(intent, source);
  const flowSelectionMode = intent.flowIds?.length ? "explicit" : "product-default";
  const flowById = new Map(source.flows.flows.map((flow) => [flow.id, flow]));
  const bindingByFlow = new Map(source.flows.contextBindings.map((binding) => [binding.flowId, binding]));
  const selectedFlowIds = uniqueSorted(intent.flowIds?.length ? intent.flowIds : product.flowIds);
  if (!selectedFlowIds.length) throw new Error(`Canonical product ${product.id} has no selectable flows.`);
  for (const flowId of selectedFlowIds) {
    const flow = flowById.get(flowId);
    if (!flow) throw new Error(`Selected flow ${flowId} is not registered.`);
    if (!(flow.canonicalProductIds ?? []).includes(product.id) && !(product.flowIds ?? []).includes(flowId)) throw new Error(`Flow ${flowId} is not associated with canonical product ${product.id}.`);
    if (!bindingByFlow.has(flowId)) throw new Error(`Flow ${flowId} has no explicit context binding.`);
  }

  const includedContexts = new Map();
  const includeContext = (contextId, via, reason, flows = []) => {
    const context = findContext(contextId, source);
    if (!context) throw new Error(`Context ${contextId} is not registered.`);
    const record = includedContexts.get(contextId) ?? { context, why: [] };
    record.why.push({ via, reason, flowIds: uniqueSorted(flows) });
    includedContexts.set(contextId, record);
  };
  const flowContextIds = new Set();
  for (const flowId of selectedFlowIds) {
    const binding = bindingByFlow.get(flowId);
    for (const contextId of binding.contextIds ?? []) {
      flowContextIds.add(contextId);
      includeContext(contextId, `flow:${flowId}`, "Required by the flow's authored context binding.", [flowId]);
    }
  }
  const visitedContexts = new Set();
  const visit = (contextId, chain = []) => {
    if (chain.includes(contextId)) throw new Error(`Context dependency cycle: ${[...chain, contextId].join(" -> ")}.`);
    if (visitedContexts.has(contextId)) return;
    const context = findContext(contextId, source);
    for (const dependency of context.dependencies ?? []) {
      const id = dependency.contextId;
      includeContext(id, `dependency:${contextId}`, `Required by ${contextId}@${context.version} at ${dependency.version}.`);
      visit(id, [...chain, contextId]);
    }
    visitedContexts.add(contextId);
  };
  for (const contextId of [...flowContextIds].sort()) visit(contextId);

  for (const contextId of source.spine.contexts) includeContext(contextId, "canonical-spine", "Always included by the registry's five-context spine.");
  const requestedServices = uniqueSorted(intent.sharedServices ?? []);
  for (const serviceId of requestedServices) {
    const service = (source.products.services ?? []).find((item) => item.id === serviceId);
    if (!service) throw new Error(`Unknown shared service ${serviceId}.`);
    if (service.defaultIncluded !== true && !(intent.sharedServices ?? []).includes(serviceId)) throw new Error(`Optional service ${serviceId} requires explicit opt-in.`);
    includeContext(serviceId, `shared-service:${serviceId}`, "Explicitly requested shared service.");
  }
  for (const service of source.products.services ?? []) if (service.defaultIncluded === true) includeContext(service.id, `shared-service:${service.id}`, "Included by the registry's default shared-service rule.");
  if (intent.includePublicContext === true) includeContext("public", "intent:public-opt-in", "Public context is opt-in and was explicitly requested.");

  const contextIds = uniqueSorted([...includedContexts.keys()]);
  const contextById = new Map(contextIds.map((id) => [id, findContext(id, source)]));
  const tableById = new Map(source.domains.tables.map((table) => [table.id, table]));
  const bindingTableIds = new Map();
  for (const flowId of selectedFlowIds) for (const tableId of bindingByFlow.get(flowId).tableIds ?? []) {
    const table = tableById.get(tableId);
    if (!table) throw new Error(`Flow ${flowId} binds missing table ${tableId}.`);
    includeContext(table.context, `flow-table:${flowId}`, `Flow binding references ${tableId}.`, [flowId]);
    const flows = bindingTableIds.get(tableId) ?? new Set(); flows.add(flowId); bindingTableIds.set(tableId, flows);
  }
  for (const contextId of [...includedContexts.keys()].sort()) visit(contextId);
  const finalContextIds = uniqueSorted([...includedContexts.keys()]);
  const tableRecords = new Map();
  for (const contextId of finalContextIds) {
    const context = findContext(contextId, source);
    for (const tableId of context.tableIds ?? []) {
      const table = tableById.get(tableId);
      if (!table) throw new Error(`Context ${contextId} references missing table ${tableId}.`);
      tableRecords.set(tableId, table);
    }
  }
  const tableIds = uniqueSorted([...tableRecords.keys()]);
  const flowRecords = selectedFlowIds.map((id) => flowById.get(id));
  const pathFlowIds = new Map();
  for (const flow of flowRecords) for (const route of flowRoutes(flow)) {
    const ids = pathFlowIds.get(route) ?? new Set(); ids.add(flow.id); pathFlowIds.set(route, ids);
  }
  const routeResolutions = new Map(source.routeResolutionRegistry.resolutions.map((item) => [item.requested, item]));
  const deferredRoutes = new Map((source.deferredRoutes?.routes ?? []).map((item) => [item.path, item]));
  const routes = [...pathFlowIds.keys()].sort().map((path) => {
    const resolution = routeResolutions.get(path)?.resolution ?? { status: "UNRESOLVED", path: null, executable: false, registered: false };
    return { path, status: resolution.status, resolvedPath: resolution.path, executable: resolution.executable === true, flowIds: [...pathFlowIds.get(path)].sort(), ...(deferredRoutes.has(path) ? { deferral: { category: deferredRoutes.get(path).category, owner: deferredRoutes.get(path).owner, targetVersion: deferredRoutes.get(path).targetVersion } } : {}) };
  });
  const routeBlockers = routes.filter((route) => !route.executable).map((route) => ({ path: route.path, status: route.status, flowIds: route.flowIds, ...(route.deferral ? { deferredTo: route.deferral.targetVersion, category: route.deferral.category } : { reason: "No executable route resolution exists." }) }));
  const readiness = routeBlockers.length ? "BLOCKED" : "READY";
  const plannedTableIds = tableIds.filter((id) => tableRecords.get(id).status === "planned");
  const contractCoverage = assessContractCoverage(tableIds, source);
  const schemaReadiness = { status: contractCoverage.status, counts: contractCoverage.counts, byContext: contractCoverage.byContext };
  const allowPlanned = intent.overrides?.allowPlanned === true;
  const compilerBlockers = [
    ...routeBlockers.map((item) => ({ kind: "route", ...item })),
    ...(!allowPlanned ? plannedTableIds.map((tableId) => ({ kind: "planned-table", tableId, reason: "Planned tables require the explicit application-local allowPlanned override." })) : []),
    ...(contractCoverage.status !== "SCHEMA_READY" ? [{ kind: "schema-contract", code: "SCHEMA_INCOMPLETE", reason: `${contractCoverage.counts.total - contractCoverage.counts.complete} of ${contractCoverage.counts.total} tables lack complete schema contracts.` }] : []),
  ];

  const whyIncluded = [];
  whyIncluded.push(...resolutions.filter((item) => item.classification === "canonical-product").map((item) => ({ type: "product", id: product.id, via: `tag:${item.tag}`, reason: `Product tag ${item.tag} resolves to ${product.id}.` })));
  for (const flow of flowRecords) whyIncluded.push({ type: "flow", id: flow.id, via: flowSelectionMode === "explicit" ? "application-intent:flowIds" : `product:${product.id}`, reason: flowSelectionMode === "explicit" ? "Explicitly selected by the application intent." : "Included in the canonical product's flow set." });
  for (const contextId of finalContextIds) for (const why of includedContexts.get(contextId).why) whyIncluded.push({ type: "context", id: contextId, ...why });
  for (const tableId of tableIds) {
    const table = tableRecords.get(tableId);
    whyIncluded.push({ type: "table", id: tableId, via: `context:${table.context}`, reason: `All catalog tables owned by included context ${table.context} are included.`, flowIds: uniqueSorted([...(bindingTableIds.get(tableId) ?? [])]) });
  }
  for (const route of routes) whyIncluded.push({ type: "route", id: route.path, via: route.flowIds.map((id) => `flow:${id}`), reason: route.executable ? `Referenced by selected flows and resolved as ${route.status}.` : `Referenced by selected flows but not executable (${route.status}).`, flowIds: route.flowIds });
  whyIncluded.sort((a, b) => `${a.type}:${a.id}:${a.via}`.localeCompare(`${b.type}:${b.id}:${b.via}`));

  const applicationId = intent.appId ?? "casting-pipeline-demo";
  const ir = {
    schemaVersion: "1.0.0",
    irVersion: "1.0.0",
    application: { appId: applicationId, name: intent.name ?? "Casting Pipeline", intent: String(intent.description ?? "") },
    registry: { id: source.manifest.registryId, version: source.manifest.version, hash: source.manifest.milestones?.M1?.registryHash ?? source.manifest.integrity.registryHash },
    resolverVersion: RESOLVER_VERSION,
    productComposition: { id: product.id, version: product.version, tags, sourceTagResolutions: resolutions.map(({ tag, classification, canonicalProductId }) => ({ tag, classification, ...(canonicalProductId ? { canonicalProductId } : {}) })) },
    flowSelection: { mode: flowSelectionMode, sourceProductId: product.id },
    selectedFlows: flowRecords.map((flow) => ({ id: flow.id, title: flow.title, category: flow.category })),
    flowIds: selectedFlowIds,
    contextVersions: finalContextIds.map((id) => ({ contextId: id, version: findContext(id, source).version, status: findContext(id, source).status })),
    tableIds,
    tables: tableIds.map((id) => { const table = tableRecords.get(id); return { id, contextId: table.context, domainId: table.domain, status: table.status, provenance: table.provenance }; }),
    routeReadiness: { status: readiness, total: routes.length, executable: routes.length - routeBlockers.length, blocked: routeBlockers.length, routes, blockers: routeBlockers },
    schemaReadiness,
    policies: { coreSpine: [...source.spine.contexts], spineAlwaysIncluded: true, defaultSharedServices: (source.products.services ?? []).filter((item) => item.defaultIncluded).map((item) => item.id).sort(), requestedSharedServices: requestedServices, optionalSharedServices: requestedServices.filter((id) => !(source.products.services ?? []).find((item) => item.id === id)?.defaultIncluded), publicContextOptIn: intent.includePublicContext === true },
    overrides: stable(intent.overrides ?? {}),
    seedProfile: intent.seedProfile ?? "demo-casting",
    lifecycleState: "RESOLVED",
    compilerStatus: routeBlockers.length || (!allowPlanned && plannedTableIds.length) ? "BLOCKED" : schemaReadiness.status,
    compilerBlockers,
    whyIncluded,
  };
  ir.irHash = sha256(ir);
  return ir;
}

export function validateApplicationIR(ir, source = defaultRegistry) {
  const errors = [];
  if (!ir || typeof ir !== "object" || Array.isArray(ir)) return { valid: false, errors: ["Application IR must be an object."] };
  for (const key of ["schemaVersion", "irVersion", "application", "registry", "resolverVersion", "productComposition", "flowSelection", "flowIds", "contextVersions", "tableIds", "routeReadiness", "schemaReadiness", "lifecycleState", "policies", "overrides", "seedProfile", "compilerStatus", "compilerBlockers", "whyIncluded", "irHash"]) {
    if (!(key in ir)) errors.push(`Missing required field: ${key}.`);
  }
  if (ir.schemaVersion !== "1.0.0" || ir.irVersion !== "1.0.0") errors.push("Unsupported Application IR schema or version.");
  if (!ir.application?.appId || !ir.application?.name || typeof ir.application?.intent !== "string") errors.push("Application identity needs appId, name, and intent.");
  if (!/^[a-f0-9]{64}$/.test(ir.registry?.hash ?? "")) errors.push("Registry pin must contain a SHA-256 hash.");
  if (!(["explicit", "product-default"].includes(ir.flowSelection?.mode)) || ir.flowSelection?.sourceProductId !== ir.productComposition?.id) errors.push("Flow selection provenance does not match the canonical product.");
  if (!Array.isArray(ir.flowIds) || !Array.isArray(ir.selectedFlows) || !Array.isArray(ir.contextVersions) || !Array.isArray(ir.tableIds) || !Array.isArray(ir.tables) || !Array.isArray(ir.whyIncluded) || !Array.isArray(ir.compilerBlockers)) errors.push("Flows, contexts, tables, provenance, and compiler blockers must be arrays.");
  if (ir.routeReadiness && (!Array.isArray(ir.routeReadiness.routes) || !Array.isArray(ir.routeReadiness.blockers) || ir.routeReadiness.blocked !== ir.routeReadiness.blockers.length || ir.routeReadiness.executable + ir.routeReadiness.blocked !== ir.routeReadiness.total)) errors.push("Route readiness counts and route/blocker arrays are inconsistent.");
  if (Array.isArray(ir.flowIds) && Array.isArray(ir.selectedFlows) && canonicalJson(ir.flowIds) !== canonicalJson(ir.selectedFlows.map((flow) => flow.id))) errors.push("Selected flow records do not match flowIds.");
  if (Array.isArray(ir.tableIds) && Array.isArray(ir.tables) && canonicalJson(ir.tableIds) !== canonicalJson(ir.tables.map((table) => table.id))) errors.push("Table records do not match tableIds.");
  if (ir.lifecycleState !== "RESOLVED") errors.push("Composition proof applications must remain RESOLVED until schema contracts are complete.");
  if (ir.compilerStatus === "SCHEMA_READY" && ir.schemaReadiness?.status !== "SCHEMA_READY") errors.push("Schema readiness cannot be asserted without complete table contracts.");
  if (ir.compilerStatus === "SCHEMA_INCOMPLETE" && ir.schemaReadiness?.status !== "SCHEMA_INCOMPLETE") errors.push("SCHEMA_INCOMPLETE must be supported by the derived contract assessment.");
  if (ir.compilerStatus === "BLOCKED" && !ir.compilerBlockers?.some((item) => item.kind === "route" || item.kind === "planned-table")) errors.push("BLOCKED requires route or planned-table blockers; schema gaps use SCHEMA_INCOMPLETE.");
  if (ir.registry?.hash !== (source.manifest.milestones?.M1?.registryHash ?? source.manifest.integrity.registryHash)) errors.push("Application IR is not pinned to this registry's frozen M1 snapshot.");
  if (Array.isArray(ir.contextVersions)) for (const context of ir.contextVersions) {
    const registered = findContext(context.contextId, source);
    if (!registered || registered.version !== context.version) errors.push(`Unknown or mismatched context pin: ${context.contextId}@${context.version}.`);
  }
  if (Array.isArray(ir.tables)) for (const table of ir.tables) {
    const registered = source.domains.tables.find((item) => item.id === table.id);
    if (!registered || registered.context !== table.contextId || registered.domain !== table.domainId || registered.status !== table.status) errors.push(`Table record does not match the pinned catalog: ${table.id}.`);
  }
  if (!errors.length) {
    try {
      const expected = resolveComposition({
        appId: ir.application.appId,
        name: ir.application.name,
        description: ir.application.intent,
        productTags: ir.productComposition.tags,
        ...(ir.flowSelection?.mode === "explicit" ? { flowIds: ir.flowIds } : {}),
        sharedServices: ir.policies.requestedSharedServices ?? ir.policies.optionalSharedServices ?? [],
        includePublicContext: ir.policies.publicContextOptIn === true,
        overrides: ir.overrides,
        seedProfile: ir.seedProfile,
      }, source);
      for (const key of ["registry", "resolverVersion", "productComposition", "flowSelection", "selectedFlows", "flowIds", "contextVersions", "tableIds", "tables", "routeReadiness", "schemaReadiness", "lifecycleState", "policies", "overrides", "seedProfile", "compilerStatus", "compilerBlockers", "whyIncluded"]) {
        if (canonicalJson(expected[key]) !== canonicalJson(ir[key])) errors.push(`Application IR ${key} does not match deterministic resolution.`);
      }
    } catch (error) { errors.push(`Application IR cannot be resolved against the pinned registry: ${error?.message ?? "invalid composition"}`); }
  }
  if (typeof ir.irHash === "string") {
    const copy = { ...ir };
    delete copy.irHash;
    if (sha256(copy) !== ir.irHash) errors.push("Application IR hash does not match its content.");
  }
  return { valid: errors.length === 0, errors };
}

export function sealApplicationIR(ir) {
  const sealed = structuredClone(ir);
  delete sealed.irHash;
  sealed.irHash = sha256(sealed);
  return sealed;
}

export function explainComposition(ir, query) {
  const normalized = typeof query === "string" ? parseQuestion(query) : query ?? {};
  const { type, id } = normalized;
  if (type === "route-blockers") return { question: normalized.question, answer: ir.routeReadiness.blockers.length ? `Compilation is blocked by ${ir.routeReadiness.blockers.length} unresolved or non-executable route(s).` : "No route blocks schema preview.", blockers: ir.routeReadiness.blockers };
  if (type === "shared-service" && id === "evidence") return { question: normalized.question, answer: "Evidence is included by the registry's default shared-service rule.", whyIncluded: ir.whyIncluded.filter((item) => item.type === "context" && item.id === "evidence") };
  const whyIncluded = ir.whyIncluded.filter((item) => item.type === type && item.id === id);
  if (type === "table") {
    const table = ir.tables.find((item) => item.id === id);
    if (table) whyIncluded.push(...ir.whyIncluded.filter((item) => item.type === "context" && item.id === table.contextId).map((item) => ({ ...item, type: "context-reason", id: table.contextId })));
  }
  const flowIds = uniqueSorted(whyIncluded.flatMap((item) => item.flowIds ?? []));
  if (!whyIncluded.length) return { question: normalized.question, answer: `${type ?? "Entity"} ${id ?? ""} is not included in this Application IR.`, whyIncluded: [], flowIds: [] };
  return { question: normalized.question, answer: `${type} ${id} is included because ${whyIncluded.map((item) => item.reason).join(" ")}`, whyIncluded, flowIds };
}

function parseQuestion(question) {
  const text = String(question ?? "");
  let match = text.match(/why\s+is\s+([\w.-]+)\s+here/i);
  if (match) return { question: text, type: match[1].includes(".") ? "table" : "context", id: match[1] };
  match = text.match(/why\s+was\s+evidence\s+added/i);
  if (match) return { question: text, type: "shared-service", id: "evidence" };
  if (/which\s+route\s+blocks/i.test(text)) return { question: text, type: "route-blockers" };
  match = text.match(/which\s+flow\s+required\s+([\w.-]+)/i);
  if (match) return { question: text, type: "context", id: match[1] };
  return { question: text, type: "unknown", id: text };
}

export function previewLogicalSchema(ir, source = defaultRegistry) {
  const tables = new Map(source.domains.tables.map((item) => [item.id, item]));
  const contracts = new Map((source.tableContracts?.contracts ?? []).map((item) => [item.id, item]));
  const models = ir.tableIds.map((tableId) => {
    const table = tables.get(tableId);
    const contract = contracts.get(tableId);
    const modelName = tableId.split(".").map((segment) => segment.replace(/(^|[^A-Za-z0-9])([A-Za-z0-9])/g, (_, __, char) => char.toUpperCase())).join("").replace(/[^A-Za-z0-9]/g, "");
    return { modelName, tableId, contextId: table.context, domainId: table.domain, status: table.status, provenance: table.provenance, contractVersion: contract?.version ?? null, fields: Object.entries(contract?.fields ?? {}).map(([name, field]) => ({ name, ...field })), relations: contract?.relations ?? [], primaryKey: contract?.primaryKey ?? null };
  });
  const contexts = ir.contextVersions.map((context) => ({ contextId: context.contextId, version: context.version, models: models.filter((model) => model.contextId === context.contextId).map((model) => model.modelName) }));
  const schemaReadiness = assessContractCoverage(ir.tableIds, source);
  const schemaReadinessSummary = { status: schemaReadiness.status, counts: schemaReadiness.counts, byContext: schemaReadiness.byContext };
  const relations = models.flatMap((model) => model.relations.map((relation) => ({ fromTableId: model.tableId, ...relation })));
  const complete = schemaReadiness.status === "SCHEMA_READY";
  return {
    schemaVersion: "1.0.0", applicationId: ir.application.appId, sourceIrHash: ir.irHash,
    status: schemaReadiness.status,
    schemaReadiness: schemaReadinessSummary,
    contextBoundaries: contexts,
    models,
    relations,
    prismaPreview: { status: complete ? "READY_FOR_PRISMA_ADAPTER" : "SCHEMA_INCOMPLETE", models: complete ? models.map((model) => model.modelName) : [], text: "", limitation: complete ? "Contracts are complete; Prisma generation remains a separate downstream adapter and has not run." : `${schemaReadiness.counts.total - schemaReadiness.counts.complete} of ${schemaReadiness.counts.total} tables lack complete field, key, relation, ownership, or lifecycle definitions. Prisma output is withheld; no fields or relations are inferred.` },
    counts: { contexts: contexts.length, models: models.length, relations: relations.length, complete: schemaReadiness.counts.complete, partial: schemaReadiness.counts.partial, nameOnly: schemaReadiness.counts.nameOnly, stubbed: models.filter((model) => model.status === "stubbed").length, planned: models.filter((model) => model.status === "planned").length },
  };
}

export function diffApplicationIR(current, draft) {
  const setDiff = (left, right) => ({ added: right.filter((item) => !left.includes(item)).sort(), removed: left.filter((item) => !right.includes(item)).sort() });
  const currentContexts = current?.contextVersions ?? [];
  const draftContexts = draft?.contextVersions ?? [];
  const contextVersions = { added: draftContexts.filter((item) => !currentContexts.some((before) => before.contextId === item.contextId && before.version === item.version)), removed: currentContexts.filter((item) => !draftContexts.some((after) => after.contextId === item.contextId && after.version === item.version)) };
  const tables = setDiff(current?.tableIds ?? [], draft?.tableIds ?? []);
  const currentRoutes = new Map((current?.routeReadiness?.routes ?? []).map((item) => [item.path, item]));
  const draftRoutes = new Map((draft?.routeReadiness?.routes ?? []).map((item) => [item.path, item]));
  const routes = setDiff([...currentRoutes.keys()], [...draftRoutes.keys()]);
  const changedRoutes = [...draftRoutes.keys()].filter((path) => currentRoutes.has(path) && canonicalJson(currentRoutes.get(path)) !== canonicalJson(draftRoutes.get(path))).sort().map((path) => ({ path, before: currentRoutes.get(path), after: draftRoutes.get(path) }));
  const flows = setDiff(current?.flowIds ?? [], draft?.flowIds ?? []);
  const currentBlockers = current?.routeReadiness?.blockers ?? [];
  const draftBlockers = draft?.routeReadiness?.blockers ?? [];
  const routeChanges = { ...routes, changed: changedRoutes, blockedAdded: draftBlockers.filter((item) => !currentBlockers.some((before) => before.path === item.path)).map((item) => item.path).sort(), blockedRemoved: currentBlockers.filter((item) => !draftBlockers.some((after) => after.path === item.path)).map((item) => item.path).sort() };
  const affectedFlowIds = uniqueSorted([
    ...flows.added, ...flows.removed,
    ...changedRoutes.flatMap((item) => [...(item.before.flowIds ?? []), ...(item.after.flowIds ?? [])]),
    ...routes.added.flatMap((path) => draftRoutes.get(path)?.flowIds ?? []),
    ...routes.removed.flatMap((path) => currentRoutes.get(path)?.flowIds ?? []),
    ...routeChanges.blockedAdded.flatMap((path) => draftBlockers.find((item) => item.path === path)?.flowIds ?? []),
    ...routeChanges.blockedRemoved.flatMap((path) => currentBlockers.find((item) => item.path === path)?.flowIds ?? []),
  ]);
  routeChanges.affectedFlowIds = affectedFlowIds;
  const currentRelations = current?.relations ?? [];
  const draftRelations = draft?.relations ?? [];
  const relations = setDiff(currentRelations.map((item) => typeof item === "string" ? item : canonicalJson(item)), draftRelations.map((item) => typeof item === "string" ? item : canonicalJson(item)));
  const downstreamArtifacts = { schemaChanged: tables.added.length + tables.removed.length + contextVersions.added.length + contextVersions.removed.length + relations.added.length + relations.removed.length > 0, generatedArtifacts: "not-connected", currentIrHash: current?.irHash ?? null, draftIrHash: draft?.irHash ?? null };
  return { schemaVersion: "1.0.0", levels: { contextVersions, tablesAndRelations: { tables, relations }, routesAndFlows: { routes: routeChanges, flows }, downstreamArtifacts }, summary: { contextVersionsChanged: contextVersions.added.length + contextVersions.removed.length, tablesAdded: tables.added.length, tablesRemoved: tables.removed.length, relationsAdded: relations.added.length, relationsRemoved: relations.removed.length, flowsAdded: flows.added.length, flowsRemoved: flows.removed.length, routesAdded: routes.added.length, routesRemoved: routes.removed.length, routesChanged: changedRoutes.length, affectedFlows: affectedFlowIds.length, deferredRoutes: draftBlockers.length } };
}

export function buildRouteImpactIndexes(source = defaultRegistry) {
  const routeRecords = new Map(source.routeResolutionRegistry.resolutions.map((item) => [item.requested, item.resolution]));
  const flowById = new Map(source.flows.flows.map((flow) => [flow.id, flow]));
  const byFlow = {};
  const byStatus = {};
  const byProduct = {};
  const flowIdsByRoute = {};
  for (const flow of [...source.flows.flows].sort((a, b) => a.id.localeCompare(b.id))) {
    const routes = flowRoutes(flow);
    byFlow[flow.id] = routes;
    for (const route of routes) {
      const resolution = routeRecords.get(route);
      const status = resolution?.status ?? "UNRESOLVED";
      (byStatus[status] ??= []).push({ flowId: flow.id, route });
      if (resolution?.executable !== true) (flowIdsByRoute[route] ??= []).push(flow.id);
    }
    for (const productId of flow.canonicalProductIds ?? []) (byProduct[productId] ??= new Set()).add(flow.id);
  }
  for (const ids of Object.values(byProduct)) { /* converted below to keep deterministic output */ void ids; }
  const productIndex = Object.fromEntries(Object.entries(byProduct).map(([id, ids]) => [id, [...ids].sort()]));
  for (const records of Object.values(byStatus)) records.sort((a, b) => a.flowId.localeCompare(b.flowId) || a.route.localeCompare(b.route));
  const blockedByRoute = Object.fromEntries(Object.entries(flowIdsByRoute).map(([route, ids]) => {
    const flowIds = uniqueSorted(ids);
    const productIds = uniqueSorted(flowIds.flatMap((id) => flowById.get(id)?.canonicalProductIds ?? []));
    const deferred = (source.deferredRoutes?.routes ?? []).find((item) => item.path === route);
    return [route, { flowIds, productIds, flowImpact: flowIds.length, productImpact: productIds.length, ...(deferred ? { category: deferred.category, owner: deferred.owner, targetVersion: deferred.targetVersion } : {}) }];
  }));
  const deferredRouteBacklog = Object.entries(blockedByRoute).map(([route, value]) => ({ route, ...value })).sort((a, b) => b.productImpact - a.productImpact || b.flowImpact - a.flowImpact || a.route.localeCompare(b.route));
  return { schemaVersion: "1.0.0", registryVersion: source.manifest.version, registryHash: source.manifest.milestones?.M1?.registryHash ?? source.manifest.integrity.registryHash, byFlow, byStatus, byProduct: productIndex, blockedByRoute, deferredRouteBacklog };
}

export function resolve(intent, source = defaultRegistry) { return resolveComposition(intent, source); }
export function explain(ir, query) { return explainComposition(ir, query); }
