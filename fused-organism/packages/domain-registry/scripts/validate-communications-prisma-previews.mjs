import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assessDraftCompileTestability } from "../src/contracts.mjs";
import { registry } from "../src/index.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(packageRoot, "schema-sources/authored/maataa-communications-v1");
const draftPath = path.join(outputRoot, "contracts.draft.json");
const draft = JSON.parse(await readFile(draftPath, "utf8"));
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

for (const provider of ["postgresql", "sqlite"]) {
  for (const table of logical.model.tables) {
    for (const invariant of table.invariants ?? []) {
      findings.push({
        provider,
        classification: "PRISMA_MODEL_LIMITATION",
        status: "DEFERRED",
        tableId: table.id,
        invariant: invariant.name,
        message: `${invariant.name} is retained in the database-neutral logical contract but is not represented by Prisma schema syntax; the provider migration projection must implement and validate it.`,
      });
    }
  }
}

const allValid = structural.status === "DRAFT_COMPILE_TESTABLE" && results.length === targets.length && results.every((item) => item.valid);
draft.readiness = {
  ...draft.readiness,
  compileTestable: structural.status === "DRAFT_COMPILE_TESTABLE",
  fkClosure: structural.status === "DRAFT_COMPILE_TESTABLE" ? "PASS" : "FAIL",
  prismaPreviewValid: allValid,
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
  projections: results,
  findings,
};
await writeFile(path.join(outputRoot, "projection-findings.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ contractSetHash: report.contractSetHash, structuralStatus: report.structuralStatus, projections: results.map(({ provider, status, valid }) => ({ provider, status, valid })), openFindings: findings.filter((item) => item.status === "OPEN").length }, null, 2));
if (!allValid) process.exitCode = 1;
