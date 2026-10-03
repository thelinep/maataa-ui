import Ajv from "ajv";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(moduleDirectory, "../control-plane/schema/control-plane.schema.json");
const schema = JSON.parse(await readFile(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, jsonPointers: true, schemaId: "auto" });
const validateCanonical = ajv.compile(schema);
const idPattern = /^[a-z0-9][a-z0-9._-]*$/;
const secretKeyPattern = /^(?:password|connection.?string|api.?key|private.?key|bearer.?token|refresh.?token|webhook.?secret|cloud.?credential|credential|access.?token|secret|secret.?value)$/i;
const stableStringify = (value) => JSON.stringify(sortJsonValue(value));

export function defineApplication(application) { return application; }
export function defineEnvironment(environment) { return environment; }
export function defineControlPlaneManifest(manifest) { return manifest; }

export function canonicalizeControlPlaneManifest(value) {
  return stableStringify(value);
}

export function hashControlPlaneManifest(value) {
  return createHash("sha256").update(canonicalizeControlPlaneManifest(value), "utf8").digest("hex");
}

export function validateControlPlaneManifest(manifest, applicationRegistry) {
  const errors = [];
  if (!isPlainObject(manifest)) return { valid: false, errors: ["manifest: expected object"] };
  validateAllowedKeys(manifest, new Set(["schemaVersion", "applications", "infrastructureResources", "secretReferences", "policies"]), "manifest", errors);
  for (const [index, application] of (Array.isArray(manifest.applications) ? manifest.applications : []).entries()) {
    validateAllowedKeys(application, new Set(["applicationId", "repository", "domains", "environments"]), `applications[${index}]`, errors);
    if (application && typeof application === "object") {
      if (application.domains !== undefined && !Array.isArray(application.domains)) errors.push(`applications[${index}].domains: expected array`);
      if (!Array.isArray(application.environments)) errors.push(`applications[${index}].environments: expected array`);
    }
  }
  if (manifest.policies !== undefined && !isPlainObject(manifest.policies)) errors.push("policies: expected object");
  const secretPath = findPlaintextSecret(manifest);
  if (secretPath) errors.push(`plaintext secret field is forbidden: ${secretPath}`);
  const normalized = normalizeControlPlaneManifest(manifest, applicationRegistry, errors);
  if (normalized) {
    const valid = validateCanonical(normalized);
    if (!valid) {
      for (const error of validateCanonical.errors ?? []) {
        errors.push(`${error.dataPath || "/"} ${error.message ?? "schema validation failed"}`);
      }
    }
    validateSemantics(normalized, applicationRegistry, errors);
  }
  return { valid: errors.length === 0, errors: [...new Set(errors)].sort() };
}

function validateAllowedKeys(value, allowed, label, errors) {
  if (!isPlainObject(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) errors.push(`${label}.${key}: unexpected property`);
  }
}

export function compileControlPlaneManifest(manifest, applicationRegistry) {
  const result = validateControlPlaneManifest(manifest, applicationRegistry);
  if (!result.valid) throw new Error(`CONTROL_PLANE_INVALID:\n${result.errors.map((item) => `- ${item}`).join("\n")}`);
  const canonical = normalizeControlPlaneManifest(manifest, applicationRegistry, []);
  const canonicalJson = canonicalizeControlPlaneManifest(canonical);
  const hash = createHash("sha256").update(canonicalJson, "utf8").digest("hex");
  return { canonical, canonicalJson, hash, targetInventory: deriveMigrationTargets(canonical, hash) };
}

