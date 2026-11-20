import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assessDraftCompileTestability } from "../src/contracts.mjs";
import { sha256 } from "../src/hash.mjs";
import { registry } from "../src/index.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(packageRoot, "schema-sources/authored/maataa-communications-v1");
const draftPath = path.join(outputRoot, "contracts.draft.json");
const draft = JSON.parse(await readFile(draftPath, "utf8"));
const enforcementPlan = JSON.parse(await readFile(path.join(outputRoot, "provider-enforcement-plan.json"), "utf8"));
const logical = JSON.parse(await readFile(path.join(outputRoot, "logical-schema.draft.json"), "utf8"));
const requested = registry.domains.tables.filter((table) => table.context === "communications").map((table) => table.id);
const structural = assessDraftCompileTestability(requested, registry);
const findings = [];
if (structural.status !== "DRAFT_COMPILE_TESTABLE") {
  findings.push({ classification: "CONTRACT_ERROR", status: "OPEN", message: "DRAFT contract structure or foreign-key closure failed.", details: structural.entries.filter((item) => item.errors.length) });
}

const cli = path.resolve(packageRoot, "../../node_modules/.bin/prisma");
const targets = [
  { provider: "postgresql", config: "prisma.config.postgresql.ts", schema: "schema-sources/authored/maataa-communications-v1/prisma-preview.postgresql.draft.prisma" },
  { provider: "sqlite", config: "prisma.config.sqlite.ts", schema: "schema-sources/authored/maataa-communications-v1/prisma-preview.sqlite.draft.prisma" },
];
const results = [];
for (const target of targets) {
  if (structural.status !== "DRAFT_COMPILE_TESTABLE") {
    results.push({ ...target, status: "BLOCKED_BY_CONTRACT", valid: false });
    continue;
  }
  const run = spawnSync(cli, ["validate", "--config", target.config, "--schema", target.schema], { cwd: packageRoot, encoding: "utf8" });
  const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`.trim();
  const valid = run.status === 0;
  results.push({ ...target, status: valid ? "PASS" : "FAIL", valid, exitCode: run.status, output });
  if (!valid) {
    const lower = output.toLowerCase();
    const classification = /relation|@relation|fields:|references:/.test(lower)
      ? "RELATION_ERROR"
      : target.provider === "sqlite" && /unsupported|not supported|native type/.test(lower)
        ? "SQLITE_PORTABILITY_LIMITATION"
        : target.provider === "postgresql" && /maximum allowed length|native type|provider/.test(lower)
          ? "POSTGRES_PROJECTION_ERROR"
          : /schema parsing|parsing attribute|unknown argument|unknown function/.test(lower)
            ? "PRISMA_GENERATOR_ERROR"
            : "PRISMA_GENERATOR_ERROR";
    findings.push({ provider: target.provider, classification, status: "OPEN", message: output });
  }
}

// Retain the real first PostgreSQL projection issue as resolved engineering evidence.
findings.push({
  provider: "postgresql",
  classification: "POSTGRES_PROJECTION_ERROR",
  status: "RESOLVED",
  message: "The initial emitted index names exceeded PostgreSQL's 63-byte identifier limit.",
  resolution: "The provider adapter now emits deterministic shortened physical names with a SHA-256 suffix; the database-neutral contract names are unchanged.",
});

const providerOverlayHashMaterial = [];
const migrationPreviews = {};
for (const provider of ["postgresql", "sqlite"]) {
  const overlay = await readFile(path.join(outputRoot, `provider-enforcement.${provider}.sql`), "utf8");
  providerOverlayHashMaterial.push(`${path.basename(`provider-enforcement.${provider}.sql`)}\0${sha256(overlay)}\n`);
  const migrationPath = path.join(outputRoot, `migration-preview.${provider}.draft.sql`);
  const metadataPath = path.join(outputRoot, `migration-preview.${provider}.draft.metadata.json`);
  try {
    const migrationSql = await readFile(migrationPath, "utf8");
    const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
    const valid = migrationSql.includes(overlay.trim())
      && migrationSql.startsWith(`-- DRAFT PREVIEW ONLY · provider=${provider} · contractSetHash=${draft.contractSetHash}`)
      && metadata.contractSetHash === draft.contractSetHash
      && metadata.sqlSha256 === sha256(migrationSql)
      && metadata.migrationPreviewValid === true
      && metadata.migrationApproved === false
      && metadata.deploymentApproved === false;
    migrationPreviews[provider] = { valid, status: valid ? "PASS" : "FAIL", file: path.basename(migrationPath), sha256: metadata.sqlSha256 };
  } catch (error) {
    migrationPreviews[provider] = { valid: false, status: "MISSING", file: path.basename(migrationPath), error: error.message };
  }
}
const providerArtifactHash = sha256(providerOverlayHashMaterial.join(""));
const providerPlanValid = enforcementPlan.contractSetHash === draft.contractSetHash
  && enforcementPlan.decision?.reviewStatus === "approved"
  && enforcementPlan.decision?.reviewer === "thelinep"
  && enforcementPlan.providerArtifactHash === providerArtifactHash
  && enforcementPlan.validation?.sqliteBehavioralChecks === "PASS"
  && enforcementPlan.validation?.postgresqlProjectionReview === "PASS_STATIC_REVIEW"
  && Object.values(migrationPreviews).length === 2
  && Object.values(migrationPreviews).every((item) => item.valid);
if (!providerPlanValid) {
  findings.push({ classification: "MIGRATION_ONLY_INVARIANT", status: "OPEN", message: "The accepted provider enforcement plan, SQL artifact hashes, behavioral checks, or migration previews do not match this Communications contract set.", contractSetHash: draft.contractSetHash, providerArtifactHash, migrationPreviews });
}
for (const provider of ["postgresql", "sqlite"]) {
  for (const table of logical.model.tables) {
    for (const invariant of table.invariants ?? []) {
      findings.push({
        provider,
        classification: provider === "postgresql" ? "POSTGRES_PROJECTION" : "SQLITE_PORTABILITY",
        status: providerPlanValid ? "ENFORCED_IN_MIGRATION_PREVIEW" : "OPEN",
        tableId: table.id,
        invariant: invariant.name,
        providerPlanHash: enforcementPlan.providerArtifactHash ?? null,
        migrationPreview: migrationPreviews[provider].file,
        validation: provider === "sqlite" ? "BEHAVIORAL_CHECKS_PASS" : "STATIC_SQL_REVIEW_PASS",
      });
    }
  }
}

const allValid = structural.status === "DRAFT_COMPILE_TESTABLE" && results.length === targets.length && results.every((item) => item.valid);
draft.readiness = {
  ...draft.readiness,
  compileTestable: structural.status === "DRAFT_COMPILE_TESTABLE",
  fkClosure: structural.status === "DRAFT_COMPILE_TESTABLE" ? "PASS" : "FAIL",
  logicalPreviewValid: logical.status === "DRAFT_LOGICAL_SCHEMA_READY",
  prismaPreviewValid: allValid,
  migrationPreviewValid: providerPlanValid,
  providerInvariantEnforcement: providerPlanValid ? "PASS" : "FAIL",
  migrationApproved: false,
  deploymentApproved: false,
};
await writeFile(draftPath, `${JSON.stringify(draft, null, 2)}\n`);
for (const item of results) {
  const metadataPath = path.join(outputRoot, `prisma-preview.${item.provider}.draft.metadata.json`);
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  metadata.prismaPreviewValid = item.valid;
  metadata.validationStatus = item.status;
  metadata.validationTool = "Prisma CLI 7.9.1";
  metadata.contractSetHash = draft.contractSetHash;
  metadata.migrationPreviewValid = migrationPreviews[item.provider]?.valid === true;
  metadata.invariantEnforcementValid = providerPlanValid;
  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
}
const report = {
  schemaVersion: "1.0.0",
  schemaLifecycle: "DRAFT",
  contractSetHash: draft.contractSetHash,
  validationTool: "Prisma CLI 7.9.1",
  structuralStatus: structural.status,
  providerPlanValid,
  providerArtifactHash,
  migrationPreviews,
  projections: results,
  findings,
};
await writeFile(path.join(outputRoot, "projection-findings.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ contractSetHash: report.contractSetHash, structuralStatus: report.structuralStatus, providerPlanValid, migrationPreviews, projections: results.map(({ provider, status, valid }) => ({ provider, status, valid })), openFindings: findings.filter((item) => item.status === "OPEN").length }, null, 2));
if (!allValid || !providerPlanValid) process.exitCode = 1;
