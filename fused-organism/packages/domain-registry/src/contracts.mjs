import { createHash } from "node:crypto";

const REQUIRED_SECTIONS = ["fields", "enums", "primaryKey", "uniqueConstraints", "foreignKeys", "relations", "indexes", "ownership", "lifecycle"];
const REQUIRED_REVIEW = "approved";
const sorted = (items) => [...items].sort((a, b) => String(a).localeCompare(String(b)));
const has = (value, key) => Object.hasOwn(value ?? {}, key);
const allContracts = (source) => {
  const contracts = new Map((source.authoredContracts ?? []).map((contract) => [contract.id, contract]));
  for (const contract of source.draftContracts ?? []) contracts.set(contract.id, contract);
  for (const contract of source.tableContracts?.contracts ?? []) contracts.set(contract.id, contract);
  return [...contracts.values()];
};

function provenanceValid(value, requireApproval, fallback) {
  const provenance = value ?? fallback;
  if (provenance?.kind === "MAATAA_AUTHORED") {
    const hasEvidence = Array.isArray(provenance.evidence) && provenance.evidence.length > 0 && provenance.evidence.every((item) => typeof item === "string" && item.trim());
    return hasEvidence && (!requireApproval || typeof provenance.reviewedBy === "string" && provenance.reviewedBy.trim());
  }
  if (provenance?.kind === "ADOPTED_SOURCE") {
    const validAdoption = typeof provenance.source === "string" && provenance.source.trim() && typeof provenance.sourceRevision === "string" && provenance.sourceRevision.trim();
    return validAdoption && (!requireApproval || typeof provenance.reviewedBy === "string" && provenance.reviewedBy.trim());
  }
  const statusValid = requireApproval
    ? provenance?.reviewStatus === REQUIRED_REVIEW
    : ["unreviewed", "reviewed", REQUIRED_REVIEW].includes(provenance?.reviewStatus);
  return statusValid && typeof provenance?.source === "string" && provenance.source.trim() && typeof provenance.reference === "string" && provenance.reference.trim();
}