export function deriveMigrationTargets(canonical, controlPlaneHash) {
  const targets = [];
  const targetCounts = {
    declared: 0,
    verified: 0,
    conflicted: 0,
    unknown: 0,
    byProvider: { postgresql: 0, sqlite: 0, libsql: 0, mysql: 0, other: 0 },
  };
  let environmentCount = 0;

  for (const application of canonical.applications) {
    for (const environment of application.environments) {
      environmentCount += 1;
      for (const target of environment.databaseTargets ?? []) {
        targetCounts.declared += 1;
        targetCounts.byProvider[target.provider] += 1;
        if (target.verificationStatus === "UNKNOWN" || target.state === "UNKNOWN") targetCounts.unknown += 1;
        else if (target.verificationStatus !== "DECLARED") targetCounts[target.verificationStatus.toLowerCase()] += 1;
        const readiness = getTargetEligibility(target);
        targets.push({
          applicationId: application.id,
          environmentId: environment.id,
          databaseTargetId: target.id,
          provider: target.provider,
          engineVersion: target.engineVersion ?? null,
          databaseState: target.state,
          verificationStatus: target.verificationStatus,
          observed: target.observed ?? null,
          schemaBaselineAvailable: Boolean(target.baseline),
          schemaBaseline: target.baseline ?? null,
          migrationHistoryAvailable: Boolean(target.migrationHistory),
          migrationHistory: target.migrationHistory ?? null,
          secretRef: target.secretRef ?? null,
          backupPolicyRef: target.backupPolicyRef ?? null,
          migrationPolicyRef: target.migrationPolicyRef ?? null,
          eligibility: readiness,
        });
      }
    }
  }

  targets.sort((left, right) => `${left.applicationId}/${left.environmentId}/${left.databaseTargetId}`.localeCompare(`${right.applicationId}/${right.environmentId}/${right.databaseTargetId}`));
  return {
    schemaVersion: "1.0.0",
    controlPlaneHash,
    targetCounts,
    targets,
    applicationCount: canonical.applications.length,
    environmentCount,
    migrationApproved: false,
    deploymentApproved: false,
  };
}

function getTargetEligibility(target) {
  if (target.verificationStatus === "CONFLICTED") return "BLOCKED_CONFLICT";
  if (target.verificationStatus === "UNKNOWN" || target.state === "UNKNOWN") return "BLOCKED_UNKNOWN";
  if (target.verificationStatus === "DECLARED" && target.state === "EMPTY") return "BOOTSTRAP_CANDIDATE";
  if (target.verificationStatus === "DECLARED" && target.state === "EXISTING") return "BLOCKED_EXISTING_UNVERIFIED";
  if (target.verificationStatus === "VERIFIED" && target.state === "EMPTY") return "BOOTSTRAP_REHEARSAL_ELIGIBLE";
  if (target.verificationStatus === "VERIFIED" && target.state === "EXISTING") return "TARGET_DIFF_INPUT_ELIGIBLE";
  return "BLOCKED_UNKNOWN";
}

