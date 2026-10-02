import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const writeJson = async (relative, value) => writeFile(path.join(root, relative), `${JSON.stringify(value, null, 2)}\n`);
const source = await readJson("sources/tlps_full_application_v2_manifest.json");
const flows = await readJson("data/flow-registry.json");
const aliases = await readJson("routes/aliases.json").catch(() => ({ schemaVersion: "1.0.0", status: "authored-empty", aliases: [] }));
const deferredRoutes = await readJson("routes/deferred.json").catch(() => ({ schemaVersion: "1.0.0", status: "none", routes: [] }));
const normalize = (value) => String(value).split(/[?#]/, 1)[0].replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
const paramsFor = (route) => [...String(route).matchAll(/(?:^|\/)(?::([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\})(?=\/|$)/g)].map((match) => match[1] ?? match[2]);
const matches = (pattern, candidate) => {
  const parts = normalize(pattern).split("/");
  const escaped = parts.map((part) => part.startsWith(":") || /^\{[^/]+\}$/.test(part) ? "[^/]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/");
  return new RegExp(`^${escaped}/?$`).test(normalize(candidate));
};
const routeParams = Array.isArray(source.routeParams) ? source.routeParams : [];
const pageRecords = (source.pages ?? []).filter((page) => typeof page.route === "string").map((page) => {
  const dynamic = paramsFor(page.route).length > 0;
  return {
    ...page,
    path: page.route,
    kind: dynamic ? "dynamic" : "static",
    declared: true,
    registered: true,
    executable: true,
    routeState: dynamic ? "REGISTERED_DYNAMIC" : "REGISTERED_STATIC",
    source: "manifest.pages",
  };
});
const declaredRecords = routeParams.map((item, index) => {
  const route = typeof item === "string" ? item : item.path ?? item.route ?? item.pattern;
  const parameters = paramsFor(route);
  return {
    id: typeof item === "object" && item.id ? item.id : `ROUTE-PATTERN-${String(index + 1).padStart(3, "0")}`,
    path: route,
    parameters,
    kind: "dynamic",
    declared: true,
    registered: false,
    executable: false,
    routeState: "DECLARED_UNREGISTERED",
    source: "manifest.routeParams",
  };
});
const registered = {
  schemaVersion: "1.0.0",
  status: "source-imported",
  source: "../sources/tlps_full_application_v2_manifest.json#pages",
  routes: pageRecords,
};
const declaredPatterns = {
  schemaVersion: "1.0.0",
  status: routeParams.length ? "source-imported" : "source-field-absent",
  source: "../sources/tlps_full_application_v2_manifest.json#routeParams",
  sourceFieldPresent: Object.hasOwn(source, "routeParams"),
  reviewClaim: { dynamicPatterns: 17, meaning: "unverified review claim; not source truth" },
  sourceFlowDocumentPageCount: (await readJson("sources/tlps_all_flows_detailed.json")).counts?.sourcePages ?? null,
  patterns: declaredRecords,
};
const routeAliases = {
  schemaVersion: "1.0.0",
  status: aliases.aliases.length ? "authored" : "authored-empty",
  policy: "Aliases require explicit governance authorship and provenance; no alias is inferred from a flow reference.",
  aliases: aliases.aliases,
};
const staticByPath = new Map(pageRecords.filter((item) => item.routeState === "REGISTERED_STATIC").map((item) => [normalize(item.path), item]));
const dynamicRegistered = pageRecords.filter((item) => item.routeState === "REGISTERED_DYNAMIC");
const aliasByRequested = new Map(routeAliases.aliases.map((item) => [normalize(item.requested), item]));
const pathFlows = new Map();
const occurrences = [];
for (const flow of flows.flows) for (const field of ["entryPoints", "steps", "routes"]) {
  for (const [index, item] of (flow[field] ?? []).entries()) {
    const requested = typeof item === "string" ? item : item.route;
    if (!requested) continue;
    const occurrenceId = `${flow.id}:${field}:${index}`;
    occurrences.push({ id: occurrenceId, flowId: flow.id, sourceField: field, sourceIndex: index, routePath: requested });
    const ids = pathFlows.get(normalize(requested)) ?? new Set();
    ids.add(flow.id);
    pathFlows.set(normalize(requested), ids);
  }
}
const uniquePaths = [...new Set(occurrences.map((item) => item.routePath))].sort((a, b) => a.localeCompare(b));
for (const route of pageRecords) {
  route.flowIds = [...(pathFlows.get(normalize(route.path)) ?? [])].sort();
  route.flowIdsSource = "derived-from-flow-registry-route-references";
}
const resolutions = uniquePaths.map((requested) => {
  const normalized = normalize(requested);
  const staticRoute = staticByPath.get(normalized);
  if (staticRoute) return { requested, flowIds: [...(pathFlows.get(normalized) ?? [])].sort(), resolution: { kind: "static", path: staticRoute.path, match: true, source: "manifest.pages", registered: true, executable: true, status: "REGISTERED_STATIC" } };
  const dynamicRoute = dynamicRegistered.find((item) => matches(item.path, requested));
  if (dynamicRoute) return { requested, flowIds: [...(pathFlows.get(normalized) ?? [])].sort(), resolution: { kind: "dynamic", path: dynamicRoute.path, match: true, source: "manifest.pages", registered: true, executable: true, status: "REGISTERED_DYNAMIC" } };
  const declared = declaredRecords.find((item) => matches(item.path, requested));
  if (declared) return { requested, flowIds: [...(pathFlows.get(normalized) ?? [])].sort(), resolution: { kind: "dynamic", path: declared.path, match: true, source: "manifest.routeParams", registered: false, executable: false, status: "DECLARED_UNREGISTERED" } };
  const alias = aliasByRequested.get(normalized);
  if (alias) return { requested, flowIds: [...(pathFlows.get(normalized) ?? [])].sort(), resolution: { kind: "alias", path: alias.target, match: true, source: alias.provenance, registered: true, executable: true, status: "APPROVED_ALIAS" } };
  return { requested, flowIds: [...(pathFlows.get(normalized) ?? [])].sort(), resolution: { kind: "unresolved", path: null, match: false, source: null, registered: false, executable: false, status: "UNRESOLVED" } };
});
const declaredUnregistered = resolutions.filter((item) => item.resolution.status === "DECLARED_UNREGISTERED");
const unresolved = resolutions.filter((item) => item.resolution.status === "UNRESOLVED");
const deferredByPath = new Map(deferredRoutes.routes.map((item) => [normalize(item.path), item]));
const routeFindings = [
  ...(declaredRecords.length && dynamicRegistered.length === 0 ? [{ id: "ROUTE-BLOCKER-001", severity: "BLOCKER", code: "ROUTE_REGISTRY_INCOMPLETE", class: "DATA_QUALITY_GAP", owner: "platform", subject: "declared-dynamic-routes", sourceEvidence: { declaredPatterns: declaredRecords.length, registeredDynamicRoutes: 0 }, reason: `${declaredRecords.length} dynamic route patterns are declared, but no dynamic application page is registered.`, resolvedWhen: { oneOf: ["intended patterns are registered as executable routes", "stale declarations are retired", "source declaration is corrected"] } }] : []),
  ...declaredUnregistered.flatMap((item, index) => item.flowIds.map((flowId) => ({ id: `ROUTE-${String(index + 1).padStart(3, "0")}`, severity: "ERROR", code: "DECLARED_ROUTE_NOT_REGISTERED", class: "DATA_QUALITY_GAP", owner: "platform", flowId, requestedPath: item.requested, sourceEvidence: { declaredPattern: true, registeredPage: false }, reason: `Pattern ${item.resolution.path} exists in manifest.routeParams but no corresponding registered dynamic route exists in manifest.pages.`, resolvedWhen: { oneOf: ["route is registered", "flow entry point is corrected", "explicit alias is approved"] } }))),
  ...unresolved.flatMap((item, index) => item.flowIds.map((flowId) => {
    const deferred = deferredByPath.get(normalize(item.requested));
    return { id: `ROUTE-${String(declaredUnregistered.length + index + 1).padStart(3, "0")}`, severity: deferred ? "INFO" : "ERROR", code: deferred ? "FLOW_ROUTE_DEFERRED" : "FLOW_ROUTE_UNRESOLVED", class: "DATA_QUALITY_GAP", owner: deferred?.owner ?? "platform", flowId, requestedPath: item.requested, ...(deferred ? { category: deferred.category, targetVersion: deferred.targetVersion } : {}), sourceEvidence: { declaredPattern: false, registeredPage: false, deferred: Boolean(deferred) }, reason: deferred ? `Unresolved route explicitly deferred to ${deferred.targetVersion} (${deferred.category}).` : "No registered page, declared pattern, explicitly authored alias, or approved deferral matches this flow path.", resolvedWhen: deferred ? { oneOf: [`resolve or retire before ${deferred.targetVersion}`] } : { oneOf: ["route is registered", "flow entry point is corrected", "explicit alias is approved", "defer with category, owner, and target version"] } };
  })),
];
const resolutionsAsset = {
  schemaVersion: "1.0.0",
  status: routeFindings.length ? "partial" : "complete",
  source: "deterministic resolution from flow registry, manifest.pages, manifest.routeParams, and authored aliases",
  precedence: ["REGISTERED_STATIC", "REGISTERED_DYNAMIC", "DECLARED_UNREGISTERED", "APPROVED_ALIAS", "UNRESOLVED"],
  counts: {
    flowReferenceOccurrences: occurrences.length,
    distinctRequestedPaths: uniquePaths.length,
    registeredStatic: resolutions.filter((item) => item.resolution.status === "REGISTERED_STATIC").length,
    registeredDynamic: resolutions.filter((item) => item.resolution.status === "REGISTERED_DYNAMIC").length,
    declaredUnregistered: declaredRecords.length,
    approvedAliases: routeAliases.aliases.length,
    unresolved: unresolved.length,
  },
  resolutions,
};
const flowReferences = {
  schemaVersion: "1.0.0",
  status: routeFindings.length ? "partial" : "complete",
  counts: { references: occurrences.length, distinctPaths: uniquePaths.length, unresolvedOccurrences: occurrences.filter((ref) => resolutions.find((item) => normalize(item.requested) === normalize(ref.routePath))?.resolution.status === "UNRESOLVED").length },
  references: occurrences.map((ref) => {
    const resolution = resolutions.find((item) => normalize(item.requested) === normalize(ref.routePath));
    return { ...ref, resolutionId: resolution?.requested, routeStatus: resolution?.resolution.status ?? "UNRESOLVED" };
  }),
};
await writeJson("routes/registered.json", registered);
await writeJson("routes/declared-patterns.json", declaredPatterns);
await writeJson("routes/aliases.json", routeAliases);
await writeJson("routes/resolutions.json", resolutionsAsset);
await writeJson("routes/findings.json", { schemaVersion: "1.0.0", status: routeFindings.some((item) => item.severity === "BLOCKER" || item.severity === "ERROR") ? "blocked" : unresolved.length ? "deferred" : "clear", findings: routeFindings });
await writeJson("routes/flow-references.json", flowReferences);
await writeJson("routes/deferred.json", { ...deferredRoutes, status: deferredRoutes.routes.length ? "explicitly-deferred" : "none", counts: { routes: deferredRoutes.routes.length, sourceReferences: deferredRoutes.routes.reduce((sum, item) => sum + (item.flowIds?.length ?? 0), 0) } });
const legacyRoutes = { schemaVersion: "1.0.0", status: "source-imported", routes: pageRecords.map(({ kind, declared, registered, executable, routeState, ...route }) => ({ ...route, status: "registered" })) };
await writeJson("data/route-registry.json", legacyRoutes);
const legacyResolutions = {
  schemaVersion: "2.0.0", status: resolutionsAsset.status,
  source: resolutionsAsset.source,
  sourceDynamicRouteClaim: declaredRecords.length,
  sourceObservedPatternCount: declaredRecords.length,
  dynamicPatternDiscrepancy: null,
  aliases: routeAliases.aliases,
  counts: { requested: uniquePaths.length, exact: resolutionsAsset.counts.registeredStatic, normalized: 0, dynamic: resolutionsAsset.counts.registeredDynamic, unresolved: unresolved.length, classified: declaredUnregistered.length },
  resolutions: resolutions.map((item) => ({ requested: item.requested, status: item.resolution.status === "UNRESOLVED" ? "unresolved" : item.resolution.status === "APPROVED_ALIAS" ? "alias" : item.resolution.status === "DECLARED_UNREGISTERED" ? "declared-unregistered" : item.resolution.status === "REGISTERED_DYNAMIC" ? "dynamic-match" : "exact", matched: item.resolution.path, owner: item.flowIds[0] ?? "platform", flowIds: item.flowIds, routeState: item.resolution.status })),
};
await writeJson("flows/route-resolutions.json", legacyResolutions);
await writeJson("data/route-resolutions.json", legacyResolutions);
console.log(`Route registries updated: ${pageRecords.length} registered pages, ${declaredRecords.length} declared patterns, ${routeAliases.aliases.length} aliases, ${unresolved.length} unresolved paths.`);
