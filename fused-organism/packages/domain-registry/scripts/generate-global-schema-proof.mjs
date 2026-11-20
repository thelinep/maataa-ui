import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assessContractCoverage, assessDraftCompileTestability, compileLogicalSchema } from "../src/contracts.mjs";
import { registry } from "../src/index.mjs";
import { canonicalJson, sha256 } from "../src/hash.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../../..");
const proofRoot = path.join(repoRoot, "fused-organism/certification");
const artifactRoot = path.join(packageRoot, "schema-sources/authored/schema-factory-v1");
const contexts = ["creative", "logistics", "campaign", "marketplace", "finance", "investor", "eventsSpatial", "intelligence", "public"];
const readJson = async (relative) => JSON.parse(await readFile(path.join(packageRoot, relative), "utf8"));
const fileHash = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  return { exitCode: result.status ?? 1, output };
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const catalog = await readJson("data/domain-catalog.json");
const tableContracts = await readJson("data/table-contracts.json");
const catalogIds = catalog.tables.map((table) => table.id).sort();
const contractIds = tableContracts.contracts.map((contract) => contract.id).sort();
const duplicateIds = contractIds.filter((id, index) => id === contractIds[index - 1]);
assert(catalogIds.length === 352, `EXPECTED_352_CATALOG_IDS:${catalogIds.length}`);
assert(tableContracts.contracts.length === 352, `EXPECTED_352_CONTRACTS:${tableContracts.contracts.length}`);
assert(new Set(contractIds).size === 352 && duplicateIds.length === 0, `DUPLICATE_CONTRACT_IDS:${duplicateIds.join(",")}`);
assert(canonicalJson(catalogIds) === canonicalJson(contractIds), "CANONICAL_CONTRACT_IDS_DO_NOT_MATCH_CATALOG");

const source = { ...registry, tableContracts };
const coverage = assessContractCoverage(catalogIds, source);
assert(coverage.status === "SCHEMA_READY" && coverage.counts.complete === 352 && coverage.counts.partial === 0 && coverage.counts.nameOnly === 0, `SCHEMA_COVERAGE_FAILED:${JSON.stringify(coverage.counts)}`);
const closure = assessDraftCompileTestability(catalogIds, source);
assert(closure.status === "DRAFT_COMPILE_TESTABLE", `FK_OR_RELATION_CLOSURE_FAILED:${JSON.stringify(closure.entries.filter((entry) => entry.errors.length))}`);
const logical = compileLogicalSchema(catalogIds, source);
assert(logical.status === "LOGICAL_SCHEMA_READY", `LOGICAL_SCHEMA_FAILED:${JSON.stringify(logical.blockers)}`);
const contractSetHash = sha256(tableContracts.contracts);

const globalReadiness = await readJson("schema-sources/authored/schema-factory-v1/global/readiness.json");
const savedLogical = await readJson("schema-sources/authored/schema-factory-v1/global/logical-schema.canonical.json");
assert(globalReadiness.status === "SCHEMA_READY" && globalReadiness.schemaLifecycle === "CANONICAL", "GLOBAL_READINESS_NOT_CANONICAL");
assert(globalReadiness.contractSetHash === contractSetHash, "GLOBAL_CONTRACT_HASH_MISMATCH");
assert(globalReadiness.logicalSchemaHash === logical.schemaHash && savedLogical.schemaHash === logical.schemaHash, "LOGICAL_SCHEMA_HASH_MISMATCH");
assert(globalReadiness.fkClosure === "PASS" && globalReadiness.relationClosure === "PASS", "GLOBAL_RELATION_CLOSURE_NOT_PASS");

