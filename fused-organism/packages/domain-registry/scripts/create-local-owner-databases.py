#!/usr/bin/env python3
"""Build MAATAA/TLPS/shared local SQLite development projections.

Inputs are the canonical table contracts and the generated global SQLite
bootstrap SQL. Cross-owner foreign keys become manifest-backed service
references; same-owner foreign keys remain physical SQLite constraints.
The generated database files are disposable local development artifacts.
"""

from __future__ import annotations

import hashlib
import argparse
import json
import re
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OWNERSHIP = ROOT / "data/ownership/product-ownership.v1.json"
REFERENCES = ROOT / "data/ownership/cross-owner-references.v1.json"
CONTRACTS = ROOT / "data/table-contracts.json"
CONTEXTS = ROOT / "data/context-registry.json"
SQL_INPUT = ROOT / "schema-sources/authored/schema-factory-v1/global/migration-preview.global.sqlite.bootstrap.sql"
OUT = ROOT.parents[1] / ".local-dev/databases"
GLOBAL_SQL_METADATA = ROOT / "schema-sources/authored/schema-factory-v1/global/migration-preview.global.sqlite.bootstrap.metadata.json"

# Contexts are the current canonical ownership units. Shared contexts contain
# capabilities intentionally used by more than one product.
CONTEXT_OWNER = {
    "identity": "shared",
    "organisation": "shared",
    "project": "shared",
    "creative": "tlps",
    "people": "tlps",
    "production": "tlps",
    "logistics": "tlps",
    "campaign": "tlps",
    "marketplace": "tlps",
    "evidence": "shared",
    "finance": "tlps",
    "investor": "tlps",
    "eventsSpatial": "tlps",
    "intelligence": "shared",
    "communications": "shared",
    "platform": "maataa",
    "public": "shared",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def physical_name(table_id: str, context: str | None = None) -> str:
    _, name = table_id.split(".", 1)
    return f"{context or table_id.split('.', 1)[0]}_{name}"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--replace", action="store_true", help="replace existing local database files; this deletes their local data")
    args = parser.parse_args()
    contracts_doc = json.loads(CONTRACTS.read_text())
    contexts_doc = json.loads(CONTEXTS.read_text())
    contracts = {c["id"]: c for c in contracts_doc["contracts"]}
    context_ids = {c["id"] for c in contexts_doc["contexts"]}
    if set(CONTEXT_OWNER) != context_ids:
        raise SystemExit(f"Context ownership mismatch: missing={context_ids-set(CONTEXT_OWNER)}, extra={set(CONTEXT_OWNER)-context_ids}")

    table_rows = []
    for table_id, contract in sorted(contracts.items()):
        owner = CONTEXT_OWNER[contract["context"]]
        table_rows.append({
            "tableId": table_id,
            "context": contract["context"],
            "table": contract["name"],
            "owner": owner,
            "database": f"{owner}.db",
            "service": f"{owner}-data-service",
            "schemaLifecycle": contract.get("schemaLifecycle"),
        })

    table_owner = {row["tableId"]: row["owner"] for row in table_rows}
    physical_owner = {physical_name(table_id, contracts[table_id]["context"]): owner for table_id, owner in table_owner.items()}
    physical_id = {physical_name(table_id, contracts[table_id]["context"]): table_id for table_id in table_owner}
    canonical_contract_hash = sha256(json.dumps(contracts_doc["contracts"], sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode())
    ownership_doc = {
        "schemaVersion": "1.0.0",
        "decisionStatus": "LOCAL_DEVELOPMENT_BOUNDARY",
        "source": {
            "canonicalContractSetSha256": canonical_contract_hash,
            "contractRegistryFileSha256": sha256(CONTRACTS.read_bytes()),
            "contextRegistrySha256": sha256(CONTEXTS.read_bytes()),
        },
        "ownerModel": {
            "maataa": "MAATAA platform/control-plane capabilities",
            "tlps": "TLPS event, production, marketplace, finance and spatial business capabilities",
            "shared": "Cross-product identity, organisation, project, communication, evidence, intelligence and public capabilities",
        },
        "contextOwners": CONTEXT_OWNER,
        "contextRationale": {
            "maataa": {"contexts": ["platform"], "rationale": "Platform control-plane settings, integrations, feature flags, and retention capabilities belong to the MAATAA platform product."},
            "shared": {"contexts": ["identity", "organisation", "project", "evidence", "intelligence", "communications", "public"], "rationale": "These are cross-product identity, tenancy, project, governance, shared intelligence, communication, and public-surface capabilities; a shared service remains the authority even when both products consume it."},
            "tlps": {"contexts": ["creative", "people", "production", "logistics", "campaign", "marketplace", "finance", "investor", "eventsSpatial"], "rationale": "These contexts model TLPS event and production workflows, their people and assets, commerce/finance, investor, and spatial/event operations."},
        },
        "tableCount": len(table_rows),
        "ownerCounts": {owner: sum(1 for row in table_rows if row["owner"] == owner) for owner in ("maataa", "tlps", "shared")},
        "tables": table_rows,
        "limitations": [
            "This allocation is for local development and service-boundary design; it does not assert production deployment or business/legal ownership approval.",
            "Canonical foreign-key contracts remain unchanged. Cross-owner SQLite projections omit the physical constraint and retain an explicit service-reference record.",
            "Generated database files are empty schema fixtures, not production baselines or migration authorization.",
            "SQLite's Prisma DDL emits bare JSON object/array defaults that SQLite cannot parse; local projections quote those JSON literals as text without changing canonical contracts.",
        ],
    }

    sql_source = SQL_INPUT.read_text()
    sql_metadata = json.loads(GLOBAL_SQL_METADATA.read_text())
    blocks = re.findall(r'CREATE TABLE "([^"]+)" \(\n(.*?)\n\);', sql_source, flags=re.S)
    if len(blocks) != len(contracts):
        raise SystemExit(f"Expected {len(contracts)} CREATE TABLE blocks; found {len(blocks)}")
    block_by_table = dict(blocks)
    if set(block_by_table) != set(physical_owner):
        raise SystemExit(f"Physical table mismatch: missing={set(physical_owner)-set(block_by_table)}, extra={set(block_by_table)-set(physical_owner)}")

    references = []
    owner_sql = {owner: ["PRAGMA foreign_keys = ON;", ""] for owner in ("maataa", "tlps", "shared")}
    cross_edge_count = 0
    retained_edge_count = 0
    owner_fk_counts = {owner: 0 for owner in ("maataa", "tlps", "shared")}
    for table_name in sorted(block_by_table):
        owner = physical_owner[table_name]
        lines = [line.strip().rstrip(",") for line in block_by_table[table_name].splitlines() if line.strip()]
        kept = []
        for line in lines:
            ref = re.search(r'FOREIGN KEY \((.*?)\) REFERENCES "([^"]+)" \((.*?)\)(?: ON DELETE (RESTRICT|CASCADE|SET NULL|SET DEFAULT|NO ACTION))?(?: ON UPDATE (RESTRICT|CASCADE|SET NULL|SET DEFAULT|NO ACTION))?', line)
            if not ref:
                kept.append(line)
                continue
            target_name = ref.group(2)
            if target_name not in physical_owner:
                raise SystemExit(f"Unmapped FK target {target_name} from {table_name}")
            target_owner = physical_owner[target_name]
            if owner == target_owner:
                kept.append(line)
                retained_edge_count += 1
                owner_fk_counts[owner] += 1
                continue
            cross_edge_count += 1
            source_id = physical_id[table_name]
            target_id = physical_id[target_name]
            references.append({
                "sourceTableId": source_id,
                "sourceOwner": owner,
                "sourceColumns": [part.strip().strip('"') for part in ref.group(1).split(",")],
                "targetTableId": target_id,
                "targetOwner": target_owner,
                "targetColumns": [part.strip().strip('"') for part in ref.group(3).split(",")],
                "onDelete": (ref.group(4) or "NO ACTION").strip().lower().replace(" ", "-"),
                "onUpdate": (ref.group(5) or "NO ACTION").strip().lower().replace(" ", "-"),
                "resolution": "target-owner-service-reference",
            })
        if not kept:
            raise SystemExit(f"No DDL remains for {table_name}")
        ddl = "CREATE TABLE \"" + table_name + "\" (\n    " + ",\n    ".join(kept) + "\n);\n"
        owner_sql[owner].append(ddl)

    index_statements = re.findall(r'CREATE (?:UNIQUE )?INDEX .*?;', sql_source, flags=re.S)
    owner_index_counts = {owner: 0 for owner in owner_sql}
    for statement in index_statements:
        target = re.search(r' ON "([^"]+)"\s*\(', statement)
        if not target or target.group(1) not in physical_owner:
            raise SystemExit(f"Could not map generated index to owner: {statement[:160]}")
        owner = physical_owner[target.group(1)]
        owner_sql[owner].append(statement + "\n")
        owner_index_counts[owner] += 1

    # Provider-only Communications invariants are appended to the global
    # SQLite bootstrap after all base DDL. Preserve those triggers in the
    # owner-local projection (Communications currently belongs to `shared`).
    trigger_statements = re.findall(r'CREATE TRIGGER .*?\nEND;', sql_source, flags=re.S)
    owner_trigger_counts = {owner: 0 for owner in owner_sql}
    for statement in trigger_statements:
        target = re.search(r' ON "([^"]+)"', statement)
        if not target or target.group(1) not in physical_owner:
            raise SystemExit(f"Could not map generated trigger to owner: {statement[:160]}")
        owner = physical_owner[target.group(1)]
        owner_sql[owner].append(statement + "\n")
        owner_trigger_counts[owner] += 1

    policy_doc = {
        "schemaVersion": "1.0.0",
        "status": "LOCAL_DEVELOPMENT_POLICY",
        "canonicalContractsChanged": False,
        "crossOwnerForeignKeyCount": cross_edge_count,
        "rules": [
            "The canonical registry retains every foreign-key edge and its onDelete/onUpdate semantics.",
            "A per-owner database retains the source reference columns but omits only a physical FK constraint whose target belongs to another owner database.",
            "Before create/update, the source owner's application calls the target owner's authenticated reference.resolve operation with target ID, tenant/workspace scope, and referenced key values; successful references are registered with the target owner's inbound-reference index.",
            "For restrict, deletion is blocked while the inbound-reference index reports a dependent. For set-null, the target owner requests idempotent source-owner reference.clear operations and finalizes deletion only after acknowledgements; a failed/unavailable owner leaves deletion unfinalized.",
            "Reference registration/clear operations must be idempotent and recorded through a durable outbox or equivalent retryable protocol. Cross-service cascades are forbidden.",
            "If the target service is unavailable, writes and deletes that require reference validation fail closed; reads may return an unresolved-reference state.",
            "The local development adapter may call sibling local services or a deterministic in-process adapter; it must not query another owner's SQLite file directly.",
            "Endpoint URLs and identity credentials are not invented here; each owner service publishes the API contract and authenticated actor/scope requirements before runtime integration.",
        ],
        "serviceOperations": {
            "reference.resolve": "Validate that a referenced row exists and is visible to the supplied actor/tenant/workspace scope.",
            "reference.register": "Register or remove an inbound reference after a source-owner write commits; retries are idempotent.",
            "reference.inbound-check": "Return the dependent source references and their canonical onDelete actions before deletion/archive.",
            "reference.clear": "Idempotently null a source-owner reference whose canonical onDelete action is set-null.",
            "reference.finalize-delete": "Allow target deletion only after restrict checks pass and all required set-null acknowledgements complete.",
        },
        "references": sorted(references, key=lambda x: (x["sourceTableId"], x["sourceColumns"], x["targetTableId"])),
    }

    if len(table_rows) != 352 or len({r["tableId"] for r in table_rows}) != 352:
        raise SystemExit("Expected exactly 352 unique canonical table IDs")
    if len(references) != cross_edge_count:
        raise SystemExit("Cross-owner reference manifest count mismatch")

    OWNERSHIP.parent.mkdir(parents=True, exist_ok=True)
    OWNERSHIP.write_text(json.dumps(ownership_doc, indent=2) + "\n")
    REFERENCES.write_text(json.dumps(policy_doc, indent=2) + "\n")
    OUT.mkdir(parents=True, exist_ok=True)
    existing_dbs = [OUT / f"{owner}.db" for owner in ("maataa", "tlps", "shared") if (OUT / f"{owner}.db").exists()]
    if existing_dbs and not args.replace:
        raise SystemExit("Refusing to replace existing local databases; pass --replace only when their data can be discarded")
    for owner, chunks in owner_sql.items():
        sql = "\n".join(chunks) + "\n"
        # SQLite stores JSON as text. Quote Prisma's bare JSON literals, which
        # are valid logical JSON defaults but not valid SQLite SQL tokens.
        sql = sql.replace("DEFAULT {}", "DEFAULT '{}'" ).replace("DEFAULT []", "DEFAULT '[]'")
        (OUT / f"{owner}.schema.sql").write_text(sql)
        db_path = OUT / f"{owner}.db"
        if db_path.exists():
            db_path.unlink()
        con = sqlite3.connect(db_path)
        try:
            con.execute("PRAGMA foreign_keys=ON")
            con.executescript(sql)
            fk_errors = list(con.execute("PRAGMA foreign_key_check"))
            if fk_errors:
                raise SystemExit(f"{owner}: foreign_key_check failed: {fk_errors[:5]}")
            table_count = con.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchone()[0]
            expected = ownership_doc["ownerCounts"][owner]
            if table_count != expected:
                raise SystemExit(f"{owner}: expected {expected} tables, found {table_count}")
            index_count = con.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND sql IS NOT NULL").fetchone()[0]
            if index_count != owner_index_counts[owner]:
                raise SystemExit(f"{owner}: expected {owner_index_counts[owner]} indexes, found {index_count}")
            trigger_count = con.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='trigger'").fetchone()[0]
            if trigger_count != owner_trigger_counts[owner]:
                raise SystemExit(f"{owner}: expected {owner_trigger_counts[owner]} triggers, found {trigger_count}")
            con.commit()
        finally:
            con.close()
        (OUT / f"{owner}.manifest.json").write_text(json.dumps({
            "owner": owner,
            "database": f"{owner}.db",
            "tableCount": ownership_doc["ownerCounts"][owner],
            "crossOwnerReferenceCount": sum(1 for edge in references if edge["sourceOwner"] == owner),
            "sameOwnerPhysicalForeignKeyConstraintCount": owner_fk_counts[owner],
            "indexCount": owner_index_counts[owner],
            "triggerCount": owner_trigger_counts[owner],
            "schemaSqlSha256": sha256((OUT / f"{owner}.schema.sql").read_bytes()),
            "canonicalContractSetSha256": ownership_doc["source"]["canonicalContractSetSha256"],
            "emptyDatabase": True,
            "providerInvariantEnforcement": sql_metadata.get("communicationsInvariantEnforcement", {}).get("status", "UNKNOWN"),
            "communicationsInvariantCount": sql_metadata.get("communicationsInvariantEnforcement", {}).get("invariantCount", 0) if owner == "shared" else 0,
            "communicationsInvariantNames": sql_metadata.get("communicationsInvariantEnforcement", {}).get("invariantNames", []) if owner == "shared" else [],
            "intendedUse": "local development only",
            "sqliteProjectionNormalizations": ["DEFAULT {} -> DEFAULT '{}'", "DEFAULT [] -> DEFAULT '[]'"],
            "migrationApproved": False,
            "deploymentApproved": False,
        }, indent=2) + "\n")

    print(json.dumps({
        "tableCount": len(table_rows),
        "ownerCounts": ownership_doc["ownerCounts"],
        "sameOwnerPhysicalForeignKeys": retained_edge_count,
        "crossOwnerServiceReferences": cross_edge_count,
        "databases": [str(OUT / f"{owner}.db") for owner in ("maataa", "tlps", "shared")],
    }, indent=2))


if __name__ == "__main__":
    main()
