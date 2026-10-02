import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(packageRoot, "schema-sources/authored/maataa-communications-v1");
const decisions = JSON.parse(await readFile(path.join(sourceDir, "decisions.json"), "utf8"));

const safeName = (value) => value.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").toLowerCase();
const evidence = (tableId) => [
  `maataa-communications-v1#${tableId}`,
  `domain-catalog#${tableId}`,
];

function makeContract(table) {
  const [context, name] = table.id.split(".");
  const tableName = name;
  const provenance = { kind: "MAATAA_AUTHORED", evidence: evidence(table.id), reviewedBy: null };
  const enums = [];
  const fields = Object.fromEntries(Object.entries(table.fields).map(([name, definition]) => {
    const field = {
      type: definition.type,
      nullable: definition.nullable,
    };
    if (definition.type === "enum") {
      const enumId = `${context}_${tableName}_${name}`;
      field.enumId = enumId;
      enums.push({ id: enumId, values: definition.values });
    }
    if (definition.generated === true) field.generated = true;
    if (definition.type === "string" && Number.isInteger(definition.maxLength)) field.maxLength = definition.maxLength;
    if (definition.type === "datetime" && definition.timezone) field.timezone = definition.timezone;
    if (Object.hasOwn(definition, "default")) {
      const isCurrentTimestamp = definition.default === "current-timestamp";
      field[isCurrentTimestamp ? "defaultExpression" : "defaultLiteral"] = isCurrentTimestamp
        ? { kind: "current-timestamp" }
        : definition.default;
    }
    if (definition.generated === true) field.defaultExpression = { kind: "uuid-v4" };
    return [name, field];
  }));

  const foreignKeys = table.foreignKeys.map((item) => ({
    name: `fk_${safeName(name)}_${safeName(item.fields.join("_"))}_${safeName(item.target)}`,
    fields: item.fields,
    references: item.target,
    referencedFields: item.targetFields,
    onDelete: item.onDelete,
    onUpdate: item.onUpdate,
  }));
  const relations = table.relations.map((item) => ({
    name: item.name,
    from: item.from,
    to: item.to,
    toFields: item.toFields,
    cardinality: item.cardinality,
    ...(item.through ? { through: item.through } : {}),
  }));
  const uniqueConstraints = table.uniqueConstraints.map((item) => ({
    name: `uq_${safeName(name)}_${safeName(item.fields.join("_"))}`,
    fields: item.fields,
  }));
  const indexes = table.indexes.map((fieldsList, index) => ({
    name: `ix_${safeName(name)}_${index + 1}_${safeName(fieldsList.join("_"))}`,
    fields: fieldsList,
    unique: false,
  }));
  const timestamps = Object.keys(fields);

  return {
    schemaVersion: "1.0.0",
    id: table.id,
    context,
    name,
    version: "1.0.0",
    schemaLifecycle: "DRAFT",
    description: table.purpose,
    fields,
    enums,
    primaryKey: table.primaryKey,
    uniqueConstraints,
    foreignKeys,
    relations,
    indexes,
    ownership: {
      owner: table.ownership.owner,
      steward: table.ownership.steward,
      tenantKey: table.ownership.tenantKey,
    },
    lifecycle: {
      ...(timestamps.includes("created_at") ? { createdAt: "created_at" } : {}),
      ...(timestamps.includes("updated_at") ? { updatedAt: "updated_at" } : {}),
      retentionPolicy: table.lifecycle.retentionPolicy,
      mutable: table.lifecycle.mutable,
      retentionAnchor: table.lifecycle.retentionAnchor,
      purge: table.lifecycle.purge,
    },
    provenance,
  };
}

const output = {
  schemaVersion: "1.0.0",
  context: "communications",
  schemaLifecycle: "DRAFT",
  generatedFrom: "maataa-communications-v1#reviewed-decisions",
  contracts: decisions.tables.map(makeContract),
};

await writeFile(path.join(sourceDir, "contracts.draft.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${output.contracts.length} DRAFT Communications contracts from reviewed decisions.`);
