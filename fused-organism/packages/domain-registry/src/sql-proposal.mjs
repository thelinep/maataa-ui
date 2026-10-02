const quote = String.raw`(?:"(?:[^"]|"")+"|[A-Za-z_][A-Za-z0-9_$]*)`;
const qualifiedIdentifier = `${quote}(?:\\.${quote})?`;
const identifierPattern = (prefix, suffix = "") => new RegExp(`^\\s*${prefix}(${qualifiedIdentifier})${suffix}`, "i");
const unquote = (value) => String(value ?? "").split(".").map((part) => part.replace(/^"|"$/g, "").replace(/""/g, '"')).join(".");
const splitTopLevel = (value, delimiter = ",") => {
  const result = []; let start = 0; let depth = 0; let quoteChar = null;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]; const next = value[i + 1];
    if (quoteChar) {
      if (char === quoteChar && next === quoteChar && quoteChar !== "[") { i += 1; continue; }
      if ((quoteChar === "[" && char === "]") || (quoteChar !== "[" && char === quoteChar)) quoteChar = null;
      else if (char === "\\" && quoteChar === "'") i += 1;
      continue;
    }
    if (["'", '"', "`"].includes(char)) { quoteChar = char; continue; }
    if (char === "[") { quoteChar = "["; continue; }
    if (char === "(") depth += 1;
    else if (char === ")") depth -= 1;
    else if (char === delimiter && depth === 0) { result.push(value.slice(start, i).trim()); start = i + 1; }
  }
  result.push(value.slice(start).trim());
  return result.filter(Boolean);
};

function stripComments(sql) {
  let out = ""; let quoteChar = null; let lineComment = false; let blockDepth = 0;
  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i]; const next = sql[i + 1];
    if (lineComment) { if (char === "\n") { lineComment = false; out += char; } continue; }
    if (blockDepth) { if (char === "/" && next === "*") { blockDepth += 1; i += 1; } else if (char === "*" && next === "/") { blockDepth -= 1; i += 1; } continue; }
    if (quoteChar) {
      out += char;
      if (char === quoteChar && next === quoteChar) { out += next; i += 1; }
      else if (char === quoteChar) quoteChar = null;
      else if (char === "\\" && quoteChar === "'") { out += next ?? ""; i += 1; }
      continue;
    }
    if (char === "-" && next === "-") { lineComment = true; i += 1; continue; }
    if (char === "/" && next === "*") { blockDepth = 1; i += 1; continue; }
    if (["'", '"', "`"].includes(char)) quoteChar = char;
    out += char;
  }
  return out;
}

function splitStatements(sql) {
  return splitTopLevel(sql, ";");
}

function findClosingParen(text, open) {
  let depth = 0; let quoteChar = null;
  for (let i = open; i < text.length; i += 1) {
    const char = text[i]; const next = text[i + 1];
    if (quoteChar) {
      if (char === quoteChar && next === quoteChar) { i += 1; continue; }
      if (char === quoteChar) quoteChar = null;
      else if (char === "\\" && quoteChar === "'") i += 1;
      continue;
    }
    if (["'", '"', "`"].includes(char)) { quoteChar = char; continue; }
    if (char === "(") depth += 1;
    if (char === ")" && --depth === 0) return i;
  }
  return -1;
}

function mapType(sourceType) {
  const normalized = sourceType.replace(/\s+/g, " ").trim().toLowerCase();
  const dimensions = normalized.match(/\((\d+)(?:\s*,\s*(\d+))?\)/);
  if (/^(uuid)$/.test(normalized)) return { type: "uuid" };
  if (/^(varchar|character varying|nvarchar)\b/.test(normalized)) return { type: "string", ...(dimensions ? { maxLength: Number(dimensions[1]) } : {}) };
  if (/^(char|character)\b/.test(normalized)) return { type: "string", ...(dimensions ? { maxLength: Number(dimensions[1]) } : {}) };
  if (/^(text|citext)$/.test(normalized)) return { type: "text" };
  if (/^(smallint|integer|int|bigint|serial|bigserial|smallserial)$/.test(normalized)) return { type: "int", ...(normalized.includes("serial") ? { generated: true } : {}) };
  if (/^(numeric|decimal)\b/.test(normalized)) return { type: "decimal", ...(dimensions ? { precision: Number(dimensions[1]), scale: Number(dimensions[2] ?? 0) } : {}) };
  if (/^(real|double precision|float|float4|float8)$/.test(normalized)) return { type: "float" };
  if (/^(boolean|bool)$/.test(normalized)) return { type: "boolean" };
  if (/^(date)$/.test(normalized)) return { type: "date" };
  if (/^timestamp\s+with time zone$/.test(normalized) || /^timestamptz$/.test(normalized)) return { type: "datetime", timezone: "UTC-normalized-instant" };
  if (/^timestamp\s+without time zone$/.test(normalized) || /^timestamp$/.test(normalized)) return { type: "datetime", timezone: "unspecified" };
  if (/^(time|time without time zone)$/.test(normalized)) return { type: "time" };
  if (/^(json|jsonb)$/.test(normalized)) return { type: "json" };
  if (/^(bytea|blob|binary|varbinary)$/.test(normalized)) return { type: "bytes" };
  return null;
}