function normalizeControlPlaneManifest(manifest, applicationRegistry, errors) {
  if (!isPlainObject(manifest) || !isPlainObject(applicationRegistry) || !Array.isArray(applicationRegistry.records)) {
    errors.push("manifest/applicationRegistry: expected a manifest and application registry records");
    return null;
  }
  if (manifest.schemaVersion !== "1.0.0") errors.push("schemaVersion: expected 1.0.0");
  if (!Array.isArray(manifest.applications)) errors.push("applications: expected array");
  if (!Array.isArray(applicationRegistry.records)) return null;

  const registryApps = new Map();
  for (const record of applicationRegistry.records) {
    if (!record || typeof record.appId !== "string" || typeof record.name !== "string") continue;
    if (registryApps.has(record.appId)) errors.push(`application registry has duplicate id ${record.appId}`);
    registryApps.set(record.appId, record);
  }

  const authoringApps = Array.isArray(manifest.applications) ? manifest.applications : [];
  const authoredById = new Map();
  for (const application of authoringApps) {
    if (!application || typeof application.applicationId !== "string") continue;
    if (authoredById.has(application.applicationId)) errors.push(`duplicate application id ${application.applicationId}`);
    authoredById.set(application.applicationId, application);
    if (!registryApps.has(application.applicationId)) errors.push(`unknown application reference ${application.applicationId}`);
  }
  for (const appId of registryApps.keys()) {
    if (!authoredById.has(appId)) errors.push(`registered application missing control-plane entry ${appId}`);
  }
  for (const appId of authoredById.keys()) {
    if (!registryApps.has(appId)) errors.push(`control-plane entry does not resolve to registered application ${appId}`);
  }

  const applications = [...registryApps.values()].filter((record) => authoredById.has(record.appId)).map((record) => {
    const source = authoredById.get(record.appId) ?? {};
    const application = { id: record.appId, name: record.name };
    if (source.repository !== undefined) application.repository = cloneJson(source.repository, `applications.${record.appId}.repository`, errors);
    application.domains = cloneJson(Array.isArray(source.domains) ? source.domains : [], `applications.${record.appId}.domains`, errors);
    application.environments = cloneJson(Array.isArray(source.environments) ? source.environments : [], `applications.${record.appId}.environments`, errors);
    application.domains.sort((a, b) => String(a?.id).localeCompare(String(b?.id)));
    application.environments.sort((a, b) => String(a?.id).localeCompare(String(b?.id)));
    for (const environment of application.environments) {
      if (!isPlainObject(environment)) continue;
      if (Array.isArray(environment.databaseTargets)) environment.databaseTargets.sort((a, b) => String(a?.id).localeCompare(String(b?.id)));
      if (Array.isArray(environment.resources)) environment.resources.sort((a, b) => String(a?.resourceId).localeCompare(String(b?.resourceId)));
      for (const assignment of Array.isArray(environment.resources) ? environment.resources : []) {
        if (Array.isArray(assignment?.capabilities)) assignment.capabilities.sort();
      }
    }
    for (const domain of application.domains) {
      if (isPlainObject(domain) && Array.isArray(domain.routeMappings)) domain.routeMappings.sort((a, b) => `${a?.path}/${a?.routeId}`.localeCompare(`${b?.path}/${b?.routeId}`));
    }
    return application;
  });

  const infrastructureResources = cloneSorted(manifest.infrastructureResources ?? [], "id", "infrastructureResources", errors);
  for (const resource of infrastructureResources) resource.capabilities?.sort();
  const secretReferences = cloneSorted(manifest.secretReferences ?? [], "id", "secretReferences", errors);
  const policies = isPlainObject(manifest.policies) ? manifest.policies : {};
  const normalizedPolicies = {
    backups: cloneSorted(policies.backups ?? [], "id", "policies.backups", errors),
    migrations: cloneSorted(policies.migrations ?? [], "id", "policies.migrations", errors),
    deployments: cloneSorted(policies.deployments ?? [], "id", "policies.deployments", errors),
  };
  return {
    schemaVersion: "1.0.0",
    applicationRegistry: { id: applicationRegistry.registryId, schemaVersion: applicationRegistry.schemaVersion },
    applications,
    infrastructureResources,
    secretReferences,
    policies: normalizedPolicies,
  };
}

function cloneSorted(values, key, label, errors) {
  if (!Array.isArray(values)) {
    errors.push(`${label}: expected array`);
    return [];
  }
  const cloned = values.map((item, index) => cloneJson(item, `${label}[${index}]`, errors));
  cloned.sort((left, right) => String(left?.[key]).localeCompare(String(right?.[key])));
  return cloned;
}

function cloneJson(value, label, errors) {
  try { return structuredClone(value); }
  catch { errors.push(`${label}: value is not cloneable JSON data`); return null; }
}