const reviewRecords = [];
for (const context of contexts) {
  const base = path.join(artifactRoot, context);
  const draft = JSON.parse(await readFile(path.join(base, "contracts.draft.json"), "utf8"));
  const canonicalized = JSON.parse(await readFile(path.join(base, "contracts.canonicalized.json"), "utf8"));
  const review = JSON.parse(await readFile(path.join(base, "contracts.review.json"), "utf8"));
  assert(review.reviewStatus === "REVIEWED" && review.decision === "APPROVE", `REVIEW_NOT_APPROVED:${context}`);
  assert(review.reviewer === "thelinep" && review.reviewedAt, `REVIEWER_OR_TIMESTAMP_MISSING:${context}`);
  assert(review.draftContractSetHash === sha256(draft.contracts), `DRAFT_REVIEW_HASH_MISMATCH:${context}`);
  assert(review.contractSetHash === sha256(canonicalized.contracts), `CANONICAL_REVIEW_HASH_MISMATCH:${context}`);
  assert(canonicalized.schemaLifecycle === "CANONICAL" && canonicalized.contracts.length === draft.contractCount, `CANONICAL_CONTEXT_MISMATCH:${context}`);
  const currentContracts = tableContracts.contracts.filter((contract) => contract.context === context);
  assert(canonicalJson(canonicalized.contracts.map(({ id }) => id).sort()) === canonicalJson(currentContracts.map(({ id }) => id).sort()), `CANONICAL_REVIEW_IDS_MISMATCH:${context}`);
  assert(review.contractSetHash === sha256(currentContracts), `CANONICAL_REVIEW_HASH_NOT_CURRENT:${context}`);
  reviewRecords.push({ context, contractCount: canonicalized.contracts.length, status: review.reviewStatus, decision: review.decision, reviewer: review.reviewer, reviewedAt: review.reviewedAt, binding: "EXACT_CANONICAL_CONTEXT_HASH", reviewedSetHash: review.contractSetHash, draftContractSetHash: review.draftContractSetHash, canonicalContractSetHash: review.contractSetHash });
}

const currentContractsByContext = new Map();
for (const contract of tableContracts.contracts) {
  const list = currentContractsByContext.get(contract.context) ?? [];
  list.push(contract);
  currentContractsByContext.set(contract.context, list);
}
const castingReadiness = await readJson("schema-sources/authored/casting-v1/readiness.draft.json");
for (const context of ["identity", "people", "project", "evidence", "platform", "production"]) {
  const review = await readJson(`schema-sources/authored/casting-v1/${context}.review.json`);
  const currentContracts = currentContractsByContext.get(context) ?? [];
  assert(review.reviewStatus === "REVIEWED" && review.decision === "APPROVE" && review.reviewer === "thelinep" && review.reviewedAt, `CASTING_REVIEW_NOT_APPROVED:${context}`);
  assert(review.contractCount === currentContracts.length && canonicalJson([...review.contractIds].sort()) === canonicalJson(currentContracts.map(({ id }) => id).sort()), `CASTING_REVIEW_IDS_MISMATCH:${context}`);
  assert(review.hashRefresh?.current?.contractSetHash === castingReadiness.contractSetHash && review.hashRefresh?.current?.logicalSchemaHash === castingReadiness.logicalSchemaHash, `CASTING_REVIEW_REFRESH_MISMATCH:${context}`);
  reviewRecords.push({ context, contractCount: currentContracts.length, status: review.reviewStatus, decision: review.decision, reviewer: review.reviewer, reviewedAt: review.reviewedAt, binding: "EXACT_CASTING_160_SLICE_HASH_REFRESH", reviewedSetHash: review.contractSetHash, refreshedSliceContractSetHash: review.hashRefresh.current.contractSetHash, refreshedSliceLogicalSchemaHash: review.hashRefresh.current.logicalSchemaHash });
}

const communicationsReview = await readJson("schema-sources/authored/maataa-communications-v1/contracts.review.json");
const communicationsDraft = await readJson("schema-sources/authored/maataa-communications-v1/contracts.draft.json");
const communicationsContracts = currentContractsByContext.get("communications") ?? [];
assert(communicationsReview.reviewStatus === "REVIEWED" && communicationsReview.decision === "APPROVE" && communicationsReview.reviewer === "thelinep", "COMMUNICATIONS_REVIEW_NOT_APPROVED");
assert(communicationsReview.contractSetHash === sha256(communicationsDraft.contracts) && communicationsReview.contractIds.length === 9, "COMMUNICATIONS_REVIEW_HASH_MISMATCH");
assert(canonicalJson([...communicationsReview.contractIds].sort()) === canonicalJson(communicationsContracts.map(({ id }) => id).sort()), "COMMUNICATIONS_REVIEW_IDS_MISMATCH");
reviewRecords.push({ context: "communications", contractCount: communicationsContracts.length, status: communicationsReview.reviewStatus, decision: communicationsReview.decision, reviewer: communicationsReview.reviewer, reviewedAt: communicationsReview.reviewedAt, binding: "EXACT_COMMUNICATIONS_DRAFT_HASH_AND_ID_SET", reviewedSetHash: communicationsReview.contractSetHash, dependencyClosureContractSetHash: communicationsReview.dependencyClosureContractSetHash, refreshedLogicalSchemaHash: communicationsReview.hashRefresh?.current?.logicalSchemaHash ?? null });

