import { defineApplication, defineEnvironment, defineControlPlaneManifest } from "../src/control-plane.mjs";
import type { ControlPlaneManifest } from "../src/control-plane.mjs";

const verification = {
  id: "local-dev-target-verification",
  kind: "verification" as const,
  sha256: "2d479028758d25f7288a1458b1701014b2d9a8afd8c1f74d952d8b41d81005b1",
  uri: "fused-organism/packages/domain-registry/control-plane/evidence/local-development/target-verification.json",
};

const localEnvironment = (owner: "maataa" | "tlps" | "shared") => defineEnvironment({
  id: "local-development",
  kind: "local",
  databaseTargets: [{
    id: `${owner}-local-sqlite`,
    provider: "sqlite",
    engineVersion: "3.43.1",
    state: "EXISTING",
    verificationStatus: "VERIFIED",
    observed: { state: "EXISTING", provider: "sqlite", engineVersion: "3.43.1" },
    baseline: {
      id: `${owner}-local-schema-baseline`,
      kind: "schema-baseline",
      sha256: owner === "maataa" ? "63d9f85ffa681feedcd5bbce6d2e03431199fb3e1f29146697ac9aa28613fbb8" : owner === "tlps" ? "f1f8803f36cc11e7ae3b062d09ea951613eaa38ed271f791ee5eaa3e853f3539" : "bd4899805bca80478eac3598427278d2a37bfe53cab4e5b4486b7a3e83cbf585",
      uri: `fused-organism/packages/domain-registry/control-plane/evidence/local-development/${owner}-baseline.json`,
    },
    migrationHistory: {
      id: `${owner}-local-migration-history`,
      kind: "migration-history",
      sha256: owner === "maataa" ? "a4f4a0a17cb3ef4305673e0e5ee0da17723abab73bb21ad812c603d13f9726fe" : owner === "tlps" ? "0fde0746f5edec4f9685929c8a0885bb9479ccf46f3ea71cb33c63a4b1a115f9" : "4cf4d0ce6715221d4020c67b7823ca2e2be6f049a03ea0dc9e4cd175cb8259f0",
      uri: `fused-organism/packages/domain-registry/control-plane/evidence/local-development/${owner}-migration-history.json`,
    },
    evidence: [verification, {
      id: `${owner}-local-sqlite-file`,
      kind: "other",
      sha256: owner === "maataa" ? "433b30fa4c8c6e033bf870fd940740dfab143de9f851d274742f839ef98b75a7" : owner === "tlps" ? "37660eac97e98f9b6b79678bc850356d7eb84ef9778b2088dee89a222edbb426" : "019aca98006be5f6668ffb9596440687fe56b97301af4c038e5d090a0e282b38",
      uri: `fused-organism/.local-dev/databases/${owner}.db`,
    }],
  }],
});

// Product-level operational apps are separate from the four composition proof apps.
const manifest = defineControlPlaneManifest({
  schemaVersion: "1.0.0",
  applications: [
    defineApplication({
      applicationId: "maataa",
      repository: { id: "maataa-ui", url: "https://github.com/thelinep/maataa-ui" },
      environments: [localEnvironment("maataa")],
    }),
    defineApplication({
      applicationId: "shared-data-service",
      environments: [localEnvironment("shared")],
    }),
    defineApplication({
      applicationId: "tlps",
      repository: { id: "maataa-api", url: "https://github.com/thelinep/maataa-api" },
      environments: [localEnvironment("tlps")],
    }),
  ],
  infrastructureResources: [],
  secretReferences: [],
  policies: { backups: [], migrations: [], deployments: [] },
} satisfies ControlPlaneManifest);

export default manifest;
