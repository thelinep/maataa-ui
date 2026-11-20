#!/usr/bin/env python3
"""Rehearse online backup and restore for the three local SQLite fixtures."""

from __future__ import annotations

import hashlib
import json
import sqlite3
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = ROOT.parents[2]
DATABASE_ROOT = REPOSITORY / "fused-organism/.local-dev/databases"
BACKUP_ROOT = REPOSITORY / "fused-organism/.local-dev/backups"
EVIDENCE_ROOT = ROOT / "migration-readiness/recovery-rehearsals"
TARGETS = ROOT / "migration-readiness/targets.json"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_json(path: Path):
    return json.loads(path.read_text())


def inventory(connection: sqlite3.Connection) -> dict:
    objects = connection.execute(
        "SELECT type, name, tbl_name, sql FROM sqlite_master "
        "WHERE name NOT LIKE 'sqlite_%' AND type IN ('table','index','trigger','view') "
        "ORDER BY type, name"
    ).fetchall()
    tables = [name for kind, name, _, _ in objects if kind == "table"]
    row_counts = {name: connection.execute(f'SELECT COUNT(*) FROM "{name}"').fetchone()[0] for name in tables}
    return {
        "objects": objects,
        "objectSha256": sha256(json.dumps(objects, separators=(",", ":"), ensure_ascii=False).encode()),
        "objectCounts": {kind: sum(1 for row in objects if row[0] == kind) for kind in ("table", "index", "trigger", "view")},
        "rowCounts": row_counts,
        "totalRows": sum(row_counts.values()),
        "integrityCheck": connection.execute("PRAGMA integrity_check").fetchone()[0],
        "foreignKeyCheckErrors": len(list(connection.execute("PRAGMA foreign_key_check"))),
    }


