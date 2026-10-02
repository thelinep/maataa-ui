import test from "node:test";
import assert from "node:assert/strict";
import sourceRegistry from "../schema-sources/registry.json" with { type: "json" };
import candidate from "../schema-sources/candidates/neroevents-postgres-migrations.json" with { type: "json" };
import maataaCommunicationsAuthority from "../schema-sources/approved/maataa-communications-v1.json" with { type: "json" };
import communicationsSource from "../schema-sources/authored/maataa-communications-v1/source.json" with { type: "json" };
import communicationsSchema from "../schema-sources/authored/maataa-communications-v1/communications-schema.json" with { type: "json" };
import communicationsReview from "../schema-sources/authored/maataa-communications-v1/review.json" with { type: "json" };
import communicationsDecisions from "../schema-sources/authored/maataa-communications-v1/decisions.json" with { type: "json" };
import { createSqlContractProposal } from "../src/sql-proposal.mjs";
import { registry, validateRegistry } from "../src/index.mjs";

test("schema source intake pins neroevents migrations as candidates with no canonical table mapping", () => {
  assert.deepEqual(sourceRegistry.records, ["./candidates/neroevents-postgres-migrations.json", "./approved/maataa-communications-v1.json"]);
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

test("reviewed MAATAA Communications source records all twelve decisions without promoting contracts", () => {
  const tableIds = registry.domains.tables.filter((item) => item.context === "communications").map((item) => item.id).sort();
  assert.equal(communicationsSource.status, "REVIEWED_UNPINNED");
  assert.equal(communicationsSource.authority, "REVIEWED_MAATAA_SOURCE_PENDING_AUTHORITY_PIN");
  assert.equal(communicationsSource.sourceKind, "json-schema");
  assert.equal(communicationsSource.repository.pinStatus, "PENDING_SECOND_AUTHORITY_REGISTRY_COMMIT");
  assert.deepEqual([...communicationsSource.scope.canonicalTableIds].sort(), tableIds);
  assert.equal(communicationsSchema.oneOf.length, 9, "reviewed source schema must describe the nine scoped row shapes");
  assert.equal(communicationsSchema["x-maataa-source"].contractGenerationAllowed, false, "source approval is not canonical contract promotion");
  assert.equal(communicationsReview.reviewStatus, "APPROVED");
  assert.equal(communicationsReview.assignedReviewer, "thelinep");
  assert.equal(communicationsReview.decisionItems.length, 12);
  assert.ok(communicationsReview.decisionItems.every((item) => item.status === "REVIEWED_APPROVED" && ["APPROVE", "APPROVE_WITH_SCOPE"].includes(item.reviewDecision) && item.rationale));
  assert.deepEqual(communicationsDecisions.decisionGroups.map((item) => item.id), communicationsReview.decisionItems.map((item) => item.id));
  assert.ok(communicationsDecisions.decisionGroups.every((item) => item.status === "REVIEWED_APPROVED" && item.reviewedBy === "thelinep"));
  assert.equal(communicationsDecisions.status, "REVIEWED_APPROVED_PENDING_PIN");
  assert.equal(communicationsDecisions.authority, "MAATAA_AUTHORED_REVIEWED_SOURCE_PENDING_PIN");
  assert.equal(communicationsDecisions.contractGenerationAllowed, false);
  assert.deepEqual(communicationsDecisions.scope.sort(), tableIds);
  assert.deepEqual(communicationsDecisions.tables.map((item) => item.id).sort(), tableIds);
  assert.deepEqual(communicationsDecisions.retentionPolicies.map((item) => item.tableId).sort(), tableIds);
  assert.ok(communicationsDecisions.retentionPolicies.every((item) => item.status === "PRODUCT_DEFAULT_APPROVED_LEGAL_REVIEW_REQUIRED"));
  assert.match(communicationsDecisions.retentionRule.authorityBoundary, /not a statutory\/legal determination/);
  assert.match(communicationsReview.approvalRecord.exclusions.join(" "), /legal or statutory retention approval/);
  assert.equal(communicationsSchema["x-maataa-relational-decisions"].length, 9, "relational semantics accompany JSON record shapes");
  for (const table of communicationsDecisions.tables) {
    const shape = communicationsSchema.oneOf.find((item) => item.properties.tableId.const === table.id).properties.row;
    assert.deepEqual(Object.keys(shape.properties).sort(), Object.keys(table.fields).sort(), `${table.id} schema fields match reviewed decisions`);
    assert.deepEqual(shape.required.sort(), Object.entries(table.fields).filter(([, field]) => !field.nullable).map(([field]) => field).sort());
    assert.ok(table.primaryKey.every((field) => table.fields[field]), `${table.id} has explicit key fields`);
  }
  assert.equal(registry.tableContracts.contracts.some((item) => item.context === "communications"), false, "review does not create canonical contracts");
  assert.equal(registry.schemaSources.records.some((item) => item.id === "maataa-communications-v1"), true, "the approved source is published by the separate authority-registry commit");
  assert.equal(maataaCommunicationsAuthority.classification, "AUTHORITATIVE");
  assert.equal(maataaCommunicationsAuthority.adoptionDecision.status, "adopted");
  assert.equal(maataaCommunicationsAuthority.repository.commitSha, "2f3d8b4fa8abcc3cd1576efffb84809b7634e3e2");
  assert.equal(maataaCommunicationsAuthority.files.length, 6);
  assert.ok(maataaCommunicationsAuthority.files.every((file) => /^[a-f0-9]{40}$/.test(file.blobSha)));
  assert.deepEqual(validateRegistry(registry).filter((item) => item.code === "schema-source-invalid"), []);
  assert.deepEqual(maataaCommunicationsAuthority.coverage.canonicalTableIds.sort(), tableIds);
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
