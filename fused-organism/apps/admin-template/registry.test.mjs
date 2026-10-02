import test from "node:test";
import assert from "node:assert/strict";
import { applicationRegistry, resolveApplicationRoute, validateApplicationRegistry } from "./app-registry.mjs";
import { capabilityRegistry, migrateServerAssignments, validateInfrastructureRegistry } from "./infrastructure-registry.mjs";

test("every registered route is owned by exactly one application", () => {
  assert.equal(validateApplicationRegistry(), true);
  for (const application of applicationRegistry) {
    for (const route of application.routes) assert.equal(route.appId, application.id);
  }
});

test("runtime route resolution requires an owning application", () => {
  assert.equal(resolveApplicationRoute("tlps", "P001")?.appId, "tlps");
  assert.equal(resolveApplicationRoute("nevoevents", "P001"), null);
  assert.equal(resolveApplicationRoute("missing-app", "P001"), null);
});

test("domain mappings resolve only to routes and environments owned by their application", () => {
  const invalid = structuredClone(applicationRegistry);
  invalid.find((application) => application.id === "tlps").domains[0].routeMappings[0].routeId = "missing-route";
  assert.throws(() => validateApplicationRegistry(invalid), /unknown route/);
});

test("infrastructure assignments target application environments and declared capabilities", () => {
  const applications = structuredClone(applicationRegistry);
  const registry = { servers: [{
    id: "server-one",
    name: "Preview server",
    host: "preview.example.test",
    capabilities: ["API", "Database"],
    environmentAssignments: [{ appId: "tlps", environmentId: "local-preview", capabilities: ["API"] }],
  }] };
  assert.equal(validateInfrastructureRegistry(registry, applications), true);
  registry.servers[0].environmentAssignments[0].environmentId = "unknown";
  assert.throws(() => validateInfrastructureRegistry(registry, applications), /unknown application environment/);
});

test("legacy app-level server assignments migrate to environment assignments", () => {
  const applications = structuredClone(applicationRegistry);
  const migrated = migrateServerAssignments({ id: "legacy", name: "Old server", host: "host.example.test", capabilities: ["API"], appIds: ["tlps"] }, applications);
  assert.equal("appIds" in migrated, false);
  assert.deepEqual(migrated.environmentAssignments, [{ appId: "tlps", environmentId: "local-preview", capabilities: ["API"], needsEnvironmentReview: false }]);
  assert.deepEqual(capabilityRegistry.includes("API"), true);
});
