const REQUIRED_SECTIONS = ["fields", "enums", "primaryKey", "uniqueConstraints", "foreignKeys", "relations", "indexes", "ownership", "lifecycle"];
const REQUIRED_REVIEW = "approved";
const sorted = (items) => [...items].sort((a, b) => String(a).localeCompare(String(b)));
const has = (value, key) => Object.hasOwn(value ?? {}, key);

function provenanceApproved(value) {
  return value?.reviewStatus === REQUIRED_REVIEW && typeof value.source === "string" && value.source.trim() && typeof value.reference === "string" && value.reference.trim();
}

export function validateTableContract(contract, source) {
  const errors = [];
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) return { valid: false, errors: ["Contract must be an object."] };
  const table = (source.domains.tables ?? []).find((item) => item.id === contract.id);
  if (!table) errors.push(`Unknown canonical table: ${contract.id ?? "<missing>"}.`);
  else if (contract.context !== table.context || contract.name !== table.name) errors.push(`Contract identity does not match canonical table ${table.id}.`);
  const scalarIds = new Set((source.scalarTypes?.types ?? []).map((item) => item.id));
  const enumIds = new Set((contract.enums ?? []).map((item) => item.id));
  if (!provenanceApproved(contract.provenance)) errors.push("Table provenance must cite a source and reference and be approved.");
  if (!contract.version || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(contract.version)) errors.push("Contract must have a semantic version.");
  const fields = contract.fields && typeof contract.fields === "object" && !Array.isArray(contract.fields) ? contract.fields : {};
  for (const [fieldName, field] of Object.entries(fields)) {
    if (!field || typeof field !== "object") { errors.push(`Field ${fieldName} must be an object.`); continue; }
    const type = field.type === "enum" ? "enum" : field.type;
    if (type !== "enum" && !scalarIds.has(type)) errors.push(`Field ${fieldName} uses unknown scalar type ${field.type ?? "<missing>"}.`);
    if (typeof field.nullable !== "boolean") errors.push(`Field ${fieldName} must declare nullability.`);
    if (typeof field.generated !== "boolean") errors.push(`Field ${fieldName} must declare whether it is generated.`);
    if (!provenanceApproved(field.provenance)) errors.push(`Field ${fieldName} provenance must be approved and source-backed.`);
    if (field.type === "string" && !Number.isInteger(field.maxLength)) errors.push(`Field ${fieldName} needs maxLength for bounded string semantics.`);
    if (field.type === "decimal" && (!Number.isInteger(field.precision) || !Number.isInteger(field.scale) || field.scale > field.precision)) errors.push(`Field ${fieldName} needs valid decimal precision and scale.`);
    if (field.type === "datetime" && !field.timezone) errors.push(`Field ${fieldName} must declare timezone semantics.`);
    if (field.type === "enum" && !enumIds.has(field.enumId)) errors.push(`Field ${fieldName} references missing enum ${field.enumId ?? "<missing>"}.`);
    if (has(field, "defaultLiteral") && has(field, "defaultExpression")) errors.push(`Field ${fieldName} cannot have both defaultLiteral and defaultExpression; their meanings are distinct.`);
    if (field.defaultExpression && !["current-timestamp", "uuid-v4", "database-native"].includes(field.defaultExpression.kind)) errors.push(`Field ${fieldName} has an unsupported default expression kind.`);
    if (field.defaultExpression?.kind === "database-native" && (!field.defaultExpression.expression?.trim() || !field.defaultExpression.dialect?.trim())) errors.push(`Field ${fieldName} database-native default must preserve its expression and dialect explicitly.`);
    if (field.generated === true && (has(field, "defaultLiteral") || has(field, "defaultExpression"))) errors.push(`Field ${fieldName} cannot declare generated behavior and a default without an explicit generation rule.`);
  }
  for (const enumDefinition of contract.enums ?? []) {
    if (!enumDefinition.id || !Array.isArray(enumDefinition.values) || !enumDefinition.values.length || new Set(enumDefinition.values).size !== enumDefinition.values.length) errors.push(`Enum ${enumDefinition.id ?? "<missing>"} must have a unique, non-empty value list.`);
    if (!provenanceApproved(enumDefinition.provenance)) errors.push(`Enum ${enumDefinition.id ?? "<missing>"} provenance must be approved and source-backed.`);
  }
  const fieldNames = new Set(Object.keys(fields));
  const checkFields = (owner, names) => {
    for (const name of names ?? []) if (!fieldNames.has(name)) errors.push(`${owner} references unknown field ${name}.`);
  };
  checkFields("primaryKey", contract.primaryKey);
  for (const constraint of contract.uniqueConstraints ?? []) {
    checkFields(`unique constraint ${constraint.name}`, constraint.fields);
    if (!provenanceApproved(constraint.provenance)) errors.push(`Unique constraint ${constraint.name} provenance must be approved and source-backed.`);
  }
  for (const index of contract.indexes ?? []) {
    checkFields(`index ${index.name}`, index.fields);
    if (!provenanceApproved(index.provenance)) errors.push(`Index ${index.name} provenance must be approved and source-backed.`);
  }
  for (const key of contract.foreignKeys ?? []) {
    checkFields(`foreign key ${key.name}`, key.fields);
    const target = (source.domains.tables ?? []).find((item) => item.id === key.references);
    if (!target) errors.push(`Foreign key ${key.name} references unknown table ${key.references}.`);
    const targetContract = (source.tableContracts?.contracts ?? []).find((item) => item.id === key.references);
    if (!targetContract) errors.push(`Foreign key ${key.name} target contract is not authored: ${key.references}.`);
    if (targetContract) {
      for (const [index, field] of (key.referencedFields ?? []).entries()) {
        if (!has(targetContract.fields, field)) errors.push(`Foreign key ${key.name} references unknown target field ${key.references}.${field}.`);
        const localField = fields[key.fields?.[index]];
        const targetField = targetContract.fields?.[field];
        if (localField && targetField && localField.type !== targetField.type) errors.push(`Foreign key ${key.name} has incompatible scalar types for ${key.fields[index]} and ${key.references}.${field}.`);
      }
      const targetKeys = [targetContract.primaryKey, ...(targetContract.uniqueConstraints ?? []).map((item) => item.fields)].filter(Array.isArray);
      if (!targetKeys.some((fields) => JSON.stringify(fields) === JSON.stringify(key.referencedFields))) errors.push(`Foreign key ${key.name} must reference a declared primary or unique key on ${key.references}.`);
    }
    if ((key.fields ?? []).length !== (key.referencedFields ?? []).length) errors.push(`Foreign key ${key.name} source and target field counts differ.`);
    if ([key.onDelete, key.onUpdate].includes("set-null") && (key.fields ?? []).some((name) => fields[name]?.nullable !== true)) errors.push(`Foreign key ${key.name} uses set-null on a non-nullable field.`);
    if ([key.onDelete, key.onUpdate].includes("set-default") && (key.fields ?? []).some((name) => !has(fields[name], "defaultLiteral") && !has(fields[name], "defaultExpression"))) errors.push(`Foreign key ${key.name} uses set-default without a declared field default.`);
    if (!provenanceApproved(key.provenance)) errors.push(`Foreign key ${key.name} provenance must be approved and source-backed.`);
  }
  for (const relation of contract.relations ?? []) {
    checkFields(`relation ${relation.name}`, relation.from);
    if (!provenanceApproved(relation.provenance)) errors.push(`Relation ${relation.name} provenance must be approved and source-backed.`);
    const target = (source.domains.tables ?? []).find((item) => item.id === relation.to);
    if (!target) errors.push(`Relation ${relation.name} targets unknown table ${relation.to}.`);
    const targetContract = (source.tableContracts?.contracts ?? []).find((item) => item.id === relation.to);
    if (!targetContract) errors.push(`Relation ${relation.name} target contract is not authored: ${relation.to}.`);
    else if (relation.cardinality === "many-to-many") {
      const joinContract = (source.tableContracts?.contracts ?? []).find((item) => item.id === relation.through?.tableId);
      if (!joinContract) errors.push(`Many-to-many relation ${relation.name} requires an authored join-table contract: ${relation.through?.tableId ?? "<missing>"}.`);
      else {
        const sourceFk = joinContract.foreignKeys?.find((item) => item.name === relation.through?.sourceForeignKey);
        const targetFk = joinContract.foreignKeys?.find((item) => item.name === relation.through?.targetForeignKey);
        if (sourceFk?.references !== contract.id) errors.push(`Many-to-many relation ${relation.name} source join key must reference ${contract.id}.`);
        if (targetFk?.references !== relation.to) errors.push(`Many-to-many relation ${relation.name} target join key must reference ${relation.to}.`);
        if (sourceFk && targetFk && relation.through.sourceForeignKey === relation.through.targetForeignKey) errors.push(`Many-to-many relation ${relation.name} must identify two distinct join-table foreign keys.`);
      }
    } else {
      for (const [index, field] of (relation.toFields ?? []).entries()) {
        if (!has(targetContract.fields, field)) errors.push(`Relation ${relation.name} targets unknown field ${relation.to}.${field}.`);
        const localField = fields[relation.from?.[index]];
        const targetField = targetContract.fields?.[field];
        if (localField && targetField && localField.type !== targetField.type) errors.push(`Relation ${relation.name} has incompatible scalar types for ${relation.from[index]} and ${relation.to}.${field}.`);
      }
      if ((relation.from ?? []).length !== (relation.toFields ?? []).length) errors.push(`Relation ${relation.name} source and target field counts differ.`);
    }
  }
  if (Array.isArray(contract.primaryKey)) {
    if (!contract.primaryKey.length) errors.push("A complete table contract requires a non-empty primary key.");
    if (contract.primaryKey.some((name) => fields[name]?.nullable === true)) errors.push("Primary key fields cannot be nullable.");
  }
  for (const section of REQUIRED_SECTIONS) if (!has(contract, section)) errors.push(`Missing required section: ${section}.`);
  const sectionValues = {
    fields: Object.keys(fields).length > 0,
    primaryKey: Array.isArray(contract.primaryKey) && contract.primaryKey.length > 0,
    uniqueConstraints: Array.isArray(contract.uniqueConstraints),
    foreignKeys: Array.isArray(contract.foreignKeys),
    relations: Array.isArray(contract.relations),
    indexes: Array.isArray(contract.indexes),
    ownership: Boolean(contract.ownership?.owner && contract.ownership?.steward),
    lifecycle: Boolean(contract.lifecycle?.createdAt && contract.lifecycle?.updatedAt),
  };
  for (const [section, complete] of Object.entries(sectionValues)) if (!complete) errors.push(`Section ${section} is not complete.`);
  if (!provenanceApproved(contract.ownership?.provenance)) errors.push("Ownership must have approved provenance.");
  if (!provenanceApproved(contract.lifecycle?.provenance)) errors.push("Lifecycle must have approved provenance.");
  for (const fieldName of [contract.lifecycle?.createdAt, contract.lifecycle?.updatedAt, contract.lifecycle?.softDeleteField].filter(Boolean)) {
    if (!fieldNames.has(fieldName)) errors.push(`Lifecycle references unknown field ${fieldName}.`);
  }
  if (contract.ownership?.tenantKey && !fieldNames.has(contract.ownership.tenantKey)) errors.push(`Ownership references unknown tenant key field ${contract.ownership.tenantKey}.`);
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

