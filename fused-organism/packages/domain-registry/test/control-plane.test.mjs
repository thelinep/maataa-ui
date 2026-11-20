import test from "node:test";
import assert from "node:assert/strict";
import {
  compileControlPlaneManifest,
  validateControlPlaneManifest,
} from "../src/control-plane.mjs";

const artifact = (id, kind) => ({ id, kind });
const appRegistry = (...ids) => ({
  registryId: "fixture-app-registry",
  schemaVersion: "1.0.0",
  records: ids.map((appId) => ({ appId, name: appId.replaceAll("-", " ") })),
});
const emptyEnvironment = (id = "local") => ({ id, kind: "local" });
const emptyManifest = (applications, extra = {}) => ({
  schemaVersion: "1.0.0",
  applications,
  infrastructureResources: [],
  secretReferences: [],
  policies: { backups: [], migrations: [], deployments: [] },
  ...extra,
});
const application = (applicationId, environments = []) => ({ applicationId, environments });
const database = (overrides = {}) => ({
  id: "primary",
  provider: "postgresql",
  state: "EMPTY",
  verificationStatus: "DECLARED",
  ...overrides,
});
const manifestWithTarget = (overrides) => emptyManifest([application("app-one", [{
  ...emptyEnvironment(),
  databaseTargets: [database(overrides)],
}])]);
const verifiedExisting = (overrides = {}) => ({
  id: "primary",
  provider: "postgresql",
  engineVersion: "17",
  state: "EXISTING",
  verificationStatus: "VERIFIED",
  baseline: artifact("schema-before", "schema-baseline"),
  migrationHistory: artifact("migration-history-before", "migration-history"),
  observed: { state: "EXISTING", provider: "postgresql", engineVersion: "17" },
  evidence: [artifact("operator-attestation", "verification")],
  ...overrides,
});

test("represents a registered application with no environment or target", () => {
  const registry = appRegistry("app-one");
  const compiled = compileControlPlaneManifest(emptyManifest([application("app-one")]), registry);
  assert.equal(compiled.canonical.applications.length, 1);
  assert.deepEqual(compiled.canonical.applications[0].environments, []);
  assert.equal(compiled.targetInventory.applicationCount, 1);
  assert.equal(compiled.targetInventory.environmentCount, 0);
  assert.equal(compiled.targetInventory.targetCounts.declared, 0);
});

test("classifies declared empty PostgreSQL as a bootstrap candidate, not a verified target", () => {
  const manifest = emptyManifest([application("app-one", [{ ...emptyEnvironment(), databaseTargets: [database()] }])]);
  const compiled = compileControlPlaneManifest(manifest, appRegistry("app-one"));
  assert.equal(compiled.targetInventory.targetCounts.declared, 1);
  assert.equal(compiled.targetInventory.targetCounts.verified, 0);
  assert.equal(compiled.targetInventory.targets[0].eligibility, "BOOTSTRAP_CANDIDATE");
  assert.equal(compiled.targetInventory.targets[0].verificationStatus, "DECLARED");
});

test("counts an explicitly unknown database state as unknown", () => {
  const { targetInventory } = compileControlPlaneManifest(manifestWithTarget({
    state: "UNKNOWN",
    verificationStatus: "UNKNOWN",
  }), appRegistry("app-one"));
  assert.deepEqual(targetInventory.targetCounts, {
    declared: 1,
    verified: 0,
    conflicted: 0,
    unknown: 1,
    byProvider: { postgresql: 1, sqlite: 0, libsql: 0, mysql: 0, other: 0 },
  });
});

test("rejects a verified target whose database state is unknown", () => {
  const result = validateControlPlaneManifest(manifestWithTarget({
    state: "UNKNOWN",
    verificationStatus: "VERIFIED",
    evidence: [{ uri: "evidence://probe" }],
  }), appRegistry("app-one"));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("UNKNOWN state cannot be VERIFIED")));
});

