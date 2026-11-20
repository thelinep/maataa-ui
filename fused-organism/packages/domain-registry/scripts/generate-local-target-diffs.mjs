import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../../..");
const targetRoot = path.join(packageRoot, "migration-readiness/target-diffs/local-development");
const tempRoot = path.join(repoRoot, "fused-organism/.local-dev/target-diff-work");
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const prismaCli = path.resolve(packageRoot, "../../node_modules/.bin/prisma");
const sqliteVersionResult = spawnSync("python3", ["-c", "import sqlite3; print(sqlite3.sqlite_version)"], { encoding: "utf8" });
if (sqliteVersionResult.status !== 0) throw new Error("SQLITE_RUNTIME_VERSION_UNAVAILABLE");
const sqliteRuntimeVersion = sqliteVersionResult.stdout.trim();
const ownership = await readJson(path.join(packageRoot, "data/ownership/product-ownership.v1.json"));
const targets = await readJson(path.join(packageRoot, "migration-readiness/targets.json"));
const globalSchema = await readFile(path.join(packageRoot, "schema-sources/authored/schema-factory-v1/global/prisma-preview.sqlite.canonical.prisma"), "utf8");
const readiness = await readJson(path.join(packageRoot, "schema-sources/authored/schema-factory-v1/global/readiness.json"));
const enforcementPlan = await readJson(path.join(packageRoot, "migration-readiness/provider-invariant-plan.json"));
const sqliteOverlay = await readFile(path.join(packageRoot, "schema-sources/authored/maataa-communications-v1/provider-enforcement.sqlite.sql"), "utf8");

const models = [...globalSchema.matchAll(/^model\s+(\w+)\s+\{\n([\s\S]*?)^\}/gm)].map((match) => ({ name: match[1], body: match[2], block: match[0] }));
const enums = [...globalSchema.matchAll(/^enum\s+(\w+)\s+\{\n[\s\S]*?^\}/gm)].map((match) => ({ name: match[1], block: match[0] }));
const preludeEnd = Math.min(...[globalSchema.search(/^enum\s+\w+/m), globalSchema.search(/^model\s+\w+/m)].filter((index) => index >= 0));
const prelude = globalSchema.slice(0, preludeEnd).trimEnd();
const ownerByPhysicalTable = new Map(ownership.tables.map((row) => [`${row.context}_${row.table}`, row.owner]));
const invariantNames = enforcementPlan.providerSpecificEquivalentInvariants.map(({ name }) => name).sort();
if (invariantNames.length !== 5 || enforcementPlan.globalBootstrapOverlayIncluded !== true) throw new Error("COMMUNICATIONS_PROVIDER_OVERLAY_NOT_RECONCILED");