function parseDefault(raw, dialect) {
  const value = raw.trim().replace(/\s+$/, "");
  if (/^(true|false)$/i.test(value)) return { defaultLiteral: value.toLowerCase() === "true" };
  if (/^null$/i.test(value)) return { defaultLiteral: null };
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return { defaultLiteral: Number(value) };
  const stringLiteral = value.match(/^'((?:[^']|'')*)'$/);
  if (stringLiteral) return { defaultLiteral: stringLiteral[1].replace(/''/g, "'") };
  if (/^(current_timestamp|now\(\))(?:\(\))?$/i.test(value)) return { defaultExpression: { kind: "current-timestamp" } };
  if (/^(gen_random_uuid\(\)|uuid_generate_v4\(\))$/i.test(value)) return { defaultExpression: { kind: "uuid-v4" } };
  return { defaultExpression: { kind: "database-native", expression: value, dialect } };
}

function columnTokens(segment) {
  const match = segment.match(/^\s*("(?:[^"]|"")+"|[A-Za-z_][A-Za-z0-9_$]*)\s+([\s\S]+)$/);
  return match ? { name: unquote(match[1]), rest: match[2].trim() } : null;
}

function parseForeignKey(tableName, constraintName, sourceFields, targetTable, targetFields, body, provenance) {
  const action = (key) => {
    const found = body.match(new RegExp(`ON\\s+${key}\\s+(CASCADE|RESTRICT|SET\\s+NULL|SET\\s+DEFAULT|NO\\s+ACTION)`, "i"));
    return found ? found[1].toLowerCase().replace(/\s+/g, "-") : "no-action";
  };
  return { name: constraintName ?? `${tableName}_${sourceFields.join("_")}_fk`, fields: sourceFields, references: unquote(targetTable), referencedFields: targetFields, onDelete: action("DELETE"), onUpdate: action("UPDATE"), provenance };
}

function parseTableConstraint(segment, tableName, proposal, provenance) {
  let body = segment.trim(); let constraintName = null;
  const named = body.match(/^CONSTRAINT\s+("(?:[^"]|"")+"|[A-Za-z_][A-Za-z0-9_$]*)\s+([\s\S]+)$/i);
  if (named) { constraintName = unquote(named[1]); body = named[2].trim(); }
  let match = body.match(/^PRIMARY\s+KEY\s*\((.*)\)/i);
  if (match) { proposal.primaryKey = splitTopLevel(match[1]).map(unquote); return true; }
  match = body.match(/^UNIQUE\s*(?:\((.*)\))?$/i);
  if (match) { proposal.uniqueConstraints.push({ name: constraintName ?? `${tableName}_unique_${proposal.uniqueConstraints.length + 1}`, fields: splitTopLevel(match[1] ?? "").map(unquote), provenance }); return true; }
  match = body.match(new RegExp(`^FOREIGN\\s+KEY\\s*\\((.*?)\\)\\s+REFERENCES\\s+(${qualifiedIdentifier})\\s*\\((.*?)\\)([\\s\\S]*)$`, "i"));
  if (match) { proposal.foreignKeys.push(parseForeignKey(tableName, constraintName, splitTopLevel(match[1]).map(unquote), match[2], splitTopLevel(match[3]).map(unquote), match[4], provenance)); return true; }
  return false;
}

