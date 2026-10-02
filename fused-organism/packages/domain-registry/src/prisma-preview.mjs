const typeMap = {
  uuid: "String", string: "String", text: "String", int: "Int", decimal: "Decimal",
  float: "Float", boolean: "Boolean", date: "DateTime", datetime: "DateTime", time: "DateTime",
  json: "Json", bytes: "Bytes",
};

const pascal = (value) => value.split(/[^a-zA-Z0-9]+/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
const prismaIdentifier = (value) => /^[A-Za-z][A-Za-z0-9_]*$/.test(value) ? value : `f_${value.replace(/[^A-Za-z0-9_]/g, "_")}`;
const relationName = (fk) => `R_${fk.name}`;
const inverseFieldName = (table, fk) => prismaIdentifier(`back_${table.context}_${table.name}_${fk.name}`);

function fieldDefault(field) {
  if (field.defaultExpression?.kind === "uuid-v4") return " @default(uuid())";
  if (field.defaultExpression?.kind === "current-timestamp") return " @default(now())";
  if (field.defaultExpression?.kind === "database-native") return ` @default(dbgenerated(${JSON.stringify(field.defaultExpression.expression)}))`;
  if (Object.hasOwn(field, "defaultLiteral")) return ` @default(${JSON.stringify(field.defaultLiteral)})`;
  return "";
}

function prismaFieldType(field, provider) {
  const mapped = field.type === "enum" ? enumName(field.enumId) : typeMap[field.type];
  if (!mapped) throw new Error(`No Prisma scalar adapter mapping for MAATAA type ${field.type}.`);
  const native = provider === "postgresql"
    ? field.type === "uuid" ? " @db.Uuid" : field.type === "text" ? " @db.Text" : field.type === "date" ? " @db.Date" : field.type === "datetime" && field.timezone ? " @db.Timestamptz(6)" : field.type === "string" && field.maxLength ? ` @db.VarChar(${field.maxLength})` : ""
    : "";
  return `${mapped}${field.nullable ? "?" : ""}${native}`;
}

const enumName = (id) => `E_${pascal(id ?? "unknown")}`;

/** Emit a provider-pinned, non-deployable Prisma projection from a validated logical model. */
export function generatePrismaPreview(logicalResult, { targetProvider } = {}) {
  if (!targetProvider) return { status: "BLOCKED", blockers: ["An explicit Prisma targetProvider is required."] };
  if (!(["sqlite", "postgresql"].includes(targetProvider))) return { status: "BLOCKED", blockers: [`No Prisma adapter is implemented for ${targetProvider}.`] };
  if (logicalResult?.status !== "DRAFT_LOGICAL_SCHEMA_READY" && logicalResult?.status !== "LOGICAL_SCHEMA_READY") {
    return { status: "BLOCKED", blockers: ["A successful logical relational model is required before Prisma projection."] };
  }

  const tables = logicalResult.model.tables;
  const modelById = new Map(tables.map((table) => [table.id, pascal(`${table.context}_${table.name}`)]));
  const models = tables.map((table) => {
    const modelName = modelById.get(table.id);
    const lines = [`model ${modelName} {`];
    const primaryKey = table.primaryKey ?? [];
    for (const [fieldName, field] of Object.entries(table.fields)) {
      let annotation = "";
      if (primaryKey.length === 1 && primaryKey[0] === fieldName) annotation += " @id";
      if (field.generated === true && field.defaultExpression?.kind === "uuid-v4") annotation += " @default(uuid())";
      else annotation += fieldDefault(field);
      if (field.type === "datetime" && field.defaultExpression?.kind !== "current-timestamp") {
        // Keep the scalar mapping provider neutral; do not infer a timestamp default or update hook.
      }
      lines.push(`  ${prismaIdentifier(fieldName)} ${prismaFieldType(field, targetProvider)}${annotation}`);
    }

    for (const fk of table.foreignKeys ?? []) {
      const targetModel = modelById.get(fk.references);
      if (!targetModel) throw new Error(`${table.id}.${fk.name} has no model in the closed logical schema.`);
      const optional = fk.fields.some((fieldName) => table.fields[fieldName]?.nullable === true);
      const relationArgs = [
        `"${relationName(fk)}"`,
        `fields: [${fk.fields.map(prismaIdentifier).join(", ")}]`,
        `references: [${fk.referencedFields.map(prismaIdentifier).join(", ")}]`,
      ];
      if (fk.onDelete) relationArgs.push(`onDelete: ${pascal(fk.onDelete)}`);
      if (fk.onUpdate) relationArgs.push(`onUpdate: ${pascal(fk.onUpdate)}`);
      lines.push(`  ${prismaIdentifier(`rel_${fk.name}`)} ${targetModel}${optional ? "?" : ""} @relation(${relationArgs.join(", ")})`);
    }
    for (const source of tables) {
      for (const fk of source.foreignKeys ?? []) {
        if (fk.references !== table.id) continue;
        const sourceModel = modelById.get(source.id);
        lines.push(`  ${inverseFieldName(source, fk)} ${sourceModel}[] @relation("${relationName(fk)}")`);
      }
    }
    if (primaryKey.length > 1) lines.push(`  @@id([${primaryKey.map(prismaIdentifier).join(", ")}])`);
    for (const unique of table.uniqueConstraints ?? []) lines.push(`  @@unique([${unique.fields.map(prismaIdentifier).join(", ")}], name: "${unique.name}")`);
    for (const index of table.indexes ?? []) lines.push(`  @@index([${index.fields.map(prismaIdentifier).join(", ")}], name: "${index.name}")`);
    lines.push(`  @@map("${table.context}_${table.name}")`);
    lines.push("}");
    return lines.join("\n");
  });

  const enumDefinitions = new Map();
  for (const table of tables) for (const item of table.enums ?? []) enumDefinitions.set(item.id, item);
  const enums = [...enumDefinitions.values()].sort((a, b) => a.id.localeCompare(b.id)).map((item) => [
    `enum ${enumName(item.id)} {`,
    ...item.values.map((value) => `  ${prismaIdentifier(value)}`),
    `  @@map("${item.id}")`,
    `}`,
  ].join("\n"));
  const providerLabel = targetProvider === "postgresql" ? "PostgreSQL" : "SQLite/libSQL";
  const schema = [
    `// GENERATED PREVIEW: MAATAA DRAFT logical model for ${providerLabel}; not deployable or migration executable.`,
    "// Logical enum values and contract semantics remain governed by the database-neutral model.",
    "generator client {",
    "  provider = \"prisma-client-js\"",
    "}",
    "",
    "datasource db {",
    `  provider = "${targetProvider}"`,
    "  url      = env(\"DATABASE_URL\")",
    "}",
    "",
    ...enums,
    ...models,
    "",
  ].join("\n");

  return {
    status: "GENERATED_UNVALIDATED",
    schema,
    metadata: {
      schemaLifecycle: "DRAFT",
      targetProvider,
      intendedCompatibility: targetProvider === "sqlite" ? "SQLite/libSQL" : "PostgreSQL",
      deployable: false,
      migrationExecutable: false,
      migrationApproved: false,
      deploymentApproved: false,
      legalReviewed: false,
      prismaPreviewValid: false,
      migrationPreviewValid: false,
      validationStatus: "NOT_RUN_PRISMA_CLI_UNAVAILABLE",
      tableIds: tables.map((table) => table.id),
      sourceLogicalSchemaHash: logicalResult.schemaHash,
      physicalTableNamePolicy: "context_table underscore mapping",
      enumProjection: "Prisma enum projection; canonical allowed values remain in MAATAA logical contract",
    },
  };
}