test("requires verified existing target evidence, baseline, and migration history", () => {
  const manifest = emptyManifest([application("app-one", [{ id: "staging", kind: "staging", databaseTargets: [verifiedExisting()] }])]);
  const compiled = compileControlPlaneManifest(manifest, appRegistry("app-one"));
  assert.equal(compiled.targetInventory.targetCounts.verified, 1);
  assert.equal(compiled.targetInventory.targets[0].eligibility, "TARGET_DIFF_INPUT_ELIGIBLE");
  assert.equal(compiled.targetInventory.targets[0].schemaBaselineAvailable, true);
  assert.equal(compiled.targetInventory.targets[0].migrationHistoryAvailable, true);
});

test("keeps SQLite and libSQL distinct in target counts", () => {
  const manifest = emptyManifest([application("app-one", [{
    ...emptyEnvironment(),
    databaseTargets: [
      database({ id: "local-sqlite", provider: "sqlite" }),
      database({ id: "edge-libsql", provider: "libsql", state: "UNKNOWN", verificationStatus: "UNKNOWN" }),
    ],
  }])]);
  const compiled = compileControlPlaneManifest(manifest, appRegistry("app-one"));
  assert.equal(compiled.targetInventory.targetCounts.byProvider.sqlite, 1);
  assert.equal(compiled.targetInventory.targetCounts.byProvider.libsql, 1);
  assert.equal(compiled.targetInventory.targetCounts.unknown, 1);
  assert.equal(compiled.targetInventory.targets.find((target) => target.provider === "libsql").eligibility, "BLOCKED_UNKNOWN");
});

test("supports multiple environments, domain/repository data, resources, opaque secrets, and policies", () => {
  const manifest = emptyManifest([{
    applicationId: "app-one",
    repository: { id: "app-repo", url: "https://github.com/example/app", defaultBranch: "main" },
    domains: [{ id: "app-domain", hostname: "app.example.test", environmentId: "staging", verificationStatus: "DECLARED", routeMappings: [] }],
    environments: [
      { id: "local", kind: "local" },
      { id: "staging", kind: "staging", resources: [{ resourceId: "queue-main", capabilities: ["delivery", "retry"] }], deploymentPolicyRef: "staging-deploy" },
    ],
  }], {
    infrastructureResources: [{ id: "queue-main", kind: "queue", provider: "local-test", service: "test-queue", verificationStatus: "DECLARED", secretRef: "queue-auth" }],
    secretReferences: [{ id: "queue-auth", provider: "test-vault", locator: "secret://fixture/queue" }],
    policies: {
      backups: [{ id: "daily-backup", restoreRehearsalRequired: true, retentionDays: 14 }],
      migrations: [{ id: "migration-approval", requiresExplicitApproval: true, backupPolicyRef: "daily-backup" }],
      deployments: [{ id: "staging-deploy", applicationId: "app-one", environmentId: "staging", requiresExplicitApproval: true }],
    },
  });
  const compiled = compileControlPlaneManifest(manifest, appRegistry("app-one"));
  assert.equal(compiled.targetInventory.environmentCount, 2);
  assert.equal(compiled.canonical.applications[0].domains[0].environmentId, "staging");
  assert.equal(compiled.canonical.secretReferences[0].id, "queue-auth");
});

test("a verified empty target needs matching observation and evidence", () => {
  const target = database({
    engineVersion: "3.46",
    verificationStatus: "VERIFIED",
    observed: { state: "EMPTY", provider: "sqlite", engineVersion: "3.46" },
    evidence: [artifact("empty-attestation", "verification")],
    provider: "sqlite",
  });
  const manifest = emptyManifest([application("app-one", [{ ...emptyEnvironment(), databaseTargets: [target] }])]);
  const compiled = compileControlPlaneManifest(manifest, appRegistry("app-one"));
  assert.equal(compiled.targetInventory.targets[0].eligibility, "BOOTSTRAP_REHEARSAL_ELIGIBLE");
});