await mkdir(targetRoot, { recursive: true });
await mkdir(tempRoot, { recursive: true });
const outputs = [];
try {
  for (const target of targets.targets.filter((row) => row.environmentKind === "local")) {
    if (target.provider !== "sqlite") throw new Error(`UNSUPPORTED_LOCAL_TARGET_PROVIDER:${target.databaseTargetId}:${target.provider}`);
    const owner = target.applicationId === "shared-data-service" ? "shared" : target.applicationId;
    const databasePath = path.join(repoRoot, `fused-organism/.local-dev/databases/${owner}.db`);
    const baselinePath = path.resolve(repoRoot, target.schemaBaseline.uri);
    const baseline = await readJson(baselinePath);
    const actualDatabaseHashBefore = digest(await readFile(databasePath));
    if (actualDatabaseHashBefore !== baseline.databaseSha256) throw new Error(`LOCAL_TARGET_BASELINE_HASH_MISMATCH:${target.databaseTargetId}`);

    const ownerModels = models.filter((model) => {
      const physical = model.body.match(/@@map\("([^"]+)"\)/)?.[1];
      return physical && ownerByPhysicalTable.get(physical) === owner;
    });
    const allowedNames = new Set(ownerModels.map(({ name }) => name));
    if (ownerModels.length !== ownership.ownerCounts[owner]) throw new Error(`OWNER_MODEL_COVERAGE_MISMATCH:${owner}:${ownerModels.length}`);
    const ownerBodies = ownerModels.map(({ body }) => body.split("\n").filter((line) => {
      if (!line.includes("@relation(")) return true;
      const relation = line.match(/^\s*\w+\s+([A-Za-z][A-Za-z0-9_]*)(?:\?|\[\])?\s+@relation\(/);
      if (!relation) throw new Error(`UNPARSED_RELATION_FIELD:${line.trim()}`);
      return allowedNames.has(relation[1]);
    }).join("\n"));
    const usedEnumNames = new Set(enums.filter(({ name }) => ownerBodies.some((body) => new RegExp(`\\b${name}\\b`).test(body))).map(({ name }) => name));
    const ownerEnums = enums.filter(({ name }) => usedEnumNames.has(name)).map(({ block }) => block);
    const ownerSchema = [prelude, ...ownerEnums, ...ownerModels.map((model, index) => {
      const body = ownerBodies[index];
      return `model ${model.name} {\n${body}\n}`;
    }), ""].join("\n\n");

    const slug = owner;
    const schemaPath = path.join(tempRoot, `${slug}.sqlite.prisma`);
    const configPath = path.join(tempRoot, `${slug}.prisma.config.ts`);
    const schemaRelative = path.relative(packageRoot, schemaPath);
    const dbUrl = `file:${databasePath}`;
    const config = `import { defineConfig } from "prisma/config";\nexport default defineConfig({ schema: ${JSON.stringify(schemaPath)}, datasource: { url: ${JSON.stringify(dbUrl)} } });\n`;
    await writeFile(schemaPath, ownerSchema);
    await writeFile(configPath, config);

    const result = spawnSync(prismaCli, ["migrate", "diff", "--config", configPath, "--from-config-datasource", "--to-schema", schemaRelative, "--script"], {
      cwd: packageRoot,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
    if (result.status !== 0) throw new Error(`LOCAL_TARGET_DIFF_FAILED:${target.databaseTargetId}:${result.stderr || result.error?.message}`);
    const generatedSql = (result.stdout ?? "").trim();
    const changesDetected = Boolean(generatedSql) && !/^-- This is an empty migration\.$/m.test(generatedSql);
    const overlayNames = owner === "shared"
      ? [...sqliteOverlay.matchAll(/CREATE (?:TRIGGER|UNIQUE INDEX) "([^"]+)"/g)].map((match) => match[1])
      : [];
    const schemaInventory = spawnSync("python3", ["-c", [
      "import json,sqlite3,sys",
      "c=sqlite3.connect('file:'+sys.argv[1]+'?mode=ro',uri=True)",
      "o=c.execute(\"select type,name,tbl_name,sql from sqlite_master where name not like 'sqlite_%' and type in ('table','index','trigger','view') order by type,name\").fetchall()",
      "print(json.dumps(o,separators=(',',':')))"
    ].join(";"), databasePath], { encoding: "utf8" });
    if (schemaInventory.status !== 0) throw new Error(`LOCAL_TARGET_SCHEMA_INVENTORY_FAILED:${target.databaseTargetId}`);
    const objects = JSON.parse(schemaInventory.stdout);
    const presentObjects = new Set(objects.map(([, name]) => name));
    const missingOverlayObjects = overlayNames.filter((name) => !presentObjects.has(name));
    const overlayConflict = generatedSql.split("\n").some((line) => overlayNames.some((name) => line.includes(name)) && /^\s*DROP\b/i.test(line));
    const actualDatabaseHashAfter = digest(await readFile(databasePath));
    if (actualDatabaseHashAfter !== actualDatabaseHashBefore) throw new Error(`LOCAL_TARGET_CHANGED_DURING_READ_ONLY_DIFF:${target.databaseTargetId}`);

    const sql = [
      `-- LOCAL TARGET-BOUND DIFF · target=${target.databaseTargetId} · provider=sqlite · migrationApproved=false`,
      `-- source database SHA-256=${actualDatabaseHashBefore}`,
      `-- canonical contract set SHA-256=${readiness.contractSetHash}; logical schema SHA-256=${readiness.logicalSchemaHash}`,
      changesDetected ? generatedSql : "-- No schema changes: target matches its owner-scoped canonical SQLite projection.",
      "",
    ].join("\n");
    const outputName = `${slug}.sqlite.target-diff.sql`;
    const metadataName = `${slug}.sqlite.target-diff.json`;
    await writeFile(path.join(targetRoot, outputName), sql);
    const metadata = {
      schemaVersion: "1.0.0",
      status: missingOverlayObjects.length ? "BLOCKED_INVARIANT_OBJECTS_MISSING" : overlayConflict ? "BLOCKED_PRISMA_DIFF_CONFLICTS_WITH_INVARIANT_OVERLAY" : changesDetected ? "GENERATED_LOCAL_TARGET_DIFF_REVIEW_REQUIRED" : "NO_OP_LOCAL_TARGET_MATCHES_OWNER_PROJECTION",
      scope: "Local-development SQLite target only; not a staging/production migration diff.",
      target: {
        applicationId: target.applicationId,
        environmentId: target.environmentId,
        databaseTargetId: target.databaseTargetId,
        provider: target.provider,
        engineVersionDeclared: target.engineVersion,
        engineVersionRuntime: sqliteRuntimeVersion,
        databasePath: path.relative(repoRoot, databasePath),
        baselineArtifact: path.relative(packageRoot, baselinePath),
        baselineArtifactSha256: digest(await readFile(baselinePath)),
        databaseSha256Before: actualDatabaseHashBefore,
        databaseSha256After: actualDatabaseHashAfter,
        migrationHistorySha256: target.migrationHistory.sha256,
      },
      desiredState: {
        ownershipBoundary: owner,
        canonicalContractSetHash: readiness.contractSetHash,
        logicalSchemaHash: readiness.logicalSchemaHash,
        expectedTableCount: ownership.ownerCounts[owner],
        desiredOwnerSchemaSha256: digest(ownerSchema),
      },
      diff: {
        generator: "Prisma migrate diff",
        prismaVersion: JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8")).devDependencies.prisma,
        command: `prisma migrate diff --config <${slug} target config> --from-config-datasource --to-schema <${slug} owner projection> --script`,
        readOnly: true,
        sqlFile: outputName,
        sqlSha256: digest(sql),
        changesDetected,
        databaseObjectsObserved: objects.length,
      },
      communicationsInvariants: owner === "shared" ? {
        invariantCount: 5,
        expectedEnforcementObjects: overlayNames,
        missingEnforcementObjects: missingOverlayObjects,
        prismaDiffWouldDropEnforcement: overlayConflict,
        evidenceBoundary: "SQLite local target only; no libSQL compatibility claim",
      } : { invariantCount: 0 },
      approval: { migrationPlanReviewed: false, migrationExecutionApproved: false, deploymentApproved: false },
    };
    await writeFile(path.join(targetRoot, metadataName), `${JSON.stringify(metadata, null, 2)}\n`);
    outputs.push({ target: target.databaseTargetId, status: metadata.status, databaseSha256: actualDatabaseHashBefore, sql: outputName, sqlSha256: metadata.diff.sqlSha256, objectsObserved: objects.length, missingOverlayObjects, overlayConflict });
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

console.log(JSON.stringify({ status: "LOCAL_TARGET_DIFFS_GENERATED", scope: "local SQLite only", outputs, migrationExecutionApproved: false, deploymentApproved: false }, null, 2));
