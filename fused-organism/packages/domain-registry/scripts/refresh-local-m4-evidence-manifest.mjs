import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../../..");
const migrationRoot = path.join(packageRoot, "migration-readiness");
const diffRoot = path.join(migrationRoot, "target-diffs/local-development");
const recoveryRoot = path.join(migrationRoot, "recovery-rehearsals");
const digest = (value) => createHash("sha256").update(value).digest("hex");
const fileRecord = async (absolutePath, relativeTo = packageRoot) => ({
  path: path.relative(relativeTo, absolutePath),
  sha256: digest(await readFile(absolutePath)),
});

const files = (await readdir(diffRoot)).filter((name) => name.endsWith(".json")).sort();
if (files.length !== 3) throw new Error(`EXPECTED_THREE_LOCAL_TARGET_DIFF_METADATA_FILES:${files.length}`);
const localTargets = [];
for (const name of files) {
  const metadataPath = path.join(diffRoot, name);
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  const sqlPath = path.join(diffRoot, metadata.diff.sqlFile);
  if (metadata.diff.sqlSha256 !== digest(await readFile(sqlPath))) throw new Error(`LOCAL_DIFF_HASH_MISMATCH:${name}`);
  localTargets.push({
    targetId: metadata.target.databaseTargetId,
    status: metadata.status,
    databaseSha256: metadata.target.databaseSha256Before,
    sql: await fileRecord(sqlPath),
    metadata: await fileRecord(metadataPath),
  });
}

const recoveryFiles = (await readdir(recoveryRoot)).filter((name) => name.endsWith(".json")).sort();
if (!recoveryFiles.length) throw new Error("NO_LOCAL_RECOVERY_REHEARSAL_REPORT");
const recoveryPath = path.join(recoveryRoot, recoveryFiles.at(-1));
const recovery = JSON.parse(await readFile(recoveryPath, "utf8"));
const backups = [];
for (const target of recovery.targets) {
  const backupPath = path.resolve(repoRoot, target.backup.path);
  if (target.backup.sha256 !== digest(await readFile(backupPath))) throw new Error(`BACKUP_HASH_MISMATCH:${target.target.databaseTargetId}`);
  backups.push({ targetId: target.target.databaseTargetId, ...(await fileRecord(backupPath, repoRoot)) });
}

const manifest = {
  schemaVersion: "1.0.0",
  status: "LOCAL_EVIDENCE_HASHES_VERIFIED",
  scope: "Three local SQLite fixtures only; no non-local migration/deployment approval.",
  recoveryReport: await fileRecord(recoveryPath),
  backups,
  localTargetDiffs: localTargets,
  approvalStates: { migrationPlanReview: "NOT_READY_FOR_TARGET_BOUND_REVIEW", migrationExecution: "NOT_GRANTED", deployment: "NOT_GRANTED_NO_RELEASE_ARTIFACT_OR_TARGET" },
};
const manifestPath = path.join(migrationRoot, "local-evidence-manifest.json");
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
await writeFile(manifestPath, manifestText);
const manifestHash = digest(manifestText);
const reportPath = path.join(migrationRoot, "M4-READINESS-REPORT.json");
const report = JSON.parse(await readFile(reportPath, "utf8"));
report.localEvidenceManifest = { path: "local-evidence-manifest.json", sha256: manifestHash, status: manifest.status };
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
const checksumPath = path.join(migrationRoot, "M4-READINESS-SHA256.txt");
const names = (await readdir(migrationRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name !== "M4-READINESS-SHA256.txt")
  .map((entry) => entry.name)
  .sort();
const checksumRows = [];
for (const name of names) checksumRows.push(`${digest(await readFile(path.join(migrationRoot, name)))}  ${name}`);
await writeFile(checksumPath, `${checksumRows.join("\n")}\n`);
console.log(JSON.stringify({ status: manifest.status, path: path.relative(packageRoot, manifestPath), sha256: manifestHash, targetDiffs: localTargets.length, backupArtifacts: backups.length, approvals: manifest.approvalStates }, null, 2));