const organisationBundle = await readJson("schema-sources/approvals/organisation-m2.7/approval-bundle.json");
const organisationApproval = organisationBundle.approval;
const organisationContracts = currentContractsByContext.get("organisation") ?? [];
const approvedOrganisationIds = [...organisationApproval.tables].sort();
assert(organisationApproval.decision === "APPROVED" && organisationApproval.approvedBy === "thelinep", "ORGANISATION_APPROVAL_NOT_APPROVED");
assert(organisationContracts.length === 10 && canonicalJson(approvedOrganisationIds) === canonicalJson(organisationContracts.map(({ id }) => id).sort()), "ORGANISATION_APPROVAL_IDS_MISMATCH");
assert(organisationBundle.contracts.length === 6 && organisationApproval.newlyAuthoredContracts.length === 6, "ORGANISATION_APPROVED_CONTRACT_SCOPE_MISMATCH");
reviewRecords.push({ context: "organisation", contractCount: organisationContracts.length, status: "APPROVED", decision: organisationApproval.decision, reviewer: organisationApproval.approvedBy, reviewedAt: organisationApproval.approvedAt, binding: "APPROVED_TABLE_ID_SET_AND_BUNDLE_SHA256", reviewedSetHash: await fileHash(path.join(packageRoot, "schema-sources/approvals/organisation-m2.7/approval-bundle.json")), newlyAuthoredContractCount: organisationBundle.contracts.length });
assert(reviewRecords.length === new Set(tableContracts.contracts.map(({ context }) => context)).size, "REVIEW_EVIDENCE_CONTEXT_COVERAGE_MISMATCH");

const providerRecords = [];
for (const provider of ["postgresql", "sqlite"]) {
  const relativeSchema = `schema-sources/authored/schema-factory-v1/global/prisma-preview.${provider}.canonical.prisma`;
  const schemaPath = path.join(packageRoot, relativeSchema);
  const config = provider === "postgresql" ? "prisma.config.postgresql.ts" : "prisma.config.sqlite.ts";
  const validation = run(path.resolve(packageRoot, "../../node_modules/.bin/prisma"), ["validate", "--config", config, "--schema", relativeSchema], packageRoot);
  assert(validation.exitCode === 0, `PROVIDER_VALIDATION_FAILED:${provider}:${validation.output}`);
  const metadata = await readJson(`schema-sources/authored/schema-factory-v1/global/prisma-preview.${provider}.canonical.metadata.json`);
  assert(metadata.validationStatus === "PASS" && metadata.schemaLifecycle === "CANONICAL", `PROVIDER_METADATA_FAILED:${provider}`);
  assert(metadata.logicalSchemaHash === logical.schemaHash, `PROVIDER_LOGICAL_HASH_MISMATCH:${provider}`);
  assert(metadata.targetProvider === provider, `PROVIDER_TARGET_MISMATCH:${provider}`);
  const invariants = metadata.unprojectedLogicalInvariants ?? [];
  providerRecords.push({ provider, status: "PASS", validationCommand: `prisma validate --config ${config} --schema ${relativeSchema}`, schemaSha256: await fileHash(schemaPath), logicalSchemaHash: metadata.logicalSchemaHash, deployable: metadata.deployable, migrationExecutable: metadata.migrationExecutable, findings: invariants.map(({ name, tableId, kind, projection }) => ({ name, tableId, kind, projection })) });
}
assert(canonicalJson(providerRecords[0].findings) === canonicalJson(providerRecords[1].findings), "PROVIDER_FINDINGS_DIVERGE");

