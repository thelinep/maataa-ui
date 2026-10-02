import test from "node:test";
import assert from "node:assert/strict";
import sourceRegistry from "../schema-sources/registry.json" with { type: "json" };
import candidate from "../schema-sources/candidates/neroevents-postgres-migrations.json" with { type: "json" };
import { createSqlContractProposal } from "../src/sql-proposal.mjs";
import { registry, validateRegistry } from "../src/index.mjs";

test("schema source intake pins neroevents migrations as candidates with no canonical table mapping", () => {
  assert.deepEqual(sourceRegistry.records, ["./candidates/neroevents-postgres-migrations.json"]);
  assert.equal(candidate.classification, "CANDIDATE");
  assert.equal(candidate.adoptionDecision.status, "pending");
  assert.equal(candidate.files.length, 11);
  assert.equal(candidate.coverage.contexts.length, 0);
  assert.equal(candidate.coverage.canonicalTableIds.length, 0);
  assert.ok(candidate.files.every((file) => /^[a-f0-9]{40}$/.test(file.blobSha)));
});

test("source classification and adoption decision must agree before registry publication", () => {
  const promotedWithoutReview = structuredClone(candidate);
  promotedWithoutReview.classification = "AUTHORITATIVE";
  const findings = validateRegistry({ ...registry, schemaSources: { records: [promotedWithoutReview] } });
  assert.ok(findings.some((item) => item.code === "schema-source-invalid"));
});

test("SQL intake emits source-backed proposals without assigning canonical tables or logical relations", () => {
  const sql = `
    CREATE TABLE public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      display_name VARCHAR(120) NOT NULL DEFAULT 'now()',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE projects (
      id UUID PRIMARY KEY,
      owner_id UUID NOT NULL,
      title TEXT NOT NULL,
      CONSTRAINT projects_owner_fk FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_projects_owner ON projects(owner_id);
  `;
  const proposal = createSqlContractProposal(sql, { sourceRecord: candidate, filePath: candidate.files[0].path });
  assert.equal(proposal.status, "CANDIDATE_SOURCE_PROPOSAL");
  assert.equal(proposal.requiresHumanReview, true);
  assert.deepEqual(proposal.tables.map((table) => table.sourceTable), ["public.users", "projects"]);
  const users = proposal.tables[0];
  assert.equal(users.canonicalTableId, null);
  assert.equal(users.fields.display_name.defaultLiteral, "now()");
  assert.deepEqual(users.fields.created_at.defaultExpression, { kind: "current-timestamp" });
  assert.deepEqual(users.relations, []);
  const projects = proposal.tables[1];
  assert.equal(projects.foreignKeys[0].references, "public.users");
  assert.equal(projects.foreignKeys[0].onDelete, "cascade");
  assert.equal(projects.foreignKeys[0].onUpdate, "no-action");
  assert.deepEqual(projects.relations, [], "physical FKs are not promoted into logical navigation relations");
  assert.equal(projects.indexes[0].fields[0], "owner_id");
  assert.equal(proposal.completeness[0].missing.includes("canonical table mapping"), true);
});

test("SQL intake preserves unsupported migration statements as blockers instead of silently dropping them", () => {
  const proposal = createSqlContractProposal("CREATE TABLE audit_log (id UUID PRIMARY KEY, value TEXT CHECK (length(value) > 0)); CREATE EXTENSION vector;", { sourceRecord: candidate, filePath: candidate.files[0].path });
  assert.ok(proposal.diagnostics.some((item) => item.code === "SQL_STATEMENT_UNSUPPORTED"));
  assert.ok(proposal.diagnostics.some((item) => item.code === "SQL_CHECK_CONSTRAINT_REVIEW_REQUIRED"));
  assert.equal(proposal.status, "CANDIDATE_SOURCE_PROPOSAL");
});

test("candidate source proposals remain candidate even when SQL parses cleanly", () => {
  const proposal = createSqlContractProposal("CREATE TABLE valid_shape (id UUID PRIMARY KEY);", { sourceRecord: candidate });
  assert.equal(proposal.status, "CANDIDATE_SOURCE_PROPOSAL");
  assert.equal(proposal.tables[0].sourceMappingStatus, "UNMAPPED");
});
