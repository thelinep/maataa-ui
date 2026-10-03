import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const contractPath = path.join(root, "apps/tlps-application/api-contracts/spatial-preview.v1.draft.json");
const validatorPath = path.join(root, "packages/api-contract/scripts/validate.mjs");
const loadContract = async () => JSON.parse(await readFile(contractPath, "utf8"));
const validate = (file) => spawnSync(process.execPath, [validatorPath, file, "--json"], { cwd: root, encoding: "utf8" });

test("frozen spatial contract validates deterministically against canonical source registries", async () => {
  const first = validate(contractPath);
  const second = validate(contractPath);
  assert.equal(first.status, 0, first.stderr || first.stdout);
  assert.equal(second.status, 0, second.stderr || second.stdout);
  const a = JSON.parse(first.stdout);
  const b = JSON.parse(second.stdout);
  assert.equal(a.validation, "VALIDATED_LOCAL_API_CONTRACT");
  assert.equal(a.contractSetSha256, b.contractSetSha256);
  assert.deepEqual(a.localBlockers, []);
  assert.deepEqual(a.externalBlockers.map(({ class: category }) => category).sort(), ["ENVIRONMENT", "IDENTITY", "REAL_HOST"]);
  assert.ok(a.sourceHashChecks.every(({ matches }) => matches));
});

test("validator rejects duplicate operation ids and unsafe lifecycle claims", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "maataa-api-contract-"));
  try {
    const contract = await loadContract();
    contract.operations[1].id = contract.operations[0].id;
    contract.claims.productionRuntimeExists = true;
    const mutatedPath = path.join(directory, "invalid.json");
    await writeFile(mutatedPath, JSON.stringify(contract));
    const result = validate(mutatedPath);
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout);
    assert.equal(report.validation, "INVALID");
    assert.ok(report.findings.some((finding) => /duplicate operation IDs/.test(finding)));
    assert.ok(report.findings.some((finding) => /must not imply production/.test(finding)));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("validator rejects unknown canonical tables, unresolved permission codes, and client-set version", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "maataa-api-contract-"));
  try {
    const contract = await loadContract();
    contract.sourceBindings.tableContracts.push({ id: "eventsspatial.not_a_canonical_table", source: "packages/domain-registry/data/table-contracts.json" });
    contract.operations[0].reads.push("eventsspatial.not_a_canonical_table");
    contract.operations[0].permission = "spatial.layout.publish";
    contract.operations[3].request.body.version_number = { type: "integer", required: false };
    const mutatedPath = path.join(directory, "invalid.json");
    await writeFile(mutatedPath, JSON.stringify(contract));
    const result = validate(mutatedPath);
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout);
    assert.ok(report.findings.some((finding) => /noncanonical table/.test(finding)));
    assert.ok(report.findings.some((finding) => /undeclared permission/.test(finding)));
    assert.ok(report.findings.some((finding) => /additionalProperties|version_number/.test(finding)));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