const tests = run("npm", ["test"], packageRoot);
const testSummary = tests.output.match(/# tests (\d+)[\s\S]*?# pass (\d+)\s+# fail (\d+)/);
assert(tests.exitCode === 0 && testSummary && testSummary[3] === "0", `TESTS_FAILED:${tests.output}`);
const registryValidation = run("npm", ["run", "validate"], packageRoot);
assert(registryValidation.exitCode === 0, `REGISTRY_VALIDATION_FAILED:${registryValidation.output}`);
assert(registryValidation.output.includes("Domain registry: VALID · Route registry: VALID"), "REGISTRY_VALIDATION_SUMMARY_MISSING");
assert(registryValidation.output.includes("Application IR artifacts: PASS"), "APPLICATION_IR_VALIDATION_FAILED");
const registrySummary = registryValidation.output.split("\n").filter((line) => /^(Registry |Domain registry:|Routes:|Application IR artifacts:|Reproducible package hash:|Registry validation PASS)/.test(line));
const diffCheck = run("git", ["diff", "--check"], repoRoot);
assert(diffCheck.exitCode === 0, `DIFF_CHECK_FAILED:${diffCheck.output}`);
const scriptCheck = run("node", ["--check", "fused-organism/packages/domain-registry/scripts/generate-global-schema-proof.mjs"], repoRoot);
assert(scriptCheck.exitCode === 0, `PROOF_SCRIPT_SYNTAX_FAILED:${scriptCheck.output}`);
const gitHead = run("git", ["rev-parse", "HEAD"], repoRoot);
const gitBranch = run("git", ["branch", "--show-current"], repoRoot);
const gitStatus = run("git", ["status", "--porcelain", "--untracked-files=all"], repoRoot);
assert(gitStatus.exitCode === 0, `GIT_STATUS_FAILED:${gitStatus.output}`);
const statusLines = gitStatus.output ? gitStatus.output.split("\n") : [];
const untrackedFileCount = statusLines.filter((line) => line.startsWith("?? ")).length;
const trackedChangeCount = statusLines.length - untrackedFileCount;
const gitDirty = statusLines.length > 0;
const manifest = await readJson("registry.manifest.json");
const packageJson = await readJson("package.json");

const proof = {
  reportVersion: "1.0.0",
  proofType: "MAATAA_GLOBAL_SCHEMA_READINESS",
  evidenceBoundary: "Schema readiness proof only; it does not authorize or prove a migration or deployment.",
  sourceSnapshot: { gitHead: gitHead.output, branch: gitBranch.output, workingTreeDirty: gitDirty, trackedChangeCount, untrackedFileCount, registryVersion: manifest.version, registryHash: manifest.integrity.registryHash, prismaVersionPinned: packageJson.devDependencies?.prisma ?? null },
  schema: {
    lifecycle: "CANONICAL", readiness: "SCHEMA_READY", tableCount: 352, completeContracts: coverage.counts.complete,
    partialContracts: coverage.counts.partial, nameOnlyContracts: coverage.counts.nameOnly, duplicateIds: duplicateIds.length,
    foreignKeyClosure: "PASS", relationClosure: "PASS", contractSetHash, logicalSchemaHash: logical.schemaHash,
  },
  reviews: { status: "ALL_17_CONTEXTS_HAVE_APPROVAL_EVIDENCE", reviewer: "thelinep", contexts: reviewRecords },
  providers: providerRecords,
  validations: {
    structuralAndClosure: { status: "PASS", command: "assessment via assessContractCoverage + assessDraftCompileTestability", completeContracts: coverage.counts.complete, fkClosure: "PASS", relationClosure: "PASS" },
    logicalModel: { status: "PASS", logicalSchemaHash: logical.schemaHash },
    prismaProviders: providerRecords.map(({ provider, status, validationCommand, schemaSha256 }) => ({ provider, status, validationCommand, schemaSha256 })),
    registryTests: { command: "npm test", exitCode: tests.exitCode, tests: Number(testSummary[1]), passed: Number(testSummary[2]), failed: Number(testSummary[3]) },
    registryIntegrity: { command: "npm run validate", exitCode: registryValidation.exitCode, summary: registrySummary },
    diffCheck: { command: "git diff --check", exitCode: diffCheck.exitCode, status: "PASS", scope: "tracked diff" },
    proofScriptSyntax: { command: "node --check fused-organism/packages/domain-registry/scripts/generate-global-schema-proof.mjs", exitCode: scriptCheck.exitCode, status: "PASS" },
  },
  permissions: { schemaReady: true, migrationApproved: false, deploymentApproved: false, legalReviewed: false, migrationExecuted: false, deploymentExecuted: false },
};

const providerRows = providerRecords.map((provider) => `| ${provider.provider} | ${provider.status} | ${provider.schemaSha256} | ${provider.findings.length} |`).join("\n");
const reviewRows = reviewRecords.map((review) => `| ${review.context} | ${review.contractCount} | ${review.status} / ${review.decision} | ${review.reviewer} | ${review.binding} | ${review.reviewedSetHash} |`).join("\n");
const findingRows = providerRecords[0].findings.map((finding) => `- \`${finding.name}\` (${finding.tableId}; ${finding.kind}) — ${finding.projection}.`).join("\n") || "- None.";
const markdown = `# MAATAA Global Schema Readiness Proof\n\n` +
  `Generated deterministically by \`fused-organism/packages/domain-registry/scripts/generate-global-schema-proof.mjs\`.\n\n` +
  `## Result\n\n- Schema lifecycle: **CANONICAL**\n- Schema readiness: **SCHEMA_READY**\n- Contracts: **${coverage.counts.complete}/352 complete**\n- Duplicate IDs: **${duplicateIds.length}**\n- Foreign-key closure: **PASS**\n- Relation closure: **PASS**\n- Contract-set SHA-256: \`${contractSetHash}\`\n- Logical-schema SHA-256: \`${logical.schemaHash}\`\n- Registry hash: \`${manifest.integrity.registryHash}\`\n- Source commit: \`${gitHead.output}\` (${gitBranch.output}; worktree ${gitDirty ? `dirty: ${trackedChangeCount} tracked changes, ${untrackedFileCount} untracked files` : "clean"})\n\n` +
  `## Provider previews\n\n| Provider | Validation | Schema SHA-256 | Deferred logical findings |\n|---|---|---|---:|\n${providerRows}\n\n` +
  `Prisma validation confirms each generated schema is syntactically and structurally valid for its Prisma provider. It does not prove runtime database behavior or implement the deferred invariants below.\n\n` +
  `## Provider findings\n\n${findingRows}\n\n` +
  `## Review evidence\n\n- Status: **approval evidence verified for all ${reviewRecords.length} canonical contexts**.\n- Review artifacts use different binding scopes; the table labels the scope and the recorded reviewed-set or bundle SHA-256.\n\n| Context | Contracts | Decision | Reviewer | Binding scope | Reviewed-set / bundle SHA-256 |\n|---|---:|---|---|---|---|\n${reviewRows}\n\n` +
  `## Validation\n\n- Registry tests: **${testSummary[2]}/${testSummary[1]} passed**.\n- Registry integrity: **PASS**.\n${registrySummary.map((line) => `- ${line}`).join("\n")}\n- \`git diff --check\` (tracked diff): **PASS**.\n- Proof generator syntax: **PASS**.\n\n` +
  `## Authorization boundary\n\nSchema readiness is **PASS**. Migration approval: **NOT GRANTED**. Deployment approval: **NOT GRANTED**. No migration or deployment was executed.\n`;

await mkdir(proofRoot, { recursive: true });
await writeFile(path.join(proofRoot, "global-schema-release-proof.json"), `${JSON.stringify(proof, null, 2)}\n`);
await writeFile(path.join(proofRoot, "global-schema-release-proof.md"), markdown);
console.log(JSON.stringify({ status: "SCHEMA_PROOF_GENERATED", json: "fused-organism/certification/global-schema-release-proof.json", markdown: "fused-organism/certification/global-schema-release-proof.md", contractSetHash, logicalSchemaHash: logical.schemaHash, tests: `${testSummary[2]}/${testSummary[1]}`, registryValidation: "PASS" }, null, 2));
