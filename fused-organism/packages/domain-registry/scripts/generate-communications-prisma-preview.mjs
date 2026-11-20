import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registry } from "../src/index.mjs";
import { assessDraftCompileTestability, compileDraftLogicalSchema } from "../src/contracts.mjs";
import { generatePrismaPreview } from "../src/prisma-preview.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(packageRoot, "schema-sources/authored/maataa-communications-v1");
const communicationsIds = registry.domains.tables.filter((table) => table.context === "communications").map((table) => table.id).sort();
const readiness = assessDraftCompileTestability(communicationsIds, registry);
if (readiness.status !== "DRAFT_COMPILE_TESTABLE") {
  throw new Error(`Communications structural closure failed: ${JSON.stringify(readiness.entries.filter((item) => item.errors.length))}`);
}

const logical = compileDraftLogicalSchema(communicationsIds, registry);
if (logical.status !== "DRAFT_LOGICAL_SCHEMA_READY") throw new Error(`Logical model compilation failed: ${JSON.stringify(logical.blockers)}`);
const draftContracts = JSON.parse(await readFile(path.join(outputRoot, "contracts.draft.json"), "utf8"));
draftContracts.readiness = {
  compileTestable: true,
  fkClosure: "PASS",
  // Schema readiness means the slice and all required dependencies are
  // canonical. A complete DRAFT can still produce non-deployable previews.
  schemaReady: false,
  logicalPreviewValid: true,
  prismaPreviewValid: false,
  migrationPreviewValid: false,
  migrationApproved: false,
  deploymentApproved: false,
  legalReviewed: false,
  closureTableCount: logical.model.tables.length,
  closureTableIds: logical.model.tables.map((table) => table.id),
  logicalSchemaHash: logical.schemaHash,
};
await writeFile(path.join(outputRoot, "contracts.draft.json"), `${JSON.stringify(draftContracts, null, 2)}\n`);
await writeFile(path.join(outputRoot, "logical-schema.draft.json"), `${JSON.stringify(logical, null, 2)}\n`);
const previews = {};
for (const provider of ["postgresql", "sqlite"]) {
  const preview = generatePrismaPreview(logical, { targetProvider: provider });
  if (preview.status !== "GENERATED_UNVALIDATED") throw new Error(`${provider} Prisma preview generation failed: ${JSON.stringify(preview.blockers)}`);
  previews[provider] = preview;
  await writeFile(path.join(outputRoot, `prisma-preview.${provider}.draft.prisma`), preview.schema);
  await writeFile(path.join(outputRoot, `prisma-preview.${provider}.draft.metadata.json`), `${JSON.stringify(preview.metadata, null, 2)}\n`);
}
console.log(JSON.stringify({ requestedCommunicationsTables: communicationsIds.length, closureTables: logical.model.tables.length, structureAndFkClosure: "PASS", logicalSchemaHash: logical.schemaHash, prismaPreviews: Object.fromEntries(Object.entries(previews).map(([key, value]) => [key, value.status])) }, null, 2));