export function assessContractCoverage(tableIds, source) {
  const contracts = new Map((source.tableContracts?.contracts ?? []).map((item) => [item.id, item]));
  const entries = sorted(tableIds).map((tableId) => {
    const contract = contracts.get(tableId);
    if (!contract) return { tableId, status: "NAME_ONLY", missingSections: [...REQUIRED_SECTIONS, "provenance"], fieldCount: 0, errors: [] };
    const validation = validateTableContract(contract, source);
    const missingSections = REQUIRED_SECTIONS.filter((section) => !has(contract, section) || (section === "fields" && !Object.keys(contract.fields ?? {}).length) || (section === "primaryKey" && !contract.primaryKey?.length));
    return { tableId, status: validation.valid ? "COMPLETE" : "PARTIAL", missingSections, fieldCount: Object.keys(contract.fields ?? {}).length, errors: validation.errors };
  });
  const counts = { total: entries.length, complete: entries.filter((item) => item.status === "COMPLETE").length, partial: entries.filter((item) => item.status === "PARTIAL").length, nameOnly: entries.filter((item) => item.status === "NAME_ONLY").length };
  const byContext = Object.fromEntries(sorted(new Set(entries.map((entry) => entry.tableId.split(".")[0]))).map((contextId) => {
    const rows = entries.filter((entry) => entry.tableId.startsWith(`${contextId}.`));
    return [contextId, { total: rows.length, complete: rows.filter((item) => item.status === "COMPLETE").length, partial: rows.filter((item) => item.status === "PARTIAL").length, nameOnly: rows.filter((item) => item.status === "NAME_ONLY").length }];
  }));
  return { status: counts.complete === counts.total && counts.total > 0 ? "SCHEMA_READY" : "SCHEMA_INCOMPLETE", counts, byContext, entries };
}

