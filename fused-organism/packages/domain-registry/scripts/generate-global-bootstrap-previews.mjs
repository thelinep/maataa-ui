import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonicalJson } from "../src/hash.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../../..");
const sourceRoot = path.join(packageRoot, "schema-sources/authored/maataa-communications-v1");
const globalRoot = path.join(packageRoot, "schema-sources/authored/schema-factory-v1/global");
const migrationReadinessRoot = path.join(packageRoot, "migration-readiness");
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const count = (sql, pattern) => [...sql.matchAll(pattern)].length;

const planPath = path.join(migrationReadinessRoot, "provider-invariant-plan.json");
const plan = await readJson(planPath);
const readiness = await readJson(path.join(globalRoot, "readiness.json"));
const logical = await readJson(path.join(globalRoot, "logical-schema.canonical.json"));
const contracts = await readJson(path.join(packageRoot, "data/table-contracts.json"));
const communicationsContracts = contracts.contracts.filter((contract) => contract.context === "communications");
const logicalCommunications = logical.model.tables.filter((table) => table.context === "communications");
const planNames = plan.providerSpecificEquivalentInvariants.map(({ name }) => name).sort();
const logicalNames = logicalCommunications.flatMap((table) => (table.invariants ?? []).map(({ name }) => name)).sort();
const contractNames = communicationsContracts.flatMap((table) => (table.invariants ?? []).map(({ name }) => name)).sort();
if (planNames.length !== 5 || new Set(planNames).size !== 5) throw new Error("EXPECTED_EXACTLY_FIVE_UNIQUE_COMMUNICATIONS_INVARIANTS");
if (canonicalJson(planNames) !== canonicalJson(logicalNames) || canonicalJson(planNames) !== canonicalJson(contractNames)) {
  throw new Error(`COMMUNICATIONS_INVARIANT_CROSSWALK_MISMATCH:${JSON.stringify({ planNames, logicalNames, contractNames })}`);
}
if (readiness.schemaLifecycle !== "CANONICAL" || readiness.status !== "SCHEMA_READY" || logical.status !== "LOGICAL_SCHEMA_READY") {
  throw new Error("CANONICAL_GLOBAL_LOGICAL_SCHEMA_REQUIRED");
}

const cli = path.resolve(packageRoot, "../../node_modules/.bin/prisma");
const git = (args) => {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`GIT_${args[0]}_FAILED:${result.stderr || result.error?.message}`);
  return result.stdout.trim();
};
const sourceSnapshot = {
  gitHead: git(["rev-parse", "HEAD"]),
  branch: git(["branch", "--show-current"]),
  repositoryWorkingTreeDirty: Boolean(git(["status", "--porcelain", "--untracked-files=all"])),
  contractSetHash: readiness.contractSetHash,
  logicalSchemaHash: readiness.logicalSchemaHash,
};

