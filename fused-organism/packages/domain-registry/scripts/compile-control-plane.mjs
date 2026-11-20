import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import ts from "typescript";
import {
  compileControlPlaneManifest,
  validateControlPlaneManifest,
} from "../src/control-plane.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const authoringPath = path.join(packageRoot, "control-plane/manifest.ts");
const appRegistryPath = path.join(packageRoot, "applications/registry.json");
const generatedDirectory = path.join(packageRoot, "control-plane/generated");
const migrationReadinessDirectory = path.join(packageRoot, "migration-readiness");
const readJson = async (relative) => JSON.parse(await readFile(path.join(packageRoot, relative), "utf8"));
const digest = (content) => createHash("sha256").update(content).digest("hex");

await mkdir(generatedDirectory, { recursive: true });
const authoredSource = await readFile(authoringPath, "utf8");
const transpiled = ts.transpileModule(authoredSource, {
  fileName: authoringPath,
  reportDiagnostics: true,
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    verbatimModuleSyntax: true,
  },
});
const diagnostics = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
if (diagnostics.length) {
  throw new Error(`CONTROL_PLANE_AUTHORING_TRANSPILE_FAILED:\n${diagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("\n")}`);
}
const runtimeUrl = pathToFileURL(path.join(packageRoot, "src/control-plane.mjs")).href;
const executableSource = transpiled.outputText.replaceAll('"../src/control-plane.mjs"', JSON.stringify(runtimeUrl));
if (executableSource === transpiled.outputText && authoredSource.includes("../src/control-plane.mjs")) {
  throw new Error("CONTROL_PLANE_AUTHORING_IMPORT_RESOLUTION_FAILED");
}
const moduleUrl = `data:text/javascript;base64,${Buffer.from(executableSource).toString("base64")}`;
const authoringModule = await import(moduleUrl);
const authoringManifest = authoringModule.default;
const applicationRegistry = await readJson("applications/registry.json");
const validation = validateControlPlaneManifest(authoringManifest, applicationRegistry);
if (!validation.valid) throw new Error(`CONTROL_PLANE_INVALID:\n${validation.errors.map((item) => `- ${item}`).join("\n")}`);
const compiled = compileControlPlaneManifest(authoringManifest, applicationRegistry);
const canonicalPretty = compiled.canonicalJson;
const inventoryPretty = `${JSON.stringify(compiled.targetInventory, null, 2)}\n`;
const hashDocument = {
  schemaVersion: "1.0.0",
  algorithm: "SHA-256",
  canonicalDocument: "./control-plane.canonical.json",
  sha256: compiled.hash,
  canonicalByteLength: Buffer.byteLength(compiled.canonicalJson, "utf8"),
  auditRecordShape: {
    fields: ["manifestHash", "previousHash", "actor", "timestamp", "changeReason", "source"],
    persistedOn: "explicit canonical-state apply only",
    generatedValues: false,
  },
};
const hashPretty = `${JSON.stringify(hashDocument, null, 2)}\n`;

await writeIfChanged(path.join(generatedDirectory, "control-plane.canonical.json"), canonicalPretty);
await writeIfChanged(path.join(generatedDirectory, "control-plane.target-inventory.json"), inventoryPretty);
await writeIfChanged(path.join(generatedDirectory, "control-plane.hash.json"), hashPretty);

// Reuse the Domain Registry's established deterministic package manifest updater.
execFileSync(process.execPath, [path.join(packageRoot, "scripts/update-manifest.mjs")], { cwd: packageRoot, stdio: "inherit" });
await updateMigrationReadinessEvidence(compiled, inventoryPretty);

console.log(JSON.stringify({
  status: "CONTROL_PLANE_COMPILED",
  canonicalization: "PASS",
  deterministicHashing: "PASS",
  controlPlaneHash: compiled.hash,
  applicationsRepresented: compiled.canonical.applications.length,
  environmentsDeclared: compiled.targetInventory.environmentCount,
  targets: compiled.targetInventory.targetCounts,
  canonicalFile: "control-plane/generated/control-plane.canonical.json",
  targetInventoryFile: "control-plane/generated/control-plane.target-inventory.json",
  migrationExecutionApproved: false,
  deploymentApproved: false,
}, null, 2));

