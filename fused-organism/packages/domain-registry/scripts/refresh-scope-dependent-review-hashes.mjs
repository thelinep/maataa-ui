import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../src/hash.mjs";
import { registry } from "../src/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const writeJson = async (relative, value) => writeFile(path.join(root, relative), `${JSON.stringify(value, null, 2)}\n`);
const refreshedAt = new Date().toISOString();
const reviewer = "thelinep";
const amendmentId = "organisation-scope-integrity-v1.2.0";

const casting = await readJson("schema-sources/authored/casting-v1/contracts.draft.json");
for (const context of ["evidence", "identity", "people", "platform", "production", "project"]) {
  const relative = `schema-sources/authored/casting-v1/${context}.review.json`;
  const review = await readJson(relative);
  const previous = { contractSetHash: review.compositionContractSetHash, logicalSchemaHash: review.logicalSchemaHash };
  review.compositionContractSetHash = casting.contractSetHash;
  review.logicalSchemaHash = casting.readiness.logicalSchemaHash;
  review.hashRefresh = { amendmentId, reviewer, refreshedAt, previous, current: { contractSetHash: review.compositionContractSetHash, logicalSchemaHash: review.logicalSchemaHash } };
  await writeJson(relative, review);
}

const communications = await readJson("schema-sources/authored/maataa-communications-v1/contracts.draft.json");
const communicationsReviewPath = "schema-sources/authored/maataa-communications-v1/contracts.review.json";
const communicationsReview = await readJson(communicationsReviewPath);
const contractMap = new Map(registry.tableContracts.contracts.map((contract) => [contract.id, contract]));
for (const contract of communications.contracts) contractMap.set(contract.id, contract);
const closureIds = [...communications.readiness.closureTableIds].sort();
const closureContracts = closureIds.map((id) => {
  const contract = contractMap.get(id);
  if (!contract) throw new Error(`REVIEW_CLOSURE_CONTRACT_MISSING:${id}`);
  return contract;
});
const previous = { logicalSchemaHash: communicationsReview.logicalSchemaHash, dependencyClosureContractSetHash: communicationsReview.dependencyClosureContractSetHash ?? null };
communicationsReview.logicalSchemaHash = communications.readiness.logicalSchemaHash;
communicationsReview.dependencyClosureContractSetHash = sha256(closureContracts);
communicationsReview.hashRefresh = {
  amendmentId,
  reviewer,
  refreshedAt,
  previous,
  current: { logicalSchemaHash: communicationsReview.logicalSchemaHash, dependencyClosureContractSetHash: communicationsReview.dependencyClosureContractSetHash },
};
await writeJson(communicationsReviewPath, communicationsReview);

console.log(JSON.stringify({
  status: "REFRESHED",
  castingContractSetHash: casting.contractSetHash,
  castingLogicalSchemaHash: casting.readiness.logicalSchemaHash,
  refreshedContextReviews: ["evidence", "identity", "people", "platform", "production", "project"],
  communicationsLogicalSchemaHash: communicationsReview.logicalSchemaHash,
  communicationsDependencyClosureContractSetHash: communicationsReview.dependencyClosureContractSetHash,
}, null, 2));
