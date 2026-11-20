import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../src/hash.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(packageRoot, "schema-sources/authored/maataa-communications-v1");
const draft = JSON.parse(await readFile(path.join(sourceRoot, "contracts.draft.json"), "utf8"));
const planPath = path.join(sourceRoot, "provider-enforcement-plan.json");
const plan = JSON.parse(await readFile(planPath, "utf8"));
const postgresPath = path.join(sourceRoot, "provider-enforcement.postgresql.sql");
const sqlitePath = path.join(sourceRoot, "provider-enforcement.sqlite.sql");
const postgresSql = await readFile(postgresPath, "utf8");
const sqliteSql = await readFile(sqlitePath, "utf8");
assert.equal(draft.contractSetHash, plan.contractSetHash, "provider plan must bind the exact Communications contract hash");
assert.equal(plan.decision.reviewStatus, "approved");
assert.equal(plan.migrationExecutionApproved, false);
assert.equal(plan.deploymentApproved, false);
const migrationPreviews = {};
for (const provider of ["postgresql", "sqlite"]) {
  const sqlPath = path.join(sourceRoot, `migration-preview.${provider}.draft.sql`);
  const metadataPath = path.join(sourceRoot, `migration-preview.${provider}.draft.metadata.json`);
  const sql = await readFile(sqlPath, "utf8");
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  assert.equal(metadata.schemaLifecycle, "DRAFT");
  assert.equal(metadata.contractSetHash, draft.contractSetHash);
  assert.equal(metadata.migrationApproved, false);
  assert.equal(metadata.deploymentApproved, false);
  assert.equal(metadata.sqlSha256, sha256(sql));
  migrationPreviews[provider] = { file: path.basename(sqlPath), sha256: metadata.sqlSha256, valid: true };
}

const requiredPostgres = [
  '"ck_communications_announcements_audience_scope"',
  '"ck_communications_direct_message_pair_order"',
  '"uq_communications_thread_members_active_episode"',
  '"enforce_communications_direct_message_parent"',
  '"enforce_communications_thread_membership_episode"',
  "parent.\"kind\" = 'direct'",
  '"left_at" IS NULL',
];
const requiredSqlite = [
  '"trg_communications_announcements_audience_scope_insert"',
  '"trg_communications_announcements_audience_scope_update"',
  '"trg_communications_direct_message_pair_order_insert"',
  '"trg_communications_direct_message_pair_order_update"',
  '"trg_communications_direct_message_parent_insert"',
  '"trg_communications_direct_message_parent_update"',
  '"trg_communications_direct_thread_kind_update"',
  '"trg_communications_thread_membership_episode_update"',
  '"uq_communications_thread_members_active_episode"',
  '"left_at" IS NULL',
];
for (const term of requiredPostgres) assert.ok(postgresSql.includes(term), `PostgreSQL overlay is missing ${term}`);
for (const term of requiredSqlite) assert.ok(sqliteSql.includes(term), `SQLite overlay is missing ${term}`);
for (const provider of ["postgresql", "sqlite"]) {
  const migrationSql = await readFile(path.join(sourceRoot, `migration-preview.${provider}.draft.sql`), "utf8");
  const overlay = provider === "postgresql" ? postgresSql : sqliteSql;
  assert.ok(migrationSql.includes(overlay.trim()), `${provider} migration preview must include its complete invariant overlay`);
  assert.ok(migrationSql.startsWith(`-- DRAFT PREVIEW ONLY · provider=${provider} · contractSetHash=${draft.contractSetHash}`));
}

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE "communications_announcements" ("audience_kind" TEXT NOT NULL, "workspace_id" TEXT);
  CREATE TABLE "communications_communication_threads" ("organisation_id" TEXT NOT NULL, "id" TEXT NOT NULL, "workspace_id" TEXT, "kind" TEXT NOT NULL);
  CREATE TABLE "communications_direct_message_threads" (
    "organisation_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "participant_low_membership_id" TEXT NOT NULL,
    "participant_high_membership_id" TEXT NOT NULL
  );
  CREATE TABLE "communications_thread_members" (
    "organisation_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "workspace_membership_id" TEXT NOT NULL,
    "joined_at" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "left_at" TEXT
  );