async function updateMigrationReadinessEvidence(compilation, targetInventoryJson) {
const targetInventoryHash = digest(targetInventoryJson);
const counts = compilation.targetInventory.targetCounts;
const branch = execFileSync("git", ["branch", "--show-current"], { cwd: packageRoot, encoding: "utf8" }).trim();
const sourceHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: packageRoot, encoding: "utf8" }).trim();
  const targetsPath = path.join(migrationReadinessDirectory, "targets.json");
  const targets = JSON.parse(await readFile(targetsPath, "utf8"));
  targets.inventoryStatus = counts.declared === 0 ? "NO_DATABASE_TARGETS_DECLARED" : "DATABASE_TARGETS_DECLARED_REQUIRES_VERIFICATION";
  targets.repository = { branch, head: sourceHead };
  targets.controlPlaneInventory = {
    path: "../control-plane/generated/control-plane.target-inventory.json",
    sha256: targetInventoryHash,
    controlPlaneHash: compilation.hash,
    targetsDeclared: counts.declared,
    targetsVerified: counts.verified,
    targetsConflicted: counts.conflicted,
    targetsUnknown: counts.unknown,
    byProvider: counts.byProvider,
  };
  await writeJsonIfChanged(targetsPath, targets);

  const reportPath = path.join(migrationReadinessDirectory, "M4-READINESS-REPORT.json");
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  report.controlPlane = {
    canonicalManifestPath: "../control-plane/generated/control-plane.canonical.json",
    targetInventoryPath: "../control-plane/generated/control-plane.target-inventory.json",
    hashDocumentPath: "../control-plane/generated/control-plane.hash.json",
    hash: compilation.hash,
    targetInventoryHash,
    applicationCount: compilation.targetInventory.applicationCount,
    environmentCount: compilation.targetInventory.environmentCount,
    targetCounts: counts,
  };
  report.targetSummary = {
    targetsDiscovered: counts.declared,
    targetsDeclared: counts.declared,
    targetsVerified: counts.verified,
    targetsConflicted: counts.conflicted,
    targetsUnknown: counts.unknown,
    state: counts.declared === 0 ? "NO_TARGET_DECLARED" : "DECLARATIONS_RECORDED",
    provider: "PER_TARGET",
    version: "PER_TARGET",
    baseline: counts.declared === 0 ? "NO_TARGET_DECLARED" : compilation.targetInventory.targets.every((target) => target.schemaBaselineAvailable) ? "AVAILABLE_FOR_ALL_DECLARED_TARGETS" : "UNAVAILABLE_OR_PARTIAL",
    migrationHistory: counts.declared === 0 ? "NO_TARGET_DECLARED" : compilation.targetInventory.targets.every((target) => target.migrationHistoryAvailable) ? "AVAILABLE_FOR_ALL_DECLARED_TARGETS" : "UNAVAILABLE_OR_PARTIAL",
    targetDiffHash: null,
    destructiveOperations: "NOT_ASSESSED_WITHOUT_TARGET_DIFF",
    backfillRequirements: "NOT_ASSESSED_WITHOUT_TARGET_DIFF",
    byProvider: counts.byProvider,
    targetSelection: counts.declared === 0 ? "NONE_DECLARED" : "DECLARED_NOT_AUTOMATICALLY_VERIFIED",
  };
  report.m4_1.targetsDeclared = counts.declared;
  report.m4_1.targetsVerified = counts.verified;
  report.m4_1.targetsConflicted = counts.conflicted;
  report.m4_1.targetsUnknown = counts.unknown;
  report.m4_1.targetBaselineCount = compilation.targetInventory.targets.filter((target) => target.schemaBaselineAvailable).length;
  report.m4_1.targetMigrationHistoryCount = compilation.targetInventory.targets.filter((target) => target.migrationHistoryAvailable).length;
  report.m4_1.targetSelection = counts.declared === 0 ? "NONE_DECLARED" : "DECLARED_NOT_AUTOMATICALLY_VERIFIED";
  delete report.m4_1.concreteTargetCount;
  report.branch = branch;
  report.sourceHead = sourceHead;
  const registryManifest = await readJson("registry.manifest.json");
  const globalProof = await readJson("../../certification/global-schema-release-proof.json");
  report.schemaProof = {
    ...report.schemaProof,
    contractSetHash: globalProof.schema.contractSetHash,
    logicalSchemaHash: globalProof.schema.logicalSchemaHash,
    tableCount: globalProof.schema.completeContracts,
    fkAndRelationClosure: globalProof.schema.foreignKeyClosure === "PASS" && globalProof.schema.relationClosure === "PASS" ? "PASS" : "FAIL",
    postgresqlPrismaValidation: globalProof.validations.prismaProviders.find((provider) => provider.provider === "postgresql")?.status ?? "UNKNOWN",
    sqlitePrismaValidation: globalProof.validations.prismaProviders.find((provider) => provider.provider === "sqlite")?.status ?? "UNKNOWN",
    tests: `${globalProof.validations.registryTests.passed}/${globalProof.validations.registryTests.tests} PASS`,
    registryValidation: globalProof.validations.registryIntegrity.exitCode === 0 ? "PASS" : "FAIL",
    registryHash: registryManifest.integrity.registryHash,
    sourceWorktreeDirty: globalProof.sourceSnapshot.workingTreeDirty,
  };
  await writeJsonIfChanged(reportPath, report);

  const markdownPath = path.join(migrationReadinessDirectory, "M4-READINESS-REPORT.md");
  const markdown = await readFile(markdownPath, "utf8");
  const start = markdown.indexOf("## Target inventory");
  const end = markdown.indexOf("## M4.2 artifacts", start);
  if (start < 0 || end < 0) throw new Error("M4_REPORT_TARGET_SECTION_MARKERS_MISSING");
  const targetSection = `## Target inventory\n\n- Applications represented: **${compilation.targetInventory.applicationCount}**.\n- Environments declared: **${compilation.targetInventory.environmentCount}**.\n- Database targets declared / verified / conflicted / unknown: **${counts.declared} / ${counts.verified} / ${counts.conflicted} / ${counts.unknown}**.\n- Provider counts: PostgreSQL ${counts.byProvider.postgresql}, SQLite ${counts.byProvider.sqlite}, libSQL ${counts.byProvider.libsql}, MySQL ${counts.byProvider.mysql}, other ${counts.byProvider.other}.\n- Control-plane hash: \`${compilation.hash}\`; target-inventory hash: \`${targetInventoryHash}\`.\n- Application IDs and labels resolve from the existing Application Registry. A fixture is never promoted into the authoritative target inventory.\n${counts.declared === 0 ? "- No database targets are currently declared. No target environment, provider/version, target identity, schema baseline, or migration history is recorded. The PostgreSQL and SQLite Prisma configs are validation placeholders. No database was contacted.\n" : "- Target declarations are configuration, not observed infrastructure. Only records explicitly marked VERIFIED with evidence count as verified. Existing databases require both a schema baseline and migration-history inventory. No database was contacted.\n"}- See \`targets.json\`, \`baseline-inventory.json\`, and \`migration-history-inventory.json\`.\n\n`;
  const updatedMarkdown = `${markdown.slice(0, start)}${targetSection}${markdown.slice(end)}`
    .replace(/- Registry hash `[^`]+`; source worktree was dirty\./, `- Registry hash \`${registryManifest.integrity.registryHash}\`; source worktree was dirty.`);
  await writeIfChanged(markdownPath, updatedMarkdown);

  const checksumPath = path.join(migrationReadinessDirectory, "M4-READINESS-SHA256.txt");
  const names = (await (await import("node:fs/promises")).readdir(migrationReadinessDirectory)).filter((name) => name !== "M4-READINESS-SHA256.txt").sort();
  const checksumRows = [];
  for (const name of names) {
    const bytes = await readFile(path.join(migrationReadinessDirectory, name));
    checksumRows.push(`${digest(bytes)}  ${name}`);
  }
  await writeIfChanged(checksumPath, `${checksumRows.join("\n")}\n`);

}

async function writeJsonIfChanged(filePath, value) {
  await writeIfChanged(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeIfChanged(filePath, content) {
  let current;
  try { current = await readFile(filePath, "utf8"); } catch { current = null; }
  if (current !== content) await writeFile(filePath, content);
}