const outputs = {};
for (const provider of ["postgresql", "sqlite"]) {
  const prismaFile = `prisma-preview.${provider}.canonical.prisma`;
  const config = `prisma.config.${provider}.ts`;
  const schemaRelative = path.relative(packageRoot, path.join(globalRoot, prismaFile));
  const run = spawnSync(cli, ["migrate", "diff", "--config", config, "--from-empty", "--to-schema", schemaRelative, "--script"], {
    cwd: packageRoot,
    encoding: "utf8",
    maxBuffer: 30 * 1024 * 1024,
  });
  if (run.status !== 0 || !run.stdout?.trim()) throw new Error(`GLOBAL_${provider.toUpperCase()}_BASE_PREVIEW_FAILED:${run.stderr ?? run.error?.message ?? "empty SQL"}`);

  const overlayName = `provider-enforcement.${provider}.sql`;
  const overlay = await readFile(path.join(sourceRoot, overlayName), "utf8");
  const marker = `-- MAATAA Communications invariant overlay · provider=${provider} · invariants=${planNames.join(",")}`;
  const sql = [
    `-- DRAFT EMPTY-STATE BOOTSTRAP PREVIEW · provider=${provider} · contractSetHash=${readiness.contractSetHash}`,
    "-- Generated from the canonical 352-table Prisma projection; preview only, not target-bound or executable.",
    "-- Communications enforcement overlay is appended after all Prisma tables, indexes, and foreign keys.",
    run.stdout.trimEnd(),
    "",
    marker,
    overlay.trim(),
    "",
  ].join("\n");
  const outputFile = `migration-preview.global.${provider}.bootstrap.sql`;
  const metadataFile = `migration-preview.global.${provider}.bootstrap.metadata.json`;
  const outputPath = path.join(globalRoot, outputFile);
  await writeFile(outputPath, sql);
  const metadata = {
    schemaVersion: "1.0.0",
    artifactStatus: "GENERATED_REVIEW_REQUIRED",
    artifactKind: "EMPTY_DATABASE_BOOTSTRAP_PREVIEW",
    authority: "Canonical database-neutral MAATAA schema projected through Prisma, with reviewed Communications provider enforcement overlay",
    provider,
    sourceSnapshot,
    target: { environment: null, engineVersion: null, baselineSchemaHash: null, migrationHistoryHash: null, fromState: "EMPTY_DATABASE", targetSpecificUpgradeDiff: false },
    generator: {
      name: "Prisma migrate diff plus MAATAA Communications overlay",
      version: JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8")).devDependencies.prisma,
      command: `prisma migrate diff --config ${config} --from-empty --to-schema ${schemaRelative} --script; append ${overlayName}`,
      mode: "Read-only schema-to-SQL rendering; no datasource connection or execution",
    },
    output: {
      file: outputFile,
      sha256: digest(sql),
      bytes: Buffer.byteLength(sql),
      createSchemas: count(sql, /^CREATE SCHEMA\b/gim),
      createEnums: count(sql, /^CREATE TYPE\b/gim),
      createTables: count(sql, /^CREATE TABLE\b/gim),
      createIndexes: count(sql, /^CREATE (?:UNIQUE )?INDEX\b/gim),
      foreignKeyClauses: count(sql, /\bFOREIGN KEY\s*\(/gim),
      alterTableStatements: count(sql, /^ALTER TABLE\b/gim),
      triggerDefinitions: count(sql, /^CREATE (?:OR REPLACE )?TRIGGER\b/gim),
      functionDefinitions: count(sql, /^CREATE OR REPLACE FUNCTION\b/gim),
      checkConstraints: count(sql, /^\s*CHECK\s*\(/gim),
      destructiveStatements: count(sql, /^(?:DROP|TRUNCATE)\b/gim),
      dataWriteStatements: count(sql, /^(?:INSERT|UPDATE|DELETE)\b/gim),
    },
    communicationsInvariantEnforcement: {
      status: "INTEGRATED_IN_EMPTY_STATE_PREVIEW_REVIEW_REQUIRED",
      invariantCount: planNames.length,
      invariantNames: planNames,
      overlayFile: `schema-sources/authored/maataa-communications-v1/${overlayName}`,
      overlaySha256: digest(overlay),
      ordering: "after all base DDL, indexes, and foreign keys",
      behaviorEvidence: provider === "sqlite" ? "existing in-memory SQLite behavioral checks; not libSQL evidence" : "existing PostgreSQL static projection review; not live PostgreSQL execution",
      targetBoundDiff: false,
    },
    permissions: { deployable: false, migrationExecutable: false, migrationApproved: false, deploymentApproved: false },
  };
  await writeFile(path.join(globalRoot, metadataFile), `${JSON.stringify(metadata, null, 2)}\n`);
  outputs[provider] = { file: outputFile, sha256: metadata.output.sha256, invariants: metadata.communicationsInvariantEnforcement.invariantCount, createTables: metadata.output.createTables };
}

plan.status = "INTEGRATED_IN_GLOBAL_EMPTY_BOOTSTRAPS_NOT_TARGET_DIFFED";
plan.globalBootstrapOverlayIncluded = true;
plan.globalBootstrapEvidence = Object.fromEntries(Object.entries(outputs).map(([provider, value]) => [provider, {
  file: `schema-sources/authored/schema-factory-v1/global/${value.file}`,
  sha256: value.sha256,
  invariantCount: value.invariants,
} ]));
plan.reconciliation = {
  status: "PASS_STATIC_CROSSWALK_AND_GENERATED_PREVIEW_INTEGRATION",
  canonicalInvariantNamesMatchPlan: true,
  exactInvariantCount: 5,
  providerOverlaysAppendedAfterBaseDdl: true,
  targetSpecificUpgradeDiffs: "NOT_GENERATED",
  liveProviderExecution: "NOT_PERFORMED",
};
plan.evidence.scope = "Five canonical Communications invariants crosswalked against the approved Communications overlay and appended to both 352-table global empty-state bootstrap previews; no live provider execution.";
plan.requiredBeforeM4_2Exit = [
  "select concrete provider/engine/version targets",
  "review overlay operation ordering and behavior on supported target versions",
  "generate and review each target-bound upgrade diff with the integrated provider overlays",
];
await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);

console.log(JSON.stringify({ status: "GLOBAL_BOOTSTRAP_PREVIEWS_GENERATED", sourceSnapshot, communicationsInvariants: planNames.length, outputs, migrationExecutionApproved: false, deploymentApproved: false }, null, 2));