def main() -> None:
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    run_dir = BACKUP_ROOT / f"sqlite-recovery-{run_id}"
    if run_dir.exists():
        raise SystemExit(f"Refusing to overwrite recovery rehearsal: {run_dir}")
    run_dir.mkdir(parents=True)
    targets = read_json(TARGETS)["targets"]
    results = []

    for target in targets:
        if target.get("environmentKind") != "local" or target.get("provider") != "sqlite":
            continue
        owner = "shared" if target["applicationId"] == "shared-data-service" else target["applicationId"]
        source_path = DATABASE_ROOT / f"{owner}.db"
        baseline_path = REPOSITORY / target["schemaBaseline"]["uri"]
        source_before = source_path.read_bytes()
        source_hash = sha256(source_before)
        baseline = read_json(baseline_path)
        if source_hash != baseline["databaseSha256"]:
            raise SystemExit(f"Baseline hash mismatch for {target['databaseTargetId']}")

        source = sqlite3.connect(f"file:{source_path}?mode=ro", uri=True)
        try:
            source_inventory = inventory(source)
            if source_inventory["integrityCheck"] != "ok" or source_inventory["foreignKeyCheckErrors"]:
                raise SystemExit(f"Source integrity failed for {target['databaseTargetId']}")
            backup_path = run_dir / f"{owner}.sqlite.backup.db"
            backup_start = time.perf_counter()
            backup = sqlite3.connect(backup_path)
            try:
                source.backup(backup)
                backup.commit()
            finally:
                backup.close()
            backup_seconds = time.perf_counter() - backup_start

            backup_connection = sqlite3.connect(f"file:{backup_path}?mode=ro", uri=True)
            try:
                backup_inventory = inventory(backup_connection)
            finally:
                backup_connection.close()

            restore_start = time.perf_counter()
            with tempfile.TemporaryDirectory(prefix=f"{owner}-restore-") as restore_dir:
                restored_path = Path(restore_dir) / f"{owner}.restored.db"
                restored = sqlite3.connect(restored_path)
                backup_source = sqlite3.connect(f"file:{backup_path}?mode=ro", uri=True)
                try:
                    backup_source.backup(restored)
                    restored.commit()
                finally:
                    backup_source.close()
                    restored.close()
                restored_connection = sqlite3.connect(f"file:{restored_path}?mode=ro", uri=True)
                try:
                    restored_inventory = inventory(restored_connection)
                finally:
                    restored_connection.close()
            restore_seconds = time.perf_counter() - restore_start

            source_after = source_path.read_bytes()
            if sha256(source_after) != source_hash:
                raise SystemExit(f"Source changed during read-only backup for {target['databaseTargetId']}")
            if backup_inventory != source_inventory or restored_inventory != source_inventory:
                raise SystemExit(f"Restore comparison failed for {target['databaseTargetId']}")

            results.append({
                "target": {
                    "applicationId": target["applicationId"],
                    "environmentId": target["environmentId"],
                    "databaseTargetId": target["databaseTargetId"],
                    "provider": target["provider"],
                    "engineVersionDeclared": target["engineVersion"],
                    "engineVersionRuntime": sqlite3.sqlite_version,
                    "databasePath": str(source_path.relative_to(REPOSITORY)),
                    "baselineArtifact": str(baseline_path.relative_to(REPOSITORY)),
                    "baselineArtifactSha256": sha256(baseline_path.read_bytes()),
                    "databaseSha256BeforeAndAfter": source_hash,
                },
                "backup": {
                    "method": "Python sqlite3.Connection.backup (SQLite online backup API wrapper)",
                    "path": str(backup_path.relative_to(REPOSITORY)),
                    "sha256": sha256(backup_path.read_bytes()),
                    "bytes": backup_path.stat().st_size,
                    "durationSeconds": round(backup_seconds, 6),
                    "inventoryMatchesSource": backup_inventory == source_inventory,
                },
                "restore": {
                    "method": "SQLite backup API into an isolated temporary database",
                    "temporaryTargetRemovedAfterVerification": True,
                    "durationSeconds": round(restore_seconds, 6),
                    "inventoryMatchesSource": restored_inventory == source_inventory,
                    "objectSha256": restored_inventory["objectSha256"],
                    "objectCounts": restored_inventory["objectCounts"],
                    "totalRows": restored_inventory["totalRows"],
                    "integrityCheck": restored_inventory["integrityCheck"],
                    "foreignKeyCheckErrors": restored_inventory["foreignKeyCheckErrors"],
                },
                "recoveryBoundary": "Local SQLite fixture rehearsal only; does not prove production backup coverage, encryption/key recovery, RPO/RTO objectives, application restore, PostgreSQL recovery, or libSQL recovery.",
            })
        finally:
            source.close()

    if len(results) != 3:
        raise SystemExit(f"Expected three local SQLite targets; rehearsed {len(results)}")
    evidence = {
        "schemaVersion": "1.0.0",
        "rehearsalId": f"sqlite-local-recovery-{run_id}",
        "status": "PASS_LOCAL_SQLITE_BACKUP_RESTORE_REHEARSAL",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "canonicalContractSetHash": "023f98b55c0be84ad6b0bf5f80d95a80d515c92069ba36057f66a9b0f484bcfa",
        "logicalSchemaHash": "5638ba9529982882b04c2a5014d8b5b3923c1a661ccb27ec6b556386ff324da5",
        "targetCount": len(results),
        "targets": results,
        "approvals": {"migrationPlanReview": "NOT_READY_FOR_TARGET_BOUND_REVIEW", "migrationExecution": "NOT_GRANTED", "deployment": "NOT_GRANTED_NO_RELEASE_ARTIFACT_OR_TARGET"},
        "limitations": [
            "These are empty local development database fixtures; row preservation was verified but representative business-data recovery was not rehearsed.",
            "No staging or production target, PostgreSQL target, or libSQL runtime was available.",
            "Recovery rehearsal does not authorize migration execution or deployment.",
        ],
    }
    EVIDENCE_ROOT.mkdir(parents=True, exist_ok=True)
    report_path = EVIDENCE_ROOT / f"{evidence['rehearsalId']}.json"
    evidence["evidenceFile"] = str(report_path.relative_to(REPOSITORY))
    evidence["backupFilesRetainedUnder"] = str(run_dir.relative_to(REPOSITORY))
    report_path.write_text(json.dumps(evidence, indent=2) + "\n")
    print(json.dumps(evidence, indent=2))


if __name__ == "__main__":
    main()
