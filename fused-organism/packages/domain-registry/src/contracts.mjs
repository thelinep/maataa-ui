import { createHash } from "node:crypto";

const REQUIRED_SECTIONS = ["fields", "enums", "primaryKey", "uniqueConstraints", "foreignKeys", "relations", "indexes", "ownership", "lifecycle"];
const REQUIRED_REVIEW = "approved";
const sorted = (items) => [...items].sort((a, b) => String(a).localeCompare(String(b)));
const has = (value, key) => Object.hasOwn(value ?? {}, key);

function provenanceValid(value, requireApproval) {
  const statusValid = requireApproval
    ? value?.reviewStatus === REQUIRED_REVIEW
    : ["unreviewed", "reviewed", REQUIRED_REVIEW].includes(value?.reviewStatus);
  return statusValid && typeof value.source === "string" && value.source.trim() && typeof value.reference === "string" && value.reference.trim();
}

function validateContract(contract, source, { requireApproval }) {
  const errors = [];
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) return { valid: false, errors: ["Contract must be an object."] };
  const table = (source.domains.tables ?? []).find((item) => item.id === contract.id);
  if (!table) errors.push(`Unknown canonical table: ${contract.id ?? "<missing>"}.`);
  else if (contract.context !== table.context || contract.name !== table.name) errors.push(`Contract identity does not match canonical table ${table.id}.`);
  const scalarIds = new Set((source.scalarTypes?.types ?? []).map((item) => item.id));
  const enumIds = new Set((contract.enums ?? []).map((item) => item.id));
  if (!provenanceValid(contract.provenance, requireApproval)) errors.push(requireApproval ? "Table provenance must cite a source and reference and be approved." : "Table provenance must cite a source, reference, and valid review status.");
  if (!contract.version || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(contract.version)) errors.push("Contract must have a semantic version.");
  const fields = contract.fields && typeof contract.fields === "object" && !Array.isArray(contract.fields) ? contract.fields : {};
  for (const [fieldName, field] of Object.entries(fields)) {
    if (!field || typeof field !== "object") { errors.push(`Field ${fieldName} must be an object.`); continue; }
    const type = field.type === "enum" ? "enum" : field.type;
    if (type !== "enum" && !scalarIds.has(type)) errors.push(`Field ${fieldName} uses unknown scalar type ${field.type ?? "<missing>"}.`);
    if (typeof field.nullable !== "boolean") errors.push(`Field ${fieldName} must declare nullability.`);
    if (typeof field.generated !== "boolean") errors.push(`Field ${fieldName} must declare whether it is generated.`);
    if (!provenanceValid(field.provenance, requireApproval)) errors.push(requireApproval ? `Field ${fieldName} provenance must be approved and source-backed.` : `Field ${fieldName} provenance must be source-backed with a valid review status.`);
    if (field.type === "string" && !Number.isInteger(field.maxLength)) errors.push(`Field ${fieldName} needs maxLength for bounded string semantics.`);
    if (field.type === "decimal" && (!Number.isInteger(field.precision) || !Number.isInteger(field.scale) || field.scale > field.precision)) errors.push(`Field ${fieldName} needs valid decimal precision and scale.`);
    if (field.type === "datetime" && !field.timezone) errors.push(`Field ${fieldName} must declare timezone semantics.`);
    if (field.type === "enum" && !enumIds.has(field.enumId)) errors.push(`Field ${fieldName} references missing enum ${field.enumId ?? "<missing>"}.`);
    if (has(field, "defaultLiteral") && has(field, "defaultExpression")) errors.push(`Field ${fieldName} cannot have both defaultLiteral and defaultExpression; their meanings are distinct.`);
    if (field.defaultExpression && !["current-timestamp", "uuid-v4", "database-native"].includes(field.defaultExpression.kind)) errors.push(`Field ${fieldName} has an unsupported default expression kind.`);
    if (field.defaultExpression?.kind === "database-native" && (!field.defaultExpression.expression?.trim() || !field.defaultExpression.dialect?.trim())) errors.push(`Field ${fieldName} database-native default must preserve its expression and dialect explicitly.`);
    const explicitUuidGeneration = field.defaultExpression?.kind === "uuid-v4";
    if (field.generated === true && (has(field, "defaultLiteral") || (has(field, "defaultExpression") && !explicitUuidGeneration))) errors.push(`Field ${fieldName} cannot declare generated behavior and a default without an explicit generation rule.`);
  }
  for (const enumDefinition of contract.enums ?? []) {
    if (!enumDefinition.id || !Array.isArray(enumDefinition.values) || !enumDefinition.values.length || new Set(enumDefinition.values).size !== enumDefinition.values.length) errors.push(`Enum ${enumDefinition.id ?? "<missing>"} must have a unique, non-empty value list.`);
    if (!provenanceValid(enumDefinition.provenance, requireApproval)) errors.push(requireApproval ? `Enum ${enumDefinition.id ?? "<missing>"} provenance must be approved and source-backed.` : `Enum ${enumDefinition.id ?? "<missing>"} provenance must be source-backed with a valid review status.`);
  }
  const fieldNames = new Set(Object.keys(fields));
  const checkFields = (owner, names) => {
    for (const name of names ?? []) if (!fieldNames.has(name)) errors.push(`${owner} references unknown field ${name}.`);
  };
  checkFields("primaryKey", contract.primaryKey);
  for (const constraint of contract.uniqueConstraints ?? []) {
    checkFields(`unique constraint ${constraint.name}`, constraint.fields);
    if (!provenanceValid(constraint.provenance, requireApproval)) errors.push(requireApproval ? `Unique constraint ${constraint.name} provenance must be approved and source-backed.` : `Unique constraint ${constraint.name} provenance must be source-backed with a valid review status.`);
  }
  for (const index of contract.indexes ?? []) {
    checkFields(`index ${index.name}`, index.fields);
    if (!provenanceValid(index.provenance, requireApproval)) errors.push(requireApproval ? `Index ${index.name} provenance must be approved and source-backed.` : `Index ${index.name} provenance must be source-backed with a valid review status.`);
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
    if (!provenanceValid(key.provenance, requireApproval)) errors.push(requireApproval ? `Foreign key ${key.name} provenance must be approved and source-backed.` : `Foreign key ${key.name} provenance must be source-backed with a valid review status.`);
  }
  for (const relation of contract.relations ?? []) {
    checkFields(`relation ${relation.name}`, relation.from);
    if (!provenanceValid(relation.provenance, requireApproval)) errors.push(requireApproval ? `Relation ${relation.name} provenance must be approved and source-backed.` : `Relation ${relation.name} provenance must be source-backed with a valid review status.`);
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
  const retentionPolicy = contract.lifecycle?.retentionPolicy;
  const retentionDefined = typeof retentionPolicy === "string" && retentionPolicy.trim().length > 0;
  const retentionResolved = retentionDefined && (!requireApproval || !/^(?:PENDING_REVIEW|UNRESOLVED|TBD|TODO|PROPOSED)(?:\b|:)/i.test(retentionPolicy.trim()));
  if (!retentionResolved) errors.push(requireApproval ? "Lifecycle must declare a concrete retention policy or an explicit approved no-retention policy." : "Lifecycle must declare a retention policy for compiler modeling.");
  const sectionValues = {
    fields: Object.keys(fields).length > 0,
    primaryKey: Array.isArray(contract.primaryKey) && contract.primaryKey.length > 0,
    uniqueConstraints: Array.isArray(contract.uniqueConstraints),
    foreignKeys: Array.isArray(contract.foreignKeys),
    relations: Array.isArray(contract.relations),
    indexes: Array.isArray(contract.indexes),
    ownership: Boolean(contract.ownership?.owner && contract.ownership?.steward),
    lifecycle: Boolean(contract.lifecycle?.createdAt && contract.lifecycle?.updatedAt && retentionResolved),
  };
  for (const [section, complete] of Object.entries(sectionValues)) if (!complete) errors.push(`Section ${section} is not complete.`);
  if (!provenanceValid(contract.ownership?.provenance, requireApproval)) errors.push(requireApproval ? "Ownership must have approved provenance." : "Ownership must have source-backed provenance with a valid review status.");
  if (!provenanceValid(contract.lifecycle?.provenance, requireApproval)) errors.push(requireApproval ? "Lifecycle must have approved provenance." : "Lifecycle must have source-backed provenance with a valid review status.");
  for (const fieldName of [contract.lifecycle?.createdAt, contract.lifecycle?.updatedAt, contract.lifecycle?.softDeleteField].filter(Boolean)) {
    if (!fieldNames.has(fieldName)) errors.push(`Lifecycle references unknown field ${fieldName}.`);
  }
  if (contract.ownership?.tenantKey && !fieldNames.has(contract.ownership.tenantKey)) errors.push(`Ownership references unknown tenant key field ${contract.ownership.tenantKey}.`);
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

export function validateTableContract(contract, source) {
  return validateContract(contract, source, { requireApproval: true });
}

export function validateTableContractStructure(contract, source) {
  return validateContract(contract, source, { requireApproval: false });
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

function validateStructuralClosure(root, source) {
  const rows = source.tableContracts?.contracts ?? [];
  const contracts = new Map(rows.map((item) => [item.id, item]));
  const counts = new Map();
  for (const item of rows) counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
  const visited = new Set();
  const errors = [];
  const visit = (contract) => {
    if (!contract || visited.has(contract.id)) return;
    visited.add(contract.id);
    if (counts.get(contract.id) > 1) errors.push(`${contract.id}: duplicate authored contract ID.`);
    const validation = validateTableContractStructure(contract, source);
    errors.push(...validation.errors.map((error) => `${contract.id}: ${error}`));
    const dependencies = [
      ...(contract.foreignKeys ?? []).map((item) => item.references),
      ...(contract.relations ?? []).map((item) => item.to),
      ...(contract.relations ?? []).filter((item) => item.cardinality === "many-to-many").map((item) => item.through?.tableId),
    ].filter(Boolean);
    for (const id of dependencies) {
      const target = contracts.get(id);
      if (!target) errors.push(`${contract.id}: schema dependency has no authored contract: ${id}.`);
      else visit(target);
    }
  };
  visit(root);
  return [...new Set(errors)];
}

export function assessCompileTestability(tableIds, source) {
  const contracts = new Map((source.tableContracts?.contracts ?? []).map((item) => [item.id, item]));
  const entries = sorted(tableIds).map((tableId) => {
    const contract = contracts.get(tableId);
    if (!contract) return { tableId, status: "NAME_ONLY", fieldCount: 0, errors: ["No table contract is authored."] };
    const errors = validateStructuralClosure(contract, source);
    return { tableId, status: errors.length ? "PARTIAL" : "STRUCTURALLY_COMPLETE", fieldCount: Object.keys(contract.fields ?? {}).length, errors };
  });
  const counts = {
    total: entries.length,
    structurallyComplete: entries.filter((item) => item.status === "STRUCTURALLY_COMPLETE").length,
    partial: entries.filter((item) => item.status === "PARTIAL").length,
    nameOnly: entries.filter((item) => item.status === "NAME_ONLY").length,
  };
  return { status: counts.total > 0 && counts.structurallyComplete === counts.total ? "COMPILE_TESTABLE" : "SCHEMA_INCOMPLETE", counts, entries };
}

export function compileLogicalSchema(tableIds, source) {
  const readiness = assessCompileTestability(tableIds, source);
  if (readiness.status !== "COMPILE_TESTABLE") return { status: "BLOCKED", readiness, blockers: readiness.entries.flatMap((entry) => entry.errors.map((reason) => ({ tableId: entry.tableId, reason }))) };
  const contracts = new Map((source.tableContracts?.contracts ?? []).map((item) => [item.id, item]));
  const closure = new Set();
  const visit = (id) => {
    if (closure.has(id)) return;
    const contract = contracts.get(id);
    if (!contract) return;
    closure.add(id);
    for (const dependency of [
      ...(contract.foreignKeys ?? []).map((item) => item.references),
      ...(contract.relations ?? []).map((item) => item.to),
      ...(contract.relations ?? []).filter((item) => item.cardinality === "many-to-many").map((item) => item.through?.tableId),
    ].filter(Boolean)) visit(dependency);
  };
  for (const id of tableIds) visit(id);
  const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])])) : value;
  const model = {
    schemaVersion: "1.0.0",
    modelKind: "logical-relational-v1",
    tables: [...closure].sort().map((id) => {
      const { context, name, version, fields, enums, primaryKey, uniqueConstraints, foreignKeys, relations, indexes, ownership, lifecycle, provenance } = contracts.get(id);
      return stable({ id, context, name, version, fields, enums, primaryKey, uniqueConstraints, foreignKeys, relations, indexes, ownership, lifecycle, provenance });
    }),
  };
  const serialized = JSON.stringify(stable(model));
  return {
    status: "LOGICAL_SCHEMA_READY",
    compileTestability: { status: readiness.status, counts: readiness.counts },
    requestedTableIds: [...new Set(tableIds)].sort(),
    dependencyTableIds: [...closure].filter((id) => !tableIds.includes(id)).sort(),
    model,
    schemaHash: createHash("sha256").update(serialized).digest("hex"),
  };
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
