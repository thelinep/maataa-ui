import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assessContractCoverage, assessDraftCompileTestability } from "../src/contracts.mjs";
import { sha256 } from "../src/hash.mjs";
import { registry } from "../src/index.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(packageRoot, "schema-sources/authored/casting-v1");
const draftPath = path.join(outputRoot, "contracts.draft.json");
const draft = JSON.parse(await readFile(draftPath, "utf8"));
const logical = JSON.parse(await readFile(path.join(outputRoot, "logical-schema.draft.json"), "utf8"));
const requested = [...new Set(JSON.parse(await readFile(path.join(packageRoot, "applications/casting-pipeline-demo.ir.json"), "utf8")).tableIds)].sort();
const structural = assessDraftCompileTestability(requested, registry);
const canonicalCoverage = assessContractCoverage(requested, registry);
const effectiveContracts = new Map();
for (const contract of registry.authoredContracts ?? []) effectiveContracts.set(contract.id, contract);
for (const contract of registry.castingDraftContracts ?? []) effectiveContracts.set(contract.id, contract);
for (const contract of registry.draftContracts ?? []) effectiveContracts.set(contract.id, contract);
for (const contract of registry.tableContracts?.contracts ?? []) effectiveContracts.set(contract.id, contract);
const resolvedContractSet = requested.map((id) => effectiveContracts.get(id)).filter(Boolean);
const actualContractSetHash = sha256(JSON.stringify(resolvedContractSet));
const findings = [];

if (draft.schemaLifecycle !== "DRAFT" || !["SCHEMA_READY", "DRAFT_COMPLETE_REVIEW_PENDING"].includes(draft.status)) {
  findings.push({ classification: "CONTRACT_ERROR", status: "OPEN", message: "The casting preview package must remain non-deployable DRAFT output; its schema readiness is derived from canonical contract coverage." });
}
if (resolvedContractSet.length !== requested.length) {
  findings.push({ classification: "CONTRACT_ERROR", status: "OPEN", message: "The resolved contract set does not cover every casting table ID.", resolvedCount: resolvedContractSet.length, requestedCount: requested.length });
}
if (actualContractSetHash !== draft.contractSetHash) {
  findings.push({ classification: "CONTRACT_ERROR", status: "OPEN", message: "The recorded contract-set hash does not match the current DRAFT contract set.", expected: actualContractSetHash, recorded: draft.contractSetHash });
}
if (structural.status !== "DRAFT_COMPILE_TESTABLE") {
  findings.push({ classification: "CONTRACT_ERROR", status: "OPEN", message: "DRAFT contract structure or FK closure failed.", details: structural.entries.filter((item) => item.errors.length) });
}
if (logical.status !== "DRAFT_LOGICAL_SCHEMA_READY" || logical.model.tables.length !== requested.length) {
  findings.push({ classification: "RELATION_ERROR", status: "OPEN", message: "The logical model does not contain the complete requested casting table closure." });
}

const cli = path.resolve(packageRoot, "../../node_modules/.bin/prisma");
const targets = [
  { provider: "postgresql", config: "prisma.config.postgresql.ts", schema: "schema-sources/authored/casting-v1/prisma-preview.postgresql.draft.prisma" },
  { provider: "sqlite", config: "prisma.config.sqlite.ts", schema: "schema-sources/authored/casting-v1/prisma-preview.sqlite.draft.prisma" },
];
const results = [];
for (const target of targets) {
  if (findings.some((item) => item.status === "OPEN")) {
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
          : "PRISMA_GENERATOR_ERROR";
    findings.push({ provider: target.provider, classification, status: "OPEN", message: output });
  }
}

for (const provider of ["postgresql", "sqlite"]) {
  for (const table of logical.model.tables) {
    for (const invariant of table.invariants ?? []) {
      findings.push({
        provider,
        classification: "PRISMA_MODEL_LIMITATION",
        status: "DEFERRED",
        tableId: table.id,
        invariant: invariant.name,
        message: `${invariant.name} remains in the database-neutral model and requires provider migration implementation and validation.`,
      });
    }
  }
}

const allValid = structural.status === "DRAFT_COMPILE_TESTABLE"
  && logical.status === "DRAFT_LOGICAL_SCHEMA_READY"
  && canonicalCoverage.status === "SCHEMA_READY"
  && logical.model.tables.length === requested.length
  && actualContractSetHash === draft.contractSetHash
  && results.length === targets.length
  && results.every((item) => item.valid);
draft.readiness = {
  ...draft.readiness,
  compileTestable: structural.status === "DRAFT_COMPILE_TESTABLE",
  fkClosure: structural.status === "DRAFT_COMPILE_TESTABLE" ? "PASS" : "FAIL",
  logicalPreviewValid: logical.status === "DRAFT_LOGICAL_SCHEMA_READY",
  prismaPreviewValid: allValid,
  schemaReady: canonicalCoverage.status === "SCHEMA_READY"
    && structural.status === "DRAFT_COMPILE_TESTABLE"
    && logical.status === "DRAFT_LOGICAL_SCHEMA_READY"
    && logical.model.tables.length === requested.length,
  migrationPreviewValid: false,
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
  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
}
const report = {
  schemaVersion: "1.0.0",
  schemaLifecycle: "DRAFT",
  contractSetHash: draft.contractSetHash,
  validationTool: "Prisma CLI 7.9.1",
  structuralStatus: structural.status,
  requestedTables: requested.length,
  resolvedContractCount: resolvedContractSet.length,
  effectiveClosureTables: logical.model.tables.length,
  projections: results,
  findings,
};
await writeFile(path.join(outputRoot, "projection-findings.json"), `${JSON.stringify(report, null, 2)}\n`);
const readinessPath = path.join(outputRoot, "readiness.draft.json");
const readiness = JSON.parse(await readFile(readinessPath, "utf8"));
readiness.prismaPreviewValid = allValid;
readiness.schemaReady = draft.readiness.schemaReady;
readiness.canonicalCoverage = canonicalCoverage.counts;
readiness.providerProjections = Object.fromEntries(results.map(({ provider, status, valid }) => [provider, { status, valid }]));
await writeFile(readinessPath, `${JSON.stringify(readiness, null, 2)}\n`);
console.log(JSON.stringify({ contractSetHash: report.contractSetHash, structuralStatus: report.structuralStatus, requestedTables: report.requestedTables, effectiveClosureTables: report.effectiveClosureTables, projections: results.map(({ provider, status, valid }) => ({ provider, status, valid })), openFindings: findings.filter((item) => item.status === "OPEN").length, deferredFindings: findings.filter((item) => item.status === "DEFERRED").length }, null, 2));
if (!allValid) process.exitCode = 1;
