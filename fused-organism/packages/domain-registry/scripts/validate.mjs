import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getRegistryGate, registry } from "../src/index.mjs";
import { validateApplicationIR } from "../src/composition.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(packageRoot, "registry.manifest.json"), "utf8"));
const assetDirs = ["catalog", "contexts", "control-plane", "data", "flows", "products", "routes", "schemas", "sources", "schema-sources", "applications", "composition"];
const files = [];
for (const directory of assetDirs) {
  const walk = async (relativeDir) => {
    for (const entry of await readdir(path.join(packageRoot, relativeDir), { withFileTypes: true })) {
      const relative = path.posix.join(relativeDir, entry.name);
      if (entry.isDirectory()) await walk(relative);
      else if (entry.isFile()) files.push(relative);
    }
  };
  await walk(directory);
}
files.sort();
const contentHashes = [];
for (const relative of files) {
  const bytes = await readFile(path.join(packageRoot, relative));
  contentHashes.push({ path: `./${relative}`, sha256: createHash("sha256").update(bytes).digest("hex") });
}
const registryHash = createHash("sha256").update(contentHashes.map((file) => `${file.path}\0${file.sha256}\n`).join("")).digest("hex");
const applicationRegistry = JSON.parse(await readFile(path.join(packageRoot, "applications/registry.json"), "utf8"));
let applicationArtifactsOk = true;
for (const app of applicationRegistry.records) {
  const ir = JSON.parse(await readFile(path.join(packageRoot, "applications", `${app.appId}.ir.json`), "utf8"));
  const preview = JSON.parse(await readFile(path.join(packageRoot, "applications", `${app.appId}.schema-preview.json`), "utf8"));
  const check = validateApplicationIR(ir);
  const valid = check.valid && ir.registry.hash === manifest.milestones?.M1?.registryHash && app.registryHash === ir.registry.hash && app.irVersions.some((version) => version.irHash === ir.irHash) && preview.sourceIrHash === ir.irHash;
  if (!valid) {
    applicationArtifactsOk = false;
    console.error(`Application artifact integrity failed: ${app.appId}${check.errors.length ? ` · ${check.errors.join(" ")}` : ""}`);
  }
}
const projections = [
  ["catalog/spine.json", "data/spine.json"],
  ["catalog/future-production-tables.json", "data/future-production-tables.json"],
  ["products/compositions.json", "data/product-composition-registry.json"],
  ["flows/slice-map.json", "data/slice-map.json"],
  ["flows/route-resolutions.json", "data/route-resolutions.json"],
  ["flows/flow-classifications.json", "data/flow-classifications.json"],
];
let projectionsOk = true;
for (const [canonical, projection] of projections) {
  const canonicalData = JSON.parse(await readFile(path.join(packageRoot, canonical), "utf8"));
  const projectionData = JSON.parse(await readFile(path.join(packageRoot, projection), "utf8"));
  if (JSON.stringify(canonicalData) !== JSON.stringify(projectionData)) { projectionsOk = false; console.error(`Registry projection mismatch: ${canonical} vs ${projection}`); }
}
const registeredRouteData = JSON.parse(await readFile(path.join(packageRoot, "routes/registered.json"), "utf8"));
const legacyRouteData = JSON.parse(await readFile(path.join(packageRoot, "data/route-registry.json"), "utf8"));
const expectedLegacyRouteData = { schemaVersion: "1.0.0", status: "source-imported", routes: registeredRouteData.routes.map(({ kind, declared, registered, executable, routeState, ...route }) => ({ ...route, status: "registered" })) };
if (JSON.stringify(expectedLegacyRouteData) !== JSON.stringify(legacyRouteData)) { projectionsOk = false; console.error("Registry projection mismatch: routes/registered.json vs data/route-registry.json"); }
const aggregateContexts = JSON.parse(await readFile(path.join(packageRoot, "data/context-registry.json"), "utf8"));
for (const context of aggregateContexts.contexts) {
  const contextPackage = JSON.parse(await readFile(path.join(packageRoot, `contexts/${context.id}/context.json`), "utf8"));
  if (JSON.stringify(contextPackage) !== JSON.stringify(context)) { projectionsOk = false; console.error(`Context package projection mismatch: ${context.id}`); }
}
const hashOk = registryHash === manifest.integrity?.registryHash && JSON.stringify(contentHashes) === JSON.stringify(manifest.integrity?.contentHashes) && projectionsOk;
const gate = getRegistryGate(registry);
console.log(`Registry ${manifest.registryId}@${manifest.version}: ${gate.counts.BLOCKER ?? 0} blocker(s), ${gate.counts.ERROR ?? 0} error(s), ${gate.counts.WARNING ?? 0} warning(s), ${gate.counts.INFO ?? 0} info.`);
console.log(`Domain registry: ${gate.domainRegistry.valid ? "VALID" : "INVALID"} · Route registry: ${gate.routeRegistry.valid ? "VALID" : "INVALID"} · Registry publishable: ${gate.publishable ? "YES" : "NO"} · Schema compiler ready: ${gate.schemaCompilerReady ? "YES" : "NO"}`);
console.log(`Routes: ${gate.routeRegistry.registeredStatic} registered static, ${gate.routeRegistry.registeredDynamic} registered dynamic, ${gate.routeRegistry.declaredUnregistered} declared only, ${gate.routeRegistry.approvedAliases} approved aliases, ${gate.routeRegistry.unresolved} unresolved.`);
console.log(`Application IR artifacts: ${applicationArtifactsOk ? "PASS" : "FAIL"} · ${applicationRegistry.records.length} records pinned to M1`);
console.log(`Reproducible package hash: ${hashOk ? "PASS" : "FAIL"}${hashOk ? ` · ${registryHash}` : ""}`);
if (!hashOk) console.error("Asset hashes do not match registry.manifest.json; regenerate the manifest after reviewing the changed source/assets.");
for (const item of gate.findings) console.error(`${item.id} ${item.severity} ${item.code} ${item.subject}: ${item.problem}`);
if (!hashOk || !applicationArtifactsOk || !gate.publishable) process.exitCode = 1;
else console.log("Registry validation PASS: publishable; warnings and info are recorded above.");