function validateSemantics(manifest, applicationRegistry, errors) {
  const apps = manifest.applications;
  unique(apps, (item) => item.id, "application", errors);
  unique(manifest.infrastructureResources, (item) => item.id, "infrastructure resource", errors);
  unique(manifest.secretReferences, (item) => item.id, "secret reference", errors);
  unique(manifest.policies.backups, (item) => item.id, "backup policy", errors);
  unique(manifest.policies.migrations, (item) => item.id, "migration policy", errors);
  unique(manifest.policies.deployments, (item) => item.id, "deployment policy", errors);

  const appById = new Map(apps.map((application) => [application.id, application]));
  const resources = new Map(manifest.infrastructureResources.map((resource) => [resource.id, resource]));
  const secrets = new Set(manifest.secretReferences.map((reference) => reference.id));
  const backups = new Map(manifest.policies.backups.map((policy) => [policy.id, policy]));
  const migrations = new Map(manifest.policies.migrations.map((policy) => [policy.id, policy]));
  const deployments = new Map(manifest.policies.deployments.map((policy) => [policy.id, policy]));
  const expectedApps = new Set((applicationRegistry.records ?? []).map((record) => record.appId));

  for (const application of apps) {
    if (!idPattern.test(application.id)) errors.push(`invalid application id ${application.id}`);
    const environments = Array.isArray(application.environments) ? application.environments : [];
    unique(environments, (item) => item.id, `environment in ${application.id}`, errors);
    const environmentById = new Map(environments.map((environment) => [environment.id, environment]));
    for (const environment of environments) {
      if (!idPattern.test(environment.id)) errors.push(`invalid environment id ${application.id}/${environment.id}`);
      const targets = environment.databaseTargets ?? [];
      unique(targets, (item) => item.id, `database target in ${application.id}/${environment.id}`, errors);
      const assignments = environment.resources ?? [];
      unique(assignments, (item) => item.resourceId, `resource assignment in ${application.id}/${environment.id}`, errors);
      for (const assignment of assignments) {
        if (!resources.has(assignment.resourceId)) errors.push(`unknown infrastructure resource ${assignment.resourceId} assigned to ${application.id}/${environment.id}`);
      }
      if (environment.deploymentPolicyRef) {
        const policy = deployments.get(environment.deploymentPolicyRef);
        if (!policy) errors.push(`unknown deployment policy ${environment.deploymentPolicyRef} on ${application.id}/${environment.id}`);
        else if (policy.applicationId !== application.id || policy.environmentId !== environment.id) errors.push(`deployment policy ${policy.id} is scoped to a different application environment`);
      }
      for (const target of targets) {
        const where = `database target ${application.id}/${environment.id}/${target.id}`;
        if (!idPattern.test(target.id)) errors.push(`${where}: invalid id`);
        if (target.secretRef && !secrets.has(target.secretRef)) errors.push(`${where}: unknown secret reference ${target.secretRef}`);
        if (target.backupPolicyRef && !backups.has(target.backupPolicyRef)) errors.push(`${where}: unknown backup policy ${target.backupPolicyRef}`);
        if (target.migrationPolicyRef && !migrations.has(target.migrationPolicyRef)) errors.push(`${where}: unknown migration policy ${target.migrationPolicyRef}`);
        validateVerification(target, where, errors);
      }
      for (const domain of application.domains ?? []) {
        if (!environmentById.has(domain.environmentId)) errors.push(`domain ${domain.id} references missing environment ${application.id}/${domain.environmentId}`);
        validateVerification(domain, `domain ${application.id}/${domain.id}`, errors);
      }
    }
    if (application.repository?.url) {
      try {
        const url = new URL(application.repository.url);
        if (url.username || url.password) errors.push(`repository ${application.repository.id}: URL must not embed credentials`);
      } catch { errors.push(`repository ${application.repository.id}: URL must be absolute`); }
    }
  }

  for (const resource of manifest.infrastructureResources) {
    if (resource.secretRef && !secrets.has(resource.secretRef)) errors.push(`infrastructure resource ${resource.id} references missing secret ${resource.secretRef}`);
    validateVerification(resource, `infrastructure resource ${resource.id}`, errors);
  }

  for (const policy of manifest.policies.backups) {
    if (policy.resourceRef && !resources.has(policy.resourceRef)) errors.push(`backup policy ${policy.id} references missing resource ${policy.resourceRef}`);
  }
  for (const policy of manifest.policies.migrations) {
    if (policy.requiresExplicitApproval !== true) errors.push(`migration policy ${policy.id} must require explicit approval`);
    if (policy.backupPolicyRef && !backups.has(policy.backupPolicyRef)) errors.push(`migration policy ${policy.id} references missing backup policy ${policy.backupPolicyRef}`);
  }
  for (const policy of manifest.policies.deployments) {
    if (policy.requiresExplicitApproval !== true) errors.push(`deployment policy ${policy.id} must require explicit approval`);
    const application = appById.get(policy.applicationId);
    if (!application) errors.push(`deployment policy ${policy.id} references missing application ${policy.applicationId}`);
    else if (!(application.environments ?? []).some((environment) => environment.id === policy.environmentId)) errors.push(`deployment policy ${policy.id} references missing environment ${policy.applicationId}/${policy.environmentId}`);
  }
  for (const appId of expectedApps) if (!appById.has(appId)) errors.push(`registered application missing from normalized control plane ${appId}`);
}

