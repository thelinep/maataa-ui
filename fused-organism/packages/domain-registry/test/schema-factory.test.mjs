import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../src/hash.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const contexts = [
  ["creative", 20], ["logistics", 26], ["campaign", 22], ["marketplace", 22], ["finance", 22],
  ["investor", 21], ["eventsSpatial", 25], ["intelligence", 22], ["public", 12],
];

test("schema factory canonical contracts bind to reviewed DRAFT hashes and keep deployment gates closed", async () => {
  const allIds = new Set();
  const allDraftContracts = [];
  for (const [context, expectedCount] of contexts) {
    const base = `schema-sources/authored/schema-factory-v1/${context}`;
    const draft = await readJson(`${base}/contracts.draft.json`);
    const review = await readJson(`${base}/contracts.review.json`);
    assert.equal(draft.schemaLifecycle, "DRAFT");
    assert.equal(draft.contracts.length, expectedCount);
    assert.equal(draft.contractSetHash, sha256(draft.contracts));
    assert.equal(review.reviewStatus, "REVIEWED");
    assert.equal(review.decision, "APPROVE");
    assert.equal(review.reviewer, "thelinep");
    assert.ok(review.reviewedAt);
    assert.equal(review.draftContractSetHash, sha256(draft.contracts));
    assert.equal(draft.readiness.fkClosure, "PASS");
    assert.equal(draft.readiness.postgresqlPreviewValid, true);
    assert.equal(draft.readiness.sqlitePreviewValid, true);
    assert.equal(draft.readiness.schemaReady, true);
    const canonicalized = await readJson(`${base}/contracts.canonicalized.json`);
    assert.equal(canonicalized.schemaLifecycle, "CANONICAL");
    assert.equal(canonicalized.contractSetHash, review.contractSetHash);
    assert.equal(canonicalized.contracts.length, expectedCount);
    for (const contract of draft.contracts) {
      assert.equal(contract.schemaLifecycle, "DRAFT");
      assert.equal(contract.provenance.kind, "MAATAA_AUTHORED");
      assert.ok(!allIds.has(contract.id), `duplicate draft contract ${contract.id}`);
      allIds.add(contract.id);
      allDraftContracts.push(contract);
    }
    assert.equal(sha256(canonicalized.contracts), review.contractSetHash);
    assert.ok(canonicalized.contracts.every((contract) => contract.schemaLifecycle === "CANONICAL" && contract.provenance.reviewedBy === "thelinep"));
    for (const provider of ["postgresql", "sqlite"]) {
      const metadata = await readJson(`${base}/prisma-preview.${provider}.canonical.metadata.json`);
      assert.equal(metadata.validationStatus, "PASS");
      assert.equal(metadata.schemaLifecycle, "CANONICAL");
      assert.equal(metadata.deployable, false);
      assert.equal(metadata.migrationExecutable, false);
    }
  }
  assert.equal(allIds.size, 192);

  const registry = await readJson("data/table-contracts.json");
  const catalog = await readJson("data/domain-catalog.json");
  assert.equal(registry.contracts.length, 352);
  assert.deepEqual(registry.contracts.map((contract) => contract.id).sort(), catalog.tables.map((table) => table.id).sort());
  assert.equal(new Set(registry.contracts.map((contract) => contract.id)).size, 352);
  assert.ok(registry.contracts.every((contract) => contract.provenance.reviewStatus === "approved" || contract.provenance.kind === "MAATAA_AUTHORED" && contract.provenance.reviewedBy === "thelinep"));
  assert.ok(registry.contracts.filter((contract) => allIds.has(contract.id)).every((contract) => contract.schemaLifecycle === "CANONICAL"));
  const global = await readJson("schema-sources/authored/schema-factory-v1/global/readiness.json");
  assert.equal(global.schemaLifecycle, "CANONICAL");
  assert.equal(global.status, "SCHEMA_READY");
  assert.equal(global.tableCount, 352);
  assert.equal(global.canonicalContractCount, 352);
  assert.equal(global.draftContractCount, 0);
  assert.equal(global.schemaReady, true);
  assert.equal(global.fkClosure, "PASS");
  assert.equal(global.relationClosure, "PASS");
  assert.equal(global.migrationApproved, false);
  assert.equal(global.deploymentApproved, false);
  assert.equal(global.contractSetHash, sha256(registry.contracts));
});
