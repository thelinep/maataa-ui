import { defineApplication, defineControlPlaneManifest } from "../src/control-plane.mjs";
import type { ControlPlaneManifest } from "../src/control-plane.mjs";

// Application IDs resolve against applications/registry.json. No environments or targets are asserted here.
const manifest = defineControlPlaneManifest({
  schemaVersion: "1.0.0",
  applications: [
    defineApplication({ applicationId: "campaign-os-reference", environments: [] }),
    defineApplication({ applicationId: "casting-pipeline-demo", environments: [] }),
    defineApplication({ applicationId: "events-wedding-spatial-reference", environments: [] }),
    defineApplication({ applicationId: "investorhub-reference", environments: [] }),
  ],
  infrastructureResources: [],
  secretReferences: [],
  policies: { backups: [], migrations: [], deployments: [] },
} satisfies ControlPlaneManifest);

export default manifest;
