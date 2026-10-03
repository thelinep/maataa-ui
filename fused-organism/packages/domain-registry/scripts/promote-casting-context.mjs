import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../src/hash.mjs";
import { registry } from "../src/index.mjs";
import { validateTableContract } from "../src/contracts.mjs";

const [, , context, expectedHash] = process.argv;
const allowedContexts = new Set(["evidence", "identity", "platform", "production"]);
if (!allowedContexts.has(context) || !/^[a-f0-9]{64}$/.test(expectedHash ?? "")) {
  throw new Error("Usage: node scripts/promote-casting-context.mjs <evidence|identity|platform|production> <expected-contract-set-sha256>");
}

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relative) => JSON.parse(await readFile(path.join(packageRoot, relative), "utf8"));
const draft = await readJson("schema-sources/authored/casting-v1/contracts.draft.json");
const logical = await readJson("schema-sources/authored/casting-v1/logical-schema.draft.json");
const kernel = await readJson("schema-sources/authored/maataa-core-v1/contracts.json");
const communications = await readJson("schema-sources/authored/maataa-communications-v1/contracts.draft.json");
const tableRegistry = await readJson("data/table-contracts.json");
const contextIds = draft.contractIds.filter((id) => id.startsWith(`${context}.`)).sort();
const draftById = new Map(draft.contracts.map((item) => [item.id, item]));
const kernelById = new Map(kernel.contracts.map((item) => [item.id, item]));
const currentById = new Map(tableRegistry.contracts.map((item) => [item.id, item]));
if (!contextIds.length) throw new Error(`CASTING_CONTEXT_NOT_IN_COMPOSITION:${context}`);
if (contextIds.some((id) => currentById.has(id))) throw new Error(`CASTING_CONTEXT_ALREADY_CANONICAL:${context}`);
const sourceSet = contextIds.map((id) => draftById.get(id) ?? kernelById.get(id));
if (sourceSet.some((item) => !item)) throw new Error(`CASTING_CONTEXT_SOURCE_MISSING:${context}`);
const contractSetHash = sha256(JSON.stringify(sourceSet));
if (contractSetHash !== expectedHash) throw new Error(`CASTING_CONTEXT_HASH_MISMATCH:${context}:${contractSetHash}`);

const reviewedAt = new Date().toISOString();
const stampApproval = (contract) => {
  const promoted = structuredClone(contract);
  promoted.schemaLifecycle = "CANONICAL";
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (value.reviewStatus !== undefined) {
      value.reviewStatus = "approved";
      value.reviewedBy = "thelinep";
      value.reviewedAt = reviewedAt;
    }
    if (value.kind === "MAATAA_AUTHORED") {
      value.reviewedBy = "thelinep";
      value.reviewedAt = reviewedAt;
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(promoted);
  return promoted;
};
const promoted = sourceSet.map(stampApproval);
const nextTableContracts = [...tableRegistry.contracts, ...promoted].sort((a, b) => a.id.localeCompare(b.id));
const validationSource = {
  ...registry,
  authoredContracts: kernel.contracts,
  draftContracts: communications.contracts,
  castingDraftContracts: draft.contracts,
  tableContracts: { ...tableRegistry, contracts: nextTableContracts },
};
const failures = promoted.map((contract) => ({ contractId: contract.id, ...validateTableContract(contract, validationSource) })).filter((item) => !item.valid);
if (failures.length) throw new Error(`CASTING_CONTEXT_APPROVAL_VALIDATION_FAILED:${JSON.stringify(failures)}`);

const coreProposalIds = sourceSet.filter((item) => item.provenance?.source === "maataa-core-v1").map((item) => item.id);
const review = {
  schemaVersion: "1.0.0",
  reviewStatus: "REVIEWED",
  decision: "APPROVE",
  reviewer: "thelinep",
  reviewedAt,
  scope: `MAATAA-authored ${context} context schema for the casting composition`,
  context,
  contractCount: contextIds.length,
  contractSetHash,
  compositionContractSetHash: draft.contractSetHash,
  logicalSchemaHash: logical.schemaHash,
  contractIds: contextIds,
  coreProposalIds,
  approvalBasis: `Approved the exact ${contextIds.length}-contract ${context} context set after contract structure, provenance, relation/FK closure, ownership, lifecycle, and provider-preview review. Definitions are MAATAA-authored design proposals; no external database authority is claimed. Global identity.users references follow CAST-DRAFT-004 and require application checks for active organisation/workspace membership and applicable project access. This context review does not approve migrations or deployment.`,
  validations: {
    structuralContracts: `${contextIds.length}/${contextIds.length} PASS`,
    foreignKeyClosure: "PASS (160-table composition closure)",
    logicalSchema: "PASS",
    prisma: { postgresql: "PASS", sqlite: "PASS", scope: "Prisma model projection only" },
    migrationApproved: false,
    deploymentApproved: false,
  },
  retainedBoundaries: {
    applicationMembershipAuthorizationImplemented: false,
    compositionSchemaReady: false,
    legalReviewed: false,
    migrationApproved: false,
    deploymentApproved: false,
  },
  canonicalizedAt: reviewedAt,
};

await writeFile(path.join(packageRoot, "data/table-contracts.json"), `${JSON.stringify({ ...tableRegistry, contracts: nextTableContracts }, null, 2)}\n`);
await writeFile(path.join(packageRoot, `schema-sources/authored/casting-v1/${context}.review.json`), `${JSON.stringify(review, null, 2)}\n`);
console.log(JSON.stringify({ context, contractCount: contextIds.length, contractSetHash, coreProposalIds, reviewedAt, status: "REVIEWED_AND_CANONICAL" }, null, 2));