function parseCreateTable(statement, source, dialect, diagnostics) {
  const match = statement.match(identifierPattern("CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?", "\\s*\\("));
  if (!match) return null;
  const open = statement.indexOf("(", match.index + match[0].indexOf("(") );
  const close = findClosingParen(statement, open);
  if (close < 0) { diagnostics.push({ code: "SQL_CREATE_TABLE_UNCLOSED", statement: statement.slice(0, 80) }); return null; }
  const sourceTable = unquote(match[1]);
  const proposal = { sourceTable, canonicalTableId: null, fields: {}, primaryKey: [], uniqueConstraints: [], foreignKeys: [], relations: [], indexes: [], ownership: null, lifecycle: null, sourceMappingStatus: "UNMAPPED" };
  const provenance = { sourceId: source.id, classification: source.classification, repository: source.repository.url, commitSha: source.repository.commitSha, filePath: source.currentFilePath, reviewStatus: "unreviewed" };
  for (const segment of splitTopLevel(statement.slice(open + 1, close))) {
    if (/^(?:CONSTRAINT\b|PRIMARY\s+KEY\b|UNIQUE\b|FOREIGN\s+KEY\b)/i.test(segment)) {
      if (!parseTableConstraint(segment, sourceTable, proposal, provenance)) diagnostics.push({ code: "SQL_TABLE_CONSTRAINT_UNSUPPORTED", sourceTable, fragment: segment.slice(0, 100) });
      continue;
    }
    const column = columnTokens(segment);
    if (!column) { diagnostics.push({ code: "SQL_COLUMN_UNPARSED", sourceTable, fragment: segment.slice(0, 100) }); continue; }
    const typeMatch = column.rest.match(/^(DOUBLE\s+PRECISION|CHARACTER\s+VARYING|TIMESTAMP\s+WITH\s+TIME\s+ZONE|TIMESTAMP\s+WITHOUT\s+TIME\s+ZONE|TIME\s+WITHOUT\s+TIME\s+ZONE|[A-Za-z_][A-Za-z0-9_]*(?:\s*\([^)]*\))?)/i);
    if (!typeMatch) { diagnostics.push({ code: "SQL_TYPE_UNPARSED", sourceTable, field: column.name, fragment: column.rest.slice(0, 80) }); continue; }
    const sourceType = typeMatch[0].replace(/\s+/g, " ").trim();
    const mapped = mapType(sourceType);
    const rest = column.rest.slice(typeMatch[0].length);
    const generated = mapped?.generated === true || /\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b/i.test(rest);
    const field = { type: mapped?.type ?? null, sourceType, nullable: !/\bNOT\s+NULL\b/i.test(rest) && !/\bPRIMARY\s+KEY\b/i.test(rest), generated, provenance };
    if (mapped) Object.assign(field, Object.fromEntries(Object.entries(mapped).filter(([key]) => !["type", "generated"].includes(key))));
    else diagnostics.push({ code: "SQL_TYPE_UNMAPPED", sourceTable, field: column.name, sourceType });
    if (generated) field.generationStrategy = /serial/i.test(sourceType) ? "serial" : "identity";
    const defaultMatch = rest.match(/\bDEFAULT\s+([\s\S]+?)(?=\s+(?:NOT\s+NULL|NULL|PRIMARY\s+KEY|UNIQUE|REFERENCES|CHECK|CONSTRAINT|GENERATED)\b|$)/i);
    if (defaultMatch) Object.assign(field, parseDefault(defaultMatch[1], dialect));
    if (/\bCHECK\s*\(/i.test(rest)) diagnostics.push({ code: "SQL_CHECK_CONSTRAINT_REVIEW_REQUIRED", sourceTable, field: column.name });
    if (/\bPRIMARY\s+KEY\b/i.test(rest)) proposal.primaryKey.push(column.name);
    if (/\bUNIQUE\b/i.test(rest)) proposal.uniqueConstraints.push({ name: `${sourceTable}_${column.name}_key`, fields: [column.name], provenance });
    const fk = rest.match(new RegExp(`\\bREFERENCES\\s+(${qualifiedIdentifier})\\s*\\((.*?)\\)([\\s\\S]*)`, "i"));
    if (fk) proposal.foreignKeys.push(parseForeignKey(sourceTable, null, [column.name], fk[1], splitTopLevel(fk[2]).map(unquote), fk[3], provenance));
    else if (/\bREFERENCES\b/i.test(rest)) diagnostics.push({ code: "SQL_FOREIGN_KEY_UNPARSED", sourceTable, field: column.name });
    proposal.fields[column.name] = field;
  }
  return { proposal, consumed: statement.slice(0, close + 1).length };
}

function parseIndex(statement, tables, diagnostics, provenance) {
  const match = statement.match(new RegExp(`^\\s*CREATE\\s+(UNIQUE\\s+)?INDEX\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(${quote})\\s+ON\\s+(${qualifiedIdentifier})\\s*(?:USING\\s+([\\w]+)\\s+)?\\s*\\((.*?)\\)`, "i"));
  if (!match) return false;
  const sourceTable = unquote(match[3]); const table = tables.get(sourceTable);
  if (!table) { diagnostics.push({ code: "SQL_INDEX_TABLE_UNSEEN", sourceTable, index: unquote(match[2]) }); return true; }
  const fields = [];
  for (const item of splitTopLevel(match[5])) {
    const parsedField = item.match(/^\s*("(?:[^"]|"")+"|[A-Za-z_][A-Za-z0-9_$]*)(?:\s+(ASC|DESC))?(?:\s+NULLS\s+(FIRST|LAST))?\s*$/i);
    if (!parsedField) { diagnostics.push({ code: "SQL_INDEX_FEATURE_UNSUPPORTED", sourceTable, index: unquote(match[2]), fragment: item }); return true; }
    fields.push(unquote(parsedField[1]));
  }
  if (match[4]) { diagnostics.push({ code: "SQL_INDEX_METHOD_REVIEW_REQUIRED", sourceTable, index: unquote(match[2]), method: match[4] }); }
  table.indexes.push({ name: unquote(match[2]), fields, unique: Boolean(match[1]), ...(match[4] ? { method: match[4] } : {}), provenance });
  return true;
}

