import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);

test("kernel runtime dependencies stay workspace-local while the visual package owns UI tooling", () => {
  const workspaceNames = new Set();
  const packageFiles = fs.readdirSync(path.join(root, "packages")).map((dir) => path.join(root, "packages", dir, "package.json"));
  for (const file of packageFiles) workspaceNames.add(JSON.parse(fs.readFileSync(file, "utf8")).name);
  for (const file of packageFiles) {
    const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const dep of Object.keys(pkg.dependencies ?? {})) {
      assert.ok(workspaceNames.has(dep), `${pkg.name} runtime dependency ${dep} is not an internal workspace package`);
    }
  }
  const rootPkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.deepEqual(rootPkg.dependencies ?? {}, {});
  const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
  const external = Object.entries(lock.packages ?? {}).filter(([name, meta]) => name.startsWith("node_modules/") && meta?.link !== true);
  const visual = JSON.parse(fs.readFileSync(path.join(root, "packages/maataa-ui/package.json"), "utf8"));
  const visualLock = lock.packages?.["packages/maataa-ui"];
  assert.ok(Object.keys(visual.devDependencies ?? {}).length > 0);
  assert.deepEqual(visualLock?.dependencies, visual.dependencies);
  assert.deepEqual(visualLock?.devDependencies, visual.devDependencies);
  assert.deepEqual(visualLock?.peerDependencies, visual.peerDependencies);
  assert.ok(external.length > 0, "UI build/test tooling should be represented in the workspace lockfile");
});