function validateVerification(value, where, errors) {
  if (value.verificationStatus === "VERIFIED") {
    if (value.state === "UNKNOWN") errors.push(`${where}: UNKNOWN state cannot be VERIFIED`);
    if (!Array.isArray(value.evidence) || value.evidence.length === 0) errors.push(`${where}: VERIFIED requires evidence references`);
    if (value.state && value.state !== "UNKNOWN") {
      const observed = value.observed;
      if (!observed) errors.push(`${where}: VERIFIED requires an observed state`);
      else {
        if (observed.state !== value.state) errors.push(`${where}: observed state conflicts with declared state`);
        if (observed.provider !== value.provider) errors.push(`${where}: observed provider conflicts with declared provider`);
        if (observed.engineVersion !== value.engineVersion) errors.push(`${where}: observed engine version conflicts with declared engine version`);
      }
    }
  } else if (value.verificationStatus === "CONFLICTED") {
    if (!Array.isArray(value.evidence) || value.evidence.length === 0) errors.push(`${where}: CONFLICTED requires evidence references`);
    if (!value.observed) errors.push(`${where}: CONFLICTED requires observed values`);
    else if (value.observed.state === value.state && value.observed.provider === value.provider && value.observed.engineVersion === value.engineVersion) errors.push(`${where}: CONFLICTED needs a material difference between declared and observed values`);
  } else if (value.verificationStatus === "DECLARED" && value.observed) {
    errors.push(`${where}: DECLARED cannot contain observed values`);
  } else if (value.verificationStatus === "UNKNOWN" && value.observed) {
    errors.push(`${where}: UNKNOWN cannot contain observed values`);
  }
}

function unique(values, keyOf, label, errors) {
  const seen = new Set();
  for (const value of values) {
    const key = keyOf(value);
    if (seen.has(key)) errors.push(`duplicate ${label} id ${key}`);
    seen.add(key);
  }
}

function findPlaintextSecret(value, pathName = "manifest") {
  if (!value || typeof value !== "object") return null;
  for (const [key, child] of Object.entries(value)) {
    if (secretKeyPattern.test(key)) return `${pathName}.${key}`;
    const found = findPlaintextSecret(child, `${pathName}.${key}`);
    if (found) return found;
  }
  return null;
}

function sortJsonValue(value, pathName = "manifest") {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map((item, index) => sortJsonValue(item, `${pathName}[${index}]`));
  if (!isPlainObject(value)) throw new TypeError(`${pathName}: only JSON data is allowed`);
  const result = {};
  for (const key of Object.keys(value).sort()) {
    if (value[key] === undefined) throw new TypeError(`${pathName}.${key}: undefined is not canonical JSON`);
    result[key] = sortJsonValue(value[key], `${pathName}.${key}`);
  }
  return result;
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