function validateContract(contract, source, { requireApproval }) {
  const errors = [];
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) return { valid: false, errors: ["Contract must be an object."] };
  const table = (source.domains.tables ?? []).find((item) => item.id === contract.id);
  if (!table) errors.push(`Unknown canonical table: ${contract.id ?? "<missing>"}.`);
  else if (contract.context !== table.context || contract.name !== table.name) errors.push(`Contract identity does not match canonical table ${table.id}.`);
  const scalarIds = new Set((source.scalarTypes?.types ?? []).map((item) => item.id));
  const enumIds = new Set((contract.enums ?? []).map((item) => item.id));
  if (![undefined, "DRAFT", "REVIEWED", "CANONICAL"].includes(contract.schemaLifecycle)) errors.push(`Unknown schema lifecycle ${contract.schemaLifecycle}.`);
  if (requireApproval && contract.schemaLifecycle && contract.schemaLifecycle !== "CANONICAL") errors.push(`Only CANONICAL contracts may enter the canonical registry; found ${contract.schemaLifecycle}.`);
  if (!provenanceValid(contract.provenance, requireApproval)) errors.push(requireApproval ? "Table provenance must be reviewed and provide valid evidence." : "Table provenance must provide valid evidence or source references.");
  if (!contract.version || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(contract.version)) errors.push("Contract must have a semantic version.");
  const fields = contract.fields && typeof contract.fields === "object" && !Array.isArray(contract.fields) ? contract.fields : {};
  for (const [fieldName, field] of Object.entries(fields)) {
    if (!field || typeof field !== "object") { errors.push(`Field ${fieldName} must be an object.`); continue; }
    const type = field.type === "enum" ? "enum" : field.type;
    if (type !== "enum" && !scalarIds.has(type)) errors.push(`Field ${fieldName} uses unknown scalar type ${field.type ?? "<missing>"}.`);
    if (typeof field.nullable !== "boolean") errors.push(`Field ${fieldName} must declare nullability.`);
    if (has(field, "generated") && typeof field.generated !== "boolean") errors.push(`Field ${fieldName} generated must be boolean when declared.`);
    if (!provenanceValid(field.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? `Field ${fieldName} provenance must be reviewed and provide valid evidence.` : `Field ${fieldName} provenance must provide valid evidence or inherit table provenance.`);
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
    if (!provenanceValid(enumDefinition.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? `Enum ${enumDefinition.id ?? "<missing>"} provenance must be reviewed and provide valid evidence.` : `Enum ${enumDefinition.id ?? "<missing>"} provenance must provide valid evidence or inherit table provenance.`);
  }
  const fieldNames = new Set(Object.keys(fields));
  const contractById = new Map(allContracts(source).map((item) => [item.id, item]));
  const checkFields = (owner, names) => {
    for (const name of names ?? []) if (!fieldNames.has(name)) errors.push(`${owner} references unknown field ${name}.`);
  };
  checkFields("primaryKey", contract.primaryKey);
  for (const constraint of contract.uniqueConstraints ?? []) {
    checkFields(`unique constraint ${constraint.name}`, constraint.fields);
    if (!provenanceValid(constraint.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? `Unique constraint ${constraint.name} provenance must be reviewed and provide valid evidence.` : `Unique constraint ${constraint.name} provenance must provide valid evidence or inherit table provenance.`);
  }
  for (const index of contract.indexes ?? []) {
    checkFields(`index ${index.name}`, index.fields);
    if (!provenanceValid(index.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? `Index ${index.name} provenance must be reviewed and provide valid evidence.` : `Index ${index.name} provenance must provide valid evidence or inherit table provenance.`);
  }
  const invariantNames = new Set();
  for (const invariant of contract.invariants ?? []) {
    if (!invariant.name || invariantNames.has(invariant.name)) errors.push(`Invariant names must be present and unique on ${contract.id}.`);
    invariantNames.add(invariant.name);
    if (invariant.kind === "strictly-ordered-uuid-pair") {
      checkFields(`invariant ${invariant.name}`, invariant.fields);
      if ((invariant.fields ?? []).length !== 2 || invariant.fields.some((name) => fields[name]?.type !== "uuid" || fields[name]?.nullable)) errors.push(`Invariant ${invariant.name} requires two non-null UUID fields.`);
      if (invariant.comparison !== "uuid-binary-ascending") errors.push(`Invariant ${invariant.name} must declare UUID binary ordering.`);
    } else if (invariant.kind === "conditional-nullability") {
      checkFields(`invariant ${invariant.name}`, [invariant.discriminator, invariant.field]);
      const definition = (contract.enums ?? []).find((item) => item.id === fields[invariant.discriminator]?.enumId);
      const nullableWhen = new Set(invariant.nullableWhen ?? []);
      const requiredWhen = new Set(invariant.requiredWhen ?? []);
      if (fields[invariant.field]?.nullable !== true) errors.push(`Invariant ${invariant.name} requires nullable field ${invariant.field}.`);
      if (!definition || !nullableWhen.size || !requiredWhen.size || [...nullableWhen].some((value) => !definition.values.includes(value)) || [...requiredWhen].some((value) => !definition.values.includes(value)) || [...nullableWhen].some((value) => requiredWhen.has(value)) || new Set([...nullableWhen, ...requiredWhen]).size !== definition?.values.length) errors.push(`Invariant ${invariant.name} must cover every discriminator enum value exactly once.`);
    } else if (invariant.kind === "at-most-one-active-row") {
      checkFields(`invariant ${invariant.name}`, [...(invariant.keyFields ?? []), invariant.activeWhenNull]);
      if (!invariant.keyFields?.length || invariant.keyFields.includes(invariant.activeWhenNull)) errors.push(`Invariant ${invariant.name} needs key fields distinct from its active marker.`);
      if (fields[invariant.activeWhenNull]?.nullable !== true) errors.push(`Invariant ${invariant.name} active marker ${invariant.activeWhenNull} must be nullable.`);
    } else errors.push(`Invariant ${invariant.name ?? "<missing>"} has unsupported kind ${invariant.kind ?? "<missing>"}.`);
  }
  for (const key of contract.foreignKeys ?? []) {
    checkFields(`foreign key ${key.name}`, key.fields);
    const target = (source.domains.tables ?? []).find((item) => item.id === key.references);
    if (!target) errors.push(`Foreign key ${key.name} references unknown table ${key.references}.`);
    const targetContract = contractById.get(key.references);
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
    if (!provenanceValid(key.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? `Foreign key ${key.name} provenance must be reviewed and provide valid evidence.` : `Foreign key ${key.name} provenance must provide valid evidence or inherit table provenance.`);
  }
  for (const relation of contract.relations ?? []) {
    checkFields(`relation ${relation.name}`, relation.from);
    if (!provenanceValid(relation.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? `Relation ${relation.name} provenance must be reviewed and provide valid evidence.` : `Relation ${relation.name} provenance must provide valid evidence or inherit table provenance.`);
    const target = (source.domains.tables ?? []).find((item) => item.id === relation.to);
    if (!target) errors.push(`Relation ${relation.name} targets unknown table ${relation.to}.`);
    const targetContract = contractById.get(relation.to);
    if (!targetContract) errors.push(`Relation ${relation.name} target contract is not authored: ${relation.to}.`);
    else if (relation.cardinality === "many-to-many") {
      const joinContract = contractById.get(relation.through?.tableId);
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
    lifecycle: Boolean(contract.lifecycle?.createdAt && retentionResolved),
  };
  for (const [section, complete] of Object.entries(sectionValues)) if (!complete) errors.push(`Section ${section} is not complete.`);
  if (!provenanceValid(contract.ownership?.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? "Ownership must have reviewed provenance." : "Ownership must have valid provenance or inherit table provenance.");
  if (!provenanceValid(contract.lifecycle?.provenance, requireApproval, contract.provenance)) errors.push(requireApproval ? "Lifecycle must have reviewed provenance." : "Lifecycle must have valid provenance or inherit table provenance.");
  for (const fieldName of [contract.lifecycle?.createdAt, contract.lifecycle?.updatedAt, contract.lifecycle?.softDeleteField].filter(Boolean)) {
    if (!fieldNames.has(fieldName)) errors.push(`Lifecycle references unknown field ${fieldName}.`);
  }
  for (const tenantKey of (Array.isArray(contract.ownership?.tenantKey) ? contract.ownership.tenantKey : [contract.ownership?.tenantKey]).filter(Boolean)) {
    if (!fieldNames.has(tenantKey)) errors.push(`Ownership references unknown tenant key field ${tenantKey}.`);
  }
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
  const canonicalRows = source.tableContracts?.contracts ?? [];
  const canonicalIds = new Set(canonicalRows.map((item) => item.id));
  const draftRows = source.draftContracts ?? [];
  const draftIds = new Set(draftRows.map((item) => item.id));
  const rows = [
    ...(source.authoredContracts ?? []).filter((item) => !canonicalIds.has(item.id) && !draftIds.has(item.id)),
    ...draftRows.filter((item) => !canonicalIds.has(item.id)),
    ...canonicalRows,
  ];
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

export function assessDraftCompileTestability(tableIds, source) {
  const contracts = new Map(allContracts(source).map((item) => [item.id, item]));
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
  return { status: counts.total > 0 && counts.structurallyComplete === counts.total ? "DRAFT_COMPILE_TESTABLE" : "SCHEMA_INCOMPLETE", counts, entries };
}

function createLogicalModel(tableIds, contracts, source, readiness, { authority, prismaEligible }) {
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
  const canonicalIds = new Set((source.tableContracts?.contracts ?? []).map((item) => item.id));
  const model = {
    schemaVersion: "1.0.0",
    modelKind: "logical-relational-v1",
    authority,
    prismaEligible,
    tables: [...closure].sort().map((id) => {
      const { context, name, version, fields, enums, primaryKey, uniqueConstraints, foreignKeys, relations, indexes, invariants, ownership, lifecycle, provenance } = contracts.get(id);
      const contract = contracts.get(id);
      return stable({ id, context, name, version, schemaLifecycle: contract.schemaLifecycle ?? (canonicalIds.has(id) ? "CANONICAL" : "DRAFT"), fields, enums, primaryKey, uniqueConstraints, foreignKeys, relations, indexes, invariants: invariants ?? [], ownership, lifecycle, provenance, sourceAuthority: canonicalIds.has(id) ? "CANONICAL_APPROVED" : "AUTHORED_NONCANONICAL" });
    }),
  };
  const serialized = JSON.stringify(stable(model));
  return {
    status: authority === "CANONICAL_APPROVED_ONLY" ? "LOGICAL_SCHEMA_READY" : "DRAFT_LOGICAL_SCHEMA_READY",
    authority,
    prismaEligible,
    deployable: false,
    migrationExecutable: false,
    compileTestability: { status: readiness.status, counts: readiness.counts },
    requestedTableIds: [...new Set(tableIds)].sort(),
    dependencyTableIds: [...closure].filter((id) => !tableIds.includes(id)).sort(),
    model,
    schemaHash: createHash("sha256").update(serialized).digest("hex"),
  };
}

/** Structural-only logical proof. May include authored proposals; output is never Prisma eligible. */
export function compileDraftLogicalSchema(tableIds, source) {
  const readiness = assessDraftCompileTestability(tableIds, source);
  if (readiness.status !== "DRAFT_COMPILE_TESTABLE") return { status: "BLOCKED", authority: "DRAFT_OR_MIXED", prismaEligible: false, readiness, blockers: readiness.entries.flatMap((entry) => entry.errors.map((reason) => ({ tableId: entry.tableId, reason }))) };
  return createLogicalModel(tableIds, new Map(allContracts(source).map((item) => [item.id, item])), source, readiness, { authority: "DRAFT_OR_MIXED", prismaEligible: true });
}

/** Canonical compiler boundary. Only approved registry rows may enter the logical schema. */
export function compileLogicalSchema(tableIds, source) {
  const canonicalRows = source.tableContracts?.contracts ?? [];
  const contracts = new Map(canonicalRows.map((item) => [item.id, item]));
  const canonicalCounts = new Map();
  for (const item of canonicalRows) canonicalCounts.set(item.id, (canonicalCounts.get(item.id) ?? 0) + 1);
  const entries = sorted(tableIds).map((tableId) => {
    const contract = contracts.get(tableId);
    if (!contract) return { tableId, status: "NONCANONICAL_OR_NAME_ONLY", fieldCount: 0, errors: ["No approved canonical table contract exists."] };
    const errors = [];
    const visited = new Set();
    const visit = (id, owner) => {
      if (visited.has(id)) return;
      visited.add(id);
      const current = contracts.get(id);
      if (!current) {
        errors.push(`${owner}: dependency ${id} is not in the approved canonical contract registry.`);
        return;
      }
      if (canonicalCounts.get(id) > 1) errors.push(`${id}: duplicate canonical contract ID.`);
      errors.push(...validateTableContract(current, source).errors.map((error) => `${id}: ${error}`));
      for (const dependency of [
        ...(current.foreignKeys ?? []).map((item) => item.references),
        ...(current.relations ?? []).map((item) => item.to),
        ...(current.relations ?? []).filter((item) => item.cardinality === "many-to-many").map((item) => item.through?.tableId),
      ].filter(Boolean)) visit(dependency, current.id);
    };
    visit(tableId, tableId);
    if (new Set(tableIds).size !== tableIds.length) errors.push("Requested table IDs contain duplicates.");
    return { tableId, status: errors.length ? "BLOCKED" : "CANONICAL_COMPLETE", fieldCount: Object.keys(contract.fields ?? {}).length, errors: [...new Set(errors)] };
  });
  const counts = { total: entries.length, canonicalComplete: entries.filter((item) => item.status === "CANONICAL_COMPLETE").length, blocked: entries.filter((item) => item.status !== "CANONICAL_COMPLETE").length };
  const readiness = { status: counts.total > 0 && counts.blocked === 0 ? "CANONICAL_COMPILE_READY" : "SOURCE_BOUNDARY_BLOCKED", counts, entries };
  if (readiness.status !== "CANONICAL_COMPILE_READY") return { status: "BLOCKED", authority: "CANONICAL_APPROVED_ONLY", prismaEligible: false, readiness, blockers: entries.flatMap((entry) => entry.errors.map((reason) => ({ tableId: entry.tableId, reason }))) };
  return createLogicalModel(tableIds, contracts, source, { status: "CANONICAL_COMPILE_READY", counts: { total: counts.total, structurallyComplete: counts.canonicalComplete, partial: 0, nameOnly: 0 } }, { authority: "CANONICAL_APPROVED_ONLY", prismaEligible: true });
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