`);
db.exec(sqliteSql);
const insertAnnouncement = db.prepare(`INSERT INTO "communications_announcements" ("audience_kind", "workspace_id") VALUES (?, ?)`);
insertAnnouncement.run("ORGANISATION", null);
insertAnnouncement.run("WORKSPACE", "workspace-1");
assert.throws(() => insertAnnouncement.run("ORGANISATION", "workspace-1"), /audience must match workspace scope/);
assert.throws(() => insertAnnouncement.run("WORKSPACE", null), /audience must match workspace scope/);
const ids = ["00000000-0000-4000-8000-000000000001", "00000000-0000-4000-8000-000000000002"];
db.prepare(`INSERT INTO "communications_communication_threads" VALUES (?, ?, ?, ?)`)
  .run("org-1", "thread-direct", "workspace-1", "direct");
db.prepare(`INSERT INTO "communications_communication_threads" VALUES (?, ?, ?, ?)`)
  .run("org-1", "thread-group", "workspace-1", "group");
const insertDirectMessage = db.prepare(`INSERT INTO "communications_direct_message_threads" VALUES (?, ?, ?, ?, ?)`);
insertDirectMessage.run("org-1", "thread-direct", "workspace-1", ...ids);
assert.throws(() => insertDirectMessage.run("org-1", "thread-direct", "workspace-1", ids[1], ids[0]), /membership IDs must be strictly ordered/);
assert.throws(() => insertDirectMessage.run("org-1", "thread-direct", "workspace-1", ids[0], ids[0].toUpperCase()), /membership IDs must be strictly ordered/);
assert.throws(() => insertDirectMessage.run("org-1", "thread-direct", "workspace-1", "not-a-uuid", ids[1]), /membership IDs must be strictly ordered/);
assert.throws(() => insertDirectMessage.run("org-1", "thread-group", "workspace-1", ...ids), /must reference a direct thread/);
assert.throws(() => insertDirectMessage.run("org-1", "thread-direct", "workspace-2", ...ids), /must reference a direct thread/);
assert.throws(() => db.prepare(`UPDATE "communications_communication_threads" SET "kind" = 'group' WHERE "id" = 'thread-direct'`).run(), /must remain direct/);
const insertMembership = db.prepare(`INSERT INTO "communications_thread_members" ("organisation_id", "workspace_id", "thread_id", "workspace_membership_id", "joined_at", "created_at", "left_at") VALUES (?, ?, ?, ?, ?, ?, ?)`);
const key = ["org-1", "workspace-1", "thread-1", "member-1"];
const insertEpisode = (leftAt) => insertMembership.run(...key, "2026-01-01T00:00:00Z", "2026-01-01T00:00:00Z", leftAt);
insertEpisode(null);
assert.throws(() => insertEpisode(null), /UNIQUE constraint failed/);
insertEpisode("2026-01-01T00:00:00Z");
db.prepare(`UPDATE "communications_thread_members" SET "left_at" = ? WHERE "organisation_id" = ? AND "workspace_id" = ? AND "thread_id" = ? AND "workspace_membership_id" = ? AND "left_at" IS NULL`).run("2026-02-01T00:00:00Z", ...key);
assert.throws(() => db.prepare(`UPDATE "communications_thread_members" SET "left_at" = NULL WHERE "organisation_id" = ? AND "workspace_id" = ? AND "thread_id" = ? AND "workspace_membership_id" = ? AND "left_at" IS NOT NULL`).run(...key), /ended episodes cannot be reopened/);
assert.throws(() => db.prepare(`UPDATE "communications_thread_members" SET "thread_id" = 'thread-2' WHERE "organisation_id" = ? AND "workspace_id" = ? AND "thread_id" = ? AND "workspace_membership_id" = ?`).run(...key), /episode identity is immutable/);
insertEpisode(null);
db.close();

const files = [postgresPath, sqlitePath];
const planHashMaterial = [];
for (const file of files) planHashMaterial.push(`${path.basename(file)}\0${sha256(await readFile(file, "utf8"))}\n`);
plan.providerArtifactHash = sha256(planHashMaterial.join(""));
plan.validation = {
  ...plan.validation,
  sqliteBehavioralChecks: "PASS",
  migrationPreviews,
  sqliteTestCases: [
    "organisation/workspace announcement audience correspondence",
    "strictly ordered and syntactically valid UUID pair",
    "single active thread membership episode while ended history and rejoin are allowed",
  ],
  postgresqlProjectionReview: "PASS_STATIC_REVIEW",
};
await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);
console.log(JSON.stringify({ context: "communications", contractSetHash: draft.contractSetHash, providerArtifactHash: plan.providerArtifactHash, sqliteBehavioralChecks: "PASS", postgresqlProjectionReview: "PASS_STATIC_REVIEW", migrationExecutionApproved: false, deploymentApproved: false }, null, 2));