export function createSqlContractProposal(sql, { sourceRecord, filePath = "<provided-sql>", dialect = "postgresql" } = {}) {
  if (!sourceRecord?.id || !sourceRecord?.repository?.commitSha || !sourceRecord?.classification) throw new TypeError("A registered source record with repository, commit, and classification is required.");
  const provenanceBase = { sourceId: sourceRecord.id, classification: sourceRecord.classification, repository: sourceRecord.repository.url, commitSha: sourceRecord.repository.commitSha, filePath, reviewStatus: "unreviewed" };
  const diagnostics = []; const tables = new Map(); const enums = [];
  const statements = splitStatements(stripComments(String(sql ?? "")));
  for (const statement of statements) {
    const enumMatch = statement.match(new RegExp(`^\\s*CREATE\\s+TYPE\\s+(${qualifiedIdentifier})\\s+AS\\s+ENUM\\s*\\(([\\s\\S]*)\\)\\s*$`, "i"));
    if (enumMatch) {
      const values = splitTopLevel(enumMatch[2]).map((value) => value.trim().match(/^'((?:[^']|'')*)'$/)?.[1]?.replace(/''/g, "'") ?? null);
      if (values.some((item) => item === null)) diagnostics.push({ code: "SQL_ENUM_VALUE_UNPARSED", enum: unquote(enumMatch[1]) });
      enums.push({ sourceName: unquote(enumMatch[1]), values, provenance: provenanceBase });
      continue;
    }
    const parsed = parseCreateTable(statement, { ...sourceRecord, currentFilePath: filePath }, dialect, diagnostics);
    if (parsed) { tables.set(parsed.proposal.sourceTable, parsed.proposal); continue; }
    if (/^\s*CREATE\s+(?:UNIQUE\s+)?INDEX\b/i.test(statement)) { if (!parseIndex(statement, tables, diagnostics, provenanceBase)) diagnostics.push({ code: "SQL_INDEX_UNSUPPORTED", fragment: statement.slice(0, 120) }); continue; }
    const alter = statement.match(new RegExp(`^\\s*ALTER\\s+TABLE\\s+(?:IF\\s+EXISTS\\s+)?(${qualifiedIdentifier})\\s+ADD\\s+([\\s\\S]+)$`, "i"));
    if (alter) {
      const table = tables.get(unquote(alter[1]));
      if (!table) diagnostics.push({ code: "SQL_ALTER_TABLE_UNSEEN", sourceTable: unquote(alter[1]), fragment: alter[2].slice(0, 100) });
      else if (!parseTableConstraint(alter[2], table.sourceTable, table, provenanceBase)) diagnostics.push({ code: "SQL_ALTER_UNSUPPORTED", sourceTable: table.sourceTable, fragment: alter[2].slice(0, 100) });
      continue;
    }
    diagnostics.push({ code: "SQL_STATEMENT_UNSUPPORTED", fragment: statement.slice(0, 140) });
  }
  const proposalTables = [...tables.values()].map((table) => ({ ...table, enums }));
  const completeness = proposalTables.map((table) => ({ sourceTable: table.sourceTable, canonicalTableId: null, missing: ["canonical table mapping", "approved table and field provenance", "logical relations", "ownership", "lifecycle"] }));
  return {
    proposalSchemaVersion: "1.0.0",
    status: sourceRecord.classification === "AUTHORITATIVE" && diagnostics.length === 0 ? "PROPOSAL_REQUIRES_REVIEW" : "CANDIDATE_SOURCE_PROPOSAL",
    source: { id: sourceRecord.id, classification: sourceRecord.classification, repository: sourceRecord.repository.url, commitSha: sourceRecord.repository.commitSha, filePath, dialect },
    sourcePolicy: "Proposal only. This artifact is not a canonical table contract and is never written to data/table-contracts.json by this importer.",
    tables: proposalTables,
    completeness,
    diagnostics,
    requiresHumanReview: true,
  };
}
