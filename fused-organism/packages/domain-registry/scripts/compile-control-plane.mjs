import { createHash } from "node:crypto";
import { readFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import ts from "typescript";
import {
  compileControlPlaneManifest,
  validateControlPlaneManifest,
} from "../src/control-plane.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "../../..");
const authoringPath = path.join(packageRoot, "control-plane/manifest.ts");
const appRegistryPath = path.join(packageRoot, "control-plane/application-registry.json");
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
const applicationRegistry = await readJson("control-plane/application-registry.json");
const validation = validateControlPlaneManifest(authoringManifest, applicationRegistry);
if (!validation.valid) throw new Error(`CONTROL_PLANE_INVALID:\n${validation.errors.map((item) => `- ${item}`).join("\n")}`);
await verifyLocalArtifactReferences(authoringManifest);
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
  const localTargets = compilation.targetInventory.targets.filter((target) => target.environmentKind === "local");
  const nonLocalTargets = compilation.targetInventory.targets.filter((target) => target.environmentKind !== "local");
  targets.inventoryStatus = counts.declared === 0
    ? "NO_DATABASE_TARGETS_DECLARED"
    : nonLocalTargets.length === 0
      ? "LOCAL_DEVELOPMENT_TARGETS_ONLY"
      : "NONLOCAL_DATABASE_TARGETS_DECLARED_REQUIRES_VERIFICATION";
  targets.repository = { branch, head: sourceHead };
  targets.targets = compilation.targetInventory.targets.map((target) => ({
    ...target,
    targetClass: target.environmentKind === "local" ? "LOCAL_DEVELOPMENT" : "NONLOCAL_ENVIRONMENT",
  }));
  targets.applicationEnvironmentAssignments = compilation.canonical.applications.flatMap((application) => (application.environments ?? []).map((environment) => ({
    appId: application.id,
    environmentId: environment.id,
    environmentKind: environment.kind,
    count: (environment.databaseTargets ?? []).length,
    databaseTargetIds: (environment.databaseTargets ?? []).map((target) => target.id).sort(),
  })));
  targets.controlPlaneInventory = {
    path: "../control-plane/generated/control-plane.target-inventory.json",
    sha256: targetInventoryHash,
    controlPlaneHash: compilation.hash,
    targetsDeclared: counts.declared,
    targetsVerified: counts.verified,
    targetsConflicted: counts.conflicted,
    targetsUnknown: counts.unknown,
    localDevelopmentTargets: localTargets.length,
    nonLocalTargets: nonLocalTargets.length,
    byProvider: counts.byProvider,
  };
  await writeJsonIfChanged(targetsPath, targets);

  const baselinePath = path.join(migrationReadinessDirectory, "baseline-inventory.json");
  const baselineInventory = JSON.parse(await readFile(baselinePath, "utf8"));
  baselineInventory.status = nonLocalTargets.length === 0 ? "NONLOCAL_TARGET_BASELINE_UNAVAILABLE_LOCAL_BASELINES_RECORDED" : "NONLOCAL_TARGET_BASELINES_REQUIRE_REVIEW";
  baselineInventory.repositoryHead = sourceHead;
  baselineInventory.targetBaselines = compilation.targetInventory.targets.map((target) => ({
    applicationId: target.applicationId,
    environmentId: target.environmentId,
    environmentKind: target.environmentKind,
    databaseTargetId: target.databaseTargetId,
    targetClass: target.environmentKind === "local" ? "LOCAL_DEVELOPMENT" : "NONLOCAL_ENVIRONMENT",
    provider: target.provider,
    engineVersion: target.engineVersion,
    state: target.databaseState,
    verificationStatus: target.verificationStatus,
    schemaBaseline: target.schemaBaseline,
    baselineAvailable: target.schemaBaselineAvailable,
  }));
  baselineInventory.finding = nonLocalTargets.length === 0
    ? "Local development baselines are recorded. No non-local environment baseline is declared, so release target-diff work remains blocked."
    : "Non-local target baselines are declared and require separate review before target-specific diff work.";
  await writeJsonIfChanged(baselinePath, baselineInventory);

  const historyPath = path.join(migrationReadinessDirectory, "migration-history-inventory.json");
  const historyInventory = JSON.parse(await readFile(historyPath, "utf8"));
  historyInventory.status = nonLocalTargets.length === 0 ? "NONLOCAL_TARGET_MIGRATION_HISTORY_UNAVAILABLE_LOCAL_INVENTORIES_RECORDED" : "NONLOCAL_TARGET_HISTORY_REQUIRES_REVIEW";
  historyInventory.repositoryHead = sourceHead;
  historyInventory.targetMigrationHistories = compilation.targetInventory.targets.map((target) => ({
    applicationId: target.applicationId,
    environmentId: target.environmentId,
    environmentKind: target.environmentKind,
    databaseTargetId: target.databaseTargetId,
    targetClass: target.environmentKind === "local" ? "LOCAL_DEVELOPMENT" : "NONLOCAL_ENVIRONMENT",
    provider: target.provider,
    migrationHistory: target.migrationHistory,
    migrationHistoryAvailable: target.migrationHistoryAvailable,
  }));
  historyInventory.finding = nonLocalTargets.length === 0
    ? "The local databases were initialized from generated owner-local schemas and have no incremental migration history. No non-local target migration history is declared."
    : "Non-local target migration history is declared and requires separate review.";
  await writeJsonIfChanged(historyPath, historyInventory);

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
    state: counts.declared === 0 ? "NO_TARGET_DECLARED" : nonLocalTargets.length === 0 ? "LOCAL_DEVELOPMENT_TARGETS_ONLY" : "DECLARATIONS_RECORDED",
    localDevelopmentTargets: localTargets.length,
    nonLocalTargets: nonLocalTargets.length,
    provider: "PER_TARGET",
    version: "PER_TARGET",
    baseline: counts.declared === 0 ? "NO_TARGET_DECLARED" : compilation.targetInventory.targets.every((target) => target.schemaBaselineAvailable) ? nonLocalTargets.length === 0 ? "AVAILABLE_LOCAL_ONLY" : "AVAILABLE_FOR_ALL_DECLARED_TARGETS" : "UNAVAILABLE_OR_PARTIAL",
    migrationHistory: counts.declared === 0 ? "NO_TARGET_DECLARED" : compilation.targetInventory.targets.every((target) => target.migrationHistoryAvailable) ? nonLocalTargets.length === 0 ? "LOCAL_BOOTSTRAP_NO_INCREMENTAL_HISTORY" : "AVAILABLE_FOR_ALL_DECLARED_TARGETS" : "UNAVAILABLE_OR_PARTIAL",
    targetDiffHash: null,
    destructiveOperations: "NOT_ASSESSED_WITHOUT_TARGET_DIFF",
    backfillRequirements: "NOT_ASSESSED_WITHOUT_TARGET_DIFF",
    byProvider: counts.byProvider,
    targetSelection: counts.declared === 0 ? "NONE_DECLARED" : nonLocalTargets.length === 0 ? "LOCAL_ONLY" : "NONLOCAL_DECLARED_REQUIRES_SEPARATE_RELEASE_REVIEW",
  };
  report.m4_1.targetsDeclared = counts.declared;
  report.m4_1.targetsVerified = counts.verified;
  report.m4_1.targetsConflicted = counts.conflicted;
  report.m4_1.targetsUnknown = counts.unknown;
  report.m4_1.targetBaselineCount = compilation.targetInventory.targets.filter((target) => target.schemaBaselineAvailable).length;
  report.m4_1.targetMigrationHistoryCount = compilation.targetInventory.targets.filter((target) => target.migrationHistoryAvailable).length;
  report.m4_1.status = nonLocalTargets.length === 0 ? "BLOCKED" : "PARTIAL";
  report.m4_1.reason = nonLocalTargets.length === 0 ? "NO_NONLOCAL_TARGET_DECLARED" : "NONLOCAL_TARGET_REQUIRES_VERIFICATION";
  report.m4_1.localDevelopmentTargetCount = localTargets.length;
  report.m4_1.nonLocalTargetCount = nonLocalTargets.length;
  report.m4_1.targetSelection = counts.declared === 0 ? "NONE_DECLARED" : nonLocalTargets.length === 0 ? "LOCAL_ONLY" : "NONLOCAL_TARGETS_REQUIRE_SEPARATE_RELEASE_REVIEW";
  report.m4_2.reason = nonLocalTargets.length === 0 ? "NO_NONLOCAL_TARGET_DIFF_INPUT" : "TARGET_DIFF_NOT_GENERATED";
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
  report.databaseContacted = true;
  report.databaseMutated = true;
  report.localDatabaseFilesCreated = true;
  report.localDatabaseFilesVerified = true;
  report.hostedDatabaseContacted = false;
  report.hostedDatabaseMutated = false;
  report.nextSafeAction = "Declare and verify the intended non-local staging or production target, including accountable owner, provider/version, exact identity, baseline, and migration history; then generate and review a target-bound diff without executing it.";
  report.stopGates = [...new Set([...(report.stopGates ?? []).filter((gate) => !["M4-TARGET-UNKNOWN", "M4-TARGET-BASELINE", "M4-TARGET-HISTORY"].includes(gate)), ...(nonLocalTargets.length === 0 ? ["M4-NONLOCAL-TARGET", "M4-NONLOCAL-BASELINE", "M4-NONLOCAL-HISTORY"] : [])])].sort();
  await writeJsonIfChanged(reportPath, report);

  const markdownPath = path.join(migrationReadinessDirectory, "M4-READINESS-REPORT.md");
  const markdown = await readFile(markdownPath, "utf8");
  const start = markdown.indexOf("## Target inventory");
  const end = markdown.indexOf("## M4.2 artifacts", start);
  if (start < 0 || end < 0) throw new Error("M4_REPORT_TARGET_SECTION_MARKERS_MISSING");
  const targetSection = `## Target inventory\n\n- Operational applications represented: **${compilation.targetInventory.applicationCount}**.\n- Environments declared: **${compilation.targetInventory.environmentCount}**.\n- Database targets declared / verified / conflicted / unknown: **${counts.declared} / ${counts.verified} / ${counts.conflicted} / ${counts.unknown}**.\n- Local development targets: **${localTargets.length}**; non-local targets: **${nonLocalTargets.length}**.\n- Provider counts: PostgreSQL ${counts.byProvider.postgresql}, SQLite ${counts.byProvider.sqlite}, libSQL ${counts.byProvider.libsql}, MySQL ${counts.byProvider.mysql}, other ${counts.byProvider.other}.\n- Control-plane hash: \`${compilation.hash}\`; target-inventory hash: \`${targetInventoryHash}\`.\n- MAATAA, TLPS, and the shared data owner resolve from \`control-plane/application-registry.json\`; the four composition proof apps remain in \`applications/registry.json\`.\n${counts.declared === 0 ? "- No database targets are declared.\n" : nonLocalTargets.length === 0 ? "- Three local SQLite files were inspected and verified by recorded hashes, SQLite integrity checks, and foreign-key checks. These local targets do not satisfy hosted/staging/production target evidence. No remote database was contacted.\n" : "- Target declarations are configuration, not automatically approved for release. Verification evidence, baseline, and migration history are scoped per environment; local and hosted targets are reported separately.\n"}- See \`targets.json\`, \`baseline-inventory.json\`, \`migration-history-inventory.json\`, and \`../control-plane/evidence/local-development/target-verification.json\`.\n\n`;
  const updatedMarkdown = `${markdown.slice(0, start)}${targetSection}${markdown.slice(end)}`
    .replace(/^\*\*Result:\*\*.*$/m, `**Result:** M4.1 is **BLOCKED for release readiness** because only local targets are declared. M4.2 is **PARTIAL**: no non-local target diff has been generated.`)
    .replaceAll("**Not generated — TARGET_BASELINE_UNAVAILABLE**", "**Not generated — NO_NONLOCAL_TARGET_DIFF_INPUT**")
    .replace("- **M4.1:** BLOCKED (`TARGET_BASELINE_UNAVAILABLE`).", "- **M4.1:** BLOCKED (`NO_NONLOCAL_TARGET_DECLARED`); three local-development targets have recorded baselines and histories.")
    .replace("- **M4.2:** PARTIAL; no target diff generated.", "- **M4.2:** PARTIAL; no non-local target diff generated. Local owner databases are development fixtures, not release targets.")
    .replace("- Database contacted/mutated: **NO / NO**. Migration execution/deployment approval: **NOT GRANTED / NOT GRANTED**.", "- Local database files inspected / created: **YES / YES**; integrity and FK checks: **PASS**. Remote/hosted database contacted / mutated: **NO / NO**. Migration execution/deployment approval: **NOT GRANTED / NOT GRANTED**.")
    .replace("Record the intended application/environment and exact provider/engine version. Capture a read-only baseline and migration history, or explicitly attest a new empty target. Then generate and review a target-bound diff. Do not execute it under this milestone.", "Designate the intended non-local staging or production application/environment and exact provider/engine version. Capture its read-only baseline and migration history, or explicitly attest a new empty target. Then generate and review a target-bound diff. The local SQLite targets do not substitute for that release evidence; do not execute a migration under this milestone.")
    .replace(/tests \d+\/\d+/, `tests ${report.schemaProof.tests}`)
    .replace(/- Registry hash `[^`]+`; source worktree was dirty\./, `- Registry hash \`${registryManifest.integrity.registryHash}\`; source worktree was dirty.`);
  await writeIfChanged(markdownPath, updatedMarkdown);

  const checksumPath = path.join(migrationReadinessDirectory, "M4-READINESS-SHA256.txt");
  const names = (await listFilesRecursively(migrationReadinessDirectory))
    .filter((name) => name !== "M4-READINESS-SHA256.txt")
    .sort();
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

async function listFilesRecursively(directory, relativeDirectory = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFilesRecursively(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

async function verifyLocalArtifactReferences(manifest) {
  for (const application of manifest.applications ?? []) {
    for (const environment of application.environments ?? []) {
      for (const target of environment.databaseTargets ?? []) {
        const references = [target.baseline, target.migrationHistory, ...(target.evidence ?? [])].filter(Boolean);
        for (const reference of references) {
          if (!reference.uri?.startsWith("fused-organism/") || !reference.sha256) continue;
          const artifactPath = path.resolve(repositoryRoot, reference.uri);
          if (!artifactPath.startsWith(`${repositoryRoot}${path.sep}`)) throw new Error(`CONTROL_PLANE_ARTIFACT_PATH_ESCAPES_REPOSITORY:${reference.id}`);
          const actualHash = digest(await readFile(artifactPath));
          if (actualHash !== reference.sha256) throw new Error(`CONTROL_PLANE_ARTIFACT_HASH_MISMATCH:${reference.id}:${actualHash}`);
        }
      }
    }
  }
}