export function diffTableContracts(before, after) {
  const beforeById = new Map((before?.contracts ?? []).map((item) => [item.id, item]));
  const afterById = new Map((after?.contracts ?? []).map((item) => [item.id, item]));
  const added = sorted([...afterById.keys()].filter((id) => !beforeById.has(id)));
  const removed = sorted([...beforeById.keys()].filter((id) => !afterById.has(id)));
  const changed = [];
  for (const id of sorted([...afterById.keys()].filter((key) => beforeById.has(key)))) {
    const left = beforeById.get(id); const right = afterById.get(id);
    const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])])) : value;
    const beforeStable = stable(left); const afterStable = stable(right);
    if (JSON.stringify(beforeStable) !== JSON.stringify(afterStable)) {
      const paths = [];
      const visit = (a, b, path = "") => {
        if (JSON.stringify(stable(a)) === JSON.stringify(stable(b))) return;
        if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
          for (const key of sorted(new Set([...Object.keys(a), ...Object.keys(b)]))) visit(a[key], b[key], path ? `${path}.${key}` : key);
        } else paths.push(path || "$");
      };
      visit(left, right);
      changed.push({ tableId: id, before: left, after: right, changedPaths: paths });
    }
  }
  return { added, removed, changed, unchanged: sorted([...afterById.keys()].filter((id) => beforeById.has(id) && JSON.stringify(beforeById.get(id)) === JSON.stringify(afterById.get(id)))) };
}