test("rejects duplicate application, environment, and per-environment target IDs", () => {
  const registry = appRegistry("app-one");
  const repeated = validateControlPlaneManifest(emptyManifest([application("app-one"), application("app-one")]), registry);
  assert.match(repeated.errors.join("\n"), /duplicate application id app-one/);

  const duplicateEnvironments = emptyManifest([application("app-one", [emptyEnvironment(), emptyEnvironment()])]);
  assert.match(validateControlPlaneManifest(duplicateEnvironments, registry).errors.join("\n"), /duplicate environment in app-one id local/);

  const duplicateTargets = emptyManifest([application("app-one", [{ ...emptyEnvironment(), databaseTargets: [database(), database()] }])]);
  assert.match(validateControlPlaneManifest(duplicateTargets, registry).errors.join("\n"), /duplicate database target in app-one\/local id primary/);
});

test("rejects existing targets missing either baseline or migration history", () => {
  const withoutBaseline = verifiedExisting({ baseline: undefined });
  const withoutHistory = verifiedExisting({ migrationHistory: undefined });
  for (const target of [withoutBaseline, withoutHistory]) {
    const manifest = emptyManifest([application("app-one", [{ ...emptyEnvironment(), databaseTargets: [target] }])]);
    assert.equal(validateControlPlaneManifest(manifest, appRegistry("app-one")).valid, false);
  }
});

test("rejects unresolved resources, invalid providers/statuses, and inline secret fields", () => {
  const registry = appRegistry("app-one");
  const unknownResource = emptyManifest([application("app-one", [{ ...emptyEnvironment(), resources: [{ resourceId: "missing", capabilities: ["api"] }] }])]);
  assert.match(validateControlPlaneManifest(unknownResource, registry).errors.join("\n"), /unknown infrastructure resource missing/);

  const invalidProvider = emptyManifest([application("app-one", [{ ...emptyEnvironment(), databaseTargets: [database({ provider: "oracle" })] }])]);
  assert.equal(validateControlPlaneManifest(invalidProvider, registry).valid, false);
  const invalidStatus = emptyManifest([application("app-one", [{ ...emptyEnvironment(), databaseTargets: [database({ verificationStatus: "TRUSTED" })] }])]);
  assert.equal(validateControlPlaneManifest(invalidStatus, registry).valid, false);

  const plaintext = emptyManifest([application("app-one")], { credentials: { password: "fixture-only-value" } });
  assert.match(validateControlPlaneManifest(plaintext, registry).errors.join("\n"), /plaintext secret field is forbidden/);
});

test("rejects implied migration approval and policy references outside the app environment", () => {
  const registry = appRegistry("app-one");
  const impliedApproval = emptyManifest([application("app-one")], { migrationApproved: true });
  assert.match(validateControlPlaneManifest(impliedApproval, registry).errors.join("\n"), /migrationApproved: unexpected property/);

  const badPolicy = emptyManifest([application("app-one", [{ ...emptyEnvironment(), deploymentPolicyRef: "deploy" }])], {
    policies: { backups: [], migrations: [], deployments: [{ id: "deploy", applicationId: "app-one", environmentId: "production", requiresExplicitApproval: true }] },
  });
  assert.match(validateControlPlaneManifest(badPolicy, registry).errors.join("\n"), /different application environment|missing environment/);

  const approvalNotRequired = emptyManifest([application("app-one")], {
    policies: { backups: [], migrations: [{ id: "unsafe", requiresExplicitApproval: false }], deployments: [] },
  });
  assert.equal(validateControlPlaneManifest(approvalNotRequired, registry).valid, false);
});

test("normalizes semantically unordered collections and hashes the canonical JSON deterministically", () => {
  const registry = appRegistry("app-one", "app-two");
  const one = emptyManifest([
    application("app-two", [emptyEnvironment("test"), emptyEnvironment("local")]),
    application("app-one"),
  ]);
  const two = emptyManifest([
    application("app-one"),
    application("app-two", [emptyEnvironment("local"), emptyEnvironment("test")]),
  ]);
  const first = compileControlPlaneManifest(one, registry);
  const second = compileControlPlaneManifest(two, registry);
  assert.equal(first.canonicalJson, second.canonicalJson);
  assert.equal(first.hash, second.hash);
  assert.match(first.hash, /^[a-f0-9]{64}$/);
  assert.throws(() => compileControlPlaneManifest({ ...one, migrationApproved: true }, registry), /CONTROL_PLANE_INVALID/);
});
