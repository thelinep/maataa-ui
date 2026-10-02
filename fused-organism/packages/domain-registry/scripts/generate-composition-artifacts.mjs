import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRouteImpactIndexes, diffApplicationIR, explainComposition, previewLogicalSchema, resolveComposition } from "../src/composition.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (name) => JSON.parse(await readFile(path.join(root, name), "utf8"));
const writeJson = async (name, value) => writeFile(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`);
const registry = await import("../src/index.mjs");
const source = registry.registry;
const baseHash = source.manifest.milestones?.M1?.registryHash ?? source.manifest.integrity.registryHash;
await mkdir(path.join(root, "applications"), { recursive: true });
await mkdir(path.join(root, "composition"), { recursive: true });
const proofs = [
  { appId: "casting-pipeline-demo", name: "Casting Pipeline", description: "Casting pipeline for a film production company", productTags: ["film"], flowIds: ["TLPS-FLOW-027", "TLPS-FLOW-028", "TLPS-FLOW-029", "TLPS-FLOW-030", "TLPS-FLOW-031"], overrides: { allowPlanned: true }, seedProfile: "demo-casting" },
  { appId: "campaign-os-reference", name: "Campaign OS Reference", description: "Cross-channel campaign planning and execution", productTags: ["campaign"], overrides: { allowPlanned: true }, seedProfile: "demo-campaign" },
  { appId: "events-wedding-spatial-reference", name: "Events, Wedding & Spatial Reference", description: "Event and wedding planning with spatial venue workflows", productTags: ["event"], overrides: { allowPlanned: true }, seedProfile: "demo-events" },
  { appId: "investorhub-reference", name: "InvestorHub Reference", description: "Investor onboarding, communications, and reporting", productTags: ["investor"], overrides: { allowPlanned: true }, seedProfile: "demo-investor" },
];
const records = [];
for (const intent of proofs) {
  const ir = resolveComposition(intent, source);
  ir.registry.hash = baseHash;
  // The M1 hash is a fixed input; rehash after applying the frozen pin.
  delete ir.irHash;
  const { createHash } = await import("node:crypto");
  const canonical = (value) => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value;
  ir.irHash = createHash("sha256").update(JSON.stringify(canonical(ir))).digest("hex");
  const slug = intent.appId;
  const irPath = `applications/${slug}.ir.json`;
  const schemaPath = `applications/${slug}.schema-preview.json`;
  const preview = previewLogicalSchema(ir, source);
  await writeJson(irPath, ir);
  await writeJson(schemaPath, preview);
  const record = {
    appId: intent.appId,
    name: intent.name,
    intent,
    registryVersion: ir.registry.version,
    registryHash: ir.registry.hash,
    resolverVersion: ir.resolverVersion,
    irVersions: [{ version: ir.irVersion, irHash: ir.irHash, artifact: `./${slug}.ir.json` }],
    pinnedContextVersions: ir.contextVersions,
    selectedFlows: ir.flowIds,
    overrides: ir.overrides,
    compilationPlans: [],
    artifactReferences: [{ kind: "application-ir", path: `./${slug}.ir.json` }, { kind: "logical-schema-preview", path: `./${slug}.schema-preview.json`, status: preview.status }],
    environmentAssignments: [],
  };
  records.push(record);
  if (intent.appId === "casting-pipeline-demo") {
    await writeJson("applications/casting-pipeline.explainability.json", {
      schemaVersion: "1.0.0", applicationId: ir.application.appId, irHash: ir.irHash,
      examples: [
        explainComposition(ir, "Why is people.talent_profiles here?"),
        explainComposition(ir, "Which flow required Finance?"),
        explainComposition(ir, "Why was Evidence added?"),
        explainComposition(ir, "Which route blocks compilation?"),
      ],
      semanticDiff: diffApplicationIR(ir, ir),
    });
  }
}
const impacts = buildRouteImpactIndexes(source);
await writeJson("composition/route-impact-indexes.json", impacts);
await writeJson("applications/registry.json", {
  schemaVersion: "1.0.0", registryId: "maataa-application-registry", status: "local-preview",
  resolverVersion: "1.0.0", records,
});
console.log(`Generated ${records.length} deterministic Application IR proofs; M1 pin ${baseHash}; route backlog ${impacts.deferredRouteBacklog.length}.`);
